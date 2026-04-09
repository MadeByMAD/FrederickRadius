# Frederick Radius Audit Report

Date: 2026-04-08

## Executive Summary

Frederick Radius has a strong concept and a useful direction: combine civic, environmental, infrastructure, and place data into one local product. The current repo is not production-ready yet.

The main problem is not styling or framework choice. The main problem is trust.

Before this audit pass, the app routinely blurred:

- official operational feeds
- government reference GIS
- community-submitted reports
- manual civic snapshots
- derived or approximate logic

That blur made the product look more certain than the data justified.

## What Is Working

- The app shell is functional and reasonably well organized for a Vite/React frontend.
- There is real ambition to use public data instead of fake demo content.
- Weather, water, and CHART traffic integrations point at legitimate public feeds.
- The codebase already has a good base for map-centric exploration and panel-based detail views.
- The repo now has a typed source registry, trust metadata on layers, and stronger contributor docs.

## What Was Weak

### Data integrity

- Municipality boundaries were being fabricated from centroid plus area. That is not a real civic boundary dataset.
- Address intelligence mixed live GIS queries with heuristic municipality, walkability, and elevation claims.
- Municipal demographic fields were precise-looking but had no source vintage or pipeline.
- The civic directory contained stale federal and county representation data.
- The dashboard was showing unsupported county business, visitor, and economic claims.
- Water severity labels were using one generic threshold across different USGS gauges, which is not hydrologically defensible.

### Architecture

- The app still fetches most datasets directly in the browser.
- There is no backend normalization or durable caching layer for brittle feeds.
- ArcGIS ingestion still pulls `outFields=*` and relies on frontend assumptions.
- There is no schema validation or contract testing for external feeds.
- There were no tests in the repo at audit time.
- There was no first-class source registry or freshness model in code before this pass.

### UX and product

- The UI overreached relative to the underlying data quality.
- Novelty surfaces such as rewards, random discovery, and correlation hints competed with civic clarity.
- The welcome flow read like product marketing, not a serious civic data introduction.
- Several panels implied “live” or “real-time” confidence without clarifying coverage limits or source differences.
- The map carried too much of the product burden even where the underlying data model was weak.

### Documentation and repo maturity

- README was too thin and too optimistic.
- There was no audit, source inventory, roadmap, or architecture note set.
- There was no documented Crime & 911 plan grounded in real source constraints.
- Contributors had no durable written standard for trust, source honesty, or freshness handling.

## What Was Misleading

- Fake municipal polygons presented as if they were real boundaries.
- “Address intelligence” as a label for logic that included heuristics and null placeholders.
- “Police districts” layer name that hid the actual ESZ source semantics.
- “Powered by real data” framing around unsupported county dashboard numbers.
- “Garage real-time availability” language when the app did not actually integrate availability.
- Generic water “Low / Normal / Flood” statuses across unrelated gauges.
- UI wording that collapsed official feeds and community reports into one undifferentiated “live” product surface.

## What Was Missing

- Official municipal boundary geometry
- Address-matched district lookup
- Backend source broker / ingestion layer
- Validation schemas
- Feed health monitoring
- Layer-level freshness metadata in the UI
- Source inventory docs
- Crime / calls-for-service / alerts architecture
- A contributor operating model for trust and data honesty

## Immediate Remediation Completed In This Branch

- Added a typed source registry in code.
- Added trust/source metadata to map layers.
- Removed fabricated municipality polygons and replaced them with explicit centroid reference points.
- Reworked address intelligence into a more honest location context model.
- Updated stale county, state, and federal representative data using official public sources.
- Reframed municipality and civic views as manual reference snapshots where appropriate.
- Replaced unsupported county dashboard brag metrics with a trust-and-coverage dashboard.
- Isolated experimental discovery/correlation features behind a feature flag.
- Rewrote the welcome experience to foreground trust and known limits.
- Added source, audit, roadmap, architecture, and Crime & 911 documentation.

## Second-Pass Self-Critique

The first pass fixed the most misleading claims. It did not make the repo production-ready.

These are the biggest things still too weak or too prototype-like:

- Address search still depends on browser-side Nominatim. That is convenient, but it is not a county or city geocoder and should not be the long-term civic lookup path.
- The activity widget still aggregates only CHART traffic and SeeClickFix issue reports. It is now labeled more honestly, but it is still a partial feed surface, not a serious county operations view.
- Most live data still enters the app directly in the browser with thin caching and no schema validation.
- Parking, municipality, and civic panels still rely on repo-managed manual reference data in places where a durable refresh pipeline is needed.
- Map overlays still do not expose robust layer health, fetched time, or upstream update time consistently.
- The repo still has no tests, no feed-health checks, and no operational alerting for broken sources.

## What Would Still Embarrass Us In Review

If a city official, planner, journalist, or investor reviewed this repo today, these are the most defensible criticisms:

- “You still do not have authoritative municipality geometry or authoritative jurisdiction lookup.”
- “Your geocoding path is still prototype infrastructure.”
- “You have a civic-intelligence product claim without a backend normalization and validation layer.”
- “You still rely on manual snapshots for some core reference experiences.”
- “You surface many map layers, but the operational maturity behind those layers is uneven.”
- “You have product ambition that still exceeds the test and monitoring posture.”

## Risk Assessment

### Technical risk

- High: browser-only ingestion remains fragile for CHART and many ArcGIS services.
- High: external feed schemas can change without validation failures being caught early.
- High: address search is still tied to a third-party browser geocoder instead of an authoritative brokered lookup path.
- Medium: map bundle is still heavy and should eventually be split.
- Medium: no test suite means regressions remain easy to ship.

### Product risk

- High: without a backend ingestion layer, the product will struggle to become reliably operational.
- High: municipality and civic experiences still lean on manual snapshots.
- Medium: too many configured layers are still thin references rather than clearly actionable workflows.

### Trust risk

- High: any return to fake boundaries, unsupported county metrics, or generic safety claims would quickly damage credibility.
- High: public-safety features could become actively misleading if “Crime & 911” is implemented without verified sourcing and privacy rules.
- Medium: community report feeds such as SeeClickFix can be overinterpreted unless consistently labeled.

### UX risk

- Medium: the map remains dense, and layer choice can still overwhelm casual users.
- Medium: some views are useful for exploration but not yet actionable enough for repeated operational use.
- Low to medium: the panel architecture is workable, but it needs more source/freshness surfacing over time.

## What Should Be Fixed Next

1. Add a backend source broker for search, weather, water, CHART, ArcGIS, and civic directory/calendar snapshots.
2. Integrate official municipal boundary geometry and replace approximate municipality lookup.
3. Replace browser-side Nominatim with an authoritative geocoder chain and explicit fallback rules.
4. Build schema validation and feed health checks for critical sources.
5. Add layer-level freshness timestamps, upstream update times, and error states across both panels and map surfaces.
6. Split “public safety reference layers” from any future “live operations” surface.
7. Implement Crime & 911 only after verified source access, privacy policy, and product rules are in place.
