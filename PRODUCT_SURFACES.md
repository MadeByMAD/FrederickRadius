# Frederick Radius Product Surfaces

Frederick Radius should not behave like a loose collection of panels, feeds, and GIS toggles.

It should behave like a civic product with a few intentional surface types.

## 1. Situational Surface

Purpose:

- help a resident, reporter, or local operator understand what is changing right now

Current examples:

- weather
- water gauges
- traffic
- selected-feed activity

Rules:

- use official operational feeds where possible
- show source, cadence, and refreshed time near the data
- declare when a surface is only a partial feed aggregation
- never let a situational surface imply countywide public-safety coverage unless that is true

## 2. Location Context Surface

Purpose:

- help a user understand one address or map point with source-backed overlays

Current examples:

- location context / address intelligence panel

Rules:

- separate approximate lookups from authoritative overlay matches
- treat geocoding provider identity as part of the product experience
- preserve field-level provenance wherever possible
- never turn missing overlay data into false assurance

## 3. Civic Reference Surface

Purpose:

- help users answer slower civic questions about representation, municipalities, facilities, and local institutions

Current examples:

- municipality profiles
- civic directory and meetings
- parking reference
- county dashboard

Rules:

- manual snapshots must look manual
- support source links and verified dates
- avoid “live” language unless the underlying source is actually operational

## 4. Planning Context Surface

Purpose:

- help users understand land use, zoning, growth, infrastructure, and long-horizon local change

Current examples:

- zoning
- land use
- growth boundaries
- water/sewer service areas
- development pipeline

Rules:

- present these as context, not decisions
- avoid legal-sounding certainty
- distinguish adopted geography from pipeline or candidate activity

## 5. Public Safety Surface

Purpose:

- support safer public-safety context without pretending to be a live dispatch product

Current examples:

- stations
- shelters
- ESZ boundaries
- roadway flood points
- weather alerts
- transportation disruptions

Rules:

- keep reference geography separate from operational activity
- keep weather, traffic, crime statistics, and calls-for-service separate by source family
- no countywide live 911 implication without a verified, legitimate source and privacy review

## 6. Workflow Layer

Users should not need to manually assemble six layers every time they ask a real local question.

That is why Frederick Radius now has curated civic views such as:

- storm and flood readiness
- mobility and access
- civic services and facilities
- planning and growth context
- public safety reference

These views are not decorative presets.

They are product scaffolding:

- fewer decisions for the user
- clearer trust boundaries
- easier source explanation
- a more durable path from prototype to platform

## Trust UI Primitives

Trust should be visible through repeated UI patterns:

- source status cards
- trust badges
- workflow trust notes
- source-family labels in aggregated widgets
- verified dates on manual snapshots
- release blockers in the dashboard

If a contributor adds a surface without these primitives, the product is drifting backward.
