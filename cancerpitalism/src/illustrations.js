// Il·lustracions concretes dels 76 nodes.
// Cada escena dibuixa l’exemple real que explica el text (una bombeta de 1.000 hores, un fetge que es regenera,
// una porta giratòria…). Moltes són díptics: a l’esquerra el capitalisme, a la dreta el càncer.
import { f, circle, rect, path, arrow, line, arrowLine, text, blob } from "./diagrams.js";
import { tl } from "./i18n.js";

const g = (x, y, s, content, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})${rot ? ` rotate(${rot})` : ""}">${content}</g>`;
const ellipse = (x, y, rx, ry, cls = "", style = "") => `<ellipse class="${cls}" cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${style ? ` style="${style}"` : ""}/>`;
const T = (x, y, v, a = "middle", c = "") => text(x, y, tl(v), a, c);

// ── Díptic: capçaleres i separador ──
const diptych = (left = "CAPITALISME", right = "CÀNCER") => ({
  el: line(400, 110, 400, 730, "guide"),
  lab: `${T(200, 78, left, "middle", "cap-label")}${T(600, 78, right, "middle", "can-label")}`
});

// ── Primitives ──
const P = {
  cell(x, y, r, tumor = false, seed = 1) {
    const membrane = tumor ? blob(x, y, r, .2, seed, "danger-soft") : circle(x, y, r, "cell");
    const nucleus = tumor ? blob(x + r * .08, y - r * .05, r * .48, .18, seed + 2, "danger-fill") : circle(x + r * .1, y - r * .05, r * .3, "nucleus");
    return membrane + nucleus + (tumor ? "" : circle(x - r * .45, y + r * .3, r * .08, "solid") + circle(x + r * .3, y + r * .45, r * .07, "solid"));
  },
  tissue(x0, y0, cols, rows, s, special = () => "") {
    let out = "";
    for (let j = 0; j < rows; j += 1) for (let i = 0; i < cols; i += 1) {
      const x = x0 + i * s * 1.5, y = y0 + j * s * 1.732 + (i % 2) * s * .866;
      const hex = Array.from({ length: 6 }, (_, k) => `${f(x + Math.cos(k * Math.PI / 3) * s)} ${f(y + Math.sin(k * Math.PI / 3) * s)}`).join("L");
      const sp = special(i, j, x, y);
      out += sp || `${path(`M${hex}Z`, "cell")}${circle(x, y, s * .28, "nucleus")}`;
    }
    return out;
  },
  factory(x, y, s = 1) {
    return g(x, y, s, `${path("M0 0V-60L30 -85V-60L60 -85V-60L90 -85V0Z")}${rect(96, -130, 20, 130)}${rect(8, -35, 18, 18)}${rect(38, -35, 18, 18)}${rect(68, -35, 18, 18)}${circle(112, -150, 12, "soft")}${circle(128, -172, 16, "soft")}${circle(150, -196, 20, "soft")}`);
  },
  house(x, y, s = 1, cls = "") {
    return g(x, y, s, `${path("M0 0V-50L30 -78L60 -50V0Z", cls)}${rect(22, -26, 16, 26)}`);
  },
  bank(x, y, s = 1, cls = "") {
    return g(x, y, s, `${path("M-10 -80L60 -115L130 -80Z", cls)}${rect(-4, -80, 128, 10)}${[8, 36, 64, 92].map(c => rect(c, -68, 16, 62)).join("")}${rect(-10, -6, 140, 10)}`);
  },
  tower(x, y, w, h, cls = "") {
    let win = "";
    for (let yy = y - h + 16; yy < y - 14; yy += 22) for (let xx = x + 10; xx < x + w - 12; xx += 18) win += rect(xx, yy, 8, 10, "solid-thin");
    return rect(x, y - h, w, h, cls) + win;
  },
  coin(x, y, r = 22, label = "€", cls = "accent-fill") {
    return `${ellipse(x, y, r, r * .38, cls)}`;
  },
  stack(x, y, n, r = 26) {
    return Array.from({ length: n }, (_, i) => `${path(`M${x - r} ${y - i * 12}v-10a${r} ${r * .38} 0 0 0 ${2 * r} 0v10`, "accent-fill")}${ellipse(x, y - i * 12 - 10, r, r * .38, "accent-fill")}`).join("");
  },
  body(x, y, s = 1, cls = "") {
    return g(x, y, s, `${circle(0, -212, 20, cls)}${path("M-20 -186Q0 -192 20 -186L42 -116L32 -112L18 -156L20 -86L16 0L4 0L0 -76L-4 0L-16 0L-20 -86L-18 -156L-32 -112L-42 -116Z", cls)}`);
  },
  bulb(x, y, s = 1, cls = "") {
    return g(x, y, s, `${path("M-22 20C-22 0 -40 -10 -40 -40A40 40 0 1 1 40 -40C40 -10 22 0 22 20Z", cls)}${rect(-20, 20, 40, 10)}${rect(-18, 30, 36, 8)}${rect(-12, 38, 24, 8)}${path("M-12 10L-8 -40L0 -30L8 -40L12 10", "thin")}`);
  },
  ship(x, y, s = 1, flag = "danger-fill") {
    return g(x, y, s, `${path("M-120 0H120L95 40H-95Z")}${line(-40, 0, -40, -150)}${line(40, 0, 40, -130)}${path("M-40 -140L-100 -20H-40Z", "soft")}${path("M40 -120L100 -15H40Z", "soft")}${path("M-40 -150H0L-10 -138L0 -126H-40", flag)}${[-80, -40, 0, 40, 80].map(c => circle(c, 20, 6, "solid")).join("")}`);
  },
  barrel(x, y, s = 1, cls = "") {
    return g(x, y, s, `${path("M-26 -60H26V0H-26Z", cls)}${ellipse(0, -60, 26, 8)}${line(-26, -40, 26, -40)}${line(-26, -20, 26, -20)}`);
  },
  skull(x, y, s = 1) {
    return g(x, y, s, `${circle(0, -4, 10, "paper-fill")}${circle(-4, -5, 2.5, "solid")}${circle(4, -5, 2.5, "solid")}`);
  },
  derrick(x, y, s = 1) {
    return g(x, y, s, `${path("M-40 0L0 -170L40 0M-30 -40H30M-20 -85H20M-10 -125H10M-30 -40L20 -85M30 -40L-20 -85")}${line(0, 0, 0, 60, "", "stroke-width:6px")}`);
  },
  globe(x, y, r, cls = "") {
    return `${circle(x, y, r, cls)}${ellipse(x, y, r * .45, r)}${line(x - r, y, x + r, y)}${path(`M${f(x - r * .92)} ${f(y - r * .38)}Q${f(x)} ${f(y - r * .2)} ${f(x + r * .92)} ${f(y - r * .38)}`)}${path(`M${f(x - r * .92)} ${f(y + r * .38)}Q${f(x)} ${f(y + r * .2)} ${f(x + r * .92)} ${f(y + r * .38)}`)}`;
  },
  petri(x, y, r) {
    return `${circle(x, y, r)}${circle(x, y, r - 8, "guide")}`;
  },
  fish(x, y, s = 1, rot = 0, cls = "") {
    return g(x, y, s, `${ellipse(0, 0, 16, 7, cls)}${path("M-14 0L-26 -8L-26 8Z", cls)}`, rot);
  },
  heart(x, y, s = 1, cls = "") {
    return g(x, y, s, path("M0 30C-60 -10 -40 -60 0 -30C40 -60 60 -10 0 30Z", cls));
  },
  liver(x, y, s = 1, cls = "") {
    return g(x, y, s, path("M-120 -10C-110 -50 -20 -70 90 -55C130 -48 130 -25 110 -5C60 45 -30 60 -95 35C-115 25 -125 10 -120 -10Z", cls));
  },
  plant(x, y, s = 1, wilted = false, cls = "") {
    const leaf = wilted ? "M0 -40C-20 -30 -30 -10 -34 0M0 -40C20 -30 30 -10 34 0" : "M0 -40C-24 -50 -34 -70 -30 -80C-12 -76 -2 -60 0 -40M0 -40C24 -50 34 -70 30 -80C12 -76 2 -60 0 -40";
    return g(x, y, s, `${line(0, 0, 0, wilted ? -44 : -90, cls)}${path(leaf, cls)}`);
  },
  macrophage(x, y, r) {
    return path(`M${x - r} ${y}C${x - r} ${y - r * .9} ${x - r * .2} ${y - r * 1.3} ${x + r * .3} ${y - r * .8}C${x + r * 1.2} ${y - r} ${x + r * 1.3} ${y - r * .1} ${x + r * .9} ${y + r * .3}C${x + r * 1.1} ${y + r} ${x} ${y + r * 1.2} ${x - r * .4} ${y + r * .8}C${x - r * 1.2} ${y + r * .9} ${x - r * 1.3} ${y + r * .4} ${x - r} ${y}Z`, "soft") + circle(x, y, r * .3, "nucleus");
  },
  tcell(x, y, r = 18, cls = "cap-fill") {
    return `${circle(x, y, r, cls)}${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return line(x + Math.cos(a) * r, y + Math.sin(a) * r, x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8), "thin"); }).join("")}`;
  },
  document(x, y, s = 1, seal = true) {
    return g(x, y, s, `${path("M0 0H80V100H0Z")}${line(12, 22, 68, 22)}${line(12, 38, 68, 38)}${line(12, 54, 50, 54)}${seal ? circle(60, 80, 14, "danger-fill") : ""}${path("M10 84C20 70 28 92 40 78", "thin")}`);
  },
  die(x, y, s = 1) {
    return g(x, y, s, `${rect(-30, -30, 60, 60, "", 10)}${circle(-14, -14, 5, "solid")}${circle(0, 0, 5, "solid")}${circle(14, 14, 5, "solid")}`);
  },
  tag(x, y, w, h, cls = "") {
    return path(`M${x} ${y}H${x + w - h / 2}L${x + w} ${y + h / 2}L${x + w - h / 2} ${y + h}H${x}Z`, cls) + circle(x + w - h / 2, y + h / 2, 6);
  },
  chromosome(x, y, h, cap, capCls = "cap-fill") {
    return `${path(`M${x - 18} ${y - h}C${x - 4} ${y - h / 2} ${x - 4} ${y + h / 2} ${x - 18} ${y + h}`, "", "stroke-width:14px;stroke-linecap:round")}${path(`M${x + 18} ${y - h}C${x + 4} ${y - h / 2} ${x + 4} ${y + h / 2} ${x + 18} ${y + h}`, "", "stroke-width:14px;stroke-linecap:round")}${[[-18, -h], [18, -h], [-18, h], [18, h]].map(([dx, dy]) => circle(x + dx, y + dy + Math.sign(dy) * cap / 2, cap / 2 + 4, capCls)).join("")}`;
  },
  sign(x, y, label) {
    return `${line(x, y, x, y + 60)}${rect(x - 44, y - 30, 88, 34, "paper-fill", 4)}`;
  }
};

// ── Escenes ──
const S = {};

S[1] = () => {
  const d = diptych();
  let el = d.el;
  [1, 2, 4, 8].forEach((n, i) => { el += P.stack(70 + i * 90, 560, n, 24); });
  el += arrowLine(60, 620, 370, 620, "thin");
  const cells = [[1, 60], [2, 42], [4, 30], [8, 22]];
  cells.forEach(([n, r], i) => {
    const cx = 470 + i * 80;
    for (let k = 0; k < n; k += 1) { const col = k % 2, row = Math.floor(k / 2); el += P.cell(cx - (n > 1 ? r * .6 : 0) + col * r * 1.2, 540 - row * r * 1.9 + (n === 1 ? 20 : 0), r * .6, i === 3, k); }
  });
  el += arrowLine(440, 620, 770, 620, "danger");
  return [el, d.lab + T(215, 680, "D → D′ → D″ → …", "middle", "strong") + T(615, 680, "1 → 2 → 4 → 8 → …", "middle", "strong") + T(400, 745, "CAP DELS DOS NO TÉ UN PUNT D’ARRIBADA", "middle", "small")];
};

S[2] = () => {
  const marks = [[130, "1955", "GREGG", "«EL MÓN TÉ CÀNCER»"], [300, "1968", "ABBEY", "«BOGERIA CANCEROSA»"], [470, "1999", "McMURTRY", "«L’ESTADI CANCERÓS»"], [660, "2026", "AQUEST LLIBRE", "COMPROVAR-HO"]];
  let el = arrowLine(80, 420, 740, 420, "thin");
  let lab = "";
  marks.forEach(([x, y, who, what], i) => {
    el += circle(x, 420, 12, i === 3 ? "danger-fill" : "solid") + g(x - 36, 250, 1, `${path("M0 0H56L72 16V110H0Z", i === 3 ? "accent-fill" : "soft")}${line(12, 30, 58, 30)}${line(12, 48, 58, 48)}${line(12, 66, 44, 66)}`);
    lab += T(x, 470, y, "middle", "strong") + T(x, 505, who, "middle", "small");
  });
  el += path("M130 600H660", "guide") + circle(130, 600, 8, "soft") + circle(660, 600, 8, "danger-fill");
  return [el, lab + T(400, 180, "UNA COMPARACIÓ AMB HISTÒRIA", "middle", "strong") + T(400, 650, "DE L’INSULT AL DIAGNÒSTIC", "middle", "small")];
};

S[3] = () => {
  const d = diptych("UNA INSTITUCIÓ PRÒPIA", "UNA CÈL·LULA PRÒPIA");
  let el = d.el;
  [[60, 60], [130, 90], [200, 70], [270, 80]].forEach(([x, h], i) => { el += i === 2 ? P.tower(x, 600, 60, 300, "accent-fill") : P.tower(x, 600, 55, h + 40); });
  [[70, 520], [140, 490], [285, 500]].forEach(([x, y]) => { el += arrow(`M${x} ${y}Q${(x + 230) / 2} ${y - 120} 228 ${y - 60}`, "danger"); });
  el += line(40, 600, 360, 600);
  el += P.body(600, 640, 1.9) + circle(606, 440, 40, "", "stroke-dasharray:5 6") + P.cell(606, 440, 26, true, 3);
  el += path("M646 440L720 300", "guide") + circle(730, 260, 50) + path("M712 240C724 256 736 256 748 240M712 262C724 278 736 278 748 262", "danger");
  return [el, d.lab + T(200, 650, "EL MATEIX EDIFICI, REORIENTAT", "middle", "small") + T(600, 690, "NO ÉS UN VIRUS NI UN BACTERI", "middle", "small") + T(720, 340, "ADN ALTERAT", "middle", "small")];
};

S[4] = () => {
  let el = P.factory(90, 430, 1.3) + path("M250 360C340 300 420 300 470 340", "danger", "stroke-dasharray:6 8") + arrow("M470 340C500 360 520 380 540 390", "danger");
  el += rect(300, 310, 60, 26, "paper-fill", 3) + line(300, 322, 360, 322, "thin");
  el += P.body(640, 640, 1.9) + ellipse(620, 420, 18, 30, "soft") + ellipse(660, 420, 18, 30, "soft") + circle(628, 430, 7, "danger-fill");
  return [el, T(170, 490, "QUI FABRICA EL RISC", "middle", "strong") + T(400, 280, "EXPOSICIÓ", "middle", "small") + T(640, 690, "QUI EMMALALTEIX", "middle", "strong") + T(400, 760, "LA PERSONA NO ÉS LA METÀFORA", "middle", "small")];
};

S[5] = () => {
  const d = diptych("DECISIÓ", "ATZAR");
  let el = d.el + rect(60, 430, 280, 20, "", 6) + [100, 170, 240, 300].map(x => `${circle(x, 380, 18)}${path(`M${x - 22} 430C${x - 22} 400 ${x + 22} 400 ${x + 22} 430`)}`).join("");
  el += P.document(160, 470, 1) + path("M250 560L290 520", "", "stroke-width:4px") + line(286, 524, 296, 514, "solid");
  el += P.die(520, 400, 1.3) + P.die(660, 330, 1) + [[500, 560, false], [590, 590, true], [690, 540, false]].map(([x, y, t], i) => P.cell(x, y, 30, t, i)).join("");
  return [el, d.lab + T(200, 640, "ACTES · INFORMES · SIGNATURES", "middle", "small") + T(600, 660, "MUTACIONS SENSE INTENCIÓ", "middle", "small") + T(400, 745, "SI LA COMPARACIÓ ÉS INJUSTA, HO ÉS AMB EL CÀNCER", "middle", "small")];
};

S[6] = () => {
  let el = "";
  [140, 270, 400, 530, 660].forEach((x, i) => { el += P.body(x, 360, .9) + (i === 2 ? circle(x + 4, 230, 9, "danger-fill") : ""); });
  el += P.tag(70, 460, 660, 250, "accent-soft");
  [140, 270, 400, 530, 660].forEach(x => { el += P.body(x, 680, .8); });
  return [el, T(400, 110, "1 DE CADA 5 TINDRÀ CÀNCER", "middle", "strong") + T(400, 440, "TOTS 5 VIUEN DINS DEL MERCAT", "middle", "strong") + T(400, 760, "L’EXCEPCIÓ I L’ENTORN", "middle", "small")];
};

S[7] = () => {
  const el = P.tissue(150, 180, 8, 5, 42, (i, j, x, y) => {
    if (i === 4 && j === 2) return `${blob(x, y, 70, .2, 3, "danger-soft")}${[[-25, -20], [20, -15], [0, 25], [-30, 20], [28, 20]].map(([dx, dy], k) => blob(x + dx, y + dy, 14, .2, k, "danger-fill")).join("")}`;
    return "";
  });
  return [el, T(400, 120, "TEIXIT: CADA CÈL·LULA ACCEPTA LÍMITS", "middle", "strong") + T(400, 700, "LA QUE FA TRAMPA TORNA A VIURE SOLA", "middle", "strong") + T(400, 740, "I GUANYA… MENTRE EL COS AGUANTA", "middle", "small")];
};

S[8] = () => {
  const d = diptych("HIPERPLÀSIA", "NEOPLÀSIA");
  const skin = (x0, fill, tumor) => {
    let out = path(`M${x0} 500H${x0 + 300}V620H${x0}Z`, "soft") + line(x0, 500, x0 + 300, 500, "", "stroke-width:3px");
    for (let i = 0; i < 6; i += 1) out += P.cell(x0 + 30 + i * 48, 560, 18, false, i);
    if (fill) for (let i = 0; i < 3; i += 1) out += P.cell(x0 + 110 + i * 40, 470, 16, false, i);
    if (tumor) { let k = 0; for (let r = 0; r < 4; r += 1) for (let i = 0; i < 5 - r; i += 1) out += P.cell(x0 + 70 + r * 20 + i * 40, 460 - r * 38, 17, true, k++); }
    return out;
  };
  const el = d.el + skin(50, true, false) + path("M160 420L180 440L220 395", "cap", "stroke-width:6px") + skin(450, false, true) + arrow("M720 330C740 300 750 280 752 250", "danger");
  return [el, d.lab + T(200, 680, "LA FERIDA ES TANCA I S’ATURA", "middle", "small") + T(600, 680, "CONTINUA SENSE CAP FERIDA", "middle", "small") + T(400, 760, "EL MATEIX CREIXEMENT, AMB FINAL O SENSE", "middle", "small")];
};

S[9] = () => {
  const d = diptych("PIB", "TELÒMERS");
  let el = d.el + path("M80 460A120 120 0 0 1 320 460") + path("M80 460A120 120 0 0 1 128 364", "danger", "stroke-width:10px") + line(200, 460, 250, 370, "", "stroke-width:5px") + circle(200, 460, 10, "solid");
  el += P.chromosome(470, 420, 70, 26) + P.chromosome(560, 420, 70, 12) + P.chromosome(650, 420, 70, 3) + P.chromosome(730, 420, 70, 26, "danger-fill");
  return [el, d.lab + T(115, 350, "0 %", "middle", "small") + T(200, 510, "ATURAR-SE = RECESSIÓ", "middle", "strong") + T(560, 530, "~50 DIVISIONS", "middle", "small") + T(700, 560, "TELOMERASA", "middle", "strong") + T(600, 620, "LA CÈL·LULA TUMORAL NO S’ATURA", "middle", "small")];
};

S[10] = () => {
  const d = diptych();
  let el = d.el;
  [[70, "TANCAT"], [150, "TANCAT"]].forEach(([x]) => { el += P.house(x, 470, 1.1) + line(x + 8, 420, x + 60, 440, "danger"); });
  el += P.bank(230, 470, .9, "accent-fill") + circle(290, 540, 34, "", "stroke-width:10px") + [[260, 640], [330, 660]].map(([x, y]) => arrowLine(x, y, 290, 590, "danger")).join("");
  [[470, 380], [540, 430], [470, 500]].forEach(([x, y], i) => { el += [[-10, -8], [12, -4], [0, 12], [-14, 10]].map(([dx, dy], k) => circle(x + dx, y + dy, 7 - k % 2 * 2, "soft")).join(""); });
  el += P.cell(660, 450, 55, true, 4) + circle(660, 450, 75, "", "stroke-dasharray:4 8");
  return [el, d.lab + T(115, 520, "ELS PETITS TANQUEN", "middle", "small") + T(290, 710, "RESCAT PÚBLIC", "middle", "small") + T(500, 590, "APOPTOSI", "middle", "strong") + T(660, 590, "NO VOL MORIR", "middle", "strong")];
};

S[11] = () => {
  const pedal = (x, cls) => `${rect(x - 45, 330, 90, 150, cls, 14)}${[360, 390, 420, 450].map(y => line(x - 30, y, x + 30, y, "thin")).join("")}${line(x, 330, x, 230, "", "stroke-width:8px")}`;
  let el = pedal(200, "danger-soft") + pedal(600, "") + path("M140 480C150 520 250 520 260 480", "danger", "stroke-width:6px") + line(600, 230, 600, 160, "", "stroke-width:4px") + path("M600 160C640 120 670 150 690 110", "guide") + line(680, 120, 720, 90, "danger", "stroke-width:5px") + line(710, 130, 730, 80, "danger", "stroke-width:5px");
  return [el, T(200, 560, "ACCELERADOR ENCALLAT", "middle", "strong") + T(200, 595, "ONCOGÈN · INCENTIUS", "middle", "small") + T(600, 560, "FRE DESCONNECTAT", "middle", "strong") + T(600, 595, "P53 · GLASS-STEAGALL", "middle", "small") + T(400, 140, "DUES AVARIES ALHORA", "middle", "strong")];
};

S[12] = () => {
  let el = rect(120, 470, 520, 60, "", 30) + [180, 300, 420, 540].map(x => circle(x, 500, 18)).join("");
  el += P.factory(170, 460, .55) + P.house(310, 460, .9) + P.tower(410, 460, 50, 150) + `<g transform="rotate(50 700 560)">${P.house(670, 580, .9)}</g>`;
  el += arrowLine(580, 590, 200, 590, "thin") + path("M620 420C660 420 680 440 690 470", "danger");
  return [el, T(380, 650, "LA CINTA ACCELERA", "middle", "small") + T(660, 690, "QUI S’ATURA CAU", "middle", "strong") + T(400, 160, "LLEIS COERCITIVES DE LA COMPETÈNCIA", "middle", "strong")];
};

S[13] = () => {
  const dish = (x, colonies) => P.petri(x, 400, 110) + colonies.map(([dx, dy, r, t], k) => blob(x + dx, 400 + dy, r, .15, k + x, t ? "danger-fill" : "soft-strong")).join("");
  const el = dish(150, [[-40, -30, 20, 0], [30, -40, 16, 0], [-20, 40, 18, 0], [40, 30, 14, 1], [0, 0, 12, 0]]) + dish(400, [[-40, -20, 16, 0], [20, 30, 44, 1], [-30, 50, 10, 0]]) + dish(650, [[0, 0, 88, 1]]) + arrowLine(265, 400, 285, 400) + arrowLine(515, 400, 535, 400);
  return [el, T(150, 560, "DIVERSITAT", "middle", "small") + T(400, 560, "SELECCIÓ", "middle", "small") + T(650, 560, "LA MÉS VORAÇ", "middle", "strong") + T(400, 200, "NINGÚ NO HO DECIDEIX: ES SELECCIONA", "middle", "strong")];
};

S[14] = () => {
  let el = path("M60 260C260 300 460 470 740 640", "", "stroke-width:4px");
  [[140, 262, 18], [300, 320, 34], [500, 440, 58], [680, 570, 80]].forEach(([x, y, r], i) => { el += circle(x, y - r - 2, r, i === 3 ? "accent-fill" : "soft") + (i === 3 ? P.coin(x - 25, y - r - 10, 14) + P.coin(x + 20, y - r + 20, 14) + P.cell(x + 10, y - r - 40, 14, true, 2) : ""); });
  return [el, T(160, 200, "UN POC", "middle", "small") + T(600, 330, "CADA VOLTA EN RECULL MÉS", "middle", "strong") + T(400, 730, "r > g · SENYALITZACIÓ AUTOCRINA", "middle", "small")];
};

S[15] = () => {
  let el = P.globe(330, 420, 220) + path("M150 560C260 550 330 470 380 360S460 220 520 190", "danger", "stroke-width:6px");
  el += circle(690, 170, 42, "danger-soft") + path("M600 250C620 230 640 215 650 205", "", "stroke-dasharray:6 8") + g(590, 262, 1, `${path("M0 -16L10 8L0 4L-10 8Z", "solid")}`, 40);
  return [el, T(330, 700, "UN PLANETA · 7 DELS 9 LÍMITS SUPERATS", "middle", "strong") + T(520, 150, "+3 % ANUAL", "end", "small") + T(690, 240, "UN ALTRE COS?", "middle", "small")];
};

S[16] = () => {
  const d = diptych("M → D → M", "D → M → D′");
  let el = d.el + circle(90, 420, 30, "accent-fill") + path("M90 390C84 380 96 374 100 382", "thin") + arrowLine(130, 420, 170, 420, "thin") + P.coin(210, 420, 26) + arrowLine(250, 420, 290, 420, "thin") + path("M300 400H360V440H300Z", "soft") + path("M330 470L345 490L380 450", "cap", "stroke-width:5px");
  el += P.stack(470, 460, 2, 22) + arrowLine(510, 440, 550, 440, "thin") + P.factory(560, 470, .5) + arrowLine(640, 440, 670, 440, "thin") + P.stack(720, 470, 5, 26) + arrow("M720 480C720 600 470 600 470 480", "danger");
  return [el, d.lab + T(200, 540, "VENDRE PER COMPRAR", "middle", "strong") + T(200, 575, "ES TANCA QUAN HI HA PROU", "middle", "small") + T(600, 650, "DINERS PER A MÉS DINERS", "middle", "strong") + T(600, 685, "NO ES TANCA MAI", "middle", "small")];
};

S[17] = () => {
  let el = path("M40 560C200 540 400 560 760 540", "") + path("M40 560V720H760V540", "soft") + P.ship(170, 520, .7) + P.stack(330, 540, 5, 30) + rect(380, 470, 70, 70, "soft") + rect(460, 490, 50, 50, "soft");
  [560, 620, 680, 740].forEach((x, i) => { el += g(x, 480 - i * 10, .55, P.body(0, 0, 1)); });
  el += arrow("M540 400C620 360 680 330 760 300", "danger");
  return [el, T(330, 620, "50.000 £ DE MITJANS", "middle", "strong") + T(560, 250, "3.000 TREBALLADORS SE’N VAN", "middle", "strong") + T(400, 150, "SENSE ALGÚ OBLIGAT A TREBALLAR,", "middle", "small") + T(400, 180, "ELS DINERS NO SÓN CAPITAL", "middle", "small") + T(170, 680, "AUSTRÀLIA, SEGLE XIX", "middle", "small")];
};

S[18] = () => {
  let el = "";
  const pts = [];
  for (let i = 0; i < 70; i += 1) {
    const t = i / 70, x = 110 + t * 520 + Math.sin(i * 7.3) * 30, spread = (1 - t) * 150 + 20, y = 400 + Math.sin(i * 12.1) * spread;
    pts.push([x, y]);
  }
  pts.forEach(([x, y], i) => { el += P.fish(x, y, 1, Math.sin(i) * 18, i === 69 ? "danger-fill" : ""); });
  el += arrow("M110 620L700 620", "danger", "stroke-width:6px");
  return [el, T(400, 160, "CAP PEIX NO DIRIGEIX EL BANC", "middle", "strong") + T(400, 690, "DECISIONS LOCALS · UNA SOLA DIRECCIÓ", "middle", "small")];
};

S[19] = () => {
  let el = path("M340 150H460V330C460 350 340 350 340 330Z", "accent-soft") + line(400, 350, 400, 420) + path("M400 420C400 520 320 520 320 600", "", "stroke-dasharray:4 6");
  el += P.tower(200, 700, 70, 180) + P.tower(280, 700, 60, 120) + P.tower(350, 700, 80, 220) + P.tower(440, 700, 60, 140) + line(160, 700, 560, 700);
  el += line(460, 430, 520, 400, "danger", "stroke-width:4px") + line(470, 390, 530, 440, "danger", "stroke-width:4px");
  return [el, T(400, 250, "+3 %", "middle", "strong") + T(400, 130, "GOTA A GOTA: CREIXEMENT", "middle", "small") + T(600, 430, "SI ES TALLA,", "start", "small") + T(600, 460, "TOT CAU", "start", "strong") + T(400, 750, "DEUTE MUNDIAL: 235 % DEL PIB", "middle", "small")];
};

S[20] = () => {
  const d = diptych("PEATGE", "TRAMPA DE NITROGEN");
  let el = d.el + line(40, 520, 370, 520) + line(40, 640, 370, 640) + rect(150, 420, 70, 100, "accent-fill", 6) + line(220, 520, 340, 500, "danger", "stroke-width:6px");
  el += g(80, 590, .8, `${rect(-40, -24, 80, 30, "", 8)}${circle(-24, 8, 10)}${circle(24, 8, 10)}`) + P.coin(260, 450, 16) + arrow("M130 560C150 520 170 500 180 480", "thin");
  const ns = [[480, 300], [470, 560], [720, 600], [740, 300], [560, 640]];
  el += blob(620, 420, 60, .2, 2, "danger-fill") + ns.map(([x, y]) => `${circle(x, y, 20)}${arrowLine(x + (620 - x) * .16, y + (420 - y) * .16, x + (620 - x) * .72, y + (420 - y) * .72, "danger")}`).join("");
  return [el, d.lab + ns.map(([x, y]) => T(x, y + 7, "N", "middle", "strong")).join("") + T(200, 700, "COBRAR PER DEIXAR PASSAR", "middle", "small") + T(600, 700, "EL TUMOR CAPTA NITROGEN DEL MÚSCUL", "middle", "small")];
};

S[21] = () => {
  let el = path("M60 400H740V720H60Z", "soft") + line(60, 400, 740, 400, "", "stroke-width:3px") + path("M400 400V300", "cap") + path("M400 330C380 300 350 290 330 300C350 320 380 330 400 330", "cap-fill") + path("M400 320C420 290 450 285 470 292C452 316 422 322 400 320", "cap-fill");
  el += ellipse(400, 430, 26, 18, "danger-fill");
  const roots = [[150, 680], [270, 700], [400, 710], [530, 700], [650, 680]];
  roots.forEach(([x, y]) => { el += path(`M400 448C400 520 ${x} ${y - 100} ${x} ${y - 30}`); });
  return [el, T(400, 250, "LA LLAVOR", "middle", "strong") + ["CRÈDIT", "LLEIS", "TREBALL", "CURES", "NATURA"].map((w, i) => T(roots[i][0], roots[i][1], w, "middle", "small")).join("") + T(400, 770, "EL SÒL DECIDEIX SI CREIX", "middle", "small")];
};

S[22] = () => {
  const d = diptych("PET ECONÒMICA", "PET MÈDICA");
  let el = d.el + P.globe(200, 420, 150) + [[150, 340, 22], [250, 330, 16], [180, 470, 10], [120, 400, 12]].map(([x, y, r]) => `${circle(x, y, r + 16, "accent-soft")}${circle(x, y, r, "danger-fill")}`).join("");
  el += P.body(600, 690, 2.1) + circle(620, 420, 34, "accent-soft") + circle(620, 420, 16, "danger-fill") + circle(575, 520, 10, "danger-fill");
  return [el, d.lab + T(200, 620, "CENTRES FINANCERS I PARADISOS", "middle", "small") + T(600, 740, "EL TUMOR S’EMPASSA LA GLUCOSA", "middle", "small")];
};

S[23] = () => {
  const d = diptych("FERROCARRIL COLONIAL", "ANGIOGÈNESI");
  let el = d.el + path("M60 180C120 150 280 160 340 220C370 300 340 420 300 520C260 600 180 640 120 600C70 520 50 360 60 180Z", "soft");
  const rail = (d2) => path(d2, "", "stroke-width:6px") + path(d2, "rail");
  el += rail("M130 250C160 350 220 420 300 470") + rail("M110 420C170 440 240 460 300 470") + rail("M200 560C240 520 270 500 300 470") + P.ship(345, 480, .35) + [[130, 250], [110, 420], [200, 560]].map(([x, y]) => `${path(`M${x - 16} ${y}L${x} ${y - 24}L${x + 16} ${y}Z`, "solid")}`).join("");
  el += blob(620, 430, 60, .2, 3, "danger-fill");
  [[470, 260], [480, 600], [760, 250], [770, 590], [600, 180], [620, 700]].forEach(([x, y], i) => { el += path(`M${x} ${y}C${(x + 620) / 2 + (i % 2 ? 40 : -40)} ${(y + 430) / 2} ${620 + (x - 620) * .3} ${430 + (y - 430) * .3} 620 430`, "danger", "stroke-width:4px"); });
  return [el, d.lab + T(200, 680, "DE LA MINA AL PORT", "middle", "small") + T(600, 740, "VASOS CAÒTICS CAP AL TUMOR", "middle", "small")];
};

S[24] = () => {
  const d = diptych("SUBVENCIÓ", "HORMONA");
  let el = d.el + P.bank(70, 330, 1) + path("M200 330C200 420 220 460 260 480", "", "stroke-width:14px") + path("M200 330C200 420 220 460 260 480", "accent-inner") + P.derrick(300, 620, .9);
  el += g(80, 420, 1, `${rect(0, 0, 60, 40, "", 6)}${line(10, 20, 50, 20, "cap", "stroke-width:5px")}`);
  el += ellipse(520, 300, 40, 26, "soft") + [[540, 360], [560, 410], [580, 460]].map(([x, y]) => path(`M${x} ${y}c-8 12 8 12 0 0`, "accent-fill")).join("") + blob(620, 540, 60, .2, 1, "danger-fill") + g(700, 400, 1, `${path("M-30 -10H30", "", "stroke-width:6px")}${line(-20, -24, 20, 4, "cap", "stroke-width:5px")}`);
  return [el, d.lab + T(200, 700, "FÒSSILS: 7 BILIONS $ (FMI, 2022)", "middle", "small") + T(110, 500, "LÍMIT", "middle", "small") + T(600, 680, "ESTRÒGENS · ANDRÒGENS", "middle", "small") + T(700, 470, "HORMONOTERÀPIA", "middle", "small")];
};

S[25] = () => {
  const d = diptych("PORTA GIRATÒRIA", "MACRÒFAG RECLUTAT");
  let el = d.el + circle(200, 420, 120) + line(80, 420, 320, 420, "", "stroke-width:6px") + line(200, 300, 200, 540, "", "stroke-width:6px") + arrow("M290 330A120 120 0 0 1 310 380", "danger") + arrow("M110 510A120 120 0 0 1 90 460", "danger");
  el += g(140, 380, .45, P.body(0, 0, 1)) + g(260, 470, .45, P.body(0, 0, 1));
  el += blob(560, 430, 55, .2, 2, "danger-fill") + P.macrophage(680, 440, 60) + [[640, 340], [650, 540]].map(([x, y]) => arrowLine(x, y, 600 + (x - 600) * .3, 430 + (y - 430) * .5, "cap")).join("");
  return [el, d.lab + T(90, 260, "REGULADOR", "middle", "small") + T(310, 600, "EMPRESA", "middle", "small") + T(600, 620, "EL VIGILANT ALIMENTA EL TUMOR", "middle", "small")];
};

S[26] = () => {
  const d = diptych("CRISI", "FERIDA QUE NO ES CURA");
  let el = d.el + line(70, 600, 350, 600) + line(70, 600, 70, 250) + rect(110, 520, 70, 80, "soft") + rect(240, 440, 70, 160, "accent-fill") + arrow("M150 500C180 440 220 420 260 420", "danger");
  el += path("M450 460H750V600H450Z", "soft") + path("M520 460L560 430L600 470L640 425L680 460", "danger", "stroke-width:6px") + circle(600, 440, 90, "danger-soft", "opacity:.55") + blob(600, 440, 30, .2, 1, "danger-fill");
  return [el, d.lab + T(145, 640, "03/2020", "middle", "small") + T(275, 640, "11/2021", "middle", "small") + T(210, 230, "10 MÉS RICS: ×2", "middle", "strong") + T(600, 660, "INFLAMACIÓ CRÒNICA", "middle", "small")];
};

S[27] = () => {
  const d = diptych("MALBARATAMENT", "EFECTE WARBURG");
  let el = d.el + path("M110 360H290L270 600H130Z") + line(100, 360, 300, 360, "", "stroke-width:5px") + [[150, 330], [200, 310], [250, 335], [175, 290]].map(([x, y], i) => circle(x, y, 18, i % 2 ? "accent-fill" : "soft")).join("");
  el += rect(470, 600 - 36 * 7, 80, 36 * 7, "cap-fill") + rect(650, 600 - 14, 80, 14, "danger-fill") + line(440, 600, 760, 600);
  return [el, d.lab + T(200, 650, "1.050 M DE TONES D’ALIMENTS (2022)", "middle", "small") + T(510, 330, "36 ATP", "middle", "strong") + T(690, 560, "2 ATP", "middle", "strong") + T(510, 640, "CÈL·LULA SANA", "middle", "small") + T(690, 640, "TUMOR", "middle", "small") + T(600, 700, "RÀPID, MALBARATADOR I ÀCID", "middle", "small")];
};

S[28] = () => {
  const d = diptych("JORNADA", "FIBROBLAST");
  let el = d.el + rect(60, 380, 280, 60, "cap-fill") + rect(160, 380, 180, 60, "danger-fill") + [60, 95, 130, 165, 200, 235, 270, 305, 340].map(x => line(x, 450, x, 462, "thin")).join("") + g(200, 330, .5, P.body(0, 0, 1));
  el += path("M440 440C470 400 520 380 560 420C600 460 640 460 660 420", "soft", "stroke-width:24px;stroke-linecap:round") + ellipse(560, 420, 14, 8, "nucleus") + P.cell(700, 420, 45, true, 2) + [[610, 360], [630, 480], [600, 300]].map(([x, y]) => arrowLine(x, y, x + 50, y + (420 - y) * .5, "danger")).join("");
  return [el, d.lab + T(110, 480, "SALARI", "middle", "small") + T(250, 480, "PLUSVÀLUA", "middle", "strong") + T(200, 560, "8 HORES DE FEINA", "middle", "small") + T(600, 560, "LA CÈL·LULA SANA FA LA FEINA", "middle", "small") + T(600, 590, "EL TUMOR EN CREMA L’ENERGIA", "middle", "small")];
};

S[29] = () => {
  let el = path("M60 520H740V720H60Z", "soft") + path("M60 590C200 570 400 610 740 580", "guide") + path("M60 650C260 630 460 670 740 640", "guide") + path("M150 610C160 600 180 600 190 610M170 600V630", "thin") + ellipse(430, 660, 70, 22, "solid");
  el += P.derrick(430, 520, 1) + line(430, 580, 430, 640, "", "stroke-width:4px") + path("M470 500C560 490 620 430 650 300S700 150 730 120", "danger", "stroke-width:6px");
  return [el, T(430, 330, "BOMBAR EN 200 ANYS", "middle", "small") + T(430, 710, "MILIONS D’ANYS D’ENERGIA", "middle", "small") + T(700, 100, "EMISSIONS", "end", "strong") + T(210, 230, "90 EMPRESES:", "middle", "strong") + T(210, 262, "63 % DE LES EMISSIONS", "middle", "small") + T(210, 292, "HISTÒRIQUES (1751–2010)", "middle", "small")];
};

S[30] = () => {
  let el = P.tower(80, 420, 60, 220) + P.tower(150, 420, 50, 160) + line(60, 420, 250, 420) + path("M250 520C400 500 500 520 740 500", "guide") + path("M540 560L620 520L700 560L760 530V620H540Z", "soft");
  el += P.ship(390, 480, .55) + P.barrel(360, 460, .5, "danger-soft") + P.barrel(400, 460, .5, "danger-soft") + P.skull(360, 438, .8) + P.skull(400, 438, .8) + arrow("M470 470C520 470 560 490 590 510", "danger");
  return [el, T(160, 460, "CENTRE NET", "middle", "strong") + T(650, 660, "PERIFÈRIA", "middle", "strong") + T(400, 180, "«LA LÒGICA D’ABOCAR RESIDUS TÒXICS", "middle", "small") + T(400, 210, "AL PAÍS DE SALARIS MÉS BAIXOS ÉS IMPECABLE»", "middle", "small") + T(400, 245, "BANC MUNDIAL, 1991", "middle", "small")];
};

S[31] = () => {
  let el = line(40, 330, 760, 330, "cap", "stroke-width:3px") + path("M330 330L370 250L420 270L460 330Z", "accent-fill") + path("M180 330L620 330L680 520L560 700L260 700L130 520Z", "soft");
  el += g(250, 470, 1, `${path("M-30 0H30V-24C30 -40 -30 -40 -30 -24Z")}${line(-38, -24, 38, -24)}`) + g(400, 600, 1, `${path("M-40 0C-40 30 40 30 40 0Z")}${line(-40, 0, 40, 0)}${line(-30, 26, -40, 40)}${line(30, 26, 40, 40)}`) + g(540, 470, .6, P.body(0, 0, 1)) + g(580, 470, .45, P.body(0, 0, 1));
  return [el, T(400, 220, "EL QUE COMPTA EL PIB", "middle", "strong") + T(400, 750, "16.400 MILIONS D’HORES DIÀRIES DE CURES SENSE SOU", "middle", "small") + T(250, 510, "CUINAR", "middle", "small") + T(400, 680, "CRIAR", "middle", "small") + T(560, 510, "CUIDAR", "middle", "small")];
};

S[32] = () => {
  const d = diptych("INTERCANVI DESIGUAL", "CAQUÈXIA");
  let el = d.el + ellipse(200, 300, 150, 90, "soft") + ellipse(200, 560, 150, 90, "soft") + line(40, 430, 360, 430, "guide") + [120, 200, 280].map(x => arrow(`M${x} 540C${x} 470 ${x} 420 ${x} 360`, "danger", "stroke-width:5px")).join("");
  el += path("M470 260C520 240 560 250 580 290C600 340 590 420 620 470", "", "stroke-width:10px") + path("M470 260C520 240 560 250 580 290", "soft", "stroke-width:40px;stroke-linecap:round;opacity:.5") + blob(650, 520, 50, .2, 2, "danger-fill") + [[520, 300], [560, 360], [600, 420]].map(([x, y]) => arrowLine(x, y, 630, 490, "danger")).join("");
  return [el, d.lab + T(200, 300, "NORD", "middle", "strong") + T(200, 570, "SUD", "middle", "strong") + T(200, 690, "+10 BILIONS $ CADA ANY", "middle", "small") + T(600, 640, "EL MÚSCUL ALIMENTA EL TUMOR", "middle", "small")];
};

S[33] = () => {
  let el = line(260, 480, 260, 700, "", "stroke-width:8px") + line(540, 480, 540, 700, "", "stroke-width:8px") + rect(160, 230, 480, 260, "accent-fill", 6) + line(40, 700, 760, 700);
  el += g(680, 700, .9, P.body(0, 0, 1)) + arrow("M650 480C620 420 600 400 560 390", "danger");
  el += arrow("M110 380C60 330 80 250 150 240", "thin");
  return [el, T(400, 330, "ET FALTA AIXÒ", "middle", "big-strong") + T(400, 400, "(NO HO SABIES)", "middle", "strong") + T(400, 110, "LA PRODUCCIÓ FABRICA ELS DESITJOS", "middle", "strong") + T(400, 145, "QUE DESPRÉS SATISFÀ", "middle", "small") + T(400, 760, "PUBLICITAT MUNDIAL: +1 BILIÓ $ (2024)", "middle", "small")];
};

S[34] = () => {
  let el = path("M180 500C180 440 230 420 280 430C320 440 340 470 400 470C480 470 560 480 600 520C620 540 610 560 580 560H200C185 560 180 540 180 500Z", "soft") + line(190, 540, 600, 540) + [300, 330, 360].map(x => line(x, 450, x + 20, 470, "thin")).join("");
  const tags = [[140, 250, "ESTATUS"], [320, 200, "JOVENTUT"], [500, 230, "REBEL·LIA"], [640, 320, "ÈXIT"]];
  tags.forEach(([x, y]) => { el += line(x + 50, y + 34, 400, 470, "guide") + P.tag(x, y, 130, 36, "accent-fill"); });
  return [el, tags.map(([x, y, w]) => T(x + 58, y + 24, w, "middle", "small")).join("") + T(400, 640, "NO ES VEN UNA SABATILLA: ES VEN UNA IDENTITAT", "middle", "strong") + T(400, 680, "AMB DATA DE CADUCITAT", "middle", "small")];
};

S[35] = () => {
  let el = P.bulb(250, 360, 2) + circle(480, 300, 60) + line(480, 300, 480, 260, "", "stroke-width:4px") + line(480, 300, 510, 316, "", "stroke-width:4px");
  el += path("M560 560H700L680 720H580Z") + line(545, 560, 715, 560, "", "stroke-width:6px") + arrow("M300 520C380 560 480 540 560 540", "danger");
  return [el, T(480, 400, "1.000 HORES", "middle", "strong") + T(250, 600, "CÀRTEL PHOEBUS, 1924", "middle", "small") + T(630, 760, "ENCARA FUNCIONAVA", "middle", "small") + T(400, 130, "QUI FEIA BOMBETES MÉS DURADORES, PAGAVA MULTA", "middle", "small")];
};

S[36] = () => {
  let el = path("M80 560H720V600H80Z") + path("M100 560V520C100 500 240 500 240 520V560", "soft") + path("M240 560C300 520 600 520 700 560", "soft") + line(80, 600, 80, 660) + line(720, 600, 720, 660);
  el += circle(640, 180, 40, "soft") + circle(660, 170, 34, "paper-fill") + rect(420, 470, 50, 90, "accent-fill", 8) + [[445, 440], [480, 420], [410, 420]].map(([x, y]) => circle(x, y, 8, "danger-fill")).join("");
  return [el, T(400, 110, "LA NIT TAMBÉ PRODUEIX DADES", "middle", "strong") + T(400, 720, "TREBALL NOCTURN: PROBABLEMENT CARCINOGEN (IARC, GRUP 2A)", "middle", "small") + T(170, 480, "DORMIR", "middle", "small")];
};

S[37] = () => {
  let el = path("M400 700V480", "", "stroke-width:10px");
  const leaves = [[150, 220, "LIBERAL", 1], [290, 170, "COORDINAT", 0], [420, 150, "D’ESTAT", 1], [550, 180, "FINANCER", 0], [660, 250, "DE PLATAFORMES", 1]];
  leaves.forEach(([x, y], i) => { el += path(`M400 ${500 - i * 6}C400 400 ${x} ${y + 150} ${x} ${y + 30}`, "", "stroke-width:4px") + blob(x, y, 34, .2, i, i % 2 ? "danger-soft" : "accent-soft"); });
  return [el, leaves.map(([x, y, w]) => T(x, y + 6, w, "middle", "small")).join("") + T(430, 660, "PROPIETAT · SALARI · ACUMULACIÓ", "start", "small") + T(400, 740, "UN SOL TRONC, MOLTES BRANQUES (COM UN TUMOR)", "middle", "strong")];
};

S[38] = () => {
  const dish = (x, cells) => P.petri(x, 380, 100) + cells.map(([dx, dy, t], k) => P.cell(x + dx, 380 + dy, 13, t, k)).join("");
  const many = [[-50, -40, 0], [-10, -55, 0], [30, -40, 0], [55, -5, 0], [-55, 10, 0], [-20, 0, 1], [20, 20, 0], [-30, 50, 0], [15, 60, 0], [50, 45, 0]];
  const el = dish(150, many) + dish(400, [[-20, 0, 1]]) + dish(650, many.map(([x, y]) => [x, y, 1])) + arrowLine(260, 380, 290, 380, "danger") + arrowLine(510, 380, 540, 380);
  return [el, T(275, 262, "FÀRMAC", "middle", "small") + T(525, 262, "MESOS", "middle", "small") + T(150, 530, "1 RESISTENT", "middle", "small") + T(400, 530, "SOBREVIU", "middle", "small") + T(650, 530, "TOTES RESISTENTS", "middle", "strong") + T(400, 640, "BASILEA III → BANCA A L’OMBRA", "middle", "strong") + T(400, 680, "PRESSIONAR TAMBÉ ÉS SELECCIONAR", "middle", "small")];
};

S[39] = () => {
  const d = diptych("MAIG DEL 68 → MÀRQUETING", "LÍNIES DE TRACTAMENT");
  let el = d.el + line(110, 520, 110, 330) + rect(60, 250, 110, 80, "paper-fill") + arrowLine(185, 300, 225, 300) + rect(230, 230, 130, 110, "accent-fill", 6) + line(270, 340, 270, 520) + line(320, 340, 320, 520);
  el += [[470, 80], [580, 50], [690, 22]].map(([x, h]) => rect(x - 30, 560 - h * 4, 60, h * 4, "cap-fill")).join("") + line(430, 560, 740, 560);
  return [el, d.lab + T(115, 285, "AUTONOMIA!", "middle", "small") + T(295, 280, "SIGUES TU", "middle", "strong") + T(295, 310, "(COMPRA)", "middle", "small") + T(200, 600, "LA CRÍTICA CONVERTIDA EN ESLÒGAN", "middle", "small") + T(470, 600, "1a", "middle", "small") + T(580, 600, "2a", "middle", "small") + T(690, 600, "3a", "middle", "small") + T(600, 650, "CADA RECAIGUDA, MÉS DIFÍCIL", "middle", "small")];
};

S[40] = () => {
  const d = diptych("ETIQUETA VERDA", "CD47");
  let el = d.el + path("M150 560V330C150 300 170 290 180 270V230H220V270C230 290 250 300 250 330V560Z", "soft") + path("M175 420C175 380 220 370 230 390C220 420 190 430 175 420Z", "cap-fill") + line(175, 420, 215, 395, "thin") + P.factory(250, 640, .6);
  el += P.cell(560, 440, 60, true, 3) + line(610, 400, 660, 300, "", "stroke-width:3px") + rect(660, 260, 110, 50, "paper-fill", 4) + P.macrophage(520, 620, 45);
  return [el, d.lab + T(200, 480, "ECO", "middle", "strong") + T(200, 700, "42 % ENGANYOSES (UE, 2021)", "middle", "small") + T(715, 292, "NO EM MENGIS", "middle", "small") + T(600, 700, "EL MACRÒFAG NO L’ATACA", "middle", "small")];
};

S[41] = () => {
  let el = path("M60 380H740V720H60Z", "soft") + path("M60 380C150 360 250 390 400 370S650 360 740 380", "paper-fill") + [[180, 520], [320, 610], [470, 500], [620, 620]].map(([x, y], i) => `${circle(x, y, 18, i === 2 ? "danger-fill" : "solid")}${i === 2 ? path(`M${x} ${y - 18}V330M${x} 350C${x - 30} 330 ${x - 40} 310 ${x - 30} 300C${x - 10} 310 ${x} 330 ${x} 350`, "danger") : ""}`).join("");
  [["1947", 130], ["1973", 330], ["1979", 470], ["1980", 610]].forEach(([_, x]) => { el += line(x, 220, x, 250, "thin"); });
  el += line(100, 250, 700, 250, "thin");
  return [el, T(130, 210, "1947", "middle", "small") + T(330, 210, "1973", "middle", "small") + T(470, 210, "1979", "middle", "small") + T(610, 210, "1980", "middle", "small") + T(400, 150, "MONT PÈLERIN: 25 ANYS ADORMIDA", "middle", "strong") + T(400, 760, "CÈL·LULES LATENTS: FINS A 20 ANYS", "middle", "small")];
};

S[42] = () => {
  let el = line(40, 560, 760, 560);
  [70, 170].forEach(x => { el += P.house(x, 560, 1.2); });
  el += P.tower(290, 560, 200, 300, "accent-fill") + P.house(560, 560, 1.2, "guide");
  [[620, 540], [690, 550], [740, 545]].forEach(([x, y], i) => { el += g(x, y, .45, P.body(0, 0, 1)) + rect(x - 10, y - 50, 24, 20, "soft"); });
  el += arrowLine(630, 620, 760, 620, "danger");
  return [el, T(390, 230, "PISOS TURÍSTICS", "middle", "strong") + T(690, 660, "VEÏNS DESPLAÇATS", "middle", "small") + T(400, 730, "ACUMULACIÓ PER DESPOSSESSIÓ · INVASIÓ", "middle", "small")];
};

S[43] = () => {
  const d = diptych("SOLUCIÓ ESPACIAL", "HIPÒXIA");
  let el = d.el + path("M40 520C100 500 160 500 200 520V620H40Z", "soft") + P.ship(250, 520, .5) + arrow("M320 500C340 460 360 420 370 380", "danger") + path("M300 300C320 280 360 280 380 300", "guide");
  el += circle(560, 440, 110, "danger-soft") + circle(560, 440, 55, "solid") + [[690, 330], [710, 470], [650, 600]].map(([x, y], i) => `${arrowLine(560 + (x - 560) * .7, 440 + (y - 440) * .7, x, y, "danger")}${P.cell(x + 20, y, 14, true, i)}`).join("");
  return [el, d.lab + T(200, 660, "EL CAPITAL MARXA", "middle", "small") + T(560, 445, "SENSE O₂", "middle", "paper") + T(600, 680, "LES CÈL·LULES FUGEN", "middle", "small")];
};

S[44] = () => {
  const d = diptych("GLOBALITZACIÓ", "METÀSTASI");
  let el = d.el + P.globe(200, 400, 140) + [[120, 330, 260, 460], [260, 320, 150, 480], [110, 450, 280, 360]].map(([a, b, c, dd]) => arrow(`M${a} ${b}Q200 ${(b + dd) / 2 - 90} ${c} ${dd}`, "danger")).join("");
  el += [[110, 600], [180, 600], [250, 600], [320, 600]].map(([x, y], i) => `${path(`M${x - 26} ${y - 20}H${x + 26}V${y + 10}H${x}L${x - 10} ${y + 20}V${y + 10}H${x - 26}Z`, i < 2 ? "" : "guide")}`).join("");
  el += P.body(600, 690, 2.1) + circle(590, 360, 20, "danger-fill") + path("M590 380C560 440 560 520 580 580", "danger", "stroke-dasharray:6 6") + [[575, 470], [580, 580], [620, 300]].map(([x, y]) => circle(x, y, 9, "danger-fill")).join("");
  return [el, d.lab + T(200, 660, "40 % DE LES LLENGÜES, EN PERILL", "middle", "small") + T(600, 740, "PER LA SANG, CAP A ALTRES ÒRGANS", "middle", "small")];
};

S[45] = () => {
  const d = diptych("EN VENDA", "NÍNXOL PREMETASTÀTIC");
  let el = d.el + path("M40 560H360", "") + [80, 170, 260].map(x => P.plant(x, 560, 1)).join("") + [120, 220, 310].map(x => `${line(x, 560, x, 470)}${rect(x - 36, 430, 72, 40, "accent-fill", 3)}`).join("");
  el += g(200, 300, 1, `${path("M-40 40V-10H40V40", "cap")}${path("M-20 -10C-20 -40 20 -40 20 -10", "cap")}${circle(0, 16, 8, "cap-fill")}`);
  el += blob(500, 420, 40, .2, 1, "danger-fill") + ellipse(680, 440, 80, 110, "soft") + [[560, 380], [590, 450], [610, 400]].map(([x, y]) => circle(x, y, 8, "danger-soft")).join("") + arrowLine(540, 420, 640, 430, "danger") + [[670, 400], [700, 470], [650, 490]].map(([x, y]) => circle(x, y, 10, "accent-fill")).join("");
  return [el, d.lab + [120, 220, 310].map(x => T(x, 457, "€", "middle", "strong")).join("") + T(200, 250, "AIGUA A BORSA (2020)", "middle", "small") + T(200, 620, "LA PROPIETAT ARRIBA PRIMER", "middle", "small") + T(600, 620, "EL TUMOR PREPARA EL SÒL", "middle", "small")];
};

S[46] = () => {
  const d = diptych("POTOSÍ", "METÀSTASI ÒSSIA");
  let el = d.el + path("M50 560L200 250L350 560Z", "soft") + path("M180 560V480C180 460 220 460 220 480V560", "solid") + g(300, 600, .8, `${rect(-30, -24, 60, 24)}${circle(-18, 4, 8)}${circle(18, 4, 8)}`) + arrow("M330 600C360 610 380 620 395 640", "danger");
  el += path("M460 380C440 350 470 330 490 350H710C730 330 760 350 740 380C760 410 730 430 710 410H490C470 430 440 410 460 380Z", "soft") + blob(600, 380, 34, .2, 2, "danger-fill") + circle(530, 420, 14, "cap-fill") + circle(670, 420, 14, "cap-fill") + arrow("M600 440C600 500 530 500 530 440", "danger") + arrow("M600 320C600 270 670 270 670 330", "danger");
  return [el, d.lab + T(200, 640, "LA MUNTANYA ES BUIDA", "middle", "small") + T(600, 520, "L’OS ALIMENTA EL TUMOR", "middle", "small") + T(600, 560, "CERCLE VICIÓS", "middle", "strong")];
};

S[47] = () => {
  const d = diptych("COMPANYIA DE LES ÍNDIES", "METÀSTASI");
  let el = d.el + P.ship(200, 440, 1.05) + g(90, 560, .4, P.body(0, 0, 1)) + g(140, 560, .4, P.body(0, 0, 1)) + g(190, 560, .4, P.body(0, 0, 1)) + P.document(250, 490, .6);
  el += path("M440 380C520 360 680 400 760 380", "danger-soft", "stroke-width:40px;opacity:.4") + [[480, 380], [560, 370], [650, 395], [720, 385]].map(([x, y], i) => P.cell(x, y, 14, true, i)).join("") + [[520, 420], [610, 420]].map(([x, y]) => `${line(x - 8, y - 8, x + 8, y + 8)}${line(x - 8, y + 8, x + 8, y - 8)}`).join("");
  return [el, d.lab + T(200, 620, "200.000 SOLDATS · ACCIONISTES", "middle", "small") + T(200, 650, "TRACTATS · MONEDA PRÒPIA", "middle", "small") + T(600, 500, "CEGA: LA MAJORIA MOREN", "middle", "small") + T(400, 740, "UNA METÀSTASI NO TÉ JUNTA D’ACCIONISTES", "middle", "strong")];
};

S[48] = () => {
  let el = path("M120 720V330C120 300 150 280 170 300", "", "stroke-width:28px") + path("M140 360C300 330 500 330 680 360", "", "stroke-width:16px") + path("M600 350C630 320 670 330 690 360", "cap", "stroke-width:4px");
  el += g(500, 352, .6, P.body(0, 0, 1)) + path("M300 340L320 380L340 340L360 380L380 340", "danger", "stroke-width:4px") + line(300, 300, 390, 330, "", "stroke-width:6px") + line(330, 348, 335, 372, "danger", "stroke-width:3px");
  return [el, T(400, 120, "SERRAR LA BRANCA ON S’ESTÀ ASSEGUT", "middle", "strong") + T(400, 560, "EL TUMOR MOR AMB L’HOSTE", "middle", "small") + T(400, 595, "UN TERÇ DELS SÒLS DEL MÓN, DEGRADATS", "middle", "small")];
};

S[49] = () => {
  let el = P.globe(400, 400, 260) + g(250, 330, 1, `${ellipse(0, 0, 50, 16, "soft")}${line(50, 0, 110, -10, "", "stroke-width:6px")}`) + path("M470 470c-30 40 30 40 0 0Z", "danger-fill") + P.body(400, 600, .8);
  el += arrow("M300 330C380 300 460 350 470 440", "danger") + arrow("M470 500C460 540 440 560 420 570", "danger");
  return [el, T(250, 290, "PAELLA ANTIADHERENT", "middle", "small") + T(560, 480, "PFOA A LA SANG", "start", "strong") + T(400, 720, "CARCINOGEN (IARC, GRUP 1, 2023)", "middle", "small") + T(400, 110, "EL RESIDU EXPULSAT TORNA AL COS", "middle", "strong")];
};

S[50] = () => {
  const d = diptych("151 CRISIS BANCÀRIES", "NUCLI NECRÒTIC");
  let el = d.el + line(60, 520, 360, 520);
  for (let i = 0; i < 151; i += 1) { const x = 60 + (i * 97 % 300), y = 510 - (i * 37 % 170); el += circle(x, y, 3.5, i % 17 === 0 ? "danger-fill" : "solid"); }
  el += circle(600, 420, 150, "danger-soft") + circle(600, 420, 70, "solid") + [[600, 300], [700, 420], [600, 540], [500, 420]].map(([x, y]) => blob(x, y, 14, .2, x, "danger-fill")).join("");
  return [el, d.lab + T(80, 560, "1970", "middle", "small") + T(340, 560, "2017", "middle", "small") + T(200, 620, "EL LÍMIT NO AVISA: ESCLATA", "middle", "small") + T(600, 425, "MORT", "middle", "paper") + T(600, 620, "EL CENTRE MOR, LA VORA CONTINUA", "middle", "small")];
};

S[51] = () => {
  let el = rect(160, 200, 120, 460, "") + rect(160, 200, 120, 460 * .54, "danger-fill") + rect(160, 200 + 460 * .54, 120, 460 * .37, "accent-fill") + rect(160, 200 + 460 * .91, 120, 460 * .09, "cap-fill");
  el += path("M460 640V220") + path("M470 250C520 260 560 300 600 370S680 560 720 640", "danger", "stroke-width:6px") + circle(460, 660, 24, "danger-fill");
  return [el, T(310, 330, "54 % RECOMPRA D’ACCIONS", "start", "strong") + T(310, 530, "37 % DIVIDENDS", "start", "small") + T(310, 648, "9 % INVERSIÓ", "start", "small") + T(220, 170, "S&P 500 (2003–2012)", "middle", "small") + T(590, 200, "CONDICIONS FUTURES", "middle", "small") + T(400, 740, "BENEFICIS SENSE PROSPERITAT", "middle", "strong")];
};

S[52] = () => {
  const d = diptych("MONOCULTIU", "HEMATOPOESI CLONAL");
  let el = d.el + line(40, 560, 360, 560);
  [70, 120, 170, 220, 270, 320].forEach((x, i) => { el += P.plant(x, 560, .9, true, "danger") + ellipse(x, 574, 14, 9, "soft"); });
  el += [[470, 400, 0], [520, 360, 1], [580, 400, 2], [640, 360, 3], [700, 400, 4], [490, 470, 5], [560, 470, 0], [630, 470, 1], [700, 470, 2]].map(([x, y, t]) => circle(x, y, 22, t === 1 ? "danger-fill" : ["cell", "accent-soft", "soft", "cap-fill", "soft-strong"][t % 5])).join("");
  el += arrowLine(600, 520, 600, 560) + [470, 520, 570, 620, 670, 720].map((x, i) => circle(x, 610, 18, i === 3 ? "soft" : "danger-fill")).join("");
  return [el, d.lab + T(200, 620, "IRLANDA, 1845: UNA SOLA PATATA", "middle", "small") + T(200, 650, "UN MILIÓ DE MORTS", "middle", "small") + T(600, 680, "UN CLON DOMINA: LEUCÈMIA ×11", "middle", "small")];
};

S[53] = () => {
  const xs = [110, 250, 390, 530, 670];
  let el = P.factory(70, 470, .7) + g(250, 420, 1, `${rect(-40, -14, 80, 28, "", 4)}${rect(20, -14, 20, 28, "accent-fill", 4)}`) + ellipse(370, 420, 28, 44, "soft") + ellipse(410, 420, 28, 44, "soft") + circle(380, 430, 9, "danger-fill") + P.cell(530, 420, 36, true, 2) + g(670, 440, 1, `${rect(-40, -50, 80, 70, "", 4)}${path("M-10 -30H10M0 -40V-20", "danger", "stroke-width:5px")}`);
  el += xs.slice(0, 4).map(x => arrowLine(x + 55, 420, x + 85, 420, "thin")).join("") + line(180, 300, 180, 540, "limit") + circle(180, 280, 22, "cap-fill");
  return [el, T(110, 520, "PRODUCTE", "middle", "small") + T(250, 520, "EXPOSICIÓ", "middle", "small") + T(390, 520, "DANY", "middle", "small") + T(530, 520, "TUMOR", "middle", "small") + T(670, 520, "HOSPITAL", "middle", "small") + T(180, 250, "PREVENIR AQUÍ", "middle", "strong") + T(400, 640, "30–50 % DELS CÀNCERS ES PODRIEN EVITAR", "middle", "strong") + T(400, 680, "LIMITANT EL QUE ES POT VENDRE", "middle", "small")];
};

S[54] = () => {
  const d = diptych("CARBONI «COMPENSAT»", "CIGARRETA «LIGHT»");
  let el = d.el + P.factory(80, 560, .9) + rect(210, 300, 140, 110, "paper-fill", 6) + circle(280, 360, 26, "cap-fill") + line(210, 430, 350, 430, "thin");
  el += rect(440, 380, 240, 34, "", 4) + rect(680, 380, 70, 34, "accent-fill", 4) + [700, 718, 736].map(x => circle(x, 397, 4, "solid")).join("") + ellipse(560, 560, 40, 70, "soft") + ellipse(640, 560, 40, 70, "soft") + circle(575, 600, 9, "danger-fill") + circle(625, 610, 7, "danger-fill") + arrow("M450 400C420 450 460 500 540 540", "danger", "stroke-dasharray:6 6");
  return [el, d.lab + T(280, 460, "CERTIFICAT", "middle", "small") + T(200, 640, "LA XEMENEIA NO S’ATURA", "middle", "small") + T(640, 450, "FILTRE AMB FORATS", "middle", "small") + T(600, 680, "MÉS PROFUND AL PULMÓ", "middle", "small")];
};

S[55] = () => {
  let el = rect(80, 150, 640, 470, "accent-soft", 8);
  const notes = [[150, 220, "CANSAMENT"], [480, 200, "PÈRDUA DE PES"], [300, 360, "ANÈMIA"], [560, 400, "PARADÍS FISCAL"], [170, 480, "DESIGUALTAT"], [430, 520, "INFLAMACIÓ"]];
  el += path(`M${notes.map(([x, y]) => `${x + 70} ${y + 20}`).join("L")}`, "danger", "stroke-width:3px");
  notes.forEach(([x, y]) => { el += rect(x, y, 150, 44, "paper-fill", 2) + circle(x + 70, y + 20, 7, "danger-fill"); });
  return [el, notes.map(([x, y, w]) => T(x + 75, y + 32, w, "middle", "small")).join("") + T(400, 680, "DIAGNOSTICAR ÉS CONNECTAR SENYALS", "middle", "strong") + T(400, 715, "QUE, PER SEPARAT, SEMBLEN NORMALS", "middle", "small")];
};

S[56] = () => {
  const d = diptych("PIB I VIDA (EUA)", "MIDA I SUPERVIVÈNCIA");
  let el = d.el + line(60, 520, 360, 520) + line(60, 520, 60, 260) + path("M70 480L140 440L210 400L280 360L350 320", "cap", "stroke-width:5px") + path("M70 360L140 350L210 380L280 400L350 420", "danger", "stroke-width:5px");
  el += rect(440, 480, 300, 30, "", 3) + [470, 530, 590, 650, 710].map(x => line(x, 480, x, 495, "thin")).join("") + blob(540, 420, 44, .2, 2, "danger-soft") + blob(660, 430, 22, .2, 3, "danger-fill") + arrowLine(590, 420, 630, 425);
  el += path("M450 600H520L540 570L560 630L580 600H750", "danger", "stroke-width:3px");
  return [el, d.lab + T(360, 300, "PIB ↑", "end", "strong") + T(360, 450, "ESPERANÇA DE VIDA ↓", "end", "small") + T(200, 570, "2014–2017", "middle", "small") + T(600, 390, "EL TUMOR S’ENCONGEIX…", "middle", "small") + T(600, 670, "…I EL PACIENT NO VIU MÉS", "middle", "strong") + T(600, 710, "NOMÉS 14 % ALLARGUEN LA VIDA", "middle", "small")];
};

S[57] = () => {
  const el = circle(400, 410, 280, "danger-soft") + circle(400, 410, 220, "cap-fill") + circle(400, 410, 130, "danger-soft") + circle(400, 410, 90, "paper-fill");
  return [el, T(400, 110, "SOSTRE ECOLÒGIC", "middle", "strong") + T(400, 160, "EXCÉS", "middle", "small") + T(400, 240, "ESPAI SEGUR I JUST", "middle", "strong") + T(400, 305, "MANCA", "middle", "small") + T(400, 408, "SÒL SOCIAL", "middle", "strong") + T(400, 740, "EL DÒNUT DE KATE RAWORTH", "middle", "small")];
};

S[58] = () => {
  const d = diptych("STANDARD OIL", "CIRURGIA");
  let el = d.el + P.barrel(120, 330, 1.6) + arrowLine(170, 300, 210, 300, "thin");
  [[240, 250], [290, 250], [240, 310], [290, 310], [340, 280]].forEach(([x, y], i) => { el += P.barrel(x, y, .5, i < 2 ? "danger-soft" : ""); });
  el += arrow("M240 330C240 420 300 440 300 480", "danger") + arrow("M290 330C290 420 300 440 300 480", "danger") + P.barrel(300, 560, .9, "danger-fill");
  el += blob(600, 420, 60, .2, 3, "danger-fill") + circle(600, 420, 100, "", "stroke-dasharray:10 8") + g(680, 300, 1, `${path("M0 0L90 -60L100 -50L10 10Z", "paper-fill")}${rect(-40, 0, 50, 14, "solid", 3)}`, 0) + circle(740, 530, 10, "danger-fill");
  return [el, d.lab + T(120, 360, "1911", "middle", "small") + T(290, 360, "34 EMPRESES", "middle", "small") + T(230, 610, "1999: EXXONMOBIL", "middle", "strong") + T(600, 560, "MARGE LLIURE", "middle", "small") + T(700, 575, "JA ERA FORA", "middle", "small")];
};

S[59] = () => {
  let el = line(60, 380, 740, 380, "", "stroke-width:3px") + path("M60 380H740V720H60Z", "soft") + path("M400 380C396 460 404 560 398 690", "", "stroke-width:8px") + [[330, 520], [470, 560], [360, 640], [450, 660]].map(([x, y]) => path(`M400 ${y - 60}C${(x + 400) / 2} ${y - 30} ${x} ${y - 10} ${x} ${y}`, "thin")).join("");
  el += line(340, 372, 460, 372, "danger", "stroke-width:4px") + path("M400 380V300", "cap") + circle(400, 270, 30, "accent-fill") + path("M400 330C370 320 350 300 350 290M400 330C430 320 450 300 450 290", "cap");
  return [el, T(400, 200, "LA MASSA ES TALLA; L’ARREL QUEDA", "middle", "strong") + T(620, 450, "IMPOST MÀXIM (EUA)", "middle", "small") + T(620, 480, "91 % → 37 %", "middle", "strong") + T(400, 750, "CÈL·LULES MARE TUMORALS · PROPIETAT INTACTA", "middle", "small")];
};

S[60] = () => {
  const d = diptych("ABANS", "DESPRÉS");
  let el = d.el + path("M200 150V650", "cap", "stroke-width:14px") + rect(250, 420, 110, 200, "accent-fill") + path("M200 520H250", "cap", "stroke-width:10px") + [[80, 300], [80, 450], [80, 600]].map(([x, y]) => rect(x - 30, y - 30, 60, 60, "soft")).join("");
  el += path("M600 150V650", "cap", "stroke-width:10px") + [[480, 280], [720, 280], [480, 430], [720, 430], [480, 580], [720, 580]].map(([x, y]) => `${path(`M600 ${y}H${x}`, "cap", "stroke-width:5px")}${rect(x - 35, y - 35, 70, 70, "accent-soft")}`).join("");
  return [el, d.lab + T(305, 660, "UN SOL CAMP", "middle", "small") + T(600, 690, "EL REG ARRIBA A TOTHOM", "middle", "small") + T(400, 745, "CANVIAR QUI ÉS PROPIETARI I QUI DECIDEIX", "middle", "strong")];
};

S[61] = () => {
  const d = diptych("TERÀPIA DE XOC (RÚSSIA)", "RADIOTERÀPIA");
  let el = d.el + line(60, 560, 360, 560) + line(60, 560, 60, 280) + path("M70 330L150 340L220 470L290 500L350 470", "danger", "stroke-width:5px");
  el += ellipse(600, 450, 150, 110, "soft") + blob(600, 440, 30, .2, 2, "danger-fill") + circle(520, 480, 26, "cap-fill") + circle(690, 470, 22, "cap-fill") + [[600, 200], [470, 250], [740, 250]].map(([x, y]) => `${path(`M${x} ${y}L${600 + (x - 600) * .1} ${410 + (y - 200) * .1}`, "danger", "stroke-width:3px")}${rect(x - 20, y - 20, 40, 20, "solid", 3)}`).join("");
  return [el, d.lab + T(80, 600, "1990", "middle", "small") + T(340, 600, "1994", "middle", "small") + T(200, 640, "−6 ANYS DE VIDA (HOMES)", "middle", "small") + T(600, 620, "PROTEGIR ELS ÒRGANS SANS", "middle", "small")];
};

S[62] = () => {
  let el = rect(110, 260, 130, 260, "", 10) + rect(130, 290, 90, 60, "paper-fill", 4) + path("M240 330C280 330 290 360 290 400V470", "", "stroke-width:6px") + line(80, 520, 270, 520);
  el += path("M440 250L480 230H560L600 250L620 500H420Z", "accent-fill") + path("M480 230C490 270 550 270 560 230", "") + line(430, 340, 610, 340, "paper-fill", "stroke-width:14px") + line(425, 420, 615, 420, "paper-fill", "stroke-width:14px");
  return [el, T(175, 330, "+ IMPOST", "middle", "small") + T(175, 570, "CARBURANT", "middle", "small") + T(520, 560, "ARMILLES GROGUES (2018)", "middle", "strong") + T(400, 650, "UNA TRANSICIÓ QUE PAGUEN ELS DE SEMPRE", "middle", "strong") + T(400, 685, "FRACASSA I ÉS INJUSTA", "middle", "small")];
};

S[63] = () => {
  let el = blob(400, 410, 90, .25, 5, "danger-soft");
  const ic = [[400, 150, "SINDICAT"], [640, 280, "PREMSA"], [620, 570, "CIÈNCIA"], [180, 570, "SERVEI PÚBLIC"], [160, 280, "LIMFÒCIT T"]];
  el += g(400, 150, 1, `${path("M-30 -10L20 -30V30L-30 10Z")}${rect(-44, -12, 14, 24)}`) + g(640, 280, 1, `${rect(-36, -26, 72, 52)}${line(-26, -12, 26, -12)}${line(-26, 2, 26, 2)}${line(-26, 14, 10, 14)}`) + g(620, 570, 1, `${path("M-12 -34H12M-8 -34V-10L-28 26H28L8 -10V-34")}`) + g(180, 570, 1, `${rect(-34, -30, 68, 60)}${path("M-10 0H10M0 -10V10", "danger", "stroke-width:5px")}`) + P.tcell(160, 280, 26);
  ic.forEach(([x, y]) => { el += arrowLine(x + (400 - x) * .28, y + (410 - y) * .28, x + (400 - x) * .62, y + (410 - y) * .62, "thin"); });
  return [el, ic.map(([x, y, w]) => T(x, y + 64, w, "middle", "small")).join("") + T(400, 415, "C", "middle", "big-strong") + T(400, 740, "DEFENSES DISTRIBUÏDES, NO UN SOL GUARDIÀ", "middle", "strong")];
};

S[64] = () => {
  const d = diptych("LLIBERTAT", "AUTOIMMUNITAT");
  let el = d.el + path("M70 300H330V460H170L130 510V460H70Z", "paper-fill");
  el += path("M470 420C470 360 540 330 600 360C660 330 730 360 730 420C730 490 650 540 600 560C550 540 470 490 470 420Z", "soft") + [[480, 300], [720, 300], [600, 250], [460, 540], [740, 540]].map(([x, y]) => `${P.tcell(x, y, 16)}${arrowLine(x + (600 - x) * .25, y + (440 - y) * .25, x + (600 - x) * .55, y + (440 - y) * .55, "danger")}`).join("");
  return [el, d.lab + T(200, 360, "«LA LLIBERTAT ÉS", "middle", "small") + T(200, 390, "LA DE QUI PENSA", "middle", "small") + T(200, 420, "DIFERENT»", "middle", "small") + T(200, 560, "ROSA LUXEMBURG, 1918", "middle", "small") + T(600, 640, "LA DEFENSA ATACA EL PROPI COS", "middle", "small")];
};

S[65] = () => {
  let el = rect(150, 140, 180, 220, "", 6) + circle(240, 220, 44) + path("M170 360C170 290 310 290 310 360") + rect(470, 140, 180, 220, "", 6) + circle(560, 220, 44) + path("M490 360C490 290 630 290 630 360") + arrow("M340 250C380 230 420 230 460 250", "thin");
  el += path("M100 470H700M100 570H700M240 470V420M560 470V420M700 470V570M100 570V660", "", "stroke-width:12px") + arrowLine(130, 620, 670, 620, "danger");
  return [el, T(240, 400, "GOVERN A", "middle", "small") + T(560, 400, "GOVERN B", "middle", "small") + T(400, 530, "LES CANONADES DE LA PROPIETAT", "middle", "strong") + T(400, 720, "«QUE TOT CANVIÏ PERQUÈ TOT CONTINUÏ IGUAL»", "middle", "small")];
};

S[66] = () => {
  const d = diptych("GLASS-STEAGALL", "REMISSIÓ");
  let el = d.el + line(60, 460, 360, 460) + [[70, "1929"], [110, "1933"], [290, "1999"], [340, "2008"]].map(([x], i) => circle(x, 460, 10, i === 1 || i === 2 ? "cap-fill" : "danger-fill")).join("") + rect(110, 440, 180, 40, "accent-soft");
  el += circle(600, 330, 100) + circle(600, 330, 60, "soft") + path("M600 460L600 500", "") + circle(600, 580, 90) + [[570, 560], [630, 600], [600, 540]].map(([x, y]) => P.cell(x, y, 12, true, x)).join("");
  return [el, d.lab + T(70, 510, "1929", "middle", "small") + T(110, 420, "1933", "middle", "small") + T(290, 420, "1999", "middle", "small") + T(340, 510, "2008", "middle", "small") + T(200, 560, "ES VA TREURE PERQUÈ FUNCIONAVA", "middle", "small") + T(600, 335, "TAC: RES", "middle", "small") + T(600, 700, "MICROSCOPI: ENCARA HI SÓN", "middle", "small")];
};

S[67] = () => {
  let el = P.liver(200, 340, 1, "guide") + g(200, 340, 1, path("M-120 -10C-110 -50 -60 -62 -30 -62V58C-60 58 -85 50 -95 35C-115 25 -125 10 -120 -10Z", "cap-fill")) + arrowLine(350, 340, 430, 340);
  el += P.liver(600, 340, 1, "cap-fill") + path("M455 340H745", "guide") + path("M570 520L600 560L660 480", "cap", "stroke-width:6px");
  return [el, T(200, 460, "ES TREUEN 2/3", "middle", "small") + T(600, 460, "TORNA A LA MIDA ORIGINAL", "middle", "small") + T(600, 620, "I S’ATURA", "middle", "strong") + T(400, 720, "CRÉIXER AMB FINAL: L’HEPATÒSTAT", "middle", "small")];
};

S[68] = () => {
  let el = path("M260 220H540L520 680H280Z") + path("M268 400H532L520 680H280Z", "cap-fill") + line(240, 400, 560, 400, "danger", "stroke-width:4px") + [300, 340, 380, 420, 460, 500].map((y, i) => line(540 - i * 3, 220 + i * 70, 520 - i * 3, 220 + i * 70, "thin")).join("") + path("M540 250C580 250 600 300 590 360", "");
  el += path("M320 140C340 180 360 200 380 250", "cap", "stroke-dasharray:6 8");
  return [el, T(600, 405, "PROU", "start", "strong") + T(400, 110, "10.000 MILIONS DE PERSONES, VIDA DIGNA:", "middle", "small") + T(400, 740, "−60 % D’ENERGIA (VIA HIPPO: EL COS SAP DIR PROU)", "middle", "small")];
};

S[69] = () => {
  const d = diptych("1800", "2026");
  const quartet = (x0) => [0, 1, 2, 3].map(i => `${g(x0 + i * 75, 520, .55, P.body(0, 0, 1))}${line(x0 + i * 75 - 20, 440, x0 + i * 75 + 26, 400, "danger", "stroke-width:3px")}`).join("");
  const el = d.el + quartet(90) + quartet(490);
  return [el, d.lab + T(200, 580, "4 MÚSICS", "middle", "strong") + T(600, 580, "4 MÚSICS", "middle", "strong") + T(200, 630, "CURES, SALUT, EDUCACIÓ:", "middle", "small") + T(600, 630, "NO ES PODEN ACCELERAR", "middle", "small") + T(400, 760, "EL SISTEMA N’HI DIU «MALALTIA DE COSTOS»", "middle", "strong")];
};

S[70] = () => {
  const d = diptych("RECONVERSIÓ", "DIFERENCIACIÓ");
  let el = d.el + path("M60 560L140 420L220 560Z", "soft") + path("M120 560V500C120 485 160 485 160 500V560", "solid") + arrowLine(230, 470, 270, 470) + line(310, 560, 310, 340) + path("M310 340L300 260L320 260Z", "cap-fill") + path("M310 340L380 370L375 380Z", "cap-fill") + path("M310 340L245 380L240 370Z", "cap-fill") + circle(310, 340, 8, "solid");
  el += [470, 540].map((x, i) => P.cell(x, 420 + i * 60, 30, true, i)).join("") + arrowLine(580, 450, 620, 450, "danger") + [[680, 400], [700, 500]].map(([x, y]) => `${circle(x, y, 32, "cell")}${circle(x - 12, y - 6, 8, "nucleus")}${circle(x + 2, y + 6, 8, "nucleus")}${circle(x + 14, y - 8, 8, "nucleus")}`).join("");
  return [el, d.lab + T(140, 600, "MINA DE CARBÓ", "middle", "small") + T(310, 600, "EÒLICA", "middle", "small") + T(200, 660, "ACORD DE 2018", "middle", "small") + T(600, 390, "ATRA", "middle", "small") + T(600, 640, "LA CÈL·LULA MADURA", "middle", "small") + T(600, 670, "+90 % DE CURACIONS", "middle", "strong")];
};

S[71] = () => {
  let el = P.heart(400, 420, 2.2, "danger-soft") + [[180, 220, "CERVELL"], [620, 220, "PULMONS"], [170, 620, "MÚSCULS"], [630, 620, "INTESTÍ"]].map(([x, y]) => `${path(`M400 420C${(x + 400) / 2} ${(y + 420) / 2 - 40} ${x} ${y + 60} ${x} ${y + 30}`, "danger", "stroke-width:4px")}${circle(x, y, 34, "cap-fill")}`).join("");
  el += circle(400, 130, 30, "") + line(378, 108, 422, 152, "danger", "stroke-width:4px");
  return [el, [[180, 220, "CERVELL"], [620, 220, "PULMONS"], [170, 620, "MÚSCULS"], [630, 620, "INTESTÍ"]].map(([x, y, w]) => T(x, y + 70, w, "middle", "small")).join("") + T(400, 138, "€", "middle", "strong") + T(400, 740, "LA SANG VA ON CAL, NO ON ES PAGA", "middle", "strong")];
};

S[72] = () => {
  const hemi = (cx, cls) => Array.from({ length: 3 }, (_, r) => Array.from({ length: 5 + r * 2 }, (_, i) => { const a = Math.PI + (i + .5) / (5 + r * 2) * Math.PI; return circle(cx + Math.cos(a) * (70 + r * 36), 460 + Math.sin(a) * (70 + r * 36), 11, cls); }).join("")).join("");
  const el = hemi(210, "accent-fill") + hemi(590, "cap-fill") + rect(360, 470, 80, 40, "", 4) + line(210, 480, 590, 480, "guide");
  return [el, T(210, 520, "ACCIONISTES", "middle", "strong") + T(590, 520, "TREBALLADORS", "middle", "strong") + T(400, 180, "UNA EMPRESA AMB DUES CAMBRES", "middle", "strong") + T(400, 620, "LES DECISIONS NECESSITEN L’ACORD DE TOTES DUES", "middle", "small") + T(400, 650, "BICAMERALISME ECONÒMIC (FERRERAS)", "middle", "small")];
};

S[73] = () => {
  let el = g(160, 480, 1, `${ellipse(0, 0, 60, 18)}${path("M-60 0V-60H60V0")}${line(-70, -110, 70, -110)}${line(-50, -110, -50, -60)}${line(50, -110, 50, -60)}${path("M0 -110V-80", "")}${rect(-10, -80, 20, 18, "cap-fill")}`);
  el += g(400, 480, 1, `${circle(-24, -40, 34, "accent-soft")}${circle(24, -40, 34, "cap-fill", "opacity:.7")}${circle(0, -80, 34, "soft")}`) + g(640, 480, 1, `${rect(-70, -120, 140, 120)}${path("M-12 -70H12M0 -82V-58", "danger", "stroke-width:6px")}${rect(-16, -36, 32, 36)}`);
  el += line(220, 440, 350, 440, "guide") + line(460, 440, 570, 440, "guide");
  return [el, T(160, 540, "COMUNS", "middle", "strong") + T(160, 570, "EL POU DEL POBLE", "middle", "small") + T(400, 540, "COOPERATIVES", "middle", "strong") + T(400, 570, "DE QUI HI TREBALLA", "middle", "small") + T(640, 540, "SERVEIS PÚBLICS", "middle", "strong") + T(640, 570, "PER A TOTHOM", "middle", "small") + T(400, 700, "EL COS TAMBÉ COMBINA NERVIS, HORMONES I DEFENSES", "middle", "small")];
};

S[74] = () => {
  let el = "";
  const neuron = (x, y) => `${circle(x, y, 20, "cell")}${[0, 1, 2, 3, 4].map(i => { const a = i * 1.25; return path(`M${f(x + Math.cos(a) * 20)} ${f(y + Math.sin(a) * 20)}L${f(x + Math.cos(a) * 60)} ${f(y + Math.sin(a) * 60)}`, "thin"); }).join("")}`;
  const muscle = (x, y) => `${ellipse(x, y, 70, 16, "danger-soft")}${circle(x - 20, y, 5, "nucleus")}${circle(x + 20, y, 5, "nucleus")}`;
  const blood = (x, y) => `${circle(x, y, 20, "danger-fill")}${circle(x, y, 8, "paper-fill")}`;
  el += neuron(200, 260) + neuron(560, 560) + muscle(560, 260) + muscle(220, 580) + blood(380, 200) + blood(420, 620) + P.cell(400, 410, 34, false, 1) + P.tcell(650, 420, 20) + P.tcell(150, 420, 20);
  el += [[200, 260], [560, 560], [560, 260], [220, 580], [380, 200], [420, 620], [650, 420], [150, 420]].map(([x, y]) => line(x, y, 400, 410, "guide")).join("");
  return [el, T(400, 100, "NEURONES, MÚSCUL, SANG, DEFENSES:", "middle", "small") + T(400, 130, "DIFERENTS I CONNECTADES", "middle", "strong") + T(400, 740, "UN TEIXIT SA NO ÉS UNIFORME", "middle", "small")];
};

S[75] = () => {
  const days = ["DL", "DM", "DC", "DJ", "DV", "DS", "DG"];
  let el = rect(90, 330, 620, 140, "", 12) + days.map((_, i) => `${rect(100 + i * 87, 340, 80, 120, i < 4 ? "soft" : "", 8)}${i >= 4 ? ellipse(140 + i * 87, 405, 18, 9, "accent-fill") : ""}`).join("");
  el += arrow("M660 560C660 660 140 660 140 560", "danger") + arrow("M140 250C140 170 660 170 660 250", "danger");
  return [el, days.map((d, i) => T(140 + i * 87, 490, d, "middle", "small")).join("") + T(400, 160, "OBSERVAR → ACTUAR", "middle", "small") + T(400, 700, "AVALUAR → CORREGIR", "middle", "small") + T(400, 740, "CÀNCER CRÒNIC: UNA PASTILLA I CONTROLS, CADA DIA", "middle", "strong")];
};

S[76] = () => {
  const d = diptych("L’ASSEMBLEA", "L’HOMEÒSTASI");
  let el = d.el;
  Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2; const x = 200 + Math.cos(a) * 120, y = 440 + Math.sin(a) * 100; el += g(x, y + 50, .38, P.body(0, 0, 1)) + (i % 3 === 0 ? line(x + 12, y - 40, x + 16, y - 70, "", "stroke-width:4px") : ""); });
  el += ellipse(200, 450, 60, 30, "accent-soft");
  el += P.body(600, 690, 2) + [[500, 300, "37 °C"], [720, 300, "O₂"], [500, 520, "SUCRE"], [720, 520, "pH 7,4"]].map(([x, y]) => `${circle(x, y, 30, "cap-fill")}${line(x + (600 - x) * .2, y, 600 + (x - 600) * .35, y + (430 - y) * .2, "guide")}`).join("");
  return [el, d.lab + T(200, 620, "DECIDIR ELS LÍMITS", "middle", "small") + [[500, 300, "37 °C"], [720, 300, "O₂"], [500, 520, "SUCRE"], [720, 520, "pH 7,4"]].map(([x, y, w]) => T(x, y + 6, w, "middle", "small")).join("") + T(600, 740, "EL CONJUNT REGULA LES PARTS", "middle", "small") + T(400, 110, "EL COS COMÚ DECIDEIX", "middle", "strong")];
};

export const ILLUSTRATIONS = S;

export function renderIllustration(order) {
  const scene = S[order];
  if (!scene) return null;
  const [elements, labels] = scene();
  return `<g class="diagram-element illustration">${elements}</g><g class="diagram-labels">${labels}</g>`;
}
