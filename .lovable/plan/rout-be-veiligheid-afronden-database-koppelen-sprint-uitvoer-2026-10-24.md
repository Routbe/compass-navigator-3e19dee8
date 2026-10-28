# ROUT.be: veiligheid afronden, database koppelen, sprint uitvoeren

## 0. Neon-koppeling (eerst)
- Neon koppelen via het Lovable-koppelvenster (Neon-connector). Je plakt daar de **nieuwe** connection string (na het vernieuwen van het wachtwoord); die blijft in Lovable en komt nooit in de code.
- Let op: via deze koppeling kom ik alleen bij de database (tabellen, data, migraties), niet bij je hele Neon-account (branches, projecten). Een volledige Neon-accountsleutel vraag ik bewust niet: die zou na het lek een extra risico zijn. Branches en projecten beheer je in de Neon-console.
- Daarna: alle migraties in `db/` controleren en ontbrekende toepassen met het bestaande migratiescript.

## 1. Veiligheid afronden
- `.env*` aan `.gitignore` toevoegen.
- Na jouw akkoord: alle sessies (`neon_auth.session`) en OAuth-toegangsbewijzen wissen, zodat iedereen opnieuw inlogt.
- Zorgen dat `BETTER_AUTH_SECRET` verplicht is in productie, dus geen afgeleide sleutel uit `DATABASE_URL`.
- Nieuwe sleutels via het beveiligde venster (Stripe `rk_`, Brevo, inlogpartners). Willekeurige interne sleutels worden automatisch aangemaakt.

## 2. Snelle fixes
- Studio-tabbladen terug naar een rustige segmentbalk (transparant, actieve pil).
- Overal emoji's vervangen door getekende symbolen: Subdomeinen, Bluesky, Statistieken, Avatar/Header, Knoppen & Typografie, Footer, Achtergrond/FX, Lagen-studio, Live-status, Links, Favorieten, Geavanceerd, QR/privacy.
- De pagina-wisselaar verbergen als er maar 1 pagina is.
- Knopvorm/Typografie-instelling inline naast het label.

## 3. Login met ROUT
- Bug: app blijft in "testmodus" hangen terwijl die al live staat. Status vers uit de database lezen in plaats van uit een cache.
- Bug: meerdere redirect-URL's geven een foutmelding. Exacte vergelijking per URL uit de lijst.
- Bestaande gekoppelde accounts (Google/e-mail) standaard aangevinkt, met de mogelijkheid ze uit te vinken om een nieuw ROUT-account te maken.
- Officiële "Connect ROUT"-knop (logo, varianten) en documentatie plus AI-prompttekst die precies deze knop voorschrijft.

## 4. Developer Console
- Persoonlijke en workspace-scope: filteren op `workspace_id IS NULL AND user_id` of op `workspace_id`.
- Nieuwe apps/sleutels krijgen de actieve scope.
- "Overdragen naar Workspace" (alleen voor owner/admin), met dezelfde client_id en secret.

## 5. Studio en profiel
- Anonieme vragen en Gastenboek in de catalogus, met aan/uit-knop die ook op de server wordt afgedwongen. Vragen beantwoorden en vastpinnen als verhaal.
- Badges klein naast de naam; voorbeelden in de showcase gelijk aan het echte profiel.
- Wisselaar tussen profiel en steunpagina onder de URL-balk.

## 6. Workspaces en onboarding
- Keuze na registratie: "Voor mezelf" of "Voor een bedrijf" (dan meteen een workspace).
- Uitlegvenster bij bedrijfsverificatie en infopagina's.

## 7. Admin, domeinen, e-mail
- Beheer van `approved_handles`, blokkeren van handleclaims, namen corrigeren, verificatie intrekken of gratis opnieuw laten proberen, curatie van "Net actief" en "Uitgelicht".
- Subdomeinregels `u.rout.be` / `rout.be`, fallback `r.rout.be` met een herstelmail (echte DNS-controle nodig).
- E-mails bij een toegekende badge en bij een statuswijziging van een workspace-aanvraag.

## Controle
- `bunx vitest run` en typecheck na elk deel; QR-editor zonder achteruitgang.
- Ingelogde controles alleen met een echte ROUT-sessie.

## Technisch
- Databasetoegang blijft via `src/lib/neon.ts` (connector in preview, `DATABASE_URL` op Vercel), volgens AGENTS.md.
- Nieuwe migraties als `db/103_*.sql` en verder, idempotent.
