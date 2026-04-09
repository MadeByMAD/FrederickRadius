# Frederick Radius Roadmap

## Phase 1: Trust + Data Integrity

Goal: stop overstating confidence and make source posture explicit.

### Outcomes

- Source registry exists in code and docs
- Every important layer has source and trust metadata
- Fake municipal boundaries are removed
- Address context separates approximate and official fields
- Civic directory and meeting data are labeled as manual snapshots
- Unsupported dashboard claims are removed

### Remaining work in this phase

- Layer-level freshness timestamps in the UI
- Replace browser-side Nominatim search with an authoritative geocoder strategy
- Replace browser-only ArcGIS and CHART fetching with a backend source broker
- Add monitoring for service failures and broken endpoints
- Integrate official municipality geometry
- Add schema validation for critical feeds
- Make selected-feed widgets declare included and excluded source families everywhere they appear

## Phase 2: Core Utility

Goal: make the product practically useful for residents, researchers, journalists, and local decision-makers.

### Outcomes

- Reliable address lookup via official county/city geocoder fallback chain
- Address-matched district and jurisdiction lookup
- Curated civic views become the default entry point for multi-layer map use
- Better layer filtering and scenario presets
- Feed health states and source attribution in every major panel
- Cleaner map-to-panel workflows for traffic, flooding, schools, zoning, and service context

### Candidate deliverables

- “Address context” page with verified overlays and known limitations
- “Municipality reference” pages backed by real Census or local pipelines
- “Infrastructure reference” workflows for sidewalks, parks, floodplain, utilities, and schools

## Phase 3: Experience + Polish

Goal: refine the product without weakening trust.

### Outcomes

- Faster initial load and smaller client bundles
- Better mobile hierarchy
- Better empty/error states for data outages
- More deliberate onboarding
- Map and panel UI feel consistent, clear, and serious

### Candidate deliverables

- Code splitting for heavy map assets
- Feed outage banners with specific source names
- Refined layer browsing with confidence and source facets
- Saved views or scenario presets grounded in real use cases

## Phase 4: Advanced Intelligence / Future Opportunities

Goal: expand coverage only after the data model can support it honestly.

### Outcomes

- Crime trends page using official statistical sources
- Calls-for-service module only if a verified public feed exists
- Local alert center combining weather, closures, emergency notices, and transit disruptions
- Stronger comparative municipal analytics when reference data is sourced and versioned

### Guardrails

- No countywide live 911 claims without verified source access
- No crime heatmaps built from incomplete or privacy-sensitive feeds
- No “intelligence” claims without documented methodology and clear limitations

## Cross-Cutting Engineering Work

- Add tests for source normalization and core reducers/hooks
- Add a backend normalization/cache service
- Add service-health checks and observability
- Version source metadata and validation rules
- Keep docs current whenever a major source or scope decision changes
