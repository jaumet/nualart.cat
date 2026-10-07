import { gsap } from "../gsap/index.js";
import { ScrollTrigger } from "../gsap/ScrollTrigger.js";
import { faces } from "./content.js";
import { loadToc } from "./toc-loader.js";
import { DIAGRAM_SPECS } from "./diagram-specs.js";
import { renderDiagram, DEFS } from "./diagrams.js";
import { renderIllustration } from "./illustrations.js";
import { lang, t, translateDom, mountLangSwitch, takePendingOrder } from "./i18n.js";

gsap.registerPlugin(ScrollTrigger);
const store = {
  getItem(key) { try { return store.getItem(key); } catch { return null; } },
  setItem(key, value) { try { store.setItem(key, value); } catch {} }
};
const hashNode = () => decodeURIComponent(location.hash.slice(1)).split("~")[0];
const hashFace = () => decodeURIComponent(location.hash.slice(1)).split("~")[1] || null;
translateDom();
const pdfDownload = document.querySelector("[data-pdf-download]");
if (pdfDownload) {
  const filename = `cancerpitalism-${lang}.pdf`;
  pdfDownload.href = `pdf/${filename}`;
  pdfDownload.download = filename;
}
const chapter = await loadToc();
document.querySelector("#book-structure").textContent=`${chapter.nodes.length} ${t("nodes")}`;
document.querySelector("#book-chapters").textContent=`${chapter.chapters.length} ${t("capítols")}`;

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeToggle = document.querySelector("#theme-toggle");
function setTheme(theme) {
  document.documentElement.dataset.theme=theme;
  store.setItem("cancerpitalism:theme",theme);
  const dark=theme==="dark";
  themeToggle.setAttribute("aria-pressed",String(dark));
  themeToggle.innerHTML=`<span aria-hidden="true">${dark?"●":"○"}</span> ${dark?t("Fosc"):t("Clar")}`;
}
mountLangSwitch(document.querySelector(".top-actions"), () => (coverActive ? null : activeNode?.order));
themeToggle.onclick=()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");
setTheme(document.documentElement.dataset.theme);
const steps = document.querySelector("#story-steps");
const indexList = document.querySelector("#index-list");
const index = document.querySelector("#chapter-index");
document.querySelector("#category-legend").innerHTML=chapter.categories.map(category=>`<button class="legend-category" data-legend-category="${category.id}" style="--category-color:${category.color}"><i></i><span><b>${category.label}</b><strong>${category.title}</strong></span></button>`).join("")+`<p class="map-credit">${t("El mapa és un projecte d'")}<a href="https://github.com/eylommaayan" target="_blank" rel="noopener">EylonMaayan</a>: <a href="https://github.com/eylommaayan/Gsap-Public" target="_blank" rel="noopener">Gsap-Public</a>.</p>`;
const faceLayer = document.querySelector("#face-layer");
const facePanel = document.querySelector("#face-panel");
let activeNode = chapter.nodes[0];
let activeFace = null;
let previousFocus = null;
let coverActive = false;

const particles = [[400,210],[520,250],[595,365],[560,500],[450,590],[315,575],[215,485],[205,350],[285,255],[400,315],[485,350],[475,450],[385,490],[315,410],[330,325]];
const center = [400,400];
const nodeIcons = [
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="16" cy="24" r="6"/><circle cx="32" cy="17" r="5"/><circle cx="32" cy="33" r="5"/><path d="M21 22l6-3M21 27l6 3"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16"/><path d="M24 10v10M24 28v10M10 24h10M28 24h10"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 36h32M12 32l8-8 6 4 10-16"/><circle cx="36" cy="12" r="3"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="5"/><circle cx="9" cy="13" r="3"/><circle cx="39" cy="12" r="3"/><circle cx="40" cy="36" r="3"/><circle cx="10" cy="37" r="3"/><path d="M13 15l7 6M35 15l-7 6M36 34l-8-7M13 35l7-8"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="8"/><path d="M7 24h9M32 24h9"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="32" height="32" rx="16"/><path d="M15 24h18"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="24" r="9"/><circle cx="33" cy="24" r="9"/><path d="M24 10v28"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16"/><path d="M14 25l7 7 14-17"/></svg>`
];
const seeded = seed => { let value=seed*9301+49297; return () => ((value=value*233280%9973)/9973); };
function nodeDiagram(node) {
  const random=seeded(node.order), dots=Array.from({length:5},(_,i)=>({x:10+random()*28,y:10+random()*28,r:1.8+(i%3)}));
  const circles=dots.map(dot=>`<circle cx="${dot.x.toFixed(1)}" cy="${dot.y.toFixed(1)}" r="${dot.r}"/>`).join("");
  const lines=dots.slice(1).map(dot=>`<path d="M ${dots[0].x.toFixed(1)} ${dots[0].y.toFixed(1)} L ${dot.x.toFixed(1)} ${dot.y.toFixed(1)}"/>`).join("");
  const motifs={
    cooperative:`${lines}${circles}`,
    balanced:`<circle cx="24" cy="24" r="16"/><path d="M12 25c6-13 18-13 24 0M14 31h20"/><circle cx="16" cy="20" r="3"/><circle cx="32" cy="20" r="3"/>`,
    criticalSeparation:`<circle cx="15" cy="24" r="10"/><circle cx="33" cy="24" r="10"/><path d="M24 7v34M8 39L40 9"/>`,
    finiteLimits:`<circle cx="24" cy="24" r="17"/><path d="M8 24h32M24 8v32"/><circle cx="24" cy="24" r="${4+node.order%6}"/>`,
    resourceCapture:`${dots.map(dot=>`<path d="M ${dot.x.toFixed(1)} ${dot.y.toFixed(1)} L24 24"/>`).join("")}<circle cx="24" cy="24" r="${6+node.order%5}"/>`,
    compressed:`<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="12"/><circle cx="24" cy="24" r="6"/><path d="M5 24h8M35 24h8"/>`,
    unregulated:`${circles}<path d="M7 41C15 31 29 38 41 7"/><path d="M32 8h9v9"/>`,
    expanding:`<path d="M24 24L8 10M24 24L40 10M24 24L42 30M24 24L27 43M24 24L7 37"/><circle cx="24" cy="24" r="6"/>`
  };
  return `<svg viewBox="0 0 48 48" aria-hidden="true" data-diagram="${node.visualState}">${motifs[node.visualState]||motifs.cooperative}</svg>`;
}
document.querySelector("#particles").innerHTML = particles.map((p,i) => `<circle class="particle p-${i}" cx="${p[0]}" cy="${p[1]}" r="${i < 9 ? 12 : 8}" />`).join("");
document.querySelector("#connections").innerHTML = particles.map((p,i) => `<line class="connection c-${i}" x1="${p[0]}" y1="${p[1]}" x2="${center[0]}" y2="${center[1]}" />`).join("");

// Les dues lectures es mostren sempre dins del node, en dues columnes (esquerra: capitalisme; dreta: càncer).
// Els límits i les fonts queden en un desplegable per no allargar la lectura principal.
const readings = node => `${node.left || node.right ? `<div class="node-readings">${node.left ? `<section class="reading reading-capital" aria-label="${t("Lectura des del capitalisme")}"><p class="reading-label"><b>←</b> ${t("Capitalisme")}</p>${node.left.html}</section>` : ""}${node.right ? `<section class="reading reading-cancer" aria-label="${t("Lectura des del càncer")}"><p class="reading-label">${t("Càncer")} <b>→</b></p>${node.right.html}</section>` : ""}</div>` : ""}${node.south ? `<details class="node-notes"><summary>${t("Límits de la metàfora i fonts")}</summary><div>${node.south.html}</div></details>` : ""}`;
const partCard = category => `<section class="part-card" aria-label="${category.label}"><div><p class="eyebrow">${category.label}</p><h2>${category.title}</h2><dl><dt>${t("Càncer")}</dt><dd>${category.cancer}</dd><dt>${t("Capitalisme")}</dt><dd>${category.capitalism}</dd></dl>${category.idea ? `<p>${category.idea}</p>` : ""}</div></section>`;
const interludeCard = (interlude, id) => `<aside class="interlude" id="${id}" aria-label="${t("Interludi")}: ${interlude.title}"><div><p class="eyebrow">${t("Interludi")}</p><h2>${interlude.title}</h2>${interlude.html}</div></aside>`;

let previousCategory = null;
chapter.nodes.forEach((node, i) => {
  if (node.category !== previousCategory) {
    const category = chapter.categories.find(item => item.id === node.category);
    if (category && category.id !== "proleg") steps.insertAdjacentHTML("beforeend", partCard(category));
    previousCategory = node.category;
  }
  steps.insertAdjacentHTML("beforeend", `<article class="story-step" id="${node.id}" data-node="${node.id}" tabindex="-1"><div class="node-card"><p class="node-number">${t("Node")} ${String(i+1).padStart(2,"0")} ${t("de")} ${chapter.nodes.length} · ${node.chapterTitle}</p><p class="node-type">${node.title}</p><h2>${node.center.html}</h2>${node.correspondence ? `<p class="node-correspondence"><span>${t("Càncer ↔ Capitalisme")}</span>${node.correspondence}</p>` : ""}<div class="node-development"><section><p>${t("Pregunta")}</p><h3>${node.question}</h3></section><section><p>${t("Resposta breu")}</p><div>${node.answerHtml}</div></section></div>${readings(node)}</div></article>`);
  if (node.interludeAfter) steps.insertAdjacentHTML("beforeend", interludeCard(node.interludeAfter, `interlude-${node.order}`));
  if (node.map.chapterStart) indexList.insertAdjacentHTML("beforeend", `<li class="map-chapter" style="--category-color:${node.categoryColor};left:${node.map.x - 170}px;top:${node.map.y - 150}px">${node.chapterTitle}</li>`);
  indexList.insertAdjacentHTML("beforeend", `<li class="network-node ${node.map.chapterStart ? "chapter-start" : ""}" data-chapter="${node.chapter}" data-category="${node.category}" style="--category-color:${node.categoryColor};left:${node.map.x}px;top:${node.map.y}px"><a href="#${node.id}" data-index-node="${node.id}" aria-label="${t("Node")} ${i+1}: ${node.center.text}"><span class="node-pictogram">${nodeDiagram(node)}</span><span class="network-copy"><small>${String(i+1).padStart(2,"0")}</small><b>${node.title}</b></span></a></li>`);
});

function drawNetwork() {
  const network = document.querySelector("#network-index"), svg = document.querySelector("#network-lines");
  const items = [...indexList.querySelectorAll(".network-node")], box = svg.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
  const point = item => { const rect=item.getBoundingClientRect(); return {x:rect.left-box.left+rect.width/2,y:rect.top-box.top+rect.height/2}; };
  const starts = items.filter(item => item.classList.contains("chapter-start"));
  const edges = [];
  starts.slice(0,-1).forEach((start,i) => edges.push([start,starts[i+1],"trunk"]));
  starts.forEach(start => items.filter(item => item.dataset.chapter === start.dataset.chapter && item !== start).forEach(item => edges.push([start,item,"branch"])));
  const halos=starts.map(start=>{
    const members=items.filter(item=>item.dataset.chapter===start.dataset.chapter), points=members.map(point);
    const cx=points.reduce((sum,p)=>sum+p.x,0)/points.length,cy=points.reduce((sum,p)=>sum+p.y,0)/points.length;
    const rx=Math.max(...points.map(p=>Math.abs(p.x-cx)))+125,ry=Math.max(...points.map(p=>Math.abs(p.y-cy)))+105;
    const color=getComputedStyle(start).getPropertyValue("--category-color").trim();
    return `<ellipse class="cluster-halo" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" stroke="${color}"/>`;
  }).join("");
  svg.innerHTML = halos+edges.map(([from,to,type]) => { const a=point(from),b=point(to),dx=b.x-a.x,color=getComputedStyle(from).getPropertyValue("--category-color").trim(); return `<path class="${type}" style="stroke:${color}" d="M ${a.x} ${a.y} C ${a.x+dx*.42} ${a.y}, ${b.x-dx*.32} ${b.y}, ${b.x} ${b.y}"/>`; }).join("");
}

function conceptSpec(node) {
  return DIAGRAM_SPECS[node.order - 1];
}

function renderConceptVisual(node) {
  const svg=document.querySelector("#growth-system"), spec=conceptSpec(node);
  const common=`${DEFS}<title id="visual-title">${node.title}</title><desc id="visual-desc">${node.diagram}</desc>`;
  svg.innerHTML=`${common}${renderIllustration(node.order) || renderDiagram(spec)}`;
}

const stateMap = {
  cooperative: { core: 1, halo: 1, spread: 1, boundary: 1 }, unregulated: { core: 1.65, halo: 1.45, spread: .75, boundary: 1 },
  expanding: { core: 1.9, halo: 1.8, spread: .65, boundary: 1 }, resourceCapture: { core: 2.2, halo: 2.1, spread: .45, boundary: 1 },
  compressed: { core: 2.35, halo: 2.3, spread: .35, boundary: .9 }, finiteLimits: { core: 1.7, halo: 1.4, spread: .62, boundary: .72 },
  criticalSeparation: { core: .8, halo: .5, spread: 1.35, boundary: 1.12 }, balanced: { core: 1, halo: 1, spread: 1.05, boundary: 1 }
};
const labels = { cooperative:"Cooperació · reparació · vida", unregulated:"Proliferació · pèrdua de senyal", expanding:"Una variable ocupa el sistema", resourceCapture:"Fluxos cap al centre", compressed:"El conjunt sota pressió", finiteLimits:"Cos finit · planeta finit", criticalSeparation:"Metàfora ≠ fenomen", balanced:"Regular · reparar · cuidar" };

function setVisual(node, immediate = false) {
  activeNode = node;
  const duration = immediate || reduceMotion ? 0 : .9;
  renderConceptVisual(node);
  gsap.from("#growth-system .diagram-element > *",{opacity:0,scale:.94,transformOrigin:"center",stagger:.045,duration,ease:"power2.out"});
  document.querySelector("#visual-count").textContent = `${t("Node")} ${String(node.order).padStart(2,"0")} ${t("de")} ${chapter.nodes.length}`;
  document.querySelector("#visual-chapter").textContent = node.chapterTitle;
  updateChapterMark(node);
  document.querySelector("#visual-caption").textContent = `${String(node.order).padStart(2,"0")} · ${node.title}`;
  if(index.hidden&&!coverActive) history.replaceState({ node:node.id }, "", `#${node.id}`);
}

document.querySelectorAll(".story-step").forEach((step, i) => {
  ScrollTrigger.create({ trigger:step, start:"top 55%", end:"bottom 45%", onEnter:()=>setVisual(chapter.nodes[i]), onEnterBack:()=>setVisual(chapter.nodes[i]) });
  if (!reduceMotion) gsap.from(step.querySelector(".node-card"), { opacity:0, y:70, duration:.8, scrollTrigger:{ trigger:step, start:"top 82%", toggleActions:"play none none reverse" } });
});

function openFace(key, push = true) {
  const item = activeNode[key]; if (!item) return;
  activeFace = key; previousFocus = document.activeElement;
  const meta = faces[key];
  document.querySelector("#face-direction").textContent = `${meta.direction} · ${meta.label}`;
  document.querySelector("#face-relation").textContent = activeNode.correspondence || "";
  document.querySelector("#face-title").textContent = item.title;
  document.querySelector("#face-text").innerHTML = item.html;
  document.querySelector("#face-node").textContent = `${String(activeNode.order).padStart(2,"0")} · ${activeNode.title} — ${activeNode.center.text}`;
  faceLayer.hidden = false; document.body.classList.add("face-open", `face-${key}`);
  gsap.fromTo(facePanel, { x:key === "left" ? -80 : key === "right" ? 80 : 0, y:key === "north" ? -80 : key === "south" ? 80 : 0, opacity:0 }, { x:0,y:0,opacity:1,duration:reduceMotion?0:.45,ease:"power3.out" });
  facePanel.focus(); document.querySelector("#announcer").textContent = `${meta.label} ${t("oberta")}`;
  if (push) history.pushState({node:activeNode.id,face:key},"",`#${activeNode.id}~${meta.query}`);
}
function closeFace(push = true) {
  if (!activeFace) return;
  const classes = Object.keys(faces).map(k=>`face-${k}`); activeFace = null;
  document.body.classList.remove("face-open", ...classes); faceLayer.hidden = true;
  if (push) history.pushState({node:activeNode.id},"",`#${activeNode.id}`);
  previousFocus?.focus(); document.querySelector("#announcer").textContent = t("Retorn al centre");
}

steps.addEventListener("click", e => { const btn=e.target.closest("[data-face]"); if(btn){ activeNode=chapter.nodes.find(n=>n.id===btn.closest("[data-node]").dataset.node); openFace(btn.dataset.face); } });
faceLayer.addEventListener("click", e => { if(e.target.closest("[data-close-face]")) closeFace(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeFace();
});


const visitedKey = "cancerpitalism:visited-nodes";
let currentMapNode = chapter.nodes[0].id;
let visitedNodes = new Set([currentMapNode]);
try { JSON.parse(store.getItem(visitedKey) || "[]").forEach(id => visitedNodes.add(id)); } catch {}

function refreshMapState() {
  indexList.querySelectorAll(".network-node").forEach((item,i) => {
    const id=chapter.nodes[i].id;
    item.classList.toggle("visited",visitedNodes.has(id));
    item.classList.toggle("current",id===currentMapNode);
    item.querySelector("a").setAttribute("aria-current",id===currentMapNode?"step":"false");
  });
}

function centerMapNode(id, smooth=true) {
  const item=indexList.querySelector(`[data-index-node="${id}"]`)?.closest(".network-node");
  if(!item)return;
  const viewport=index.getBoundingClientRect(), rect=item.getBoundingClientRect();
  index.scrollTo({left:index.scrollLeft+(rect.left+rect.width/2-viewport.left-viewport.width/2),top:index.scrollTop+(rect.top+rect.height/2-viewport.top-viewport.height/2),behavior:smooth&&!reduceMotion?"smooth":"auto"});
}

function activateMapNode(id, center=true) {
  currentMapNode=id;
  visitedNodes.add(id);
  store.setItem(visitedKey,JSON.stringify([...visitedNodes]));
  refreshMapState();
  if(center)centerMapNode(id);
  const mapNode=chapter.nodes.find(node=>node.id===id);
  if(mapNode&&!index.hidden)updateChapterMark(mapNode);
  document.querySelector("#announcer").textContent=`${t("Node activat")}: ${chapter.nodes.find(node=>node.id===id)?.title}`;
}

function openCurrentMapNode() {
  const selectedNode=chapter.nodes.find(node=>node.id===currentMapNode);
  if(selectedNode)setBookView("story",selectedNode.id);
}

function spatialNeighbor(id,key) {
  const current=chapter.nodes.find(node=>node.id===id);
  if(!current)return null;
  const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  const [vx,vy]=directions[key];
  return chapter.nodes.filter(node=>node!==current).map(node=>{
    const dx=node.map.x-current.map.x,dy=node.map.y-current.map.y;
    const forward=dx*vx+dy*vy,side=Math.abs(dx*vy-dy*vx);
    return {node,forward,score:forward+side*1.75};
  }).filter(item=>item.forward>20).sort((a,b)=>a.score-b.score)[0]?.node||null;
}

document.addEventListener("keydown",e=>{
  if(index.hidden||e.target.closest(".category-legend,.map-zoom,.index-head,.topbar"))return;
  let target=null;
  if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))target=spatialNeighbor(currentMapNode,e.key);
  else if(e.key==="Home")target=chapter.nodes[0];
  else if(e.key==="End")target=chapter.nodes.at(-1);
  else if(e.key==="PageUp"||e.key==="PageDown"){
    const current=chapter.nodes.find(node=>node.id===currentMapNode);
    const chapterIndex=chapter.chapters.findIndex(item=>item.id===current.chapter);
    const nextIndex=Math.min(chapter.chapters.length-1,Math.max(0,chapterIndex+(e.key==="PageDown"?1:-1)));
    target=chapter.nodes.find(node=>node.chapter===chapter.chapters[nextIndex].id);
  } else if(e.key==="Enter"||e.key===" "){e.preventDefault();openCurrentMapNode();return;}
  else return;
  e.preventDefault();
  if(target){activateMapNode(target.id);indexList.querySelector(`[data-index-node="${target.id}"]`)?.focus({preventScroll:true});}
});

function toggleIndex(show = index.hidden) {
  index.hidden=!show;
  document.querySelector("#index-toggle").setAttribute("aria-expanded",String(show));
  document.querySelector("#back-to-map").hidden=show;
  if(show) requestAnimationFrame(()=>{drawNetwork();centerMapNode(currentMapNode,false);index.focus({preventScroll:true});});
}
let scrollTargetId = null;
function setBookView(view, requestedNodeId = null) {
  coverActive=false;
  const leavingMap=!index.hidden;
  const targetId=requestedNodeId || (leavingMap ? currentMapNode : activeNode?.id) || currentMapNode;
  const targetNode=chapter.nodes.find(node=>node.id===targetId) || chapter.nodes[0];
  const map=view==="map";
  const rich=view==="rich";
  const reading=!map;
  currentMapNode=targetNode.id;
  activeNode=targetNode;
  document.body.classList.toggle("linear-mode",rich);
  document.querySelectorAll(".node-notes").forEach(details=>{details.open=rich;});
  toggleIndex(map);
  document.querySelector("#index-toggle").classList.toggle("active",map);
  document.querySelector("#mode-toggle").classList.toggle("active",reading);
  document.querySelector("#index-toggle").setAttribute("aria-pressed",String(map));
  document.querySelector("#mode-toggle").setAttribute("aria-pressed",String(reading));
  document.querySelector("#story-mode").setAttribute("aria-checked",String(view==="story"));
  document.querySelector("#rich-mode").setAttribute("aria-checked",String(rich));
  document.querySelector("#mode-toggle").setAttribute("aria-expanded","false");
  if(map){
    refreshMapState();
    requestAnimationFrame(()=>centerMapNode(targetNode.id,false));
  } else {
    setVisual(targetNode,true);
    requestAnimationFrame(()=>{
      ScrollTrigger.refresh();
      (scrollTargetId && document.getElementById(scrollTargetId) || document.getElementById(targetNode.id))?.scrollIntoView({block:rich||scrollTargetId?"start":"center",behavior:"auto"});
      scrollTargetId=null;
    });
  }
}
// ── Índex desplegable de la barra superior ──
// S'obre amb el ratolí (o tocant-lo al mòbil) i salta al node triat sense canviar de mode:
// al mapa selecciona i centra el node; a Narració i a Text hi desplaça la lectura.
const tocMenu = document.querySelector("#toc-menu");
const tocButton = document.querySelector("#current-chapter");
const tocPanel = document.querySelector("#toc-panel");
const pad = n => String(n).padStart(2, "0");
function updateChapterMark(node) {
  tocButton.querySelector(".toc-num").textContent = pad(node.order);
  tocButton.querySelector(".toc-label").textContent = node.chapterTitle;
}
tocPanel.innerHTML = `<p class="toc-head"><b>${t("Índex")}</b><span>${t("Salta a qualsevol node. Et quedes en el mode de lectura on ets.")}</span></p>` + chapter.categories.map(category => {
  const groups = chapter.chapters.filter(item => item.category === category.id);
  if (!groups.length) return "";
  const heading = category.id === "proleg" ? "" : `<h3><b>${category.label}</b> ${category.title}</h3>`;
  return `<section class="toc-part" style="--category-color:${category.color}">${heading}${groups.map(group => {
    const members = chapter.nodes.filter(node => node.chapter === group.id);
    const items = members.map(node => `<li><button type="button" data-toc-node="${node.id}"><small>${pad(node.order)}</small><span>${node.title}</span></button></li>${node.interludeAfter ? `<li class="toc-interlude"><button type="button" data-toc-node="${node.id}" data-toc-target="interlude-${node.order}"><small>·</small><span>${t("Interludi")}: ${node.interludeAfter.title}</span></button></li>` : ""}`).join("");
    return `<div class="toc-chapter"><button type="button" class="toc-chapter-title" data-toc-node="${members[0]?.id}">${group.title}</button><ol>${items}</ol></div>`;
  }).join("")}</section>`;
}).join("");
const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
let tocTimer = null;
function markTocCurrent() {
  const current = !index.hidden ? currentMapNode : (coverActive ? null : activeNode?.id);
  tocPanel.querySelectorAll("[data-toc-node]:not(.toc-chapter-title)").forEach(button => {
    const on = !button.dataset.tocTarget && button.dataset.tocNode === current;
    button.toggleAttribute("aria-current", on);
  });
  tocPanel.querySelector("[aria-current]")?.scrollIntoView({ block: "center" });
}
function openToc() {
  clearTimeout(tocTimer);
  if (!tocPanel.hidden) return;
  tocPanel.hidden = false;
  tocButton.setAttribute("aria-expanded", "true");
  markTocCurrent();
}
function closeToc(returnFocus = false) {
  clearTimeout(tocTimer);
  if (tocPanel.hidden) return;
  tocPanel.hidden = true;
  tocButton.setAttribute("aria-expanded", "false");
  if (returnFocus) tocButton.focus();
}
if (canHover) {
  tocMenu.addEventListener("mouseenter", openToc);
  tocMenu.addEventListener("mouseleave", () => { tocTimer = setTimeout(() => closeToc(), 280); });
}
tocButton.addEventListener("click", () => {
  if (tocPanel.hidden) { openToc(); if (!canHover) tocPanel.querySelector("[aria-current],[data-toc-node]")?.focus({ preventScroll: true }); }
  else if (!canHover) closeToc();
});
document.addEventListener("click", e => { if (!e.target.closest("#toc-menu")) closeToc(); });
tocMenu.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); closeToc(true); } });
tocMenu.addEventListener("focusout", e => { if (!tocMenu.contains(e.relatedTarget)) tocTimer = setTimeout(() => closeToc(), 150); });
function goToNode(id, targetId = null) {
  const node = chapter.nodes.find(item => item.id === id);
  if (!node) return;
  if (!index.hidden) { activateMapNode(id); return; }
  scrollTargetId = targetId;
  setBookView(document.body.classList.contains("linear-mode") ? "rich" : "story", id);
}
tocPanel.addEventListener("click", e => {
  const button = e.target.closest("[data-toc-node]");
  if (!button) return;
  closeToc();
  goToNode(button.dataset.tocNode, button.dataset.tocTarget || null);
});

document.querySelector("#index-toggle").onclick=()=>setBookView("map");
document.querySelector("#mode-toggle").onclick=()=>setBookView("story");
document.querySelector("#story-mode").onclick=()=>setBookView("story");
document.querySelector("#rich-mode").onclick=()=>setBookView("rich");
document.querySelector("#index-close").onclick=()=>setBookView("story");
document.querySelector("#back-to-map").onclick=()=>setBookView("map");
document.querySelector(".cover-reading-options").addEventListener("click",e=>{
  const button=e.target.closest("[data-cover-view]");
  if(button)setBookView(button.dataset.coverView);
});
document.querySelector(".brand").addEventListener("click",e=>{
  e.preventDefault();
  coverActive=true;
  document.body.classList.remove("linear-mode");
  toggleIndex(false);
  document.querySelector("#index-toggle").classList.remove("active");
  document.querySelector("#mode-toggle").classList.add("active");
  document.querySelector("#index-toggle").setAttribute("aria-pressed","false");
  document.querySelector("#mode-toggle").setAttribute("aria-pressed","true");
  history.pushState({cover:true},"","#inici");
  document.querySelector("#introduccio").scrollIntoView({behavior:reduceMotion?"auto":"smooth"});
});
document.querySelector("#category-legend").addEventListener("click",e=>{
  const button=e.target.closest("[data-legend-category]");if(!button)return;
  const node=chapter.nodes.find(item=>item.category===button.dataset.legendCategory);
  if(node)activateMapNode(node.id);
});
index.addEventListener("click",e=>{
  const link=e.target.closest("[data-index-node]");
  if(!link)return;
  if(suppressMapClick){e.preventDefault();return;}
  e.preventDefault();
  const id=link.dataset.indexNode;
  if(id===currentMapNode&&visitedNodes.has(id)){
    openCurrentMapNode();
    return;
  }
  activateMapNode(id);
});
let mapScale = 1;
const mapPointers = new Map();
let mapDrag = null;
let mapPinch = null;
let suppressMapClick = false;
const MAP_CONTENT_WIDTH = 5000;
const clamp = (value,min,max) => Math.min(max,Math.max(min,value));
const pointerDistance = () => { const [a,b]=[...mapPointers.values()]; return Math.hypot(b.x-a.x,b.y-a.y); };
const pointerCenter = () => { const [a,b]=[...mapPointers.values()]; return {x:(a.x+b.x)/2,y:(a.y+b.y)/2}; };

function setMapZoom(nextScale, origin={x:index.clientWidth/2,y:index.clientHeight/2}) {
  const scale = clamp(nextScale,.07,2.25);
  if (Math.abs(scale-mapScale)<.001) return;
  const oldGutter=innerWidth*.75/mapScale;
  const mapX=(index.scrollLeft+origin.x)/mapScale-oldGutter;
  const contentY=(index.scrollTop+origin.y)/mapScale;
  mapScale=scale;
  const network=document.querySelector("#network-index");
  network.style.zoom=mapScale;
  network.style.setProperty("--map-label-compensation",Math.max(1,10/(17*mapScale)).toFixed(3));
  syncMapSurface();
  const newGutter=innerWidth*.75/mapScale;
  index.scrollLeft=(mapX+newGutter)*mapScale-origin.x;
  index.scrollTop=contentY*mapScale-origin.y;
  document.querySelector("#zoom-level").value=`${Math.round(mapScale*100)}%`;
}

function syncMapSurface() {
  const network=document.querySelector("#network-index");
  const gutter=innerWidth*.75/mapScale;
  network.style.setProperty("--map-gutter",`${gutter}px`);
  network.style.width=`${MAP_CONTENT_WIDTH+gutter*2}px`;
  network.style.minWidth=`${MAP_CONTENT_WIDTH+gutter*2}px`;
}

function fitMap() {
  const network=document.querySelector("#network-index");
  const scale=Math.min(index.clientWidth/network.offsetWidth,index.clientHeight/network.offsetHeight)*.92;
  setMapZoom(scale,{x:0,y:0});
  index.scrollLeft=0;
  index.scrollTop=0;
}

index.addEventListener("wheel", e => {
  if (e.target.closest("button,#category-legend")) return;
  e.preventDefault();
  setMapZoom(mapScale*Math.exp(-e.deltaY*.0015));
},{passive:false});
index.addEventListener("pointerdown", e => {
  if(e.pointerType==="mouse")return;
  if (e.target.closest("button,#category-legend")) return;
  mapPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  index.setPointerCapture(e.pointerId);
  if(mapPointers.size===1){mapDrag={x:e.clientX,y:e.clientY,left:index.scrollLeft,top:index.scrollTop,moved:false};index.classList.add("panning");}
  if(mapPointers.size===2){mapDrag=null;mapPinch={distance:pointerDistance(),scale:mapScale,center:pointerCenter()};}
});
index.addEventListener("pointermove", e => {
  if(!mapPointers.has(e.pointerId))return;
  mapPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(mapPointers.size===2&&mapPinch){setMapZoom(mapPinch.scale*pointerDistance()/mapPinch.distance);return;}
  if(mapDrag){
    if(Math.hypot(e.clientX-mapDrag.x,e.clientY-mapDrag.y)>7)mapDrag.moved=true;
    index.scrollLeft=mapDrag.left-(e.clientX-mapDrag.x);index.scrollTop=mapDrag.top-(e.clientY-mapDrag.y);
  }
});
const endMapPointer = e => {
  if(mapDrag?.moved){suppressMapClick=true;setTimeout(()=>suppressMapClick=false,0);}
  mapPointers.delete(e.pointerId);
  if(mapPointers.size<2)mapPinch=null;
  if(mapPointers.size===1){const [point]=mapPointers.values();mapDrag={x:point.x,y:point.y,left:index.scrollLeft,top:index.scrollTop,moved:false};}
  else if(!mapPointers.size){mapDrag=null;index.classList.remove("panning");}
};
index.addEventListener("pointerup",endMapPointer);
index.addEventListener("pointercancel",endMapPointer);
let mouseDrag = null;
index.addEventListener("mousedown",e=>{
  if(e.button!==0||e.target.closest("button,#category-legend"))return;
  e.preventDefault();
  mouseDrag={x:e.clientX,y:e.clientY,left:index.scrollLeft,top:index.scrollTop,moved:false};
  index.classList.add("panning");
});
addEventListener("mousemove",e=>{
  if(!mouseDrag)return;
  if(Math.hypot(e.clientX-mouseDrag.x,e.clientY-mouseDrag.y)>7)mouseDrag.moved=true;
  index.scrollLeft=mouseDrag.left-(e.clientX-mouseDrag.x);
  index.scrollTop=mouseDrag.top-(e.clientY-mouseDrag.y);
});
addEventListener("mouseup",()=>{
  if(!mouseDrag)return;
  if(mouseDrag.moved){suppressMapClick=true;setTimeout(()=>suppressMapClick=false,0);}
  mouseDrag=null;
  index.classList.remove("panning");
});
document.querySelector("#zoom-in").onclick=()=>setMapZoom(mapScale*1.2);
document.querySelector("#zoom-out").onclick=()=>setMapZoom(mapScale/1.2);
document.querySelector("#zoom-reset").onclick=fitMap;
document.querySelector("#restart").onclick=()=>scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"});
addEventListener("scroll",()=>{ const max=document.documentElement.scrollHeight-innerHeight; document.querySelector("#progress-bar").style.transform=`scaleX(${Math.min(1,scrollY/max)})`; },{passive:true});
addEventListener("resize",()=>{ syncMapSurface(); if(!index.hidden) drawNetwork(); },{passive:true});
addEventListener("popstate",()=>{
  const params=new URLSearchParams(location.search);
  const found=chapter.nodes.find(n=>hashNode()===n.id);
  if(found){coverActive=false;activeNode=found;document.querySelector(`#${found.id}`)?.scrollIntoView();}
  else if((!location.hash||location.hash==="#inici")){
    coverActive=true;
    document.body.classList.remove("linear-mode");
    toggleIndex(false);
    document.querySelector("#introduccio").scrollIntoView({behavior:"auto"});
  }
  const q=hashFace();
  const key=Object.keys(faces).find(k=>faces[k].query===q);
  key?openFace(key,false):closeFace(false);
});

const initialQuery=hashFace();
const pendingOrder=takePendingOrder();
const initialNode=(pendingOrder&&chapter.nodes[pendingOrder-1])||chapter.nodes.find(n=>hashNode()===n.id);
if(initialNode){ setVisual(initialNode,true); setBookView("story",initialNode.id); }
const initialFace=Object.keys(faces).find(k=>faces[k].query===initialQuery); if(initialFace) setTimeout(()=>openFace(initialFace,false),100);
syncMapSurface();
if(!initialNode){
  coverActive=true;
  document.body.classList.remove("linear-mode");
  toggleIndex(false);
  document.querySelector("#index-toggle").classList.remove("active");
  document.querySelector("#mode-toggle").classList.add("active");
  document.querySelector("#index-toggle").setAttribute("aria-pressed","false");
  document.querySelector("#mode-toggle").setAttribute("aria-pressed","true");
  history.replaceState({cover:true},"","#inici");
  requestAnimationFrame(()=>document.querySelector("#introduccio").scrollIntoView({behavior:"auto"}));
}
else { currentMapNode=initialNode.id; activateMapNode(initialNode.id,false); }
