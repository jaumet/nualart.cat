# pAIr per a nualart.cat

Exportació estàtica preparada per publicar-se a:

`https://nualart.cat/pair/`

Totes les dependències locals utilitzen rutes relatives. La carpeta sencera es
pot copiar o servir amb qualsevol altre nom i profunditat de directori sense
perdre els estils, les imatges ni el JavaScript.

## Instal·lació a GitHub Pages

1. Al repositori que publica `nualart.cat`, crea el directori `pair` si encara no existeix.
2. Copia **el contingut** d'aquest directori dins del directori `pair` del repositori.
3. Conserva el fitxer `.nojekyll`: evita que GitHub Pages ignori els recursos de Next dins `_next`.
4. Fes commit i push del repositori de GitHub Pages.

La portada catalana quedarà a `/pair/`, l'anglesa a `/pair/en/`, la Taula del
màster catalana a `/pair/master/` i l'anglesa a `/pair/en/master/`.

La portada detecta els idiomes del navegador. Si el navegador declara català,
manté la versió catalana; per a la resta d'idiomes obre l'anglesa. El selector
`CA / EN` permet canviar-ho manualment i recorda la preferència al navegador.

## Actualització

Quan canviï el projecte font, cal tornar a executar el build estàtic des de `pair-web` i substituir els fitxers publicats. No n'hi ha prou amb copiar `public/`.

La comanda preparada al projecte font és `npm run build:static`.
