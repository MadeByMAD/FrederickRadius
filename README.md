# Frederick Radius

Frederick Radius is a trust-first civic intelligence and place context product for Frederick County, Maryland and the City of Frederick.

The goal is not just to put local layers on a map. The goal is to build a serious local product that separates:

- official operational data
- official reference data
- community-submitted reports
- manual civic snapshots
- derived or approximate logic

## Current Status

This repo is a strong alpha foundation, not a finished production system.

### What it does well today

- combines a large local GIS layer catalog into one React app
- uses legitimate public feeds for weather, water, and traffic
- provides municipality, civic, parking, 311, and dashboard panels
- now documents source authority, trust level, and known product limits

### What is not production-ready yet

- official municipality boundaries are not integrated
- address search still uses a Nominatim fallback instead of an authoritative local geocoder chain
- most data fetching still happens directly in the browser
- layer freshness is not surfaced per dataset
- civic meetings and directory data are still manual snapshots
- there is no backend normalization or validation layer
- Crime & 911 architecture is planned but not implemented

## Trust Rules

Frederick Radius should never hide uncertainty.

- approximate geometry must look approximate
- manual snapshots must look manual
- community reports must not look like official operations data
- missing data must not be turned into confident negatives
- countywide 911 access must never be implied without verified public sourcing

See [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md) for the full standard.

## Key Docs

- [AUDIT_REPORT.md](./AUDIT_REPORT.md)
- [DATA_SOURCES.md](./DATA_SOURCES.md)
- [PRODUCT_PRINCIPLES.md](./PRODUCT_PRINCIPLES.md)
- [PRODUCT_SURFACES.md](./PRODUCT_SURFACES.md)
- [ROADMAP.md](./ROADMAP.md)
- [ARCHITECTURE_NOTES.md](./ARCHITECTURE_NOTES.md)
- [CRIME_911_PLAN.md](./CRIME_911_PLAN.md)

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Mapbox GL via `react-map-gl`
- Framer Motion
- Turf.js

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Add a Mapbox token if you want the interactive map canvas:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

4. Start the app:

```bash
npm run dev
```

## Environment Variables

- `VITE_MAPBOX_TOKEN`
  Required for the interactive Mapbox canvas. Without it, the app falls back to a map-setup state and keeps the panel UI usable.

- `VITE_CHART_PROXY_URL`
  Optional same-origin production proxy for the Maryland CHART JSON feed. Recommended for production deployments.

- `VITE_CENSUS_API_KEY`
  Reserved for future Census integrations. Not a core dependency today.

- `VITE_AIRNOW_API_KEY`
  Reserved for future air-quality integrations. Not a core dependency today.

## Architecture Snapshot

### Current frontend posture

- source registry lives in `src/data/source-registry.ts`
- map layer trust metadata lives in `src/data/layers.ts`
- curated civic views live in `src/data/workflows.ts`
- municipality and civic snapshots are still repo-managed data files
- live weather, water, traffic, and 311 integrations are browser-fetched

### Target posture

- backend source broker for brittle feeds and ArcGIS
- schema validation for external sources
- per-layer freshness metadata
- official municipality geometry
- address-matched jurisdiction lookup
- public-safety architecture with explicit source-family boundaries

See [ARCHITECTURE_NOTES.md](./ARCHITECTURE_NOTES.md) for the longer-term design.

## Data Posture

The app currently uses a mix of:

- official sources: NWS, USGS, Maryland CHART, Frederick County GIS, City GIS
- community reports: SeeClickFix
- manual snapshots: municipality and civic directory data
- derived logic: approximate municipality reference for location context

See [DATA_SOURCES.md](./DATA_SOURCES.md) for the inventory.

## Known Gaps

- no automated civic calendar ingestion
- no official municipal boundary layer in the app
- no authoritative geocoder broker yet
- no validated calls-for-service or 911 feed
- no tests yet
- no service health monitoring yet

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run preview
```
