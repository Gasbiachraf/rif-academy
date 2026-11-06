# Rif Academy — Concept Demo

Site de démonstration Innovatechs (portfolio, concept n°11) : centre de formation — langues, informatique, bureautique et marketing digital — à Al Hoceima.
Marque, formateurs et contenus **fictifs** — ce n'est pas le site d'un centre réel.

## Parcours principal

Accueil ou catalogue `/formations` (recherche + filtres combinables catégorie / niveau / format / horaire, synchronisés dans l'URL) → fiche formation `/formations/{slug}` (programme en modules, prochaines sessions indicatives, bloc d'inscription sticky) → formulaire `/inscription?formation=…&session=…` pré-rempli (champs parent / tuteur obligatoires si l'apprenant est mineur) → confirmation « Demande reçue, le centre vous recontacte pour confirmer la place » → message WhatsApp pré-rempli.

Les dates de session sont calculées à partir du jour courant : le site n'affiche jamais de session passée.

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · React Router 7 · Vitest. Site statique, déployé sur Vercel.

- Langues : français (défaut), arabe (RTL), anglais — préfixe d'URL `/fr`, `/ar`, `/en`.
- Textes : `src/i18n/*.ts` (typés : une traduction manquante fait échouer le build) · formations : `src/data/courses.ts`.
- Numéro WhatsApp : `VITE_WHATSAPP_NUMBER` (défaut : ligne Innovatechs).

## Commandes

```bash
npm install
npm run dev      # développement
npm test         # tests (validation, mineur → tuteur, pré-sélection, message WhatsApp, filtres, sessions)
npm run build    # build de production dans dist/
```

## Mentions

Aucune accréditation, aucun diplôme ou certificat reconnu par l'État, aucun taux de réussite ni garantie d'emploi.
Tarifs « à partir de » et dates indicatifs, confirmés par le centre. Formateurs : profils de démonstration.
Photos : Unsplash (licence Unsplash).
# rif-academy
