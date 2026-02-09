[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey?style=flat-square)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
# What is NDC live test?
The NDC live test is originally named for deploying the first data dashboard online. Now, we are stuck with that name. The real purpose of these scripts is that the website hosting, Netlify, transforms these into what the public can see. This is a **[website](https://www.nationaldeafcenter.org/dashboard)** you can see right now. In other words, this website is from Netlify and the Netlify obtains information from here. In other words, if you make any changes in this data dashboard, everyone in the public can see. Please handle this information with care.

If you are one responsible for maintaining and updating this information, please enter this **[GitHub website](https://github.com/NationalDeafCenterRAD/Backend)**


```
NDC_live_test
├─ LICENSE.md
├─ README.md
├─ app
│  ├─ .htaccess
│  ├─ app.js
│  ├─ package-lock.json
│  └─ package.json
├─ client
│  ├─ README.md
│  ├─ dist
│  │  ├─ _redirects
│  │  ├─ assets
│  │  │  ├─ NDC_Alabama_report-8iuk88sM.pdf
│  │  │  ├─ NDC_Alaska_report-Zt1hLiJ7.pdf
│  │  │  ├─ NDC_Arizona_report-CD5y6ehB.pdf
│  │  │  ├─ NDC_Arkansas_report-7rhG1jtI.pdf
│  │  │  ├─ NDC_California_report-5MZf1yZO.pdf
│  │  │  ├─ NDC_Colorado_report-CvXwNNlW.pdf
│  │  │  ├─ NDC_Connecticut_report-vaopDDnz.pdf
│  │  │  ├─ NDC_Delaware_report-CZqii4uF.pdf
│  │  │  ├─ NDC_District of Columbia_report-CRp2fZs9.pdf
│  │  │  ├─ NDC_Florida_report-BCWTbZVj.pdf
│  │  │  ├─ NDC_Georgia_report-CqKTU4Yi.pdf
│  │  │  ├─ NDC_Hawaii_report-_7WkAfM_.pdf
│  │  │  ├─ NDC_Idaho_report-w7uecYpd.pdf
│  │  │  ├─ NDC_Illinois_report-Ci_3Azob.pdf
│  │  │  ├─ NDC_Indiana_report-DnZL2TqG.pdf
│  │  │  ├─ NDC_Iowa_report-CcLnOX6R.pdf
│  │  │  ├─ NDC_Kansas_report-Cm8wIHpd.pdf
│  │  │  ├─ NDC_Kentucky_report-B7AK2KSv.pdf
│  │  │  ├─ NDC_Louisiana_report-DLfLDluY.pdf
│  │  │  ├─ NDC_Maine_report-D1QRbXag.pdf
│  │  │  ├─ NDC_Maryland_report-Be1G4IYx.pdf
│  │  │  ├─ NDC_Massachusetts_report-BJtE3NWy.pdf
│  │  │  ├─ NDC_Michigan_report-B-Z4M1pn.pdf
│  │  │  ├─ NDC_Minnesota_report-C3OfMvFt.pdf
│  │  │  ├─ NDC_Mississippi_report-DIoqA-Ji.pdf
│  │  │  ├─ NDC_Missouri_report-CSL-iLrh.pdf
│  │  │  ├─ NDC_Montana_report-C44JfQcR.pdf
│  │  │  ├─ NDC_Nebraska_report-CV8Du0MP.pdf
│  │  │  ├─ NDC_Nevada_report-Cyvy7BbN.pdf
│  │  │  ├─ NDC_New Hampshire_report-CwDYV9DX.pdf
│  │  │  ├─ NDC_New Jersey_report-D_crVyBF.pdf
│  │  │  ├─ NDC_New Mexico_report-DL7P95G3.pdf
│  │  │  ├─ NDC_New York_report-Dcii7kcs.pdf
│  │  │  ├─ NDC_North Carolina_report-QGIuJf69.pdf
│  │  │  ├─ NDC_North Dakota_report-C2gJ0cqo.pdf
│  │  │  ├─ NDC_Ohio_report-CnSofxZA.pdf
│  │  │  ├─ NDC_Oklahoma_report-BE9RCPr8.pdf
│  │  │  ├─ NDC_Oregon_report-w9jXlNi8.pdf
│  │  │  ├─ NDC_Pennsylvania_report-D7fQPaJf.pdf
│  │  │  ├─ NDC_Rhode Island_report-BRVg7TcN.pdf
│  │  │  ├─ NDC_South Carolina_report-CxtUiwQa.pdf
│  │  │  ├─ NDC_South Dakota_report-ChjegwuT.pdf
│  │  │  ├─ NDC_Tennessee_report-DQ2Kyd7O.pdf
│  │  │  ├─ NDC_Texas_report-CB_FspU8.pdf
│  │  │  ├─ NDC_Utah_report-BL6ulXum.pdf
│  │  │  ├─ NDC_Vermont_report-aTHeKMPv.pdf
│  │  │  ├─ NDC_Virginia_report-TjSy2cpA.pdf
│  │  │  ├─ NDC_Washington_report-DqvbHOn1.pdf
│  │  │  ├─ NDC_West Virginia_report-CyJqwvVh.pdf
│  │  │  ├─ NDC_Wisconsin_report-CGNq33O4.pdf
│  │  │  ├─ NDC_Wyoming_report-BTr-ymya.pdf
│  │  │  ├─ NDC_logo_black-CElGOrTW.png
│  │  │  ├─ NDC_logo_color_horizontal-black-text-k8iBRPcG.png
│  │  │  ├─ fasterone-CLF5ZTF0.css
│  │  │  ├─ fasterone-CfZw-Kov.js
│  │  │  ├─ index-B9FpOVGY.css
│  │  │  ├─ index-DCLS3f5y.js
│  │  │  ├─ roboto-cyrillic-400-normal-DAIM1_dR.woff2
│  │  │  ├─ roboto-cyrillic-400-normal-DZJji7Rx.woff
│  │  │  ├─ roboto-cyrillic-ext-400-normal-DtZHuW6i.woff
│  │  │  ├─ roboto-cyrillic-ext-400-normal-DzMWdK87.woff2
│  │  │  ├─ roboto-greek-400-normal-CcizSnRP.woff
│  │  │  ├─ roboto-greek-400-normal-jFM2czAU.woff2
│  │  │  ├─ roboto-latin-400-normal-068yxgMN.woff
│  │  │  ├─ roboto-latin-400-normal-CNwBRw8h.woff2
│  │  │  ├─ roboto-latin-ext-400-normal-ZYmyxeOy.woff2
│  │  │  ├─ roboto-latin-ext-400-normal-eTRLN0Nt.woff
│  │  │  ├─ roboto-math-400-normal-B3wgz80t.woff2
│  │  │  ├─ roboto-math-400-normal-rzxYvyVt.woff
│  │  │  ├─ roboto-slab-cyrillic-400-normal-Cc0Cso00.woff
│  │  │  ├─ roboto-slab-cyrillic-400-normal-NTBYJ9iY.woff2
│  │  │  ├─ roboto-slab-cyrillic-ext-400-normal-BW1cBx1L.woff
│  │  │  ├─ roboto-slab-cyrillic-ext-400-normal-Cm5q4seC.woff2
│  │  │  ├─ roboto-slab-greek-400-normal-76UbIAt9.woff2
│  │  │  ├─ roboto-slab-greek-400-normal-AoTWS79V.woff
│  │  │  ├─ roboto-slab-latin-400-normal-DwurWVj7.woff2
│  │  │  ├─ roboto-slab-latin-400-normal-wzK1bUc4.woff
│  │  │  ├─ roboto-slab-latin-ext-400-normal-AV6nsDYb.woff2
│  │  │  ├─ roboto-slab-latin-ext-400-normal-DOoLriWR.woff
│  │  │  ├─ roboto-slab-vietnamese-400-normal-BmyZx1xn.woff
│  │  │  ├─ roboto-slab-vietnamese-400-normal-bJRBMnqv.woff2
│  │  │  ├─ roboto-symbols-400-normal-Tzuungub.woff
│  │  │  ├─ roboto-symbols-400-normal-fF1SLJBj.woff2
│  │  │  ├─ roboto-vietnamese-400-normal-CDDxGrUb.woff2
│  │  │  └─ roboto-vietnamese-400-normal-DmXaN3yE.woff
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ manifest.json
│  │  ├─ preview.jpeg
│  │  └─ robots.txt
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ _redirects
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ manifest.json
│  │  ├─ preview.jpeg
│  │  └─ robots.txt
│  ├─ src
│  │  ├─ app.jsx
│  │  ├─ assets
│  │  │  ├─ images
│  │  │  │  ├─ NDC_logo_black.png
│  │  │  │  ├─ NDC_logo_color.png
│  │  │  │  ├─ NDC_logo_color_horizontal-black-text.png
│  │  │  │  ├─ OSEP-Ideas-That-Work-white.png
│  │  │  │  ├─ USDOE_white.png
│  │  │  │  ├─ positive.svg
│  │  │  │  ├─ tad_logo_white-2.png
│  │  │  │  └─ warning_sign.svg
│  │  │  ├─ polygons
│  │  │  │  └─ usmap.json
│  │  │  ├─ reports
│  │  │  │  ├─ NDC_Alabama_report.pdf
│  │  │  │  ├─ NDC_Alaska_report.pdf
│  │  │  │  ├─ NDC_Arizona_report.pdf
│  │  │  │  ├─ NDC_Arkansas_report.pdf
│  │  │  │  ├─ NDC_California_report.pdf
│  │  │  │  ├─ NDC_Colorado_report.pdf
│  │  │  │  ├─ NDC_Connecticut_report.pdf
│  │  │  │  ├─ NDC_Delaware_report.pdf
│  │  │  │  ├─ NDC_District of Columbia_report.pdf
│  │  │  │  ├─ NDC_Florida_report.pdf
│  │  │  │  ├─ NDC_Georgia_report.pdf
│  │  │  │  ├─ NDC_Hawaii_report.pdf
│  │  │  │  ├─ NDC_Idaho_report.pdf
│  │  │  │  ├─ NDC_Illinois_report.pdf
│  │  │  │  ├─ NDC_Indiana_report.pdf
│  │  │  │  ├─ NDC_Iowa_report.pdf
│  │  │  │  ├─ NDC_Kansas_report.pdf
│  │  │  │  ├─ NDC_Kentucky_report.pdf
│  │  │  │  ├─ NDC_Louisiana_report.pdf
│  │  │  │  ├─ NDC_Maine_report.pdf
│  │  │  │  ├─ NDC_Maryland_report.pdf
│  │  │  │  ├─ NDC_Massachusetts_report.pdf
│  │  │  │  ├─ NDC_Michigan_report.pdf
│  │  │  │  ├─ NDC_Minnesota_report.pdf
│  │  │  │  ├─ NDC_Mississippi_report.pdf
│  │  │  │  ├─ NDC_Missouri_report.pdf
│  │  │  │  ├─ NDC_Montana_report.pdf
│  │  │  │  ├─ NDC_Nebraska_report.pdf
│  │  │  │  ├─ NDC_Nevada_report.pdf
│  │  │  │  ├─ NDC_New Hampshire_report.pdf
│  │  │  │  ├─ NDC_New Jersey_report.pdf
│  │  │  │  ├─ NDC_New Mexico_report.pdf
│  │  │  │  ├─ NDC_New York_report.pdf
│  │  │  │  ├─ NDC_North Carolina_report.pdf
│  │  │  │  ├─ NDC_North Dakota_report.pdf
│  │  │  │  ├─ NDC_Ohio_report.pdf
│  │  │  │  ├─ NDC_Oklahoma_report.pdf
│  │  │  │  ├─ NDC_Oregon_report.pdf
│  │  │  │  ├─ NDC_Pennsylvania_report.pdf
│  │  │  │  ├─ NDC_Rhode Island_report.pdf
│  │  │  │  ├─ NDC_South Carolina_report.pdf
│  │  │  │  ├─ NDC_South Dakota_report.pdf
│  │  │  │  ├─ NDC_Tennessee_report.pdf
│  │  │  │  ├─ NDC_Texas_report.pdf
│  │  │  │  ├─ NDC_Utah_report.pdf
│  │  │  │  ├─ NDC_Vermont_report.pdf
│  │  │  │  ├─ NDC_Virginia_report.pdf
│  │  │  │  ├─ NDC_Washington_report.pdf
│  │  │  │  ├─ NDC_West Virginia_report.pdf
│  │  │  │  ├─ NDC_Wisconsin_report.pdf
│  │  │  │  └─ NDC_Wyoming_report.pdf
│  │  │  └─ styles
│  │  │     ├─ app.css
│  │  │     ├─ buttongroup.css
│  │  │     ├─ content_downdrop.css
│  │  │     ├─ dashboard.css
│  │  │     ├─ edu_chart_text.css
│  │  │     ├─ emp_chart_text.css
│  │  │     ├─ loading.css
│  │  │     └─ table.css
│  │  ├─ components
│  │  │  ├─ buttonGroup.jsx
│  │  │  ├─ citation.jsx
│  │  │  ├─ contentDowndrop.jsx
│  │  │  ├─ faq.jsx
│  │  │  ├─ loading.jsx
│  │  │  └─ table.jsx
│  │  ├─ data
│  │  │  ├─ acs_5_year.json
│  │  │  ├─ acs_year.json
│  │  │  ├─ backup.json
│  │  │  ├─ education.json
│  │  │  ├─ emp16_64.json
│  │  │  ├─ employment.json
│  │  │  ├─ fastfact.json
│  │  │  ├─ occupation.json
│  │  │  ├─ state.json
│  │  │  ├─ timeseries.json
│  │  │  └─ us25_64.json
│  │  ├─ features
│  │  │  ├─ aboutData.jsx
│  │  │  ├─ dashboard.jsx
│  │  │  ├─ method.jsx
│  │  │  └─ report.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ test
│  │  └─ setup.js
│  ├─ test_units
│  │  ├─ datacheck.test.js
│  │  └─ pdfReport.test.js
│  └─ vite.config.js
└─ netlify.toml

```