# Visualization · J. Eduardo Díaz León

Catalog of interactive data visualizers, published at
**https://jeduardodiazleon.github.io/visualization/**

Plain HTML, CSS and JavaScript. No build step: GitHub Pages serves the files as they are.

## Structure

```
index.html        Home page: hero and catalog
viewer.html       Page that embeds a visualizer (viewer.html?app=<id>)
assets/apps.js    The catalog. The only file you edit to add a visualizer
assets/main.js    Renders the catalog, the cover figures and the viewer
assets/styles.css Design
assets/favicon.svg
.nojekyll         Tells GitHub Pages not to process the site with Jekyll
```

## Add a new visualizer

1. In Looker Studio, open the report and go to **Archivo > Insertar informe**.
   Turn on **Habilitar la inserción** and copy the **URL** shown there (it contains `/embed/`).
2. Share the report: **Compartir > Gestionar el acceso > Cualquier usuario con el enlace > Lector**.
3. For every data source of the report: **Recurso > Gestionar las fuentes de datos añadidas > Editar >
   Credenciales de la fuente de datos > Credenciales del propietario**. Otherwise visitors without
   access to BigQuery will see an error.
4. Copy an entry in `assets/apps.js`, give it a new `id` and fill in the fields
   (`embed` is the URL from step 1, `link` the normal report URL).
5. Commit and push. The site updates in about a minute.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.
