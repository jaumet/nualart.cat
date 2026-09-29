// Gramàtica visual dels 76 diagrames centrals.
// Cada plantilla dibuixa una sola relació dins d’un llenç de 800 × 800.
// Els textos són curts, en majúscules, i sempre es mostren dins del grup «diagram-labels».

const f = n => Number(n).toFixed(1);
const esc = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const circle = (x, y, r, cls = "", style = "") => `<circle class="${cls}" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"${style ? ` style="${style}"` : ""}/>`;
const rect = (x, y, w, h, cls = "", rx = 0, style = "") => `<rect class="${cls}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}"${style ? ` style="${style}"` : ""}/>`;
const path = (d, cls = "", style = "") => `<path class="${cls}" d="${d}"${style ? ` style="${style}"` : ""}/>`;
// Les fletxes de traç gruixut porten la punta dibuixada com a triangle: Chrome amaga el marcador
// quan el traç és ample i no escala amb vector-effect.
const arrow = (d, cls = "", style = "") => {
  const width = Number((style.match(/stroke-width:([\d.]+)/) || [])[1] || 0);
  if (width <= 4) return `<path class="${cls}" d="${d}" marker-end="url(#${cls.includes("danger") ? "arrow-danger" : "arrow"})"${style ? ` style="${style}"` : ""}/>`;
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const [px, py, x, y] = nums.slice(-4);
  const a = Math.atan2(y - py, x - px), size = 14 + width * 2.4;
  const pt = (r, t) => `${f(x + Math.cos(a + t) * r)} ${f(y + Math.sin(a + t) * r)}`;
  const back = `${f(x - Math.cos(a) * size * .7)} ${f(y - Math.sin(a) * size * .7)}`;
  const shaft = d.replace(/(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*$/, back);
  return `<path class="${cls}" d="${shaft}" style="${style}"/><path class="${cls.includes("danger") ? "danger-fill" : "solid"}" d="M${pt(size * .2, 0)}L${pt(size, Math.PI - .42)}L${pt(size, Math.PI + .42)}Z"/>`;
};
const line = (x1, y1, x2, y2, cls = "", style = "") => path(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, cls, style);
const arrowLine = (x1, y1, x2, y2, cls = "", style = "") => arrow(`M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, cls, style);
const SIZES = { "": 21, strong: 24, small: 18, big: 110 };
const text = (x, y, value, anchor = "middle", cls = "") => `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" style="font-size:${SIZES[cls] ?? 21}px">${esc(value)}</text>`;
const ring = (n, cx, cy, r, start = -Math.PI / 2) => Array.from({ length: n }, (_, i) => {
  const a = start + i * 2 * Math.PI / n;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
});
const person = (x, y, s = 1, cls = "") => `${circle(x, y - 34 * s, 16 * s, cls)}${path(`M${f(x - 30 * s)} ${f(y + 40 * s)}C${f(x - 30 * s)} ${f(y - 8 * s)} ${f(x + 30 * s)} ${f(y - 8 * s)} ${f(x + 30 * s)} ${f(y + 40 * s)}Z`, cls)}`;
const blob = (x, y, r, wobble = .16, seed = 1, cls = "") => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = i / 10 * Math.PI * 2;
    const k = 1 + Math.sin(i * 2.3 + seed) * wobble;
    return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k];
  });
  const d = pts.map((p, i) => {
    const n = pts[(i + 1) % pts.length];
    const m = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2];
    return `${i ? "" : `M${f((pts.at(-1)[0] + p[0]) / 2)} ${f((pts.at(-1)[1] + p[1]) / 2)}`}Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  }).join("");
  return path(`${d}Z`, cls);
};
const chip = (x, y, w, label, cls = "") => `${rect(x - w / 2, y - 26, w, 52, `chip ${cls}`, 26)}`;
const chipLabel = (x, y, label) => text(x, y + 5, label, "middle", "strong");

// Cada plantilla retorna [elements, labels].
const T = {
  // Una part creix mentre el cercle que la conté s’aprima.
  shell({ labels: [top, bottom] }) {
    const steps = [[160, 18, 12], [400, 42, 6], [640, 78, 1.5]];
    const el = steps.map(([x, r, w]) => `${circle(x, 400, 100, "", `stroke-width:${w}px`)}${circle(x, 400, r, "accent-fill")}`).join("")
      + arrowLine(270, 400, 290, 400, "thin") + arrowLine(510, 400, 530, 400, "thin");
    return [el, text(400, 200, top) + text(400, 620, bottom) + text(160, 540, "ABANS", "middle", "small") + text(640, 540, "DESPRÉS", "middle", "small")];
  },

  // Dues columnes alineades fila per fila.
  columns({ labels: [left, right], rows }) {
    const y0 = 250, gap = 90;
    const el = rows.map((_, i) => `${line(150, y0 + i * gap + 30, 650, y0 + i * gap + 30, "guide")}${circle(215, y0 + i * gap - 6, 16, "accent-fill")}${circle(585, y0 + i * gap - 6, 16, "accent-fill")}`).join("")
      + line(400, 190, 400, y0 + rows.length * gap - 30, "guide");
    const lab = text(215, 170, left, "middle", "strong") + text(585, 170, right, "middle", "strong")
      + rows.map((row, i) => text(400, y0 + i * gap, row, "middle", "small")).join("");
    return [el, lab];
  },

  // Fluxos d’una xarxa que convergeixen en un sol node.
  converge({ labels: [outer, inner], fromRing = false, n = 8, mode = "" }) {
    if (mode === "pipes") {
      const ys = [170, 260, 350, 440, 530, 620];
      const el = ys.map((y, i) => `${path(`M90 ${y}H${260 + i * 12}`, "guide", "stroke-width:10px")}${arrow(`M${260 + i * 12} ${y}C${420} ${y} ${470} 400 ${540} 400`, "danger")}${line(700, y, 740, y, "guide", "stroke-width:10px")}`).join("")
        + rect(540, 290, 150, 220, "accent-fill", 12) + text(720, 150, "", "end");
      return [el, text(90, 130, outer, "start") + text(615, 560, inner, "middle", "strong") + text(720, 690, "LA RESTA DEL COS", "end", "small")];
    }
    if (mode === "shrinking") {
      const pts = ring(n, 400, 400, 280);
      const centers = [[360, 380], [470, 440]];
      const el = pts.map(([x, y], i) => {
        const c = centers[i % 2], dx = c[0] - x, dy = c[1] - y, d = Math.hypot(dx, dy), k = (d - 70) / d;
        return `${arrowLine(x + dx * .12, y + dy * .12, x + dx * k, y + dy * k, "thin")}${circle(x, y, 30 - (i % 4) * 6, "soft")}`;
      }).join("") + centers.map(([x, y]) => circle(x, y, 60, "accent-fill")).join("");
      return [el, text(400, 70, outer) + text(415, 560, inner, "middle", "strong")];
    }
    const pts = ring(n, 400, 400, 250);
    const target = fromRing ? pts[2] : [400, 400];
    const links = fromRing ? pts.map((p, i) => line(p[0], p[1], pts[(i + 1) % n][0], pts[(i + 1) % n][1], "guide")).join("") : "";
    const flows = pts.filter(p => p !== target).map(p => {
      const dx = target[0] - p[0], dy = target[1] - p[1], d = Math.hypot(dx, dy), k = (d - 70) / d;
      return arrowLine(p[0] + dx * .14, p[1] + dy * .14, p[0] + dx * k, p[1] + dy * k);
    }).join("");
    const el = links + flows + pts.filter(p => p !== target).map(p => circle(p[0], p[1], 22)).join("") + circle(target[0], target[1], 52, "accent-fill");
    return [el, text(400, 110, outer) + text(target[0], target[1] + 100, inner, "middle", "strong")];
  },

  // Formes separades; una fletxa opcional entre dues d’elles.
  separate({ labels, link }) {
    const xs = labels.length === 2 ? [230, 570] : [150, 400, 650];
    const draw = [
      x => person(x, 400, 1.6),
      x => `${circle(x, 400, 72)}${circle(x + 12, 392, 24, "accent-fill")}`,
      x => `${rect(x - 70, 330, 140, 140)}${line(x - 70, 377, x + 70, 377)}${line(x - 70, 424, x + 70, 424)}${line(x - 23, 330, x - 23, 470)}${line(x + 23, 330, x + 23, 470)}`
    ];
    const shapes = labels.length === 2 ? [draw[1], draw[2]] : draw;
    let el = xs.map((x, i) => shapes[i](x)).join("") + xs.slice(1).map((x, i) => line((xs[i] + x) / 2, 280, (xs[i] + x) / 2, 520, "guide")).join("");
    let lab = xs.map((x, i) => text(x, 560, labels[i], "middle", "strong")).join("");
    if (link) {
      const [a, b, label] = link;
      el += arrow(`M${xs[a] - 20} 300C${xs[a] - 60} 200 ${xs[b] + 60} 200 ${xs[b] + 20} 300`, "danger");
      lab += text((xs[a] + xs[b]) / 2, 205, label, "middle", "small");
    }
    return [el, lab];
  },

  // Bifurcació: procés sense intenció / decisió amb signatura.
  fork({ labels: [up, down, origin] }) {
    const el = line(110, 400, 330, 400) + arrow("M330 400C420 400 460 250 590 250") + arrow("M330 400C420 400 460 550 590 550", "danger")
      + circle(330, 400, 14, "solid") + circle(650, 250, 40) + rect(610, 510, 90, 110, "", 4) + line(628, 540, 682, 540) + line(628, 562, 682, 562) + circle(680, 600, 22, "accent-fill");
    return [el, text(110, 370, origin || "", "start", "small") + text(650, 190, up, "middle", "strong") + text(655, 670, down, "middle", "strong")];
  },

  // Una malaltia dins d’un cos / un cos dins d’un sistema.
  contain({ labels: [left, right] }) {
    const body = x => `${circle(x, 250, 42)}${path(`M${x - 70} 560C${x - 90} 360 ${x - 60} 320 ${x} 318C${x + 60} 320 ${x + 90} 360 ${x + 70} 560Z`)}`;
    const el = body(220) + circle(245, 420, 20, "accent-fill") + rect(450, 160, 300, 460, "accent-soft", 40) + body(600);
    return [el, text(220, 660, left, "middle", "strong") + text(600, 660, right, "middle", "strong")];
  },

  // Xarxes: equilibrada, amb un node que trenca, uniforme, redistribuïda…
  network({ labels, mode = "balanced" }) {
    const pts = ring(7, 400, 400, 220).concat([[400, 400]]);
    const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [7, 0], [7, 2], [7, 4], [7, 5], [1, 3], [6, 2]];
    const drawEdges = (skip = () => false, cls = "") => edges.filter(e => !skip(e)).map(([a, b]) => line(pts[a][0], pts[a][1], pts[b][0], pts[b][1], cls)).join("");
    const shapes = (i, x, y, r = 26) => i % 3 === 0 ? circle(x, y, r) : i % 3 === 1 ? rect(x - r, y - r, 2 * r, 2 * r, "", 6) : path(`M${f(x)} ${f(y - r)}L${f(x + r)} ${f(y + r)}L${f(x - r)} ${f(y + r)}Z`);
    if (mode === "defector") {
      const el = drawEdges(([a, b]) => a === 3 || b === 3) + pts.map((p, i) => i === 3 ? "" : shapes(i, p[0], p[1])).join("")
        + edges.filter(([a, b]) => a === 3 || b === 3).map(([a, b]) => { const o = pts[a === 3 ? b : a]; return line(o[0], o[1], (o[0] + pts[3][0]) / 2, (o[1] + pts[3][1]) / 2, "guide"); }).join("")
        + circle(pts[3][0], pts[3][1], 70, "accent-fill");
      return [el, text(400, 110, labels[0]) + text(pts[3][0], pts[3][1] + 110, labels[1], "middle", "strong")];
    }
    if (mode === "compare") {
      const small = (cx, uniform, failed) => {
        const q = ring(6, cx, 400, 110).concat([[cx, 400]]);
        const e = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 0], [6, 2], [6, 4], [1, 4]];
        return e.map(([a, b]) => line(q[a][0], q[a][1], q[b][0], q[b][1], failed ? "guide" : "")).join("")
          + q.map((p, i) => uniform ? circle(p[0], p[1], 18, failed ? "solid" : "") : shapes(i, p[0], p[1], 18)).join("")
          + (uniform ? "" : `${circle(q[1][0], q[1][1], 26, "accent-fill")}`);
      };
      return [small(220, false, false) + small(580, true, true) + line(520, 340, 640, 460, "danger", "stroke-width:8px") + line(640, 340, 520, 460, "danger", "stroke-width:8px"),
        text(220, 590, labels[0], "middle", "strong") + text(580, 640, labels[1], "middle", "strong")];
    }
    if (mode === "decentralize") {
      const left = ring(6, 210, 400, 120).map(p => `${line(210, 400, p[0], p[1])}${circle(p[0], p[1], 14)}`).join("") + circle(210, 400, 42, "accent-fill");
      const hubs = [[540, 320], [660, 330], [600, 470]];
      const right = hubs.map(([x, y], i) => ring(3, x, y, 70, i).map(p => `${line(x, y, p[0], p[1])}${circle(p[0], p[1], 12)}`).join("") + circle(x, y, 24, "accent-fill")).join("")
        + line(540, 320, 660, 330) + line(660, 330, 600, 470) + line(600, 470, 540, 320);
      return [left + right + arrowLine(355, 400, 440, 400), text(210, 600, labels[0], "middle", "strong") + text(600, 600, labels[1], "middle", "strong")];
    }
    if (mode === "rewire") {
      const q = ring(6, 210, 400, 130);
      const left = q.map(([x, y]) => `${arrowLine(x, y, 210 + (x - 210) * .45, 400 + (y - 400) * .45, "thin")}${circle(x, y, 16)}`).join("") + circle(210, 400, 44, "", "stroke-dasharray:8 8");
      const r = ring(6, 600, 400, 130);
      const right = r.map(([x, y], i) => `${line(x, y, r[(i + 1) % 6][0], r[(i + 1) % 6][1])}${line(x, y, r[(i + 2) % 6][0], r[(i + 2) % 6][1], "guide")}${circle(x, y, 16, i % 2 ? "accent-fill" : "")}`).join("");
      return [left + right + arrowLine(355, 400, 445, 400), text(210, 600, labels[0], "middle", "strong") + text(600, 600, labels[1], "middle", "strong")];
    }
    if (mode === "regulated") {
      const gates = ring(4, 400, 400, 300, -Math.PI / 4);
      const el = drawEdges() + pts.map((p, i) => shapes(i, p[0], p[1], 22)).join("") + circle(400, 400, 300, "", "stroke-dasharray:14 10")
        + gates.map(([x, y], i) => i % 2 ? arrowLine(x * 1.12 - 48, y * 1.12 - 48, x * .94 + 24, y * .94 + 24) : arrowLine(x * .94 + 24, y * .94 + 24, x * 1.12 - 48, y * 1.12 - 48)).join("");
      return [el, text(400, 70, labels[0], "middle", "strong") + text(400, 760, labels[1], "middle", "small")];
    }
    if (mode === "sectors") {
      const s = ring(labels.length - 1, 400, 400, 250);
      const el = drawEdges(() => false, "guide") + s.map(([x, y]) => `${arrowLine(x * .78 + 88, y * .78 + 88, x * .36 + 256, y * .36 + 256)}${circle(x, y, 30, "accent-fill")}`).join("") + circle(400, 400, 60);
      return [el, s.map(([x, y], i) => text(x, y + (y > 400 ? 62 : -46), labels[i + 1], "middle", "small")).join("") + text(400, 405, labels[0], "middle", "strong")];
    }
    // balanced / nocenter
    const noCenter = mode === "nocenter";
    const el = drawEdges(noCenter ? ([a, b]) => a === 7 || b === 7 : () => false) + (noCenter ? line(pts[0][0], pts[0][1], pts[4][0], pts[4][1]) + line(pts[1][0], pts[1][1], pts[5][0], pts[5][1]) : "")
      + pts.map((p, i) => noCenter && i === 7 ? circle(400, 400, 36, "guide") : shapes(i, p[0], p[1], 20 + (i * 7) % 14)).join("");
    return [el, text(400, 110, labels[0]) + text(400, 720, labels[1] || "", "middle", "small")];
  },

  // Seqüència d’etapes; pot tancar-se en bucle, marcar una intervenció o mostrar dues files.
  sequence({ rows, loop = false, marker = null, cls = [] }) {
    let el = "", lab = "";
    const yRows = rows.length === 1 ? [400] : [300, 520];
    rows.forEach((row, r) => {
      const y = yRows[r];
      const w = Math.min(170, 640 / row.length);
      const xs = row.map((_, i) => 400 + (i - (row.length - 1) / 2) * (w + 22));
      xs.forEach((x, i) => {
        el += chip(x, y, w, row[i], (cls[r] && cls[r][i]) || "");
        lab += chipLabel(x, y, row[i]);
        if (i < xs.length - 1) el += arrowLine(x + w / 2 + 2, y, xs[i + 1] - w / 2 - 4, y, "thin");
      });
      if (loop === true || loop === r) el += arrow(`M${f(xs.at(-1))} ${y + 30}C${f(xs.at(-1))} ${y + 150} ${f(xs[0])} ${y + 150} ${f(xs[0])} ${y + 34}`, "danger");
      if (marker !== null && r === 0) {
        const x = xs[marker];
        el += line(x, y - 110, x, y + 110, "limit");
        lab += text(x, y - 130, "INTERVENCIÓ", "middle", "small");
      }
    });
    return [el, lab];
  },

  // Corbes en un gràfic simple.
  curves({ labels = [], kind }) {
    const axes = arrowLine(120, 660, 700, 660, "thin") + arrowLine(120, 660, 120, 120, "thin");
    const L = [];
    let el = axes;
    if (kind === "logistic") {
      el += line(120, 250, 700, 250, "limit") + path("M130 640C300 630 330 290 470 290S640 285 690 285") + path("M130 645C360 640 470 520 560 300S640 140 660 110", "danger");
      L.push(text(690, 235, labels[2], "end", "small"), text(690, 320, labels[0], "end", "strong"), text(600, 110, labels[1], "end", "strong"));
    } else if (kind === "crossing") {
      el += path("M130 600C300 590 480 420 690 180", "danger") + path("M130 200C320 210 480 380 690 600");
      L.push(text(690, 160, labels[0], "end", "strong"), text(690, 640, labels[1], "end", "strong"));
    } else if (kind === "threshold") {
      el += line(120, 560, 700, 560, "limit") + path("M130 150C260 170 330 560 430 590S640 600 690 600") + [470, 520, 560, 610, 650].map((x, i) => circle(x, 610 + (i % 2) * 18, 7, "accent-fill")).join("");
      L.push(text(690, 540, labels[0], "end", "small"), text(560, 650, labels[1], "middle", "strong"));
    } else if (kind === "sufficiency") {
      el += line(120, 300, 700, 300, "limit") + [[130, 620, 0], [130, 560, 1], [130, 640, 2]].map(([x, y, i]) => path(`M${x} ${y}C${260 + i * 40} ${y - 20} ${360 + i * 40} 320 ${480 + i * 40} 310S640 305 690 305`, i === 1 ? "danger" : "")).join("");
      L.push(text(130, 280, labels[0], "start", "strong"));
    } else if (kind === "twolines") {
      el += path("M130 580C300 560 460 360 690 220") + path("M130 220C300 240 460 440 690 580", "danger") + arrow("M430 300C400 330 400 420 430 460", "thin");
      L.push(text(690, 200, labels[0], "end", "strong"), text(690, 620, labels[1], "end", "strong"), text(460, 390, labels[2], "start", "small"));
    } else if (kind === "hidden") {
      el += line(560, 130, 560, 660, "limit") + path("M130 640C320 620 460 470 550 230", "danger") + circle(540, 270, 30, "solid");
      L.push(text(575, 120, labels[0], "start", "small"), text(520, 330, labels[1], "end", "strong"));
    } else if (kind === "reservoir") {
      el += rect(150, 440, 150, 170, "solid", 10) + path("M300 520C360 520 380 640 430 640S560 630 690 150", "danger") + line(225, 440, 225, 400, "thin");
      L.push(text(225, 650, labels[0], "middle", "strong"), text(680, 130, labels[1], "end", "strong"));
    } else if (kind === "stops") {
      el += [[240, 360], [420, 290], [600, 390]].map(([x, top], i) => `${line(x - 60, top, x + 60, top, "guide")}${path(`M${x - 60} 650C${x - 20} 640 ${x - 40} ${top} ${x + 60} ${top}`, i === 1 ? "danger" : "")}`).join("");
      L.push(text(400, 200, labels[0], "middle", "strong"));
    }
    return [el, L.join("")];
  },

  // Bucle de retroalimentació que s’engruixeix.
  loop({ labels: [a, b] }) {
    const el = arrow("M300 300C360 180 440 180 500 300", "", "stroke-width:4px") + arrow("M500 500C440 620 360 620 300 500", "", "stroke-width:7px") + circle(250, 400, 90, "accent-fill") + circle(550, 400, 90);
    return [el, text(250, 405, a, "middle", "strong") + text(550, 405, b, "middle", "strong")];
  },

  // Semàfor vermell i una fletxa que no s’atura.
  light({ labels: [a, b] }) {
    const el = rect(170, 200, 110, 300, "", 20) + circle(225, 260, 34, "danger-fill") + circle(225, 350, 34) + circle(225, 440, 34) + line(225, 500, 225, 620)
      + path("M225 620C300 640 320 600 360 560", "guide") + line(350, 548, 380, 578, "limit") + arrowLine(110, 330, 710, 330, "", "stroke-width:6px");
    return [el, text(225, 180, a, "middle", "small") + text(430, 620, b, "start", "strong")];
  },

  // Una cinta que accelera; qui s’atura cau.
  treadmill({ labels: [a, b] }) {
    const el = rect(120, 470, 520, 60, "", 30) + [180, 300, 420, 540].map(x => circle(x, 500, 18)).join("")
      + [220, 360, 500].map(x => person(x, 400, .9)).join("") + `<g transform="rotate(60 700 560)">${person(700, 560, .9)}</g>`
      + arrowLine(580, 590, 200, 590, "thin");
    return [el, text(380, 650, a, "middle", "small") + text(700, 680, b, "middle", "strong")];
  },

  // Rondes de selecció: moltes formes en queden poques.
  rounds({ labels, mode = "rounds" }) {
    let el = "";
    if (mode === "filter") {
      el += path("M140 200L660 200L460 420L460 560L340 560L340 420Z") + [180, 240, 300, 360, 420, 480, 540, 600].map((x, i) => i % 3 === 1 ? circle(x, 160, 14, "accent-fill") : circle(x, 160, 14)).join("")
        + [[250, 250], [340, 290], [460, 260], [560, 250]].map(([x, y]) => `${line(x - 12, y - 12, x + 12, y + 12)}${line(x - 12, y + 12, x + 12, y - 12)}`).join("")
        + [370, 400, 430].map(x => circle(x, 640, 14, "accent-fill")).join("") + [340, 380, 420, 460].map(x => circle(x, 700, 14, "accent-fill")).join("");
      return [el, text(400, 110, labels[0]) + text(560, 690, labels[1], "start", "strong")];
    }
    if (mode === "generations") {
      el += line(620, 150, 620, 650, "limit");
      [150, 290, 430].forEach((x, g) => { el += arrowLine(x, 400, x + 90 + g * 30, 400 - g * 5, "thin"); el += circle(x, 400, 26 + g * 8, g === 2 ? "accent-fill" : ""); });
      el += arrowLine(470, 400, 700, 400, "danger");
      return [el, text(290, 520, labels[0], "middle", "strong") + text(620, 130, labels[1], "middle", "small")];
    }
    const cols = [[4, 20], [3, 32], [1, 90]];
    cols.forEach(([n, r], c) => {
      const x = 170 + c * 230;
      for (let i = 0; i < n; i += 1) {
        const y = 400 + (i - (n - 1) / 2) * 90;
        el += c === 2 ? circle(x, y, r, "accent-fill") : i === 0 ? circle(x, y, r, "accent-fill") : rect(x - r, y - r, 2 * r, 2 * r, "", 6);
      }
      if (c < 2) el += arrowLine(x + 55, 400, x + 175, 400, "thin");
    });
    return [el, labels.map((l, i) => text(170 + i * 230, 640, l, "middle", "small")).join("")];
  },

  // Un centre net que expulsa dany cap a les perifèries (o que torna).
  outflow({ labels: [a, b], back = false }) {
    const pts = ring(4, 400, 400, 260, -Math.PI / 4);
    let el = circle(400, 400, 70) + pts.map(([x, y]) => blob(x, y, 42, .2, x, "soft")).join("");
    if (back) {
      el = circle(400, 400, 320, "", "stroke-width:4px") + person(400, 430, 1.4) + ring(6, 400, 400, 1).map((_, i) => {
        const a1 = i * Math.PI / 3, x1 = 400 + Math.cos(a1) * 250, y1 = 400 + Math.sin(a1) * 250;
        return arrow(`M${f(400 + Math.cos(a1) * 120)} ${f(400 + Math.sin(a1) * 120)}Q${f(400 + Math.cos(a1 + .5) * 380)} ${f(400 + Math.sin(a1 + .5) * 380)} ${f(400 + Math.cos(a1 + .8) * 150)} ${f(400 + Math.sin(a1 + .8) * 150)}`, "danger");
      }).join("");
      return [el, text(400, 60, a, "middle", "strong") + text(400, 560, b, "middle", "small")];
    }
    el += pts.map(([x, y]) => arrowLine(400 + (x - 400) * .32, 400 + (y - 400) * .32, 400 + (x - 400) * .76, 400 + (y - 400) * .76, "danger", "stroke-width:6px")).join("");
    return [el, text(400, 405, a, "middle", "strong") + text(400, 740, b, "middle", "small")];
  },

  // Allò visible i allò que hi ha sota terra.
  ground({ labels: [above, below], mode = "iceberg" }) {
    let el = line(80, 360, 720, 360, "", "stroke-width:3px");
    if (mode === "iceberg") el += rect(340, 270, 120, 90, "accent-fill", 6) + path("M140 380L660 380L600 660L200 660Z", "soft") + arrowLine(250, 620, 360, 400, "thin") + arrowLine(550, 620, 440, 400, "thin");
    if (mode === "roots") el += blob(400, 300, 60, .15, 3, "accent-fill") + [[-160, 640], [-60, 700], [40, 690], [150, 630], [-110, 520], [110, 540]].map(([dx, y], i) => path(`M400 370C${400 + dx * .3} ${440 + i * 8} ${400 + dx * .8} ${y - 60} ${400 + dx} ${y}`)).join("") + arrow("M470 250C520 200 560 200 590 240", "danger");
    if (mode === "seeds") el += [[180, 470], [320, 560], [470, 450], [600, 600], [250, 650]].map(([x, y], i) => `${circle(x, y, 20, i === 2 ? "accent-fill" : "solid")}`).join("") + path("M470 428C470 400 480 380 500 365", "danger", "stroke-width:5px");
    if (mode === "pipes") el += [[260, "guide"], [400, ""], [540, "guide"]].map(([x, c]) => `${circle(x, 240, 50, c)}${circle(x - 16, 230, 5, c)}${circle(x + 16, 230, 5, c)}`).join("") + path("M140 460H660M140 560H660M260 460V380M400 460V380M540 460V380M660 460V560M140 560V660", "", "stroke-width:10px") + arrowLine(160, 610, 640, 610, "danger");
    return [el, text(400, mode === "pipes" ? 150 : 200, above, "middle", "strong") + text(400, 730, below, "middle", "strong")];
  },

  // Centre i branques: vasos que porten cap endins, branques cap a zones buides, compartiments travessats.
  radial({ labels: [a, b], mode = "inward" }) {
    let el = "";
    if (mode === "inward") el += ring(8, 400, 400, 280).map(([x, y], i) => `${path(`M400 400Q${f(400 + (y - 400) * .35 + (x - 400) * .5)} ${f(400 - (x - 400) * .35 + (y - 400) * .5)} ${f(x)} ${f(y)}`, "guide")}${arrowLine(x * .86 + 56, y * .86 + 56, x * .42 + 232, y * .42 + 232, "danger")}${circle(x, y, 14)}`).join("") + circle(400, 400, 80, "accent-fill");
    if (mode === "branches") el += blob(260, 400, 110, .12, 2, "accent-fill") + [[620, 200], [660, 420], [590, 620]].map(([x, y]) => `${path(`M340 400C450 400 ${x - 120} ${y} ${x - 40} ${y}`, "danger")}${circle(x, y, 44, "", "stroke-dasharray:8 8")}`).join("");
    if (mode === "compartments") el += [0, 1, 2, 3].map(i => rect(110 + i * 150, 250, 130, 300, "", 10)).join("") + circle(175, 400, 34, "accent-fill") + arrow("M210 400C300 300 360 500 450 400S620 330 700 400", "danger") + [325, 475, 625].map(x => circle(x, 450, 9, "accent-fill")).join("");
    return [el, text(400, 110, a) + text(400, 720, b, "middle", "strong")];
  },

  // Un objecte al centre envoltat d’elements.
  orbit({ labels, mode = "identities" }) {
    const [center, ...around] = labels;
    const pts = ring(around.length, 400, 400, 250);
    let el = "";
    if (mode === "identities") el += pts.map(([x, y]) => `${person(x, y + 20, 1, "soft")}${line(400 + (x - 400) * .25, 400 + (y - 400) * .25, 400 + (x - 400) * .7, 400 + (y - 400) * .7, "guide")}`).join("") + rect(340, 340, 120, 120, "accent-fill", 18);
    if (mode === "encircle") el += blob(400, 400, 90, .25, 5, "danger-soft") + pts.map(([x, y]) => `${circle(x, y, 34, "accent-fill")}${arrowLine(400 + (x - 400) * .82, 400 + (y - 400) * .82, 400 + (x - 400) * .52, 400 + (y - 400) * .52, "thin")}`).join("") + circle(400, 400, 250, "guide");
    if (mode === "bignumber") el += circle(400, 400, 110, "accent-fill") + pts.map(([x, y]) => `${circle(x, y, 44)}${line(x - 18, y, x + 18, y, "", "stroke-width:6px")}`).join("");
    if (mode === "protected") {
      const inner = ring(around.length, 400, 400, 130);
      el += circle(400, 400, 235, "", "stroke-width:14px") + inner.map(([x, y]) => circle(x, y, 34, "accent-fill")).join("")
        + ring(6, 400, 400, 360, -Math.PI / 3).map(([x, y]) => arrowLine(x, y, 400 + (x - 400) * .74, 400 + (y - 400) * .74, "danger")).join("");
      return [el, inner.map(([x, y], i) => text(x, y + 60, around[i], "middle", "small")).join("") + text(400, 405, center, "middle", "strong") + text(400, 140, "€ · € · €", "middle", "small")];
    }
    if (mode === "dashboard") el += pts.map(([x, y], i) => `${path(`M${x - 50} ${y + 20}A50 50 0 0 1 ${x + 50} ${y + 20}`)}${line(x, y + 20, x + Math.cos(-Math.PI * (.35 + i * .06)) * 42, y + 20 + Math.sin(-Math.PI * (.35 + i * .06)) * 42, "", "stroke-width:4px")}`).join("") + circle(400, 400, 60, "guide");
    return [el, text(400, mode === "identities" ? 408 : 405, center, "middle", "strong") + pts.map(([x, y], i) => text(x, y + (mode === "identities" ? 100 : 80), around[i], "middle", "small")).join("")];
  },

  // Rellotge de 24 hores capturat.
  clock({ labels: [a, b] }) {
    const el = Array.from({ length: 24 }, (_, i) => {
      const a1 = (i / 24) * Math.PI * 2 - Math.PI / 2, a2 = ((i + 1) / 24) * Math.PI * 2 - Math.PI / 2 - .04;
      const p = (r, a) => `${f(400 + Math.cos(a) * r)} ${f(400 + Math.sin(a) * r)}`;
      const captured = i < 7 || (i > 8 && i < 20) || i === 22;
      return path(`M${p(160, a1)}L${p(280, a1)}A280 280 0 0 1 ${p(280, a2)}L${p(160, a2)}A160 160 0 0 0 ${p(160, a1)}Z`, captured ? "accent-fill" : "");
    }).join("") + person(400, 420, 1.1);
    return [el, text(400, 80, a, "middle", "strong") + text(400, 740, b, "middle", "small")];
  },

  // Escuts: gir cap al centre, protecció de zones sensibles, fre sobre si mateix.
  shield({ labels: [a, b], mode = "turn" }) {
    const sh = (x, y, rot = 0, cls = "") => `<g transform="rotate(${rot} ${x} ${y})">${path(`M${x - 50} ${y - 60}H${x + 50}V${y}C${x + 50} ${y + 50} ${x} ${y + 70} ${x} ${y + 70}C${x} ${y + 70} ${x - 50} ${y + 50} ${x - 50} ${y}Z`, cls)}</g>`;
    let el = "";
    if (mode === "turn") el += sh(170, 400, 90) + sh(330, 400, 150, "guide") + sh(490, 400, 225, "guide") + blob(650, 400, 50, .15, 1, "accent-fill") + sh(650, 400, 270) + arrow("M170 290C300 220 500 220 620 300", "thin") + person(120, 560, .8) + person(220, 580, .8);
    if (mode === "protect") el += blob(400, 360, 80, .2, 4, "danger-soft") + arrowLine(400, 120, 400, 260, "danger", "stroke-width:6px") + [[210, 560], [400, 600], [590, 560]].map(([x, y]) => `${circle(x, y + 30, 36, "accent-fill")}${sh(x, y - 60, 0)}`).join("");
    if (mode === "brake") el += sh(400, 380, 0, "accent-fill") + arrow("M470 320C620 300 620 520 470 480", "danger") + rect(470, 430, 40, 70, "solid", 6);
    return [el, text(400, 120, a, "middle", mode === "protect" ? "small" : "strong") + text(400, 720, b, "middle", "strong")];
  },

  // Balança de costos repartits.
  balance({ labels: [a, b] }) {
    const el = line(400, 200, 400, 600) + line(180, 280, 620, 280) + line(300, 600, 500, 600)
      + [180, 620].map(x => `${line(x, 280, x - 70, 420)}${line(x, 280, x + 70, 420)}${path(`M${x - 90} 420H${x + 90}C${x + 90} 470 ${x - 90} 470 ${x - 90} 420`)}`).join("")
      + [150, 190, 230].map((x, i) => circle(x - 20, 400 - i * 6, 14, "accent-fill")).join("") + [590, 630, 670].map((x, i) => circle(x - 20, 400 - i * 6, 14, "accent-fill")).join("") + circle(400, 190, 20, "solid");
    return [el, text(400, 140, a, "middle", "small") + text(400, 680, b, "middle", "strong")];
  },

  // Una institució amb dues sortides.
  outlets({ labels: [center, a, b] }) {
    const el = rect(300, 300, 200, 200, "", 8) + path("M290 300L400 230L510 300") + arrow("M500 350C600 350 620 250 700 230", "thin") + arrow("M500 450C600 450 620 550 690 570", "danger", "stroke-width:8px");
    return [el, text(400, 410, center, "middle", "strong") + text(700, 205, a, "end", "small") + text(700, 630, b, "end", "strong")];
  },

  // Vida quotidiana convertida en parcel·les amb preu.
  parcels({ labels: [a, b] }) {
    const cells = [];
    for (let i = 0; i < 6; i += 1) for (let j = 0; j < 6; j += 1) {
      const x = 220 + i * 60, y = 220 + j * 60;
      if (Math.hypot(x + 30 - 400, y + 30 - 400) < 190) cells.push([x, y, (i * 7 + j * 3) % 5 !== 0]);
    }
    const el = circle(400, 400, 200) + cells.map(([x, y, priced]) => `${rect(x + 4, y + 4, 52, 52, priced ? "accent-fill" : "", 4)}`).join("");
    return [el, cells.filter(c => c[2]).map(([x, y]) => text(x + 30, y + 37, "€", "middle", "strong")).join("") + text(400, 140, a) + text(400, 680, b, "middle", "strong")];
  },

  // Arbre amb un sol tronc i branques diferents.
  tree({ labels: [a, b] }) {
    const branches = [[220, 240], [300, 170], [400, 140], [500, 170], [580, 240], [640, 330], [160, 330]];
    const el = path("M400 660V430", "", "stroke-width:12px") + branches.map(([x, y], i) => `${path(`M400 ${440 + (i % 3) * 20}C400 ${380} ${x} ${y + 120} ${x} ${y}`)}${i % 2 ? circle(x, y, 26, "accent-fill") : rect(x - 24, y - 24, 48, 48, "", 8)}`).join("");
    return [el, text(430, 620, a, "start", "strong") + text(400, 90, b, "middle", "small")];
  },

  // Una forma fosca que pren el color de l’entorn.
  camouflage({ labels: [a, b] }) {
    const el = rect(90, 230, 620, 340, "soft", 20) + [170, 320, 470, 620].map((x, i) => blob(x, 400, 56, .2, i, i === 0 ? "solid" : i === 1 ? "mid" : i === 2 ? "soft-strong" : "soft")).join("") + circle(620, 400, 62, "", "stroke-dasharray:4 7");
    return [el, text(170, 510, a, "middle", "strong") + text(620, 510, b, "middle", "strong")];
  },

  // Una aixeta que redueix el flux sense tancar la font.
  tap({ labels: [a, b] }) {
    const el = path("M140 200H420V250H330V300", "", "stroke-width:10px") + rect(380, 170, 30, 40, "solid", 4) + path("M330 300V330", "danger", "stroke-width:4px")
      + path("M330 330V520", "danger", "stroke-dasharray:4 10;stroke-width:4px") + path("M220 450V640H440V450") + rect(224, 540, 212, 96, "accent-fill") + arrowLine(500, 630, 500, 480, "thin");
    return [el, text(140, 180, a, "start", "small") + text(530, 560, b, "start", "strong")];
  },

  // Extirpació amb marge i un punt que ja era fora.
  excise({ labels: [a, b] }) {
    const el = rect(120, 180, 560, 440, "soft", 30) + blob(360, 400, 80, .15, 3, "accent-fill") + circle(360, 400, 140, "", "stroke-dasharray:12 10") + arrowLine(360, 250, 360, 110, "danger") + circle(590, 300, 12, "danger-fill") + circle(590, 300, 28, "guide");
    return [el, text(360, 580, a, "middle", "small") + text(590, 260, b, "middle", "strong")];
  },

  // Objecte útil empès a la paperera abans del final de la seva vida.
  bin({ labels: [a, b, c] }) {
    const el = line(120, 300, 680, 300, "guide") + line(120, 285, 120, 315) + line(680, 285, 680, 315) + rect(130, 290, 200, 20, "accent-fill", 10)
      + rect(250, 390, 90, 90, "", 12) + arrow("M340 435C420 430 470 470 520 520", "danger") + path("M520 520H650L630 680H540Z") + line(510, 520, 660, 520, "", "stroke-width:5px");
    return [el, text(400, 270, c, "middle", "small") + text(295, 520, a, "middle", "strong") + text(585, 720, b, "middle", "strong")];
  },

  // Les peces petites surten; la gran es queda sostinguda per rescats.
  rescue({ labels: [a, b, c] }) {
    const el = [150, 250, 350].map((x, i) => `${rect(x - 30, 370, 60, 60, i === 1 ? "guide" : "", 6)}${arrowLine(x, 360, x, 250 - i * 10, "thin")}`).join("")
      + rect(470, 300, 200, 200, "accent-fill", 10) + [[420, 620], [560, 660], [700, 620]].map(([x, y]) => arrowLine(x, y, 520 + (x - 420) * .35, 510, "danger")).join("");
    return [el, text(250, 200, a, "middle", "small") + text(570, 405, b, "middle", "strong") + text(560, 720, c, "middle", "small")];
  },

  // Llavor sobre un sòl que la nodreix.
  soil({ labels: [a, b], items = [] }) {
    const el = path("M80 430C220 400 580 460 720 430V700H80Z", "soft") + blob(400, 360, 60, .1, 2, "accent-fill")
      + items.map((_, i) => { const x = 160 + i * (480 / Math.max(1, items.length - 1)); return arrow(`M${x} 650C${x} 520 ${(x + 400) / 2} 480 ${400 + (x - 400) * .15} 420`, "thin"); }).join("");
    return [el, text(400, 260, a, "middle", "strong") + items.map((item, i) => text(160 + i * (480 / Math.max(1, items.length - 1)), 690, item, "middle", "small")).join("") + text(400, 760, b, "middle", "small")];
  },

  // El futur arrossegat cap al present.
  chain({ labels: [a, b, c] }) {
    const links = [260, 330, 400, 470, 540].map(x => `<ellipse cx="${x}" cy="400" rx="42" ry="20"/>`).join("");
    const el = circle(160, 400, 60, "accent-fill") + links + arrowLine(700, 400, 600, 400, "danger", "stroke-width:6px") + circle(700, 400, 50);
    return [el, text(160, 500, a, "middle", "strong") + text(700, 500, b, "middle", "strong") + text(400, 330, c, "middle", "small")];
  },

  // Petits fluxos que pugen cap a un mateix propietari.
  rent({ labels: [a, b] }) {
    const el = rect(310, 130, 180, 110, "accent-fill", 10) + [150, 250, 350, 450, 550, 650].map((x, i) => `${person(x, 600, .7)}${arrow(`M${x} 540C${x} 420 ${400 + (x - 400) * .2} 360 ${400 + (x - 400) * .2} 250`, "thin")}`).join("");
    return [el, text(400, 195, a, "middle", "strong") + text(400, 700, b, "middle", "small")];
  },

  // Dues expansions semblants: una sense decisió, l’altra amb bandera i exèrcit.
  twin({ labels: [a, b] }) {
    const spread = (cx, cls) => blob(cx, 400, 70, .2, cx, cls) + ring(5, cx, 400, 150).map(([x, y]) => `${line(cx + (x - cx) * .45, 400 + (y - 400) * .45, x, y, "guide")}${circle(x, y, 16, cls)}`).join("");
    const el = spread(220, "soft-strong") + spread(580, "accent-fill") + line(580, 330, 580, 200) + path("M580 200H660L640 225L660 250H580", "danger-fill") + [540, 580, 620].map(x => rect(x - 12, 480, 24, 24, "solid", 3)).join("");
    return [el, text(220, 620, a, "middle", "strong") + text(580, 620, b, "middle", "strong")];
  },

  // Una forma que devora la base que la sosté.
  eat({ labels: [a, b] }) {
    const el = path("M120 560H680V660H120Z", "soft") + path("M300 560C320 520 480 520 500 560", "", "stroke-width:0") + blob(400, 420, 110, .12, 4, "accent-fill")
      + path("M300 560C330 610 470 610 500 560", "danger-fill") + [230, 570].map(x => line(x, 560, x + 20, 620, "guide")).join("");
    return [el, text(400, 250, a, "middle", "strong") + text(400, 720, b, "middle", "strong")];
  },

  // Zona inflamada de la qual emergeix una forma més gran.
  inflamed({ labels: [a, b] }) {
    const jag = ring(18, 400, 470, 1).map((_, i) => { const r = i % 2 ? 190 : 150, t = i / 18 * Math.PI * 2; return `${i ? "L" : "M"}${f(400 + Math.cos(t) * r * 1.3)} ${f(470 + Math.sin(t) * r * .7)}`; }).join("") + "Z";
    const el = path(jag, "danger-soft") + blob(400, 330, 90, .1, 1, "accent-fill") + arrowLine(400, 440, 400, 250, "thin");
    return [el, text(400, 650, a, "middle", "strong") + text(400, 180, b, "middle", "strong")];
  },

  // Entrada ampla, funció estreta, residus amplis.
  funnel({ labels: [a, b, c] }) {
    const el = path("M100 220L360 360V440L100 580Z", "soft") + rect(360, 360, 80, 80, "accent-fill") + path("M440 360L700 220V580L440 440Z", "danger-soft")
      + arrowLine(120, 400, 330, 400, "thin") + arrowLine(470, 400, 690, 400, "thin");
    return [el, text(210, 190, a, "middle", "strong") + text(400, 500, b, "middle", "small") + text(590, 190, c, "middle", "strong")];
  },

  // Treball, cures i natura fan el producte; el benefici surt per una altra via.
  product({ labels: [a, b, c, d] }) {
    const ys = [220, 400, 580];
    const el = ys.map(y => `${circle(150, y, 40)}${arrowLine(195, y, 330, 380 + (y - 400) * .1, "thin")}`).join("") + rect(340, 330, 140, 140, "", 10)
      + arrow("M480 400H680", "thin") + arrow("M410 330C410 200 560 160 680 160", "danger", "stroke-width:8px") + circle(700, 160, 30, "accent-fill");
    return [el, text(150, 160, a, "middle", "small") + text(150, 345, b, "middle", "small") + text(150, 660, c, "middle", "small") + text(410, 405, "PRODUCTE", "middle", "strong") + text(700, 110, d, "middle", "strong")];
  },

  // Moltes fletxes petites que sumen una direcció.
  manyArrows({ labels: [a, b] }) {
    const el = Array.from({ length: 24 }, (_, i) => {
      const x = 120 + (i % 6) * 60, y = 220 + Math.floor(i / 6) * 100, t = -.5 + ((i * 37) % 11) / 11;
      return arrowLine(x, y, x + Math.cos(t) * 40, y + Math.sin(t) * 40, "thin");
    }).join("") + arrow("M500 400L700 400", "danger", "stroke-width:8px");
    return [el, text(270, 640, a, "middle", "small") + text(600, 340, b, "middle", "strong")];
  },

  // Espiral contra una frontera tancada, i un cercle buit a fora.
  spiral({ labels: [a, b, c] }) {
    let d = "";
    for (let t = 0; t < 26; t += .25) { const r = 8 + t * 9.5; d += `${t ? "L" : "M"}${f(360 + Math.cos(t) * r)} ${f(400 + Math.sin(t) * r)}`; }
    const el = path(d, "danger") + circle(360, 400, 260, "limit") + circle(700, 170, 60, "", "stroke-dasharray:8 8") + arrow("M560 240C600 200 620 190 640 185", "thin");
    return [el, text(360, 720, a, "middle", "strong") + text(360, 405, b, "middle", "small") + text(700, 270, c, "middle", "small")];
  },

  // Símptomes dispersos units en un patró.
  pattern({ labels: [a, b] }) {
    const pts = [[170, 250], [300, 560], [420, 210], [560, 470], [650, 260], [240, 420], [520, 640]];
    const el = pts.map(([x, y]) => circle(x, y, 18, "accent-fill")).join("") + path(`M${pts.map(p => p.join(" ")).join("L")}`, "danger", "stroke-dasharray:10 8");
    return [el, text(400, 110, a) + text(400, 730, b, "middle", "strong")];
  },

  // Tres estructures complementàries.
  three({ labels }) {
    const el = circle(230, 330, 110, "soft") + rect(460, 220, 210, 210, "soft", 20) + path("M400 460L520 660H280Z", "soft") + line(330, 380, 460, 330) + line(300, 430, 360, 520) + line(540, 430, 470, 540);
    return [el, text(230, 335, labels[0], "middle", "strong") + text(565, 330, labels[1], "middle", "strong") + text(400, 610, labels[2], "middle", "strong")];
  }
};

export const DEFS = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="30" markerHeight="30" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker><marker id="arrow-danger" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="30" markerHeight="30" orient="auto-start-reverse"><path class="danger-head" d="M0 0L10 5L0 10z"/></marker></defs>`;

export function renderDiagram(spec) {
  const template = T[spec.type];
  if (!template) throw new Error(`Plantilla de diagrama desconeguda: ${spec.type}`);
  const [elements, labels] = template(spec);
  return `<g class="diagram-element ${spec.type}">${elements}</g><g class="diagram-labels">${labels}</g>`;
}

export const templates = Object.keys(T);

export { f, esc, circle, rect, path, arrow, line, arrowLine, text, ring, person, blob };
