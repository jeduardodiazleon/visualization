/*
  Catalog of visualizers.
  To add a new one, copy an entry, change the fields and push.
  The order here is the order on the home page (Fig. 1, Fig. 2, ...).

  embed:  Looker Studio embed URL
          (Archivo > Insertar informe > Habilitar la inserción > copy the URL)
  link:   normal report URL, used for "Open in Looker Studio"
  height: iframe height in px for the tallest page of the report
  plate:  style of the generated cover figure: "lines", "bars" or "area"
*/
window.APPS = [
  {
    id: "coopac-financial-system",
    title: "Coopac Financial System",
    summary:
      "Balance sheet, income statement and ranking of Peruvian savings and credit cooperatives supervised by the SBS, month by month since December 2021.",
    embed:
      "https://lookerstudio.google.com/embed/reporting/7292a2cb-b6e3-4b29-985b-2306d3020803/page/tEnnC",
    link: "https://lookerstudio.google.com/reporting/7292a2cb-b6e3-4b29-985b-2306d3020803",
    height: 1040,
    tool: "Looker Studio + BigQuery",
    source: "Superintendency of Banking, Insurance and AFP (SBS)",
    coverage: "Dec 2021 – latest month",
    refresh: "Daily",
    topics: ["Finance", "Cooperatives", "Peru"],
    plate: "area",
    notes: [
      "Figures in thousands of soles (S/). The currency filter separates local currency, foreign currency and the total.",
      "Income statement series are year-to-date; the trend charts annualize them as value × 12 / month.",
      "The ranking excludes tier aggregates and orders cooperatives by the selected indicator.",
      "Data are scraped from SBS financial statements, loaded to BigQuery and refreshed every day at 06:00 UTC."
    ]
  }
];
