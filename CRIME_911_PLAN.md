# Crime & 911 Plan

## Non-Negotiable Rule

Frederick Radius must not imply countywide live 911 access unless the project has a verified, legitimate, publicly usable source for that data.

Right now, this repo does **not** have that verified integration.

## Product Split

Crime and public safety should not be one blended feed. The product must distinguish:

1. calls for service / dispatch activity
2. confirmed crime statistics
3. alerts and emergency context
4. transportation and operational disruptions

These are different data families with different expectations, cadences, and privacy constraints.

## What The Repo Has Today

- candidate public-safety GIS references in the county GIS manifest
- Maryland Open Data crime dataset references
- weather alerts
- traffic incidents
- public-safety map layers such as stations, ESZ, shelters, and flood points

## What The Repo Does Not Have Today

- verified countywide live 911 feed
- verified calls-for-service ingestion
- privacy and location precision rules for incident display
- public-safety backend normalization
- legal / policy review for operational public-safety publishing

## Safe Feature Structure

### A. Calls for Service

Only build this if Frederick Radius can verify:

- the feed is actually public
- the cadence is known
- the location precision is publishable
- the feed may legally be redistributed
- the feed is not being confused with confirmed crime

If not verified, do not ship a calls-for-service map.

### B. Confirmed Crime Statistics

This is the safest near-term crime feature because the repo already references historical state datasets.

Suitable uses:

- county trends over time
- municipality trends over time
- crime category comparisons
- historical reference panels

Not suitable uses:

- live incident maps
- “today’s crime” claims
- block-by-block fear heatmaps based on annual data

### C. Alerts / Emergency Context

This is the safest real-time public-safety adjacent surface.

Candidate content:

- NWS alerts
- official emergency notices
- road closures
- flood points / floodplain context
- shelter reference layers

### D. Transportation / Operational Disruptions

Traffic and closures should remain separate from crime.

These sources are closer to operations than crime statistics and should sit alongside alert context, not in a “crime map”.

## Recommended Data Model

```ts
type PublicSafetySourceFamily =
  | 'calls-for-service'
  | 'crime-statistics'
  | 'alerts'
  | 'transport-disruption'
  | 'reference-layer'

type PrecisionLevel =
  | 'exact'
  | 'intersection'
  | 'general-area'
  | 'jurisdiction-only'
  | 'redacted'

type VerificationStatus =
  | 'official'
  | 'official-but-unverified-for-public-use'
  | 'manual'
  | 'derived'

interface PublicSafetyRecord {
  id: string
  sourceId: string
  sourceFamily: PublicSafetySourceFamily
  title: string
  category: string
  publishedAt?: string
  updatedAt?: string
  geometry?: GeoJSON.Geometry
  precisionLevel: PrecisionLevel
  verificationStatus: VerificationStatus
  jurisdiction?: string
  notes?: string
  privacyNote?: string
}
```

## UI Rules

- Always show the source family.
- Always show whether the view is live, historical, or manual.
- Never mix crime trends and live calls for service in one undifferentiated list.
- Never let a generic “activity” widget be mistaken for broad public-safety coverage.
- Default to broader geography if privacy is uncertain.
- Show redaction and precision notes near the map, not buried in docs.

## Privacy Constraints

- Avoid exact home-level or victim-sensitive location display.
- Avoid combining sparse location data with sensational labels.
- Consider redacted or generalized geometry for any operational public-safety feed.
- Add retention rules before storing any sensitive operational records.

## Candidate Source Path

### Near-term, safe

- Maryland Open Data county crime statistics
- Maryland Open Data municipality crime statistics
- NWS alerts
- CHART incidents / closures
- County public-safety reference GIS layers

### Investigate before build

- Frederick County CAD / incident GIS services listed in the manifest
- local emergency RSS or alert endpoints
- any official sheriff / police / county emergency public data feed

### Do not assume

- that a public ArcGIS service is automatically intended for live consumer publication
- that operational data may be redistributed without policy review
- that “CAD incidents” equals “safe to show publicly at full precision”

## Delivery Plan

### Phase 1

- build a historical crime trends page using official state statistics
- add strong source and freshness disclosures
- keep it non-operational and trend-focused

### Phase 2

- add alerts and closure context into a public-safety situation panel
- keep calls-for-service separate and disabled unless verified

### Phase 3

- evaluate verified operational feeds with privacy review
- only then consider a calls-for-service or dispatch surface

## Source Honesty Rules

- If the source is statistical, call it statistical.
- If the source is operational, call it operational.
- If the source is manual, call it manual.
- If the source is unknown, the feature should not ship as a public-trust surface.
