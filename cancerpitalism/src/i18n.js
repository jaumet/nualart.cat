// Llengües del llibre: català (original) i anglès.
// Detecció: si el lector ha triat una llengua amb el selector, es respecta. Si no, es mira la primera
// llengua del navegador: català, castellà, portuguès, francès o italià → català; qualsevol altra → anglès.
export const LANGS = ["ca", "en"];
const CATALAN_READERS = ["ca", "es", "pt", "fr", "it"];
const KEY = "cancerpitalism:lang";
const PENDING = "cancerpitalism:goto-order";

const store = {
  get(k, session = false) { try { return (session ? sessionStorage : localStorage).getItem(k); } catch { return null; } },
  set(k, v, session = false) { try { (session ? sessionStorage : localStorage).setItem(k, v); } catch {} },
  remove(k, session = false) { try { (session ? sessionStorage : localStorage).removeItem(k); } catch {} }
};

export function detectLang() {
  if (globalThis.CANCERPITALISM_LANG && LANGS.includes(globalThis.CANCERPITALISM_LANG)) return globalThis.CANCERPITALISM_LANG;
  const chosen = store.get(KEY);
  if (LANGS.includes(chosen)) return chosen;
  const nav = globalThis.navigator;
  const first = String((nav?.languages && nav.languages[0]) || nav?.language || "en").toLowerCase().slice(0, 2);
  return CATALAN_READERS.includes(first) ? "ca" : "en";
}

export const lang = detectLang();

// Canvia de llengua recordant el node on era el lector, i recarrega.
export function switchLang(next, currentOrder = null) {
  if (!LANGS.includes(next) || next === lang) return;
  store.set(KEY, next);
  if (currentOrder) store.set(PENDING, String(currentOrder), true);
  const isLocalBook = typeof location !== "undefined" && location.pathname.startsWith("/llibre/");
  if (isLocalBook) location.href = "/";
  else { if (location.hash) history.replaceState(null, "", location.pathname + location.search); location.reload(); }
}

export function takePendingOrder() {
  const value = Number(store.get(PENDING, true));
  store.remove(PENDING, true);
  return Number.isFinite(value) && value > 0 ? value : null;
}

// ── Textos de la interfície (clau: text català) ──
const UI_EN = {
  "Saltar al relat": "Skip to the story",
  "Cancerpitalism, inici": "Cancerpitalism, home",
  "Pròleg": "Prologue",
  "Canviar entre tema fosc i clar": "Switch between dark and light theme",
  "Fosc": "Dark",
  "Clar": "Light",
  "Vista del llibre": "Book view",
  "Mapa": "Map",
  "Lectura": "Reading",
  "Mode de lectura": "Reading mode",
  "Formats": "Formats",
  "Formats de lectura": "Reading formats",
  "Scrollytelling": "Scrollytelling",
  "Rich Text": "Rich Text",
  "Mapa del capítol": "Book map",
  "Capítol 01": "Chapter 01",
  "Tancar índex": "Close index",
  "Un mapa per navegar entre allò que creix, allò que limita i el conjunt que ho sosté.": "A map for moving between what grows, what limits it and the whole that sustains it.",
  "Categories del llibre": "Parts of the book",
  "Xarxa de nodes del capítol": "Network of nodes",
  "Arrossega per explorar · fletxes per navegar · Enter per obrir": "Drag to explore · arrows to move · Enter to open",
  "Controls de zoom": "Zoom controls",
  "Allunyar el mapa": "Zoom out",
  "Apropar el mapa": "Zoom in",
  "Encaixar tot el mapa a la pantalla": "Fit the whole map to the screen",
  "Tornar al mapa": "Back to the map",
  "Llibre digital · 76 nodes · càncer i capitalisme": "Digital book · 76 nodes · cancer and capitalism",
  "El càncer creix sense cap finalitat que no sigui continuar creixent. El capitalisme, també. El càncer ja ha demostrat com acaba. Aquest llibre compara els dos mecanismes, pas a pas, amb la biologia i l’economia a la mà.": "Cancer grows with no purpose other than to keep growing. So does capitalism. Cancer has already shown how it ends. This book compares the two mechanisms, step by step, with biology and economics in hand.",
  "Com llegir aquest llibre": "How to read this book",
  "Cancerpitalism és un llibre construït en nodes.": "Cancerpitalism is a book built out of nodes.",
  "76 nodes": "76 nodes",
  "distribuïts en": "arranged in",
  "16 capítols": "16 chapters",
  "Una idea a cada node": "One idea per node",
  "Una frase que val alhora per al càncer i per al capitalisme, una pregunta i una resposta breu.": "A sentence that holds for both cancer and capitalism, a question and a short answer.",
  "Diverses maneres de llegir": "Several ways to read",
  "Tria una d’aquestes sis formes d’entrar al llibre.": "Choose one of these six ways into the book.",
  "Escolta": "Listen",
  "Llegeix i escolta cada node, amb el text ressaltat frase a frase.": "Read and listen to each node, with the text highlighted sentence by sentence.",
  "Àudio": "Audio",
  "MP3 · M4B": "MP3 · M4B",
  "Storytelling": "Storytelling",
  "Scroll": "Scroll",
  "Text ric": "Rich text",
  "Web · Markdown": "Web · Markdown",
  "Lector d’àudio": "Audio reader",
  "Llegeix i escolta aquí, al teu ritme.": "Read and listen here, at your own pace.",
  "Escolta el llibre node a node. El text se sincronitza i es ressalta frase a frase.": "Listen to the book node by node. The text stays in sync and is highlighted sentence by sentence.",
  "Velocitat": "Speed",
  "Descarrega l’audiollibre": "Download the audiobook",
  "← Node anterior": "← Previous node",
  "Node següent →": "Next node →",
  "Carregant l’audiollibre…": "Loading the audiobook…",
  "Transcripció sincronitzada": "Synchronised transcript",
  "Veu sintètica · Piper": "Synthetic voice · Piper",
  "Aquest node encara no té àudio.": "This node does not have audio yet.",
  "No s’ha pogut carregar l’audiollibre.": "The audiobook could not be loaded.",
  "El teu navegador no admet àudio HTML5.": "Your browser does not support HTML5 audio.",
  "Explora els nodes, capítols i connexions del llibre.": "Explore the book's nodes, chapters and connections.",
  "Narració": "Story",
  "Avança amb l’scroll mentre text, imatge i moviment construeixen el relat.": "Scroll forward while text, image and motion build the story.",
  "Text": "Text",
  "Llegeix tot el contingut de manera seguida i lineal.": "Read all the content continuously, from start to finish.",
  "Descarrega el llibre en PDF": "Download the book as a PDF",
  "Descarrega el llibre en EPUB": "Download the book as an EPUB",
  "Cada node amb el seu diagrama i l’àudio sincronitzat frase a frase.": "Each node with its diagram and the audio synchronised sentence by sentence.",
  "EPUB3 · àudio": "EPUB3 · audio",
  "Descarrega l’edició completa per llegir-la sense connexió o imprimir-la.": "Download the complete edition to read offline or print.",
  "Geografia del relat": "Layout of a node",
  "← capitalisme": "← capitalism",
  "càncer →": "cancer →",
  "↓ límits i fonts": "↓ limits and sources",
  "Com funciona un node": "How a node works",
  "Una idea, dues lectures.": "One idea, two readings.",
  "Cada node conté una idea que val per al càncer i per al capitalisme. Per això, al text hi veuràs simplement una": "Each node holds an idea that is true of both cancer and capitalism. That is why the text simply says",
  "«C»": "“C”",
  ". Sota la idea hi ha dues columnes: a l’esquerra, el mecanisme econòmic; a la dreta, el mecanisme biològic. A sota, els límits de la comparació i les fonts de cada afirmació.": ". Below the idea there are two columns: on the left, the economic mechanism; on the right, the biological mechanism. Underneath, the limits of the comparison and the source of every claim.",
  "Desplaça’t per començar": "Scroll to begin",
  "Relat interactiu": "Interactive story",
  "Node 01 de 76": "Node 01 of 76",
  "Cooperació · regulació · límit": "Cooperation · regulation · limit",
  "Epíleg · Fi del recorregut": "Epilogue · End of the journey",
  "El càncer ja ha respost.": "Cancer has already answered.",
  "El capitalisme, encara no.": "Capitalism has not, yet.",
  "Tornar al principi ↑": "Back to the start ↑",
  "Tornar al centre": "Back to the centre",
  "Llengua": "Language",
  "El mapa és un projecte d'": "The map is a project by ",
  "Idea i coedició: Nu a l'art i IA.": "Idea and co-editing: Nu a l'art and IA.",
  "Créixer per créixer": "Growth for growth’s sake",
  "Índex del llibre": "Table of contents",
  "Índex": "Contents",
  "Salta a qualsevol node. Et quedes en el mode de lectura on ets.": "Jump to any node. You stay in the reading mode you are in.",
  "Cancerpitalism · Créixer per créixer": "Cancerpitalism · Growth for growth’s sake",
  "Cancerpitalism · Catàleg de diagrames": "Cancerpitalism · Diagram catalogue",
  "← Esquerra": "← Left",
  "Dreta →": "Right →",
  "↓ Sud": "↓ Below",
  // Textos generats per l’aplicació
  "Node": "Node",
  "de": "of",
  "nodes": "nodes",
  "capítols": "chapters",
  "Pregunta": "Question",
  "Resposta breu": "Short answer",
  "Càncer ↔ Capitalisme": "Cancer ↔ Capitalism",
  "Càncer": "Cancer",
  "Capitalisme": "Capitalism",
  "Lectura des del capitalisme": "Reading through capitalism",
  "Lectura des del càncer": "Reading through cancer",
  "Límits de la metàfora i fonts": "Limits of the metaphor and sources",
  "Límits de la metàfora": "Limits of the metaphor",
  "Fonts": "Sources",
  "Límits i fonts": "Limits and sources",
  "Interludi": "Interlude",
  "Node activat": "Node selected",
  "Retorn al centre": "Back to the centre",
  "oberta": "open",
  "La pregunta": "The question",
  "Cooperar o créixer fins a matar": "Cooperate, or grow until it kills",
  "La xarxa que alimenta el tumor": "The network that feeds the tumour",
  "Les metàstasis del capital": "The metastases of capital",
  "Diagnòstic, tractament i poder": "Diagnosis, treatment and power",
  "Què ha de créixer. Què ha de morir.": "What must grow. What must die.",
  "Catàleg de diagrames": "Diagram catalogue",
  "Els 76 diagrames centrals del llibre. Sota cada un: el títol del node, el missatge central i la descripció del dibuix.": "The book's 76 central diagrams. Under each one: the node title, the central message and a description of the drawing.",
  "Obrir el llibre": "Open the book"
};

// ── Etiquetes dels diagrames (clau: text català de src/illustrations.js) ──
const LABELS_EN = {
  "CAPITALISME": "CAPITALISM", "CÀNCER": "CANCER", "D → D′ → D″ → …": "M → M′ → M″ → …",
  "CAP DELS DOS NO TÉ UN PUNT D’ARRIBADA": "NEITHER HAS A FINISHING LINE", "AQUEST LLIBRE": "THIS BOOK",
  "UNA COMPARACIÓ AMB HISTÒRIA": "A COMPARISON WITH A HISTORY", "DE L’INSULT AL DIAGNÒSTIC": "FROM INSULT TO DIAGNOSIS",
  "UNA INSTITUCIÓ PRÒPIA": "ONE OF ITS OWN INSTITUTIONS", "UNA CÈL·LULA PRÒPIA": "ONE OF ITS OWN CELLS",
  "EL MATEIX EDIFICI, REORIENTAT": "THE SAME BUILDING, REDIRECTED", "NO ÉS UN VIRUS NI UN BACTERI": "NEITHER A VIRUS NOR A BACTERIUM",
  "ADN ALTERAT": "ALTERED DNA", "QUI FABRICA EL RISC": "WHO MAKES THE RISK", "EXPOSICIÓ": "EXPOSURE",
  "QUI EMMALALTEIX": "WHO FALLS ILL", "LA PERSONA NO ÉS LA METÀFORA": "THE PERSON IS NOT THE METAPHOR",
  "DECISIÓ": "DECISION", "ATZAR": "CHANCE", "ACTES · INFORMES · SIGNATURES": "MINUTES · REPORTS · SIGNATURES",
  "MUTACIONS SENSE INTENCIÓ": "MUTATIONS WITHOUT INTENT", "SI LA COMPARACIÓ ÉS INJUSTA, HO ÉS AMB EL CÀNCER": "IF THE COMPARISON IS UNFAIR, IT IS UNFAIR TO CANCER",
  "1 DE CADA 5 TINDRÀ CÀNCER": "1 IN 5 WILL HAVE CANCER", "TOTS 5 VIUEN DINS DEL MERCAT": "ALL 5 LIVE INSIDE THE MARKET",
  "L’EXCEPCIÓ I L’ENTORN": "THE EXCEPTION AND THE ENVIRONMENT", "TEIXIT: CADA CÈL·LULA ACCEPTA LÍMITS": "TISSUE: EVERY CELL ACCEPTS LIMITS",
  "LA QUE FA TRAMPA TORNA A VIURE SOLA": "THE CHEATER GOES BACK TO LIVING ALONE", "I GUANYA… MENTRE EL COS AGUANTA": "AND WINS… WHILE THE BODY LASTS",
  "HIPERPLÀSIA": "HYPERPLASIA", "NEOPLÀSIA": "NEOPLASIA", "LA FERIDA ES TANCA I S’ATURA": "THE WOUND CLOSES AND STOPS",
  "CONTINUA SENSE CAP FERIDA": "IT GOES ON WITH NO WOUND", "EL MATEIX CREIXEMENT, AMB FINAL O SENSE": "THE SAME GROWTH, WITH OR WITHOUT AN END",
  "PIB": "GDP", "TELÒMERS": "TELOMERES", "ATURAR-SE = RECESSIÓ": "STOPPING = RECESSION", "TELOMERASA": "TELOMERASE",
  "LA CÈL·LULA TUMORAL NO S’ATURA": "THE TUMOUR CELL NEVER STOPS", "ELS PETITS TANQUEN": "SMALL SHOPS CLOSE",
  "RESCAT PÚBLIC": "PUBLIC BAILOUT", "APOPTOSI": "APOPTOSIS", "NO VOL MORIR": "REFUSES TO DIE",
  "ACCELERADOR ENCALLAT": "STUCK ACCELERATOR", "ONCOGÈN · INCENTIUS": "ONCOGENE · INCENTIVES",
  "FRE DESCONNECTAT": "BRAKE DISCONNECTED", "DUES AVARIES ALHORA": "TWO FAILURES AT ONCE",
  "LA CINTA ACCELERA": "THE BELT SPEEDS UP", "QUI S’ATURA CAU": "STOP AND YOU FALL",
  "LLEIS COERCITIVES DE LA COMPETÈNCIA": "COERCIVE LAWS OF COMPETITION", "DIVERSITAT": "DIVERSITY", "SELECCIÓ": "SELECTION",
  "LA MÉS VORAÇ": "THE MOST VORACIOUS", "NINGÚ NO HO DECIDEIX: ES SELECCIONA": "NOBODY DECIDES IT: IT IS SELECTED",
  "UN POC": "A LITTLE", "CADA VOLTA EN RECULL MÉS": "EACH TURN PICKS UP MORE", "r > g · SENYALITZACIÓ AUTOCRINA": "r > g · AUTOCRINE SIGNALLING",
  "UN PLANETA · 7 DELS 9 LÍMITS SUPERATS": "ONE PLANET · 7 OF 9 BOUNDARIES CROSSED", "+3 % ANUAL": "+3% A YEAR", "UN ALTRE COS?": "ANOTHER BODY?",
  "M → D → M": "C → M → C", "D → M → D′": "M → C → M′", "VENDRE PER COMPRAR": "SELLING IN ORDER TO BUY",
  "ES TANCA QUAN HI HA PROU": "IT CLOSES WHEN THERE IS ENOUGH", "DINERS PER A MÉS DINERS": "MONEY FOR MORE MONEY", "NO ES TANCA MAI": "IT NEVER CLOSES",
  "50.000 £ DE MITJANS": "£50,000 OF MEANS", "3.000 TREBALLADORS SE’N VAN": "3,000 WORKERS WALK AWAY",
  "SENSE ALGÚ OBLIGAT A TREBALLAR,": "WITHOUT SOMEONE FORCED TO WORK,", "ELS DINERS NO SÓN CAPITAL": "MONEY IS NOT CAPITAL",
  "AUSTRÀLIA, SEGLE XIX": "AUSTRALIA, 19TH CENTURY", "CAP PEIX NO DIRIGEIX EL BANC": "NO FISH LEADS THE SHOAL",
  "DECISIONS LOCALS · UNA SOLA DIRECCIÓ": "LOCAL DECISIONS · ONE DIRECTION", "GOTA A GOTA: CREIXEMENT": "DRIP BY DRIP: GROWTH",
  "SI ES TALLA,": "CUT IT,", "TOT CAU": "IT ALL FALLS", "DEUTE MUNDIAL: 235 % DEL PIB": "WORLD DEBT: 235% OF GDP",
  "PEATGE": "TOLL", "TRAMPA DE NITROGEN": "NITROGEN TRAP", "COBRAR PER DEIXAR PASSAR": "CHARGING TO LET THROUGH",
  "EL TUMOR CAPTA NITROGEN DEL MÚSCUL": "IT TAKES MUSCLE NITROGEN", "LA LLAVOR": "THE SEED",
  "CRÈDIT": "CREDIT", "LLEIS": "LAWS", "TREBALL": "LABOUR", "CURES": "CARE", "NATURA": "NATURE",
  "EL SÒL DECIDEIX SI CREIX": "THE SOIL DECIDES WHETHER IT GROWS", "PET ECONÒMICA": "ECONOMIC PET", "PET MÈDICA": "MEDICAL PET",
  "CENTRES FINANCERS I PARADISOS": "FINANCIAL CENTRES AND HAVENS", "EL TUMOR S’EMPASSA LA GLUCOSA": "THE TUMOUR GULPS GLUCOSE",
  "FERROCARRIL COLONIAL": "COLONIAL RAILWAY", "ANGIOGÈNESI": "ANGIOGENESIS", "DE LA MINA AL PORT": "FROM MINE TO PORT",
  "VASOS CAÒTICS CAP AL TUMOR": "CHAOTIC VESSELS TO THE TUMOUR", "SUBVENCIÓ": "SUBSIDY", "HORMONA": "HORMONE",
  "FÒSSILS: 7 BILIONS $ (FMI, 2022)": "FOSSILS: $7 TRILLION (IMF, 2022)", "LÍMIT": "LIMIT", "ESTRÒGENS · ANDRÒGENS": "OESTROGENS · ANDROGENS",
  "HORMONOTERÀPIA": "HORMONE THERAPY", "PORTA GIRATÒRIA": "REVOLVING DOOR", "MACRÒFAG RECLUTAT": "RECRUITED MACROPHAGE",
  "REGULADOR": "REGULATOR", "EMPRESA": "COMPANY", "EL VIGILANT ALIMENTA EL TUMOR": "THE GUARD FEEDS THE TUMOUR",
  "CRISI": "CRISIS", "FERIDA QUE NO ES CURA": "A WOUND THAT DOES NOT HEAL", "10 MÉS RICS: ×2": "10 RICHEST: ×2",
  "INFLAMACIÓ CRÒNICA": "CHRONIC INFLAMMATION", "MALBARATAMENT": "WASTE", "EFECTE WARBURG": "WARBURG EFFECT",
  "1.050 M DE TONES D’ALIMENTS (2022)": "1.05 BILLION TONNES OF FOOD (2022)", "CÈL·LULA SANA": "HEALTHY CELL", "TUMOR": "TUMOUR",
  "RÀPID, MALBARATADOR I ÀCID": "FAST, WASTEFUL AND ACID", "JORNADA": "WORKING DAY", "FIBROBLAST": "FIBROBLAST",
  "SALARI": "WAGE", "PLUSVÀLUA": "SURPLUS VALUE", "8 HORES DE FEINA": "8 HOURS OF WORK",
  "LA CÈL·LULA SANA FA LA FEINA": "THE HEALTHY CELL DOES THE WORK", "EL TUMOR EN CREMA L’ENERGIA": "THE TUMOUR BURNS THE ENERGY",
  "BOMBAR EN 200 ANYS": "PUMPED IN 200 YEARS", "MILIONS D’ANYS D’ENERGIA": "MILLIONS OF YEARS OF ENERGY", "EMISSIONS": "EMISSIONS",
  "90 EMPRESES:": "90 COMPANIES:", "63 % DE LES EMISSIONS": "63% OF EMISSIONS", "HISTÒRIQUES (1751–2010)": "SINCE 1751 (TO 2010)",
  "CENTRE NET": "CLEAN CENTRE", "PERIFÈRIA": "PERIPHERY", "«LA LÒGICA D’ABOCAR RESIDUS TÒXICS": "“THE LOGIC OF DUMPING TOXIC WASTE",
  "AL PAÍS DE SALARIS MÉS BAIXOS ÉS IMPECABLE»": "IN THE LOWEST-WAGE COUNTRY IS IMPECCABLE”", "BANC MUNDIAL, 1991": "WORLD BANK, 1991",
  "EL QUE COMPTA EL PIB": "WHAT GDP COUNTS", "16.400 MILIONS D’HORES DIÀRIES DE CURES SENSE SOU": "16.4 BILLION HOURS OF UNPAID CARE A DAY",
  "CUINAR": "COOKING", "CRIAR": "RAISING", "CUIDAR": "CARING", "INTERCANVI DESIGUAL": "UNEQUAL EXCHANGE", "CAQUÈXIA": "CACHEXIA",
  "NORD": "NORTH", "SUD": "SOUTH", "+10 BILIONS $ CADA ANY": "+$10 TRILLION A YEAR", "EL MÚSCUL ALIMENTA EL TUMOR": "MUSCLE FEEDS THE TUMOUR",
  "ET FALTA AIXÒ": "YOU NEED THIS", "(NO HO SABIES)": "(YOU DIDN’T KNOW)", "LA PRODUCCIÓ FABRICA ELS DESITJOS": "PRODUCTION MAKES THE WANTS",
  "QUE DESPRÉS SATISFÀ": "IT THEN SATISFIES", "PUBLICITAT MUNDIAL: +1 BILIÓ $ (2024)": "GLOBAL ADVERTISING: +$1 TRILLION (2024)",
  "ESTATUS": "STATUS", "JOVENTUT": "YOUTH", "REBEL·LIA": "REBELLION", "ÈXIT": "SUCCESS",
  "NO ES VEN UNA SABATILLA: ES VEN UNA IDENTITAT": "IT DOESN’T SELL A TRAINER: IT SELLS AN IDENTITY", "AMB DATA DE CADUCITAT": "WITH A SELL-BY DATE",
  "1.000 HORES": "1,000 HOURS", "CÀRTEL PHOEBUS, 1924": "PHOEBUS CARTEL, 1924", "ENCARA FUNCIONAVA": "IT STILL WORKED",
  "QUI FEIA BOMBETES MÉS DURADORES, PAGAVA MULTA": "WHOEVER MADE LONGER-LASTING BULBS WAS FINED", "LA NIT TAMBÉ PRODUEIX DADES": "THE NIGHT PRODUCES DATA TOO",
  "TREBALL NOCTURN: PROBABLEMENT CARCINOGEN (IARC, GRUP 2A)": "NIGHT WORK: PROBABLY CARCINOGENIC (IARC GROUP 2A)", "DORMIR": "SLEEP",
  "LIBERAL": "LIBERAL", "COORDINAT": "COORDINATED", "D’ESTAT": "STATE", "FINANCER": "FINANCIAL", "DE PLATAFORMES": "PLATFORM",
  "PROPIETAT · SALARI · ACUMULACIÓ": "PROPERTY · WAGES · ACCUMULATION", "UN SOL TRONC, MOLTES BRANQUES (COM UN TUMOR)": "ONE TRUNK, MANY BRANCHES (LIKE A TUMOUR)",
  "FÀRMAC": "DRUG", "MESOS": "MONTHS", "1 RESISTENT": "1 RESISTANT", "SOBREVIU": "IT SURVIVES", "TOTES RESISTENTS": "ALL RESISTANT",
  "BASILEA III → BANCA A L’OMBRA": "BASEL III → SHADOW BANKING", "PRESSIONAR TAMBÉ ÉS SELECCIONAR": "PRESSURE IS ALSO SELECTION",
  "MAIG DEL 68 → MÀRQUETING": "MAY ’68 → MARKETING", "LÍNIES DE TRACTAMENT": "LINES OF TREATMENT", "AUTONOMIA!": "AUTONOMY!",
  "SIGUES TU": "BE YOURSELF", "(COMPRA)": "(BUY)", "LA CRÍTICA CONVERTIDA EN ESLÒGAN": "CRITIQUE TURNED INTO A SLOGAN",
  "1a": "1st", "2a": "2nd", "3a": "3rd", "CADA RECAIGUDA, MÉS DIFÍCIL": "EACH RELAPSE, HARDER", "ETIQUETA VERDA": "GREEN LABEL",
  "42 % ENGANYOSES (UE, 2021)": "42% MISLEADING (EU, 2021)", "NO EM MENGIS": "DON’T EAT ME", "EL MACRÒFAG NO L’ATACA": "THE MACROPHAGE LETS IT BE",
  "MONT PÈLERIN: 25 ANYS ADORMIDA": "MONT PÈLERIN: 25 YEARS ASLEEP", "CÈL·LULES LATENTS: FINS A 20 ANYS": "DORMANT CELLS: UP TO 20 YEARS",
  "PISOS TURÍSTICS": "TOURIST FLATS", "VEÏNS DESPLAÇATS": "NEIGHBOURS OUT", "ACUMULACIÓ PER DESPOSSESSIÓ · INVASIÓ": "ACCUMULATION BY DISPOSSESSION · INVASION",
  "SOLUCIÓ ESPACIAL": "SPATIAL FIX", "HIPÒXIA": "HYPOXIA", "EL CAPITAL MARXA": "CAPITAL MOVES ON", "SENSE O₂": "NO O₂", "LES CÈL·LULES FUGEN": "THE CELLS ESCAPE",
  "GLOBALITZACIÓ": "GLOBALISATION", "METÀSTASI": "METASTASIS", "40 % DE LES LLENGÜES, EN PERILL": "40% OF LANGUAGES ENDANGERED",
  "PER LA SANG, CAP A ALTRES ÒRGANS": "THROUGH THE BLOOD TO OTHER ORGANS", "EN VENDA": "FOR SALE", "NÍNXOL PREMETASTÀTIC": "PRE-METASTATIC NICHE",
  "AIGUA A BORSA (2020)": "WATER ON THE STOCK MARKET (2020)", "LA PROPIETAT ARRIBA PRIMER": "PROPERTY ARRIVES FIRST", "EL TUMOR PREPARA EL SÒL": "THE TUMOUR PREPARES THE SOIL",
  "POTOSÍ": "POTOSÍ", "METÀSTASI ÒSSIA": "BONE METASTASIS", "LA MUNTANYA ES BUIDA": "THE MOUNTAIN IS HOLLOWED OUT",
  "L’OS ALIMENTA EL TUMOR": "BONE FEEDS THE TUMOUR", "CERCLE VICIÓS": "VICIOUS CYCLE", "COMPANYIA DE LES ÍNDIES": "EAST INDIA COMPANY",
  "200.000 SOLDATS · ACCIONISTES": "200,000 SOLDIERS · SHAREHOLDERS", "TRACTATS · MONEDA PRÒPIA": "TREATIES · OWN CURRENCY",
  "CEGA: LA MAJORIA MOREN": "BLIND: MOST OF THEM DIE", "UNA METÀSTASI NO TÉ JUNTA D’ACCIONISTES": "A METASTASIS HAS NO SHAREHOLDERS’ MEETING",
  "SERRAR LA BRANCA ON S’ESTÀ ASSEGUT": "SAWING OFF THE BRANCH YOU SIT ON", "EL TUMOR MOR AMB L’HOSTE": "THE TUMOUR DIES WITH ITS HOST",
  "UN TERÇ DELS SÒLS DEL MÓN, DEGRADATS": "A THIRD OF THE WORLD’S SOILS DEGRADED", "PAELLA ANTIADHERENT": "NON-STICK PAN",
  "PFOA A LA SANG": "PFOA IN BLOOD", "CARCINOGEN (IARC, GRUP 1, 2023)": "CARCINOGENIC (IARC GROUP 1, 2023)",
  "EL RESIDU EXPULSAT TORNA AL COS": "EXPELLED WASTE RETURNS TO THE BODY", "151 CRISIS BANCÀRIES": "151 BANKING CRISES",
  "NUCLI NECRÒTIC": "NECROTIC CORE", "EL LÍMIT NO AVISA: ESCLATA": "NO WARNING: IT BURSTS", "MORT": "DEAD",
  "EL CENTRE MOR, LA VORA CONTINUA": "THE CORE DIES, THE EDGE GOES ON", "54 % RECOMPRA D’ACCIONS": "54% SHARE BUYBACKS",
  "37 % DIVIDENDS": "37% DIVIDENDS", "9 % INVERSIÓ": "9% INVESTMENT", "CONDICIONS FUTURES": "FUTURE CONDITIONS",
  "BENEFICIS SENSE PROSPERITAT": "PROFITS WITHOUT PROSPERITY", "MONOCULTIU": "MONOCULTURE", "HEMATOPOESI CLONAL": "CLONAL HAEMATOPOIESIS",
  "IRLANDA, 1845: UNA SOLA PATATA": "IRELAND, 1845: ONE POTATO", "UN MILIÓ DE MORTS": "A MILLION DEAD", "UN CLON DOMINA: LEUCÈMIA ×11": "ONE CLONE RULES: LEUKAEMIA ×11",
  "PRODUCTE": "PRODUCT", "DANY": "DAMAGE", "HOSPITAL": "HOSPITAL", "PREVENIR AQUÍ": "PREVENT HERE",
  "30–50 % DELS CÀNCERS ES PODRIEN EVITAR": "30–50% OF CANCERS COULD BE AVOIDED", "LIMITANT EL QUE ES POT VENDRE": "BY LIMITING WHAT MAY BE SOLD",
  "CARBONI «COMPENSAT»": "“OFFSET” CARBON", "CIGARRETA «LIGHT»": "“LIGHT” CIGARETTE", "CERTIFICAT": "CERTIFICATE",
  "LA XEMENEIA NO S’ATURA": "THE CHIMNEY KEEPS SMOKING", "FILTRE AMB FORATS": "PERFORATED FILTER", "MÉS PROFUND AL PULMÓ": "DEEPER INTO THE LUNG",
  "CANSAMENT": "TIREDNESS", "PÈRDUA DE PES": "WEIGHT LOSS", "ANÈMIA": "ANAEMIA", "PARADÍS FISCAL": "TAX HAVEN",
  "DESIGUALTAT": "INEQUALITY", "INFLAMACIÓ": "INFLAMMATION", "DIAGNOSTICAR ÉS CONNECTAR SENYALS": "DIAGNOSIS MEANS CONNECTING SIGNS",
  "QUE, PER SEPARAT, SEMBLEN NORMALS": "THAT LOOK NORMAL ON THEIR OWN", "PIB I VIDA (EUA)": "GDP AND LIFE (US)", "MIDA I SUPERVIVÈNCIA": "SIZE AND SURVIVAL",
  "PIB ↑": "GDP ↑", "ESPERANÇA DE VIDA ↓": "LIFE EXPECTANCY ↓", "EL TUMOR S’ENCONGEIX…": "THE TUMOUR SHRINKS…",
  "…I EL PACIENT NO VIU MÉS": "…BUT LIFE IS NOT LONGER", "NOMÉS 14 % ALLARGUEN LA VIDA": "ONLY 14% EXTEND LIFE",
  "SOSTRE ECOLÒGIC": "ECOLOGICAL CEILING", "EXCÉS": "OVERSHOOT", "ESPAI SEGUR I JUST": "SAFE AND JUST SPACE", "MANCA": "SHORTFALL",
  "SÒL SOCIAL": "SOCIAL FOUNDATION", "EL DÒNUT DE KATE RAWORTH": "KATE RAWORTH’S DOUGHNUT", "CIRURGIA": "SURGERY",
  "34 EMPRESES": "34 COMPANIES", "MARGE LLIURE": "CLEAR MARGIN", "JA ERA FORA": "ALREADY OUTSIDE",
  "LA MASSA ES TALLA; L’ARREL QUEDA": "THE MASS IS CUT; THE ROOT STAYS", "IMPOST MÀXIM (EUA)": "TOP TAX RATE (US)",
  "CÈL·LULES MARE TUMORALS · PROPIETAT INTACTA": "CANCER STEM CELLS · OWNERSHIP INTACT", "ABANS": "BEFORE", "DESPRÉS": "AFTER",
  "UN SOL CAMP": "ONE FIELD ONLY", "EL REG ARRIBA A TOTHOM": "WATER REACHES EVERYONE", "CANVIAR QUI ÉS PROPIETARI I QUI DECIDEIX": "CHANGE WHO OWNS AND WHO DECIDES",
  "TERÀPIA DE XOC (RÚSSIA)": "SHOCK THERAPY (RUSSIA)", "RADIOTERÀPIA": "RADIOTHERAPY", "−6 ANYS DE VIDA (HOMES)": "−6 YEARS OF LIFE (MEN)",
  "PROTEGIR ELS ÒRGANS SANS": "SPARE THE HEALTHY ORGANS", "+ IMPOST": "+ TAX", "CARBURANT": "FUEL", "ARMILLES GROGUES (2018)": "YELLOW VESTS (2018)",
  "UNA TRANSICIÓ QUE PAGUEN ELS DE SEMPRE": "A TRANSITION PAID BY THE USUAL PEOPLE", "FRACASSA I ÉS INJUSTA": "FAILS AND IS UNJUST",
  "SINDICAT": "UNION", "PREMSA": "PRESS", "CIÈNCIA": "SCIENCE", "SERVEI PÚBLIC": "PUBLIC SERVICE", "LIMFÒCIT T": "T CELL",
  "DEFENSES DISTRIBUÏDES, NO UN SOL GUARDIÀ": "DISTRIBUTED DEFENCES, NOT ONE GUARDIAN", "LLIBERTAT": "FREEDOM", "AUTOIMMUNITAT": "AUTOIMMUNITY",
  "«LA LLIBERTAT ÉS": "“FREEDOM IS", "LA DE QUI PENSA": "FOR THE ONE WHO", "DIFERENT»": "THINKS DIFFERENTLY”",
  "ROSA LUXEMBURG, 1918": "ROSA LUXEMBURG, 1918", "LA DEFENSA ATACA EL PROPI COS": "THE DEFENCE ATTACKS ITS OWN BODY",
  "GOVERN A": "GOVERNMENT A", "GOVERN B": "GOVERNMENT B", "LES CANONADES DE LA PROPIETAT": "THE PIPES OF OWNERSHIP",
  "«QUE TOT CANVIÏ PERQUÈ TOT CONTINUÏ IGUAL»": "“EVERYTHING MUST CHANGE SO NOTHING CHANGES”", "REMISSIÓ": "REMISSION",
  "ES VA TREURE PERQUÈ FUNCIONAVA": "REPEALED BECAUSE IT WORKED", "TAC: RES": "CT: NOTHING", "MICROSCOPI: ENCARA HI SÓN": "MICROSCOPE: STILL THERE",
  "ES TREUEN 2/3": "2/3 REMOVED", "TORNA A LA MIDA ORIGINAL": "BACK TO ITS ORIGINAL SIZE", "I S’ATURA": "AND STOPS",
  "CRÉIXER AMB FINAL: L’HEPATÒSTAT": "GROWTH WITH AN END: THE HEPATOSTAT", "PROU": "ENOUGH",
  "10.000 MILIONS DE PERSONES, VIDA DIGNA:": "10 BILLION PEOPLE, DECENT LIVES:", "−60 % D’ENERGIA (VIA HIPPO: EL COS SAP DIR PROU)": "−60% ENERGY (HIPPO PATHWAY: THE BODY SAYS ENOUGH)",
  "4 MÚSICS": "4 MUSICIANS", "CURES, SALUT, EDUCACIÓ:": "CARE, HEALTH, EDUCATION:", "NO ES PODEN ACCELERAR": "CANNOT BE SPED UP",
  "EL SISTEMA N’HI DIU «MALALTIA DE COSTOS»": "THE SYSTEM CALLS IT “COST DISEASE”", "RECONVERSIÓ": "CONVERSION", "DIFERENCIACIÓ": "DIFFERENTIATION",
  "MINA DE CARBÓ": "COAL MINE", "EÒLICA": "WIND POWER", "ACORD DE 2018": "2018 AGREEMENT", "LA CÈL·LULA MADURA": "THE CELL MATURES",
  "+90 % DE CURACIONS": "+90% CURED", "CERVELL": "BRAIN", "PULMONS": "LUNGS", "MÚSCULS": "MUSCLES", "INTESTÍ": "GUT",
  "LA SANG VA ON CAL, NO ON ES PAGA": "BLOOD GOES WHERE NEEDED, NOT WHERE PAID", "ACCIONISTES": "SHAREHOLDERS", "TREBALLADORS": "WORKERS",
  "UNA EMPRESA AMB DUES CAMBRES": "A FIRM WITH TWO CHAMBERS", "LES DECISIONS NECESSITEN L’ACORD DE TOTES DUES": "DECISIONS NEED THE CONSENT OF BOTH",
  "BICAMERALISME ECONÒMIC (FERRERAS)": "ECONOMIC BICAMERALISM (FERRERAS)", "COMUNS": "COMMONS", "EL POU DEL POBLE": "THE VILLAGE WELL",
  "COOPERATIVES": "COOPERATIVES", "DE QUI HI TREBALLA": "OWNED BY THEIR WORKERS", "SERVEIS PÚBLICS": "PUBLIC SERVICES", "PER A TOTHOM": "FOR EVERYONE",
  "EL COS TAMBÉ COMBINA NERVIS, HORMONES I DEFENSES": "THE BODY ALSO COMBINES NERVES, HORMONES AND DEFENCES",
  "NEURONES, MÚSCUL, SANG, DEFENSES:": "NEURONS, MUSCLE, BLOOD, DEFENCES:", "DIFERENTS I CONNECTADES": "DIFFERENT AND CONNECTED",
  "UN TEIXIT SA NO ÉS UNIFORME": "A HEALTHY TISSUE IS NOT UNIFORM", "DL": "MO", "DM": "TU", "DC": "WE", "DJ": "TH", "DV": "FR", "DS": "SA", "DG": "SU",
  "OBSERVAR → ACTUAR": "OBSERVE → ACT", "AVALUAR → CORREGIR": "EVALUATE → CORRECT", "CÀNCER CRÒNIC: UNA PASTILLA I CONTROLS, CADA DIA": "CHRONIC CANCER: A PILL AND CHECK-UPS, EVERY DAY",
  "L’ASSEMBLEA": "THE ASSEMBLY", "L’HOMEÒSTASI": "HOMEOSTASIS", "DECIDIR ELS LÍMITS": "DECIDING THE LIMITS", "SUCRE": "SUGAR", "pH 7,4": "pH 7.4",
  "EL CONJUNT REGULA LES PARTS": "THE WHOLE REGULATES THE PARTS", "EL COS COMÚ DECIDEIX": "THE COMMON BODY DECIDES"
};

export const t = s => (lang === "ca" ? s : (UI_EN[s] ?? s));
export const tl = s => (lang === "ca" ? s : (LABELS_EN[s] ?? s));
export const missingLabel = s => lang !== "ca" && !(s in LABELS_EN);

// Tradueix tots els fragments de text i els atributs accessibles d’un arbre DOM.
export function translateDom(root = document.body) {
  document.documentElement.lang = lang;
  if (lang === "ca") return;
  if (UI_EN[document.title]) document.title = UI_EN[document.title];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement?.closest("script,style,svg")) return;
    const raw = node.nodeValue, key = raw.trim();
    if (key && UI_EN[key]) node.nodeValue = raw.replace(key, UI_EN[key]);
  });
  root.querySelectorAll("[aria-label],[title]").forEach(el => {
    ["aria-label", "title"].forEach(attr => { const v = el.getAttribute(attr); if (v && UI_EN[v]) el.setAttribute(attr, UI_EN[v]); });
  });
}

// Selector de llengua: dos botons (CA · EN) inserits al contenidor indicat.
export function mountLangSwitch(container, getOrder = () => null) {
  if (!container) return;
  const wrap = document.createElement("div");
  wrap.className = "lang-switch";
  wrap.setAttribute("role", "group");
  wrap.setAttribute("aria-label", "Llengua · Language");
  wrap.innerHTML = LANGS.map(code => `<button type="button" lang="${code}" data-lang="${code}" aria-pressed="${code === lang}" title="${code === "ca" ? "Català" : "English"}">${code.toUpperCase()}</button>`).join("");
  wrap.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b) switchLang(b.dataset.lang, getOrder()); });
  container.prepend(wrap);
}
