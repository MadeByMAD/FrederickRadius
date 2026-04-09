# Frederick Radius Architecture Notes

## Target Architecture

Frederick Radius should evolve from a frontend-heavy demo architecture into a source-aware civic data platform.

## 1. Source Registry

The source registry is the control plane for trust.

Each source should declare:

- `sourceId`
- owner
- official vs non-official status
- classification: operational, reference, community-report, derived, manual-snapshot
- cadence
- coverage area
- last verified date
- notes
- risk notes

This already exists in a first-pass form in `src/data/source-registry.ts`. Future work should make it the canonical dependency of panels, layers, and backend ingestion jobs.

## 2. Ingestion Model

### Current state

- Most sources are fetched directly in the browser.
- Caching is in-memory only.
- Schemas are assumed, not validated.

### Target state

Introduce a backend source broker with source-specific handlers:

1. `weather` handler
2. `water` handler
3. `traffic` handler
4. `arcgis` handler
5. `community-report` handler
6. `manual-snapshot` handler

Each handler should:

- fetch upstream data
- validate against a schema
- normalize field names
- attach source metadata
- attach fetched time
- attach upstream update time when available
- write to cache / persistence

Search should be treated as its own ingestion family, not a stray frontend utility:

7. `geocoding` handler

The geocoding handler should:

- try official county or city geocoders first when policy and uptime allow
- normalize candidate results into one search contract
- record which provider produced the result
- flag third-party fallback results as non-authoritative for jurisdiction matching

## 3. Normalized Data Shapes

User-facing code should consume stable shapes, not raw upstream payloads.

Examples:

- `WeatherObservation`
- `WaterGaugeReading`
- `TrafficIncident`
- `CommunityReport`
- `LayerFeatureCollection`
- `MunicipalityProfileSnapshot`
- `CivicDirectorySnapshot`

Each normalized record should carry:

- `sourceId`
- `fetchedAt`
- `upstreamUpdatedAt` when available
- `confidence`
- `coverage`
- `notes` or `disclaimer` when needed

## 4. Validation

Validation is currently missing and should be added before the product expands.

Recommended approach:

- add schema validation for every external source family
- fail closed for malformed operational feeds
- fail soft for reference catalogs, but log mismatches
- preserve raw payloads in backend logs for debugging

Priority validation targets:

- NWS forecast / alerts
- USGS water feeds
- CHART incident feed
- ArcGIS query responses
- manual civic snapshot structure

## 5. Caching

### Current state

- in-memory cache in the browser
- no durable freshness record

### Target state

Use a server-side cache with source-specific TTLs.

Example posture:

- NWS alerts: short TTL
- NWS forecast: moderate TTL
- USGS gauges: short TTL
- CHART incidents: short TTL
- ArcGIS reference layers: moderate or long TTL
- manual snapshots: versioned, manual refresh

The frontend should display:

- last refreshed
- source name
- degraded state if backend cache is stale

## 6. Frontend Consumption

The frontend should stop treating all panels as equal.

Every panel should know:

- which sources it depends on
- whether the data is operational, reference, community, manual, or derived
- whether it is fresh, stale, or unavailable
- what confidence label to show

### Suggested panel contract

Each panel should receive:

- normalized data
- `panelSourceSummary`
- `panelFreshness`
- `panelWarnings`

Aggregate surfaces such as activity widgets should also declare:

- which source families are included
- which common source families are not included
- whether the widget is operational, community, mixed, or historical
- whether the geometry and timestamps are direct or normalized

## 7. Product Workflow Layer

Frederick Radius should not force users to build their own local GIS stack from scratch.

Between raw layers and panels, the product now needs a workflow layer:

- curated civic views
- recommended panel pairings
- trust notes per workflow
- readiness labels such as `ready-now` or `reference-first`

The workflow layer is where the product becomes differentiated.

It turns:

- “here are 60 layers”

into:

- “start with flood readiness”
- “start with planning context”
- “start with civic services”
- “start with public safety reference”

This orchestration layer should remain declarative in code so it can later power:

- saved views
- onboarding
- address-context recommendations
- scenario presets
- shareable map states

## 8. Layer Architecture

The layer catalog now has source/trust metadata, but the renderer is still thin.

Next steps:

- fetch service metadata once and cache it
- surface layer errors and unavailable services
- reduce `outFields=*`
- support field-level mapping by layer family
- add per-layer freshness and health state

## 9. Municipality / Address Architecture

### Current state

- municipality profiles are manual snapshots
- municipality geometry is not official
- address context uses live county GIS where possible
- address search still uses browser-side Nominatim

### Target state

1. ingest official municipality geometry
2. wire county/city geocoder fallback chain
3. keep third-party geocoder fallback explicit and visibly lower-trust
4. match addresses to jurisdictions using authoritative polygons
5. attach district, municipality, zoning, floodplain, school, and utilities with field-level provenance

Address lookup should produce a response shaped like:

```ts
{
  address: string
  point: [lng, lat]
  municipality: { value, confidence, sourceId, note }
  overlays: Array<{ field, value, sourceId, confidence, updatedAt, note }>
  fetchedAt: string
}
```

## 10. Crime & 911 Architecture

This must be architected separately from the current map overlays.

Recommended source families:

- historical crime statistics
- calls for service only if publicly verified
- emergency alerts
- transportation / closure disruptions

Never merge these into one undifferentiated “public safety” stream.

Every future public-safety record should carry:

- source family
- event type
- precision level
- privacy/redaction level
- verification status
- retention policy

## 11. Testing Priorities

The repo currently has no tests.

Start with:

- source normalization tests
- reducer and state transition tests
- trust label rendering tests
- address context response tests
- failure mode tests for unavailable feeds

## 12. Operational Maturity

Before Frederick Radius is treated as production-grade, it should have:

- source health checks
- error logging
- stale cache alarms
- broken endpoint alerts
- documented manual refresh process for snapshot datasets
- release checklist tied to trust rules

## 13. Release Blockers Still Visible In This Repo

These are not abstract future niceties. They are concrete blockers for a serious public launch:

- No authoritative municipality boundary integration
- No authoritative geocoder chain
- No backend normalization/cache layer
- No schema validation for critical feeds
- No automated feed-health monitoring
- No tests for source normalization or trust rendering
- Several manual reference panels still standing in for real pipelines

## 14. Do Not Ship As Production Until

- search results distinguish authoritative geocoder matches from fallback matches
- municipality lookup is polygon-based, not centroid/heuristic based
- every major panel exposes source, cadence, and refreshed time
- every live feed has schema validation and stale-cache handling
- activity aggregations declare included and excluded source families
- manual snapshot refresh ownership is documented and actually operational
