// Lector node a node: el text es ressalta frase a frase mentre sona l’àudio.
const LISTEN_KEY = "cancerpitalism:listen-track";

export function listenHashId() {
  const raw = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (raw === "escolta") return "";
  if (raw.startsWith("escolta~")) return raw.slice("escolta~".length);
  return null;
}

export function consumeListenTrack() {
  try {
    const value = sessionStorage.getItem(LISTEN_KEY);
    sessionStorage.removeItem(LISTEN_KEY);
    return value;
  } catch {
    return null;
  }
}

export function rememberListenTrack(id) {
  try {
    if (id) sessionStorage.setItem(LISTEN_KEY, id);
  } catch { /* el navegador pot bloquejar l’emmagatzematge */ }
}

const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// PDF, àudio i EPUB es publiquen a part de la web. Ha de coincidir amb MEDIA_BASE de build.py.
export const MEDIA_BASE = "https://media.nualart.cat/cancerpitalism/";

function mediaUrl(path) {
  if (!path) return path;
  if (/^https?:/.test(path)) return path;
  return MEDIA_BASE + String(path).replace(/^\//, "");
}

export function createListen({ lang, t, reduceMotion, nodes }) {
  const root = document.querySelector("#listen");
  const select = document.querySelector("#listen-track");
  const audio = document.querySelector("#listen-audio");
  const transcript = document.querySelector("#listen-transcript");
  const status = document.querySelector("#listen-status");
  const previous = document.querySelector("#listen-prev");
  const next = document.querySelector("#listen-next");
  const speed = document.querySelector("#listen-speed");
  const download = document.querySelector("#listen-download");
  const meter = document.querySelector("#listen-progress-bar");
  const bookBar = document.querySelector("#progress-bar");
  const credit = document.querySelector("#listen-credit");
  let manifest = null;
  let trackIndex = 0;
  let sentences = [];
  let currentSentence = -1;
  let token = 0;
  let urlMode = "push";
  let dropEnded = false;

  function trackByNode(nodeId, targetId) {
    if (!manifest) return 0;
    if (targetId?.startsWith("interlude-")) {
      const order = Number(targetId.slice("interlude-".length));
      const found = manifest.tracks.findIndex(track => track.kind === "interlude" && track.nodeOrder === order);
      if (found >= 0) return found;
    }
    const node = nodes.find(item => item.id === nodeId);
    if (!node) return trackIndex;
    const found = manifest.tracks.findIndex(track => track.kind === "node" && track.nodeOrder === node.order);
    return found >= 0 ? found : trackIndex;
  }

  function render(data) {
    let html = "";
    let index = 0;
    const items = data.sentences || [];
    while (index < items.length) {
      const sentence = items[index];
      if (sentence.role === "label") {
        const tag = sentence.block === "title" ? "h3" : sentence.block === "chapter" ? "p" : "h4";
        const cls = sentence.block === "chapter" ? "listen-kicker" : sentence.block === "title" ? "listen-title" : "listen-label";
        html += `<${tag} class="${cls}"><span class="sent" data-i="${index}">${esc(sentence.text)}</span></${tag}>`;
        index += 1;
        continue;
      }
      const spans = [];
      const block = sentence.block;
      const paragraph = sentence.paragraph;
      while (index < items.length && items[index].role === "body" && items[index].block === block && items[index].paragraph === paragraph) {
        spans.push(`<span class="sent" data-i="${index}">${esc(items[index].text)}</span>`);
        index += 1;
      }
      html += `<p>${spans.join(" ")}</p>`;
    }
    return html;
  }

  function setUrl(id) {
    const url = `#escolta~${encodeURIComponent(id)}`;
    if (location.hash === url) return;
    const state = { view: "listen", track: id };
    if (urlMode === "replace") history.replaceState(state, "", url);
    else history.pushState(state, "", url);
    urlMode = "push";
  }

  function bookProgress() {
    if (!manifest) return;
    const durations = manifest.tracks.map(track => track.duration || 0);
    const total = durations.reduce((sum, value) => sum + value, 0);
    if (meter) meter.style.transform = `scaleX(${audio.duration ? Math.min(1, audio.currentTime / audio.duration) : 0})`;
    if (bookBar && total) {
      const before = durations.slice(0, trackIndex).reduce((sum, value) => sum + value, 0);
      bookBar.style.transform = `scaleX(${Math.min(1, (before + (audio.currentTime || 0)) / total)})`;
    }
  }

  function highlight() {
    const time = audio.currentTime || 0;
    let low = 0;
    let high = sentences.length - 1;
    let found = -1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (time < sentences[mid].start) high = mid - 1;
      else if (time >= sentences[mid].end) low = mid + 1;
      else { found = mid; break; }
    }
    if (found === currentSentence) return;
    transcript.querySelector(".is-current")?.classList.remove("is-current");
    currentSentence = found;
    if (found < 0) return;
    const element = transcript.querySelector(`[data-i="${found}"]`);
    element?.classList.add("is-current");
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < 160 || rect.bottom > innerHeight - 24) {
      element.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  async function ensureManifest() {
    if (manifest) return manifest;
    const response = await fetch(mediaUrl(`audio/${lang}/manifest.json`));
    if (!response.ok) throw new Error(String(response.status));
    manifest = await response.json();
    let html = "";
    let group = null;
    manifest.tracks.forEach(track => {
      if (track.group !== group) {
        if (group !== null) html += "</optgroup>";
        group = track.group;
        html += `<optgroup label="${esc(group || "")}">`;
      }
      html += `<option value="${esc(track.id)}">${esc(track.label)}</option>`;
    });
    if (group !== null) html += "</optgroup>";
    select.innerHTML = html;
    if (manifest.audiobook) {
      download.href = mediaUrl(manifest.audiobook);
      download.download = manifest.audiobook.split("/").pop();
      download.hidden = false;
    }
    if (credit) credit.textContent = `${t("Veu sintètica · Piper")} · ${manifest.voice}`;
    return manifest;
  }

  async function show(index, autoplay = false) {
    const current = ++token;
    await ensureManifest();
    if (current !== token) return;
    trackIndex = Math.max(0, Math.min(index, manifest.tracks.length - 1));
    const track = manifest.tracks[trackIndex];
    select.value = track.id;
    status.textContent = `${trackIndex + 1} ${t("de")} ${manifest.tracks.length}`;
    previous.disabled = trackIndex === 0;
    next.disabled = trackIndex === manifest.tracks.length - 1;
    rememberListenTrack(track.id);
    setUrl(track.id);
    document.dispatchEvent(new CustomEvent("cancerpitalism:listen", { detail: { id: track.id, nodeOrder: track.nodeOrder } }));
    currentSentence = -1;
    sentences = [];
    try {
      const response = await fetch(mediaUrl(track.sentences));
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      if (current !== token) return;
      sentences = data.sentences || [];
      transcript.innerHTML = render(data);
    } catch {
      if (current !== token) return;
      transcript.innerHTML = `<p class="listen-missing">${esc(t("Aquest node encara no té àudio."))}</p>`;
    }
    dropEnded = true;
    audio.pause();
    audio.dataset.track = track.id;
    audio.src = mediaUrl(track.audio);
    audio.load();
    bookProgress();
    root.scrollIntoView({ block: "start", behavior: "auto" });
    if (autoplay) audio.play().catch(() => { dropEnded = false; });
  }

  async function open(ref, options = {}) {
    if (!root) return;
    root.hidden = false;
    urlMode = options.replace ? "replace" : "push";
    status.textContent = t("Carregant l’audiollibre…");
    try {
      await ensureManifest();
    } catch {
      status.textContent = t("No s’ha pogut carregar l’audiollibre.");
      transcript.innerHTML = "";
      return;
    }
    let index = 0;
    if (ref) {
      const byId = manifest.tracks.findIndex(track => track.id === ref);
      index = byId >= 0 ? byId : trackByNode(ref, null);
    }
    await show(index, Boolean(options.autoplay));
  }

  function close(options = {}) {
    audio.pause();
    if (root) root.hidden = true;
    try { sessionStorage.removeItem(LISTEN_KEY); } catch { /* buit */ }
    if (!options.keepHash && location.hash.startsWith("#escolta")) {
      history.replaceState({}, "", location.pathname + location.search);
    }
  }

  select.addEventListener("change", () => {
    if (!manifest) return;
    const index = manifest.tracks.findIndex(track => track.id === select.value);
    if (index >= 0) show(index, !audio.paused);
  });
  speed.addEventListener("change", () => { audio.playbackRate = Number(speed.value); });
  previous.addEventListener("click", () => { if (trackIndex > 0) show(trackIndex - 1, true); });
  next.addEventListener("click", () => { if (manifest && trackIndex < manifest.tracks.length - 1) show(trackIndex + 1, true); });
  audio.addEventListener("playing", () => { dropEnded = false; });
  audio.addEventListener("timeupdate", () => { highlight(); bookProgress(); });
  audio.addEventListener("ended", () => {
    if (dropEnded) return;
    if (manifest && trackIndex < manifest.tracks.length - 1) show(trackIndex + 1, true);
  });
  audio.addEventListener("error", () => {
    if (audio.dataset.track && audio.dataset.track === manifest?.tracks[trackIndex]?.id) {
      status.textContent = t("Aquest node encara no té àudio.");
    }
  });
  transcript.addEventListener("click", event => {
    const span = event.target.closest(".sent");
    if (!span) return;
    const sentence = sentences[Number(span.dataset.i)];
    if (!sentence) return;
    audio.currentTime = sentence.start;
    audio.play().catch(() => {});
  });

  return {
    open,
    close,
    goToNode(nodeId, targetId) {
      if (!manifest) return open(nodeId);
      return show(trackByNode(nodeId, targetId), !audio.paused);
    },
    currentId() { return manifest?.tracks[trackIndex]?.id || null; },
    currentNodeOrder() { return manifest?.tracks[trackIndex]?.nodeOrder || null; }
  };
}
