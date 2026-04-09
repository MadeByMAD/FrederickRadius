# Frederick Radius Product Principles

## Core Standard

Frederick Radius should behave like a serious local civic product.

That means the product must optimize for:

- trust
- utility
- source honesty
- clarity
- production readiness

It must not optimize for decorative confidence.

## 1. No Fake Precision

- If a value is estimated, inferred, approximate, stale, or manually maintained, label it.
- Do not use parcel-like UI language for county-scale approximations.
- Do not draw invented geometry to stand in for official civic boundaries.
- Do not turn “no returned result” into “safe”, “clear”, or “none” without proof.

## 2. Official, Manual, Community, and Derived Must Stay Distinct

Every meaningful data surface should make it possible to distinguish:

- official operational data
- official reference data
- community-submitted reports
- manual repo snapshots
- derived or experimental logic

If the user cannot tell the difference, the UI is wrong.

## 3. Freshness Must Be Legible

- Important datasets should expose update cadence.
- When feasible, show last refreshed timestamps.
- Unknown freshness is a real condition and should be surfaced as such.
- Stale manual data should not be quietly blended into a “live” view.

## 4. Source Attribution Is Part of the Product

- Source links belong near the data they justify.
- Documentation is required, but documentation alone is not enough.
- Trust metadata should exist in code, not only in Markdown.
- Layer catalogs and panels should reference source identity and confidence.
- Aggregated widgets must name which feeds are included and which obvious source families are not included.

## 5. Public Safety Requires Extra Restraint

- Do not imply countywide live 911 visibility unless a verified public source exists and is approved for use.
- Calls for service, crime statistics, weather alerts, and road incidents are different things.
- Public-safety UX must include privacy, precision, and disclosure rules from the start.
- If location accuracy or recency is uncertain, the UI must degrade safely.

## 6. Trust Before Delight

- Playful or gamified features should never outrank source clarity.
- Novelty mechanics belong behind feature flags or in explicitly experimental areas.
- If a feature feels fun but weakens credibility, it should be removed or isolated.

## 7. The Map Supports Understanding; It Is Not the Whole Product

- The map should help users explore and orient.
- It should not be the excuse for weak or thin data modeling.
- Some of the highest-value product surfaces will be panel, directory, alert, and trend views, not just map overlays.

## 8. Default To Useful Over Impressive

- Favor clear scope over inflated ambition.
- Favor fewer trustworthy panels over many fragile ones.
- Favor documented gaps over polished ambiguity.
- Favor operationally honest wording over civic-product buzzwords.

## 9. Product Copy Must Survive Scrutiny

- Avoid unsupported county marketing claims.
- Avoid unlabeled “live”, “intelligence”, or “real-time” language.
- Avoid implying coverage that the repo does not actually have.
- Avoid generic labels like “activity” or “incidents” when the surface only covers selected feeds.
- Good copy reduces risk; hype increases it.

## 10. Ship With Explicit Unknowns

Every serious civic product needs an honest list of things it does not yet know or support.

For Frederick Radius, current unknowns or incomplete areas include:

- official municipal boundary integration
- address-matched representation
- backend-verified feed freshness
- crime / calls-for-service access
- production monitoring of brittle third-party feeds
