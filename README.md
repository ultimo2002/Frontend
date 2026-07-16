# MooVee

Filmplatform voor de Frontend eindopdracht. Je kunt films en personen opzoeken, lijsten bijhouden en reviews schrijven.

## Inhoudsopgave

- [Installatie](#installatie)
- [Functionaliteit](#functionaliteit)
- [Projectmap](#projectmap)
- [API keys](#api-keys)
- [Todo](#todo)
- [Inleveren](#inleveren)

## Installatie

Je hebt Node.js 18+ en npm nodig.

```bash
npm install
cp .env.example .env
npm run dev
```

Zet je NOVI API-key en TMDB API-key in `.env`. Daarna kun je de app openen op http://localhost:3000.

Productiebuild:

```bash
npm run build
npm run preview
```

### Overige commando's

| Commando | Wat het doet |
|----------|--------------|
| `npm run dev` | Start development server met hot reload |
| `npm run build` | Maakt productiebuild in `dist/` |
| `npm run preview` | Preview van de productiebuild |

## Functionaliteit

De app heeft vier onderdelen:

1. Inloggen en registreren (NOVI API), routes `/` en `/register`
2. Films en personen zoeken (TMDB), routes `/search`, `/movie/:id` en `/person/:id`
3. Lijsten beheren (NOVI API), route `/lists`
4. Reviews en scores (NOVI API), op de filmpagina

## Projectmap

- `src/components` - UI onderdelen
- `src/pages` - pagina's
- `src/context` - login state (React Context)
- `src/hooks` - herbruikbare React hooks (bijv. `useNamedListFilms` voor Favorieten en Gezien)
- `src/services` - fetch calls naar NOVI en TMDB
- `src/assets/moovee-init.json` - NOVI configuratie

## API keys

- NOVI: [documentatie](https://novi-backend-api-wgsgz.ondigitalocean.app/documentation/1-Overview)
- TMDB: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

NOVI endpoints die ik gebruik: `POST /lijst`, `GET /lijst/[ID]`, `PUT /lijst/[ID]`.

## Todo

- [x] Dev bypass uitzetten (`VITE_DEV_BYPASS_AUTH=false`) voor inleveren

- [x] Lijsten koppelen aan NOVI API (aanmaken, ophalen, hernoemen, verwijderen)
- [x] Lijsten zoeken op naam
- [x] Films toevoegen aan en verwijderen uit lijsten
- [x] Favorietenlijst werkend maken
- [x] Gezien-lijst automatisch vullen bij review/score
- [x] Reviews bewerken en verwijderen op filmpagina
- [x] "Voeg toe aan lijst" knop werkend maken
- [x] Persoonspagina toevoegen (`/person/:id`)
- [x] Mock data vervangen door echte API-data
- [x] Loading states en foutmeldingen overal afhandelen
- [x] Semantische HTML nalopen
- [ ] Responsive design testen op mobiel

### Documentatie

- [ ] Screenshot toevoegen aan README
- [ ] Testgebruiker documenteren (username + wachtwoord)
- [ ] Functioneel ontwerp afronden (25+ eisen, use cases, wireframes, Figma)
- [ ] Verantwoordingsdocument schrijven (5 keuzes, 5 limitaties)
- [ ] NOVI JSON-config definitief maken en inleveren

### Git

- [x] Project op public GitHub zetten
- [x] Minimaal 20 commits met duidelijke messages
- [x] Minimaal 5 pull requests mergen naar main

## Inleveren

Broncode als ZIP, zonder `node_modules` en `.idea`. README meeleveren. NOVI API-key en JSON-config apart inleveren. Repository moet public op GitHub staan.
