import { t } from "./i18n.js";
// Geografia fixa de cada node: el centre formula, la dreta explica el càncer,
// l’esquerra explica el capitalisme i el sud recull els límits de la metàfora i les fonts.
export const faces = {
  left: { label: t("Capitalisme"), direction: t("← Esquerra"), arrow: "←", query: "capitalisme" },
  right: { label: t("Càncer"), direction: t("Dreta →"), arrow: "→", query: "cancer" },
  south: { label: t("Límits i fonts"), direction: t("↓ Sud"), arrow: "↓", query: "fonts" },
};
