DWT Regulator Report Prototypes - static hosting bundle

Contents
  index.html        Landing page linking to the prototypes
  r01/index.html    R-01 Receiving Site Intake Dashboard
  r01/support.js    Runtime the prototype needs (keep it next to index.html)
  r02/index.html    R-02 Carrier Activity & Registration Report
  r02/support.js    Runtime the prototype needs (keep it next to index.html)
  r03/index.html    R-03 Hazardous Waste & POPs Intake Report
  r03/support.js    Runtime the prototype needs (keep it next to index.html)
  r04/index.html    R-04 Receiver Submission Activity Report
  r04/support.js    Runtime the prototype needs (keep it next to index.html)
  ur/index.html     Receipt of Waste: combined site view, version 1.0 (User Research prototype, as used in round 1)
  ur/support.js     Runtime the prototype needs (keep it next to index.html)
  ur-v1-1/index.html  Receipt of Waste: combined site view, version 1.1 (User Research prototype)
  ur-v1-1/support.js  Runtime the prototype needs (keep it next to index.html)

Data source
  All reports use Receipt of Waste submissions only. All data in these
  prototypes is invented sample data.

How to host
  Upload the whole dwt-prototypes folder, keeping its structure, to any
  static web host (internal web server, Azure Static Web Apps, Azure Blob
  Storage static website, AWS S3, GitHub Pages). Share the URL of the
  landing page.

  No server code, database or build step is needed, and nothing is fetched
  from the internet: fonts are system fonts and all data is invented and
  generated in the browser.

  Serve the files over http(s). Opening index.html straight from a local
  drive or a SharePoint document library may not work because of browser
  security rules.

Updating
  This is a snapshot. When the prototypes change, replace the index.html
  files (and support.js if a new one is supplied).
