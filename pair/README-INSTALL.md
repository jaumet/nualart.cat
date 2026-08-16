# pAIr per a nualart.cat

Exportació estàtica preparada per publicar-se a:

`https://nualart.cat/pair/`

## Instal·lació a GitHub Pages

1. Al repositori que publica `nualart.cat`, crea el directori `pair` si encara no existeix.
2. Copia **el contingut** d'aquest directori dins del directori `pair` del repositori.
3. Conserva el fitxer `.nojekyll`: evita que GitHub Pages ignori els recursos de Next dins `_next`.
4. Fes commit i push del repositori de GitHub Pages.

La portada quedarà a `/pair/` i la Taula del màster a `/pair/master/`.

## Actualització

Quan canviï el projecte font, cal tornar a executar el build estàtic des de `pair-web` i substituir els fitxers publicats. No n'hi ha prou amb copiar `public/`.
