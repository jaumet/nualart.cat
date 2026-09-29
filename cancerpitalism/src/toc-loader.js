import { lang, t } from "./i18n.js";

// Un guió per llengua. El català és l’original; l’anglès, la traducció.
const SOURCES = { ca: "/cTOC-Proposat.per.gpt--ancerpitalism-taula-de-continguts-inicial.md", en: "/cancerpitalism-en.md" };
import guions from "./guio-data.js";

// Camps que pot tenir cada node al guió. La clau és el marcador en negreta del Markdown.
const FIELDS = {
  "Missatge central": "center",
  "Afirmació": "center",
  "Pregunta": "question",
  "Resposta breu": "answer",
  "Correspondència": "correspondence",
  "Càncer": "cancer",
  "Capitalisme": "capitalism",
  "Límits": "limits",
  "Fonts": "sources",
  "Diagrama central": "diagram",
  "Central message": "center",
  "Question": "question",
  "Short answer": "answer",
  "Correspondence": "correspondence",
  "Cancer": "cancer",
  "Capitalism": "capitalism",
  "Limits": "limits",
  "Sources": "sources",
  "Central diagram": "diagram"
};

const escapeHtml = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const inline = value => escapeHtml(value)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, "<em>$1</em>");
const plain = value => value.replace(/\*\*/g, "").replace(/\*(.+?)\*/g, "$1");

// Agrupa línies en paràgrafs (separats per línies buides) o en elements de llista.
function blocks(lines) {
  const paragraphs = [];
  let current = [];
  const flush = () => { if (current.length) paragraphs.push(current.join(" ").replace(/\s+/g, " ").trim()); current = []; };
  lines.forEach(line => {
    if (!line) return flush();
    if (/^- /.test(line)) { flush(); paragraphs.push(line); return; }
    current.push(line);
  });
  flush();
  return paragraphs;
}

const joinPlain = lines => plain(blocks(lines).join(" "));
const paragraphsHtml = lines => blocks(lines).map(p => `<p>${inline(p)}</p>`).join("");
const listItems = lines => blocks(lines).map(line => line.replace(/^- /, ""));

function visualStateFor(text) {
  const value = text.toLowerCase();
  if (/metàfora|diferència|identitat|responsabilitat|decideix/.test(value)) return "criticalSeparation";
  if (/límit|finit|aturar|prou/.test(value)) return "finiteLimits";
  if (/acumul|captur|recurs|nodrit|flux|renda/.test(value)) return "resourceCapture";
  if (/resist|pressió|tractament|immun|defens/.test(value)) return "compressed";
  if (/expan|metàstasi|créixer|creixement|ocupar/.test(value)) return "unregulated";
  if (/cura|salut|cooper|repar|vida/.test(value)) return "balanced";
  return "cooperative";
}

export async function loadToc() {
  const lines = (guions[lang] || guions.ca).split(/\r?\n/);
  const nodes = [];
  const chapters = [];
  const categories = [{ id:"proleg", label:t("Pròleg"), title:"", cancer:t("La pregunta"), capitalism:t("La pregunta"), color:"#a7a7a7" }];
  const colors = ["#ff4056","#ff9f43","#9b7cff","#4ea0f2","#61d095"];
  let category = categories[0];
  let chapter = null;
  let node = null;
  let field = null;
  let interlude = null;

  const finishNode = () => {
    if (!node) return;
    const raw = node.raw;
    node.center.text = joinPlain(raw.center);
    node.center.html = blocks(raw.center).map(inline).join(" ");
    node.question = joinPlain(raw.question);
    node.answer = joinPlain(raw.answer);
    node.answerHtml = blocks(raw.answer).map(inline).join(" ");
    node.correspondence = joinPlain(raw.correspondence);
    node.diagram = joinPlain(raw.diagram);
    node.sources = listItems(raw.sources);
    if (raw.cancer.length) node.right = { title: t("Càncer"), html: paragraphsHtml(raw.cancer) };
    if (raw.capitalism.length) node.left = { title: t("Capitalisme"), html: paragraphsHtml(raw.capitalism) };
    if (raw.limits.length || node.sources.length) {
      node.south = {
        title: t("Límits i fonts"),
        html: `${raw.limits.length ? `<h3>${t("Límits de la metàfora")}</h3>${paragraphsHtml(raw.limits)}` : ""}${node.sources.length ? `<h3>${t("Fonts")}</h3><ul class="sources">${node.sources.map(item => `<li>${inline(item)}</li>`).join("")}</ul>` : ""}`
      };
    }
    node.visualState = visualStateFor(`${node.title} ${node.center.text}`);
    delete node.raw;
    nodes.push(node);
    node = null;
  };

  const finishInterlude = () => {
    if (!interlude) return;
    const paragraphs = blocks(interlude.lines);
    const [first, ...rest] = paragraphs;
    const title = plain(first || "").replace(/^(Interludi|Interlude)\s*—\s*/, "");
    const target = nodes.at(-1);
    if (target) target.interludeAfter = { title, html: rest.map(p => `<p>${inline(p)}</p>`).join("") };
    interlude = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith(">")) {
      finishNode();
      field = null;
      interlude ??= { lines: [] };
      interlude.lines.push(line.replace(/^>\s?/, ""));
      continue;
    }
    if (interlude && line) finishInterlude();

    const partMatch = line.match(/^# Part (.+)$/);
    if (partMatch) {
      finishNode();
      category = { id:`part-${partMatch[1].toLowerCase()}`, label:`Part ${partMatch[1]}`, title:"", cancer:"", capitalism:"", color:colors[categories.length-1] };
      categories.push(category);
      chapter = null;
      continue;
    }
    const cancerMatch = line.match(/^## (?:Càncer|Cancer):\s*(.+)$/i);
    if (cancerMatch) { category.cancer = cancerMatch[1]; continue; }
    const capitalismMatch = line.match(/^## (?:Capitalisme|Capitalism):\s*(.+)$/i);
    if (capitalismMatch) { category.capitalism = capitalismMatch[1]; continue; }
    const ideaMatch = !node && line.match(/^\*\*(?:Idea comuna|Common idea):\*\*\s*(.+)$/);
    if (ideaMatch) { category.idea = plain(ideaMatch[1]); continue; }
    if (/^# (Pròleg|Capítol|Epíleg|Prologue|Chapter|Epilogue)\b/.test(line)) {
      finishNode();
      chapter = { id: `bloc-${chapters.length + 1}`, order: chapters.length + 1, title: line.replace(/^# /, ""), category:category.id, nodes: [] };
      chapters.push(chapter);
      continue;
    }
    if (/^# /.test(line)) { finishNode(); field = null; chapter = /^# (Resum|Summary)/.test(line) ? null : chapter; continue; }
    const match = line.match(/^## Node (\d+) — (.+)$/);
    if (match) {
      finishNode();
      if (!chapter) continue;
      node = {
        id: slug(match[2]), order: Number(match[1]), title: match[2], chapter: chapter.id, chapterTitle: chapter.title,
        category:category.id, categoryColor:category.color, center: { type: "statement" },
        raw: Object.fromEntries(Object.values(FIELDS).map(key => [key, []]))
      };
      chapter.nodes.push(node.order);
      field = null;
      continue;
    }
    if (!node) continue;
    const marker = line.match(/^\*\*(.+?)\*\*$/);
    if (marker && FIELDS[marker[1]]) { field = FIELDS[marker[1]]; continue; }
    if (line === "---") continue;
    if (field) node.raw[field].push(line);
  }
  finishNode();
  finishInterlude();

  const sharedTitles = {
    proleg:t("La pregunta"),
    "part-i":t("Cooperar o créixer fins a matar"),
    "part-ii":t("La xarxa que alimenta el tumor"),
    "part-iii":t("Les metàstasis del capital"),
    "part-iv":t("Diagnòstic, tractament i poder"),
    "part-v":t("Què ha de créixer. Què ha de morir.")
  };
  categories.forEach(item => {
    item.title = sharedTitles[item.id] || nodes.find(entry => entry.category === item.id)?.title || item.label;
  });

  const tissueCenters = [
    [650,720],[1580,480],[2680,760],[3740,520],
    [3970,1620],[3020,1880],[1900,1510],[720,1960],
    [1050,3000],[2240,2700],[3480,3040],[3970,4140],
    [2920,4380],[1700,3970],[650,4800],[1900,5520]
  ];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  chapters.forEach((group, groupIndex) => {
    const members = nodes.filter(entry => entry.chapter === group.id);
    [group.x,group.y] = tissueCenters[groupIndex] || [700+(groupIndex%4)*1050,700+Math.floor(groupIndex/4)*1250];
    const phase = (groupIndex*.83) % Math.PI;
    members.forEach((entry, localIndex) => {
      if (localIndex === 0) { entry.map = {x:group.x,y:group.y,chapterStart:true}; return; }
      const angle = phase+localIndex*goldenAngle;
      const radius = 145+Math.sqrt(localIndex)*125;
      const organicX = Math.cos(angle)*radius*(1+(groupIndex%3)*.08);
      const organicY = Math.sin(angle)*radius*(.82+((groupIndex+1)%3)*.07);
      entry.map = {x:group.x+organicX,y:group.y+organicY,chapterStart:false};
    });
  });

  validate(nodes);
  return { id: "cancerpitalism", title: "Cancerpitalism", nodes, chapters, categories };
}

function slug(value) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function validate(nodes) {
  const errors = [];
  const ids = new Set();
  if (nodes.length !== 76) errors.push(`S’esperaven 76 nodes i se n’han trobat ${nodes.length}`);
  nodes.forEach((entry, index) => {
    if (ids.has(entry.id)) errors.push(`Identificador duplicat: ${entry.id}`);
    ids.add(entry.id);
    if (entry.order !== index + 1) errors.push(`Ordre incorrecte al node ${entry.order}`);
    if (!entry.center.text || !entry.question || !entry.answer || !entry.diagram) errors.push(`Contingut incomplet: ${entry.id}`);
    if (!entry.left || !entry.right) errors.push(`Falta la lectura de càncer o de capitalisme: ${entry.id}`);
    if (!entry.correspondence || !entry.south) errors.push(`Falta la correspondència o les fonts: ${entry.id}`);
  });
  if (errors.length) throw new Error(errors.join("\n"));
}
