# Plugzin Frontend

Next.js App Router landing page matching the supplied Plugzin reference:
- near-black UI
- neon lime accent
- compact uppercase navigation
- motorsport hero
- software compatibility cards
- tools/plugins cards
- early-updates CTA
- installation/compatibility section
- responsive mobile navigation

## Run

```powershell
npm install
npm run dev
```

Because the NestJS backend already uses port 3000, run the frontend on port 3001:

```powershell
npm run dev -- -p 3001
```

Open:

http://localhost:3001

The backend can remain at:

http://localhost:3000

Copy `.env.local.example` to `.env.local` when API integration begins.

## Structure

- `app/` — Next.js App Router pages and global CSS
- `components/` — landing-page sections
- `public/images/hero-racing.png` — hero artwork
