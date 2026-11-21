# Visualization · José Eduardo Díaz León

Gallery of interactive data visualizers, published at
**https://jeduardodiazleon.github.io/visualization/**

Plain HTML, CSS and JavaScript. No build step.

## Files

```
index.html          Gallery
viewer.html         Page that embeds one visualizer (viewer.html?app=<id>)
assets/apps.js      The catalog. The only file you edit to add a visualizer
assets/main.js      Builds the gallery and the viewer
assets/styles.css   Design
assets/thumbs/      One screenshot per visualizer (16:9)
assets/favicon.svg
.nojekyll
```

## Add a new visualizer

1. In Looker Studio: **Archivo > Insertar informe > Habilitar la inserción**, and copy the embed URL.
2. **Compartir > Gestionar el acceso > Cualquier usuario con el enlace > Lector**.
3. For each data source: **Recurso > Gestionar las fuentes de datos añadidas > Editar >
   Credenciales de la fuente de datos > Credenciales del propietario**.
4. Take a screenshot of the dashboard (16:9, about 1280 x 720) and save it in `assets/thumbs/`.
5. Copy an entry in `assets/apps.js`, give it a new `id` and fill in the fields.
6. Commit and push.

## Run locally

```
python3 -m http.server 8000
```
