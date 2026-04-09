# Frederick Radius Data Sources

This inventory is intentionally selective. It covers the datasets that are either active in the app today, foundational to the current architecture, or important to the planned Crime & 911 roadmap.

## Status Legend

- `Official`: government-published source
- `Government-hosted`: appears government-published but still needs service-by-service verification
- `Community`: community-submitted platform data
- `Third-party`: external non-government source used as a convenience integration
- `Manual`: repo-maintained snapshot
- `Derived`: computed inside Frederick Radius

## Active Or Foundational Sources

| Dataset | Owner / Source | Endpoint / Reference | Authority | Delivery | Cadence | Coverage | Intended Use | Quality Notes | Risk Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Frederick County GIS catalog | Frederick County, MD | `https://fcgis.frederickcountymd.gov/server_pub/rest/services` | Official | ArcGIS REST | Unknown by layer | Frederick County | Basemap, planning, public safety, schools, elections, infrastructure | Strongest local source family in the repo | Freshness is not surfaced per layer; browser pulls raw features directly |
| City of Frederick GIS catalog | City of Frederick, MD | `https://spires.cityoffrederick.com/arcgis/rest/services` | Official | ArcGIS REST | Unknown by layer | City of Frederick | City zoning, sidewalks, utilities, infrastructure | Important city-specific context | Some services are brittle; `LeadServiceLines` returned a server error during the 2026-04-08 audit |
| Frederick government hosted ArcGIS layers | Frederick-area government publishers via ArcGIS Online | `https://services5.arcgis.com/o8KSxSzYaulbGcFX/arcgis/rest/services` | Government-hosted | ArcGIS REST | Unknown | Frederick County region | Trails, park boundaries, road closures, medical facilities, food distribution | Useful supplement where county catalog points to hosted layers | Do not assume every hosted layer is equally fresh or authoritative |
| Maryland iMAP | State of Maryland | `https://mdgeodata.md.gov/imap/rest/services` | Official | ArcGIS REST | Unknown | Maryland statewide | Transit stops/routes and statewide reference overlays | Good statewide support layer family | Needs Frederick-specific filtering and clear local scope notes |
| NWS forecast | NOAA / National Weather Service | `https://api.weather.gov/gridpoints/LWX/80,93/forecast` | Official | JSON API | Near-real-time | Frederick County forecast region | Weather forecast panel and pulse surfaces | Legitimate operational source | Gridpoint forecast is regional, not parcel-specific |
| NWS alerts | NOAA / National Weather Service | `https://api.weather.gov/alerts/active?zone=MDZ004` | Official | GeoJSON API | Near-real-time | Alert zone `MDZ004` | Alert banners and weather context | Legitimate operational source | Zone coverage does not map cleanly to every product surface |
| OpenStreetMap Nominatim search | OpenStreetMap Foundation / Nominatim contributors | `https://nominatim.openstreetmap.org/search` | Third-party | JSON API | Near-real-time | Global, constrained in-app to Frederick-area bounds | Current address search convenience lookup | Useful for finding places quickly | Not an official county or city geocoder and not suitable as the final jurisdiction lookup layer |
| USGS water gauges | U.S. Geological Survey | `https://waterservices.usgs.gov/nwis/iv/` | Official | JSON API | Near-real-time | Selected Frederick-area gauges | Water panel and gauge overlay | Legitimate operational source | Flood stage is site-specific; do not use one generic severity scale |
| Maryland CHART incidents | MDOT SHA | `https://chartexp1.sha.maryland.gov/CHARTExportClientService/getEventMapDataJSON.do` | Official | JSON feed | Near-real-time | Maryland statewide, filtered to Frederick map bounds | Traffic panel and overlay | Legitimate operational source | Production browser access is brittle; requires proxy/backend |
| SeeClickFix Frederick feed | SeeClickFix / user reports | `https://seeclickfix.com/api/v2/issues?place_url=frederick&per_page=50&status=open,acknowledged` | Community | JSON API | Near-real-time | Mostly City of Frederick | 311/community report panel and activity feed | Useful situational signal | Not countywide, not official CAD, and not equal to verified work completion |
| Manual parking reference | Frederick Radius repo | Local TypeScript data | Manual | Static in repo | Manual | City of Frederick parking references | Parking panel | Useful for orientation and garage locations | Not a live occupancy, enforcement, or system-status integration |
| Manual municipality snapshot | Frederick Radius repo | Local TypeScript data | Manual | Static in repo | Manual | Frederick County municipalities | Municipality profiles and compare views | Better than fake demo copy because it is explicit | Must be replaced with a real Census/local-government pipeline |
| Manual civic snapshot | Frederick Radius repo + official verification | Local TypeScript data | Manual | Static in repo | Manual | Frederick County civic directory and meetings | Representative directory and meetings panel | Now verified against official public pages on 2026-04-08 | Still a manual process, therefore perishable |
| Approximate municipality reference | Frederick Radius derived logic | Local TypeScript + Turf | Derived | Derived in app | Manual | Frederick County municipalities | Temporary location context fallback | Now clearly labeled as approximate | Must never be treated as an official boundary lookup |

## Crime / Public Safety Planning Sources

| Dataset | Owner / Source | Endpoint / Reference | Authority | Delivery | Cadence | Coverage | Intended Use | Quality Notes | Risk Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Maryland Open Data crime by county | State of Maryland | `https://opendata.maryland.gov/resource/jwfa-fdxs.json` | Official | Socrata JSON | Annual | Maryland counties | Historical county crime trends | Good for long-range analysis | Not live operations, not calls for service |
| Maryland Open Data crime by municipality | State of Maryland | `https://opendata.maryland.gov/resource/2p5g-xrcb.json` | Official | Socrata JSON | Annual | Maryland municipalities | Historical municipal crime trends | Useful for city/town trend views | Not suitable for incident mapping or “today” claims |
| Frederick County GIS CAD incidents (candidate only) | Frederick County, MD | `/PublicSafety/CAD_Incidents/MapServer` in manifest | Official candidate | ArcGIS REST | Unknown | Frederick County | Potential future calls-for-service / operations evaluation | Promising if publicly queryable and policy-cleared | Must not be assumed live, public, or publishable without verification |
| Frederick County GIS road closures CAD | Frederick County, MD | `/PublicSafety/RoadClosures_CAD/MapServer` in manifest | Official candidate | ArcGIS REST | Unknown | Frederick County | Potential future operations context | Could support safer operational UI than crime labels | Still needs verification, freshness testing, and UX constraints |
| FBI crime data API | FBI / data.gov | `https://api.usa.gov/crime/fbi/sapi/` | Official | REST API | Batch / historical | National | Supplemental crime trend validation | Useful for historical context | Not a replacement for local operational public-safety feeds |
| NWS alerts / county emergency notices | NOAA / local agencies | NWS alert endpoints and future local feeds | Official | API / RSS / web | Near-real-time | Region / county | Emergency context and alerting | Good for public safety context | Alerts are not police activity or live 911 |

## Source Handling Rules

- Every user-facing dataset should eventually resolve to one `sourceId`.
- Source attribution should travel with the data, not live only in docs.
- “Official” and “community” data must never share the same visual treatment by default.
- Lack of freshness metadata should be treated as a quality gap, not hidden.
- Crime and 911 features must separate:
  - calls for service
  - confirmed crime statistics
  - weather/emergency alerts
  - road or operational disruptions
