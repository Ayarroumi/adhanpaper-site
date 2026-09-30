# SEO-controle — 1 oktober 2026

## Opgeleverd, nog niet gepubliceerd

- Engelse en Nederlandse titels, introducties, metadata en synoniemen richten zich op het product en thuisgebruik.
- Alle publieke HTML is gecontroleerd op technische schermtermen: geen verwijzingen meer naar e-ink of e-paper.
- Organization-, WebSite- en WebPage-data gebruiken consistente identifiers. De Nederlandse verwijzing naar WebSite heeft nu ook een definitie. De zichtbare FAQ blijft; de achterhaalde FAQPage-markup is verwijderd.
- Er was bij inspectie geen Product-markup in de huidige pagina's, ondanks de eerdere SEO-notities. Geen prijs, aanbod, reviews of ratings toegevoegd; deze gegevens zijn niet bevestigd.
- Bestaande lokale wijzigingen in `.gitignore`, privacy en accountverwijdering zijn behouden. De aanvullingen op de juridische pagina's beperken zich tot faviconlinks en de productomschrijving.
- Nieuwe ICO (16/32/48), PNG (16/32/48/96) en Apple-touch-icon (180) gebruiken het volledige bestaande gouden logo op `#082331`. Alle pagina's verwijzen naar de nieuwe iconen.

## Live controle vóór publicatie

`https://adhanpaper.com/`, `/nl/`, `/robots.txt` en `/sitemap.xml` geven HTTP 200. HTTP en de www-variant verwijzen met 301 naar de HTTPS-hoofddomeinnaam. Canonicals en wederzijdse hreflang-verwijzingen zijn aanwezig. Robots blokkeert de pagina's niet. De live sitemap vóór publicatie bevat beide taalversies; lokaal is de Nederlandse keuzehulp toegevoegd.

Dit bewijst bereikbaarheid, niet Google-indexering. Search Console is inmiddels uitgelezen voor 31 augustus–27 september: 6 klikken en 56 vertoningen. Zie de nulmeting in het keywordplan. URL-inspectie en echte Core Web Vitals zijn niet ingezien. De live site heeft nog de oude teksten en favicon totdat deze wijzigingen worden gepubliceerd.

## Lokale validatie

- Alle lokale HTML-links en assetpaden bestaan; interne ankers zijn gecontroleerd. JSON-LD en sitemap XML zijn parseerbaar. `git diff --check` geslaagd.
- Chromium: Engelse en Nederlandse pagina's op 390 en 1440 pixels getest. Geen JavaScriptfouten, kapotte geladen afbeeldingen of horizontale overflow.
- De wachtlijst opent, wijst ongeldige e-mail af, toont succes bij een gesimuleerd backendantwoord en sluit met Escape. Zowel Turnstile als backend zijn in deze test gesimuleerd; er is geen productie-inschrijving verstuurd en echte CAPTCHA/SES-aflevering is hiermee niet bewezen.
- Scrollcontrole op 320, 390 en 1440 pixels: reveal-elementen zichtbaar na scrollen en geen horizontale overflow.
- Lokale LCP in deze test: 92–492 ms; CLS: 0–0,000059. Dit zijn ongethrottlede lokale testwaarden, geen publieke PageSpeed-score of echte bezoekersdata.
- Favicon visueel gecontroleerd op 16, 32 en 48 pixels tegen lichte en donkere achtergronden. Volledig logo aanwezig, verhoudingen intact en geen afsnijding. Het woord ‘Paper’ is op 16 pixels moeilijk leesbaar; het volledige logo is behouden volgens de gekozen voorkeur.

## Na publicatie

Controleer live de pagina's én nieuwe icoonbestanden, dien de sitemap in Search Console in en inspecteer beide URL's. Noteer een nulmeting en vergelijk na vier tot acht weken relevante zoekwoordclusters per taal, land en apparaat. Zie [zoekwoorden en contentplan](SEO-KEYWORD-PLAN.md) voor de meetaanpak.

## Favicon opnieuw genereren

Met Node.js en `sharp` beschikbaar: `node scripts/generate-favicons.cjs`. Het script gebruikt uitsluitend het bestaande, getrackte `assets/logo-gold.png`, snijdt de lege rand weg en schaalt met behoud van verhoudingen. De bestaande logo-assets worden niet overschreven.

## Aanvulling: Nederlandse keuzehulp en productpagina

De productpagina heeft een zichtbaar blok met drie gebruiksstappen, een titel gericht op een moderne adhan klok voor thuis en interne links naar de nieuwe keuzehulp. De keuzehulp is een oorspronkelijke Nederlandse pagina met Article-data, productillustratie en teruglinks. Er is geen Engelse vertaling en dus geen fictieve hreflang-tegenhanger. Beide homepages gebruiken nu een wachtlijst-CTA.

Lokale controles geslaagd: gids op 320/390/1440 pixels zonder overflow of JavaScriptfouten, geladen illustratie, navigatie terug naar productpagina, cross-page ankers, JSON-LD en drie sitemap-URL's. Wachtlijst opnieuw getest op beide talen en desktop/mobiel met gesimuleerde CAPTCHA en backend; er is niets naar productie verstuurd.
