/**
 * Frederick Radius — Comprehensive Data Manifest
 * All confirmed public data endpoints for Frederick County & City of Frederick
 * Last updated: April 2026
 */

export const dataManifest = {
  // ==========================================
  // FREDERICK COUNTY GIS (server_pub)
  // Base: https://fcgis.frederickcountymd.gov/server_pub/rest/services
  // ==========================================
  countyGIS: {
    base: 'https://fcgis.frederickcountymd.gov/server_pub/rest/services',
    basemap: {
      addresses: '/Basemap/Addresses/MapServer/1',
      buildingFootprints: '/Basemap/BuildingFootprints/MapServer',
      countyBoundary: '/Basemap/CountyBoundary/MapServer',
      hydrography: {
        dams: '/Basemap/Hydrography/MapServer/0',
        streams: '/Basemap/Hydrography/MapServer/1',
        feederStreams: '/Basemap/Hydrography/MapServer/2',
        riversLakes: '/Basemap/Hydrography/MapServer/3',
        catchments: '/Basemap/Hydrography/MapServer/5',
        subwatersheds: '/Basemap/Hydrography/MapServer/7',
        watersheds: '/Basemap/Hydrography/MapServer/9',
      },
      municipalities: '/Basemap/Municipalities/MapServer',
      neighborhoods: '/Basemap/Neighborhoods/MapServer',
      parcels: '/Basemap/Parcels/MapServer',
      pointsOfInterest: {
        farmersMarkets: '/Basemap/PointsOfInterest/MapServer/0',
        libraries: '/Basemap/PointsOfInterest/MapServer/1',
        govFacilities: '/Basemap/PointsOfInterest/MapServer/2',
        hotels: '/Basemap/PointsOfInterest/MapServer/3',
        placesOfWorship: '/Basemap/PointsOfInterest/MapServer/4',
        postOffices: '/Basemap/PointsOfInterest/MapServer/5',
        shoppingCenters: '/Basemap/PointsOfInterest/MapServer/6',
        farms: '/Basemap/PointsOfInterest/MapServer/7',
      },
      soils: '/Basemap/Soils/MapServer',
      zipcodes: '/Basemap/Zipcodes/MapServer',
      contours: '/Basemap/Contours/MapServer',
    },
    publicSafety: {
      fireStations: '/PublicSafety/FireAreas/MapServer/0',
      fireHydrants: '/PublicSafety/FireHydrants/MapServer',
      policeDistricts: '/PublicSafety/ESZ/MapServer/6',
      cadIncidents: '/PublicSafety/CAD_Incidents/MapServer',
      lawEnforcement: '/PublicSafety/Law_Enforcement/MapServer',
      shelters: '/PublicSafety/Shelters/MapServer',
      towers: '/PublicSafety/Towers/MapServer',
      nursingHomes: '/PublicSafety/NursingHomes/MapServer',
      hospitals: '/PublicSafety/MEDS_Point_NE/MapServer/5',
      fema500yr: '/PublicSafety/FEMA500YR/MapServer',
      roadClosuresCAD: '/PublicSafety/RoadClosures_CAD/MapServer',
      roadwayFloodPoints: '/PublicSafety/RoadwayFloodPoints/MapServer',
    },
    dpw: {
      bridges: '/DPW/Bridges/MapServer/0',
      trails: '/DPW/Trails/MapServer',
      snowRoutes: '/DPW/SnowRoutes/MapServer',
      trafficSignals: '/DPW/Traffic_Signals/MapServer',
      trafficCounts: '/DPW/TrafficCount/MapServer',
      streetLighting: '/DPW/Street_Lighting/MapServer',
      bikewayRoutes: '/DPW/SHA_Bikeway_Routes/MapServer',
      shaCrashes: '/DPW/SHA_Crashes/MapServer',
      sinkholes: '/DPW/Sinkholes/MapServer',
      highWaterAreas: '/DPW/High_Water_Areas/MapServer',
      dams: '/DPW/Dams/MapServer',
      pavementManagement: '/DPW/PavementManagement/MapServer',
      walkability: '/DPW/Walkability/MapServer',
      countyRoads: '/DPW/CountyMaintainedRoads/MapServer',
      warningSignLocations: '/DPW/Warning_Signs/MapServer',
      schoolbusTurnarounds: '/DPW/Schoolbus_Turnarounds/MapServer',
      marc: '/DPW/MARC/MapServer',
      airportRunways: '/DPW/FMA_Runways/MapServer',
    },
    planning: {
      zoning: '/PlanningAndPermitting/Zoning/MapServer',
      landUse: '/PlanningAndPermitting/LandUse/MapServer',
      comprehensivePlan: '/PlanningAndPermitting/ComprehensivePlan/MapServer',
      growthBoundaries: '/PlanningAndPermitting/ComprehensivePlan/MapServer/2',
      communityFacilities: '/PlanningAndPermitting/ComprehensivePlan/MapServer/5',
      femaFloodplain: '/PlanningAndPermitting/FEMAFloodplain/MapServer',
      wetlands: '/PlanningAndPermitting/Wetlands/MapServer',
      steepSlopes: '/PlanningAndPermitting/Steep_Slopes/MapServer',
      historicSites: '/PlanningAndPermitting/Historic_Sites/MapServer',
      historicPreservation: '/PlanningAndPermitting/Historic_Preservation/MapServer',
      cemeteries: '/PlanningAndPermitting/Cemeteries/MapServer',
      agPreservation: '/PlanningAndPermitting/AgPreservation/MapServer',
      forestResource: '/PlanningAndPermitting/ForestResource/MapServer',
      naturalResources: '/PlanningAndPermitting/NaturalResources/MapServer',
      liquorEstablishments: '/PlanningAndPermitting/LiquorEstablishments/MapServer',
      seniorHousing: '/PlanningAndPermitting/Senior_Housing_Resources/MapServer',
      waterSewerAreas: '/PlanningAndPermitting/WaterSewerServiceAreas/MapServer',
      devPipeline: '/PlanningAndPermitting/ResidentialDevelopmentPipeline/MapServer',
      censusBlocks: '/PlanningAndPermitting/CensusBlocks2020/MapServer',
      planningRegions: '/PlanningAndPermitting/PlanningRegions/MapServer',
    },
    elections: {
      districts: '/Elections/Elections/MapServer',
      redistricting: '/Elections/Redistricting2022/MapServer',
    },
    schools: {
      facilities: '/PublicSchools/EducationalFacilities/MapServer',
      districts: '/PublicSchools/SchoolDistricts/MapServer',
      properties: '/PublicSchools/SchoolProperties/MapServer',
    },
    parks: {
      parks: '/ParksAndRecreation/Parks/MapServer',
      assets: '/ParksAndRecreation/Assets/MapServer',
      facilities: '/ParksAndRecreation/ParkFacilities/MapServer',
    },
    economicDev: {
      opportunityZones: '/EconomicDevelopment/OpportunityZones/MapServer',
      devPipeline: '/EconomicDevelopment/Development_Pipeline/MapServer',
      workforce: '/EconomicDevelopment/CountyWorkforce/MapServer',
    },
    energy: {
      stormwaterFacilities: '/EnergyAndEnvironment/SWMFacilityService/MapServer',
      creekReLeaf: '/EnergyAndEnvironment/CreekReLeafEasements/MapServer',
    },
    transit: {
      routes: '/TransIT/TransIT/MapServer',
    },
    recycling: {
      routes: '/SolidWasteAndRecycling/Recycle/MapServer',
    },
    geocoder: '/Geoprocessors/FrederickCountyAddressesPublic/GeocodeServer',
  },

  // ==========================================
  // CITY OF FREDERICK GIS
  // Base: https://spires.cityoffrederick.com/arcgis/rest/services
  // ==========================================
  cityGIS: {
    base: 'https://spires.cityoffrederick.com/arcgis/rest/services',
    addresses: '/Addresses/FeatureServer',
    bikePaths: '/BikePaths/MapServer',
    boundary: '/Boundary/MapServer',
    capitalProjects: '/CapitalImprovementProjects/MapServer',
    councilDistricts: '/CouncilDistricts/FeatureServer',
    culturalAssets: '/CulturalAssets/MapServer',
    developmentReview: '/DevelopmentReview/MapServer',
    fiberLines: '/FiberLines/MapServer',
    historicDistrict: '/HistoricDistrict/MapServer',
    hpcProperties: '/HPC_Properties/FeatureServer',
    leadServiceLines: '/LeadServiceLines/MapServer',
    nacs: '/Nacs/FeatureServer',
    parcels: '/Parcels/MapServer',
    pathPlan: '/PathPlan/MapServer',
    places: '/Places/MapServer',
    sidewalks: '/Sidewalks/MapServer',
    sinkholes: '/Sinkholes/MapServer',
    snowRemoval: '/SnowRemoval/FeatureServer',
    water: '/Water/MapServer',
    sewer: '/Sewer/MapServer',
    storm: '/Storm/MapServer',
    zoning: '/Zoning/MapServer',
    geocoder: '/COFLocator/GeocodeServer',
  },

  // ==========================================
  // ARCGIS ONLINE HOSTED SERVICES
  // ==========================================
  agol: {
    base: 'https://services5.arcgis.com/o8KSxSzYaulbGcFX/arcgis/rest/services',
    trails: '/Trails/FeatureServer',
    countyParkBoundaries: '/County_Park_Boundaries/FeatureServer',
    historicCemeteries: '/HistoricCemeteries/FeatureServer',
    historicSites: '/HistoricSitesLayer/FeatureServer',
    historicRoads: '/Historic_Roads/FeatureServer',
    roadClosuresActive: '/RoadClosures_active_public/FeatureServer',
    medicalFacilities: '/MedicalFacilities_public/FeatureServer',
    foodDistribution: '/Food_Distribution_Sites/FeatureServer',
    shelters: '/FCShelters/FeatureServer',
    floodEvents: '/Flood_Events/FeatureServer',
    schoolDistricts: '/SchoolDistricts_public/FeatureServer',
    streams: '/Streams_Shapefile/FeatureServer',
  },

  // ==========================================
  // WEATHER (No API key needed)
  // ==========================================
  weather: {
    forecast: 'https://api.weather.gov/gridpoints/LWX/80,93/forecast',
    hourly: 'https://api.weather.gov/gridpoints/LWX/80,93/forecast/hourly',
    alerts: 'https://api.weather.gov/alerts/active?zone=MDZ004',
    stations: 'https://api.weather.gov/gridpoints/LWX/80,93/stations',
  },

  // ==========================================
  // USGS WATER (No API key needed)
  // ==========================================
  water: {
    base: 'https://waterservices.usgs.gov/nwis/iv/',
    gauges: ['01642190', '01643000', '01643500', '01639000'],
  },

  // ==========================================
  // MARYLAND CHART TRAFFIC (No API key needed)
  // ==========================================
  traffic: {
    incidents: 'https://chart.maryland.gov/DataFeeds/GetIncidentXml',
    closures: 'https://chart.maryland.gov/DataFeeds/GetClosureXml',
    cameras: 'https://chart.maryland.gov/DataFeeds/GetCamerasXml',
    weatherStations: 'https://chart.maryland.gov/DataFeeds/GetRwisXml',
    messageSigns: 'https://chart.maryland.gov/DataFeeds/GetDmsXml',
    speedSensors: 'https://chart.maryland.gov/DataFeeds/GetTssXml',
    snowEmergency: 'https://chart.maryland.gov/DataFeeds/GetSepXml',
  },

  // ==========================================
  // SEECLICKFIX 311 (No API key needed)
  // ==========================================
  seeClickFix: {
    countyIssues: 'https://seeclickfix.com/api/v2/issues?place_url=frederick-county&per_page=100',
    cityIssues: 'https://seeclickfix.com/api/v2/issues?place_url=frederick&per_page=100',
    byLocation: 'https://seeclickfix.com/api/v2/issues?lat=39.4143&lng=-77.4105&per_page=100',
  },

  // ==========================================
  // MARYLAND STATE DATA (Socrata / SODA API)
  // ==========================================
  marylandOpenData: {
    propertyAssessments: 'https://opendata.maryland.gov/resource/gx8c-a963.json',
    cityPermits: 'https://opendata.maryland.gov/resource/xrz3-9xhj.json',
    codeViolations: 'https://opendata.maryland.gov/resource/fqwk-5r78.json',
    covidByCounty: 'https://opendata.maryland.gov/resource/tm86-dujs.json',
  },

  // ==========================================
  // MARYLAND STATE GIS
  // ==========================================
  marylandGIS: {
    transitStops: 'https://mdgeodata.md.gov/imap/rest/services/Transportation/MD_LocalTransit/FeatureServer/16',
    transitRoutes: 'https://mdgeodata.md.gov/imap/rest/services/Transportation/MD_LocalTransit/FeatureServer/17',
    parcelBoundaries: 'https://geodata.md.gov/imap/rest/services/PlanningCadastre/MD_ParcelBoundaries/MapServer',
  },

  // ==========================================
  // NPS PARKS (Free API key required)
  // ==========================================
  nps: {
    base: 'https://developer.nps.gov/api/v1',
    parkCodes: ['cato', 'choh', 'mono'],
    // cato = Catoctin Mountain Park
    // choh = C&O Canal National Historical Park
    // mono = Monocacy National Battlefield
  },

  // ==========================================
  // CENSUS (Free API key optional)
  // ==========================================
  census: {
    acs5: 'https://api.census.gov/data/2023/acs/acs5',
    state: '24',
    county: '021',
  },

  // ==========================================
  // PARKING
  // ==========================================
  parking: {
    parkMobileZones: { start: 1601, end: 1640 },
    garages: [
      { name: 'Church Street Garage', lat: 39.4148, lng: -77.4112, address: '18 W Church St' },
      { name: 'Court Street Garage', lat: 39.4141, lng: -77.4088, address: '100 W Patrick St' },
      { name: 'Carroll Creek Garage', lat: 39.4122, lng: -77.4098, address: '44 E All Saints St' },
      { name: 'West Patrick Street Garage', lat: 39.4145, lng: -77.4135, address: '225 W Patrick St' },
      { name: 'East All Saints Garage', lat: 39.4118, lng: -77.4065, address: '100 E All Saints St' },
    ],
  },

  // ==========================================
  // CITY RSS FEEDS
  // ==========================================
  cityRSS: {
    base: 'https://www.cityoffrederickmd.gov/RSSFeed.aspx',
    feeds: {
      cityCalendar: '?ModID=58&CID=City-of-Frederick-Calendar-14',
      parksCalendar: '?ModID=58&CID=Parks-Recreation-Calendar-27',
      planningCalendar: '?ModID=58&CID=Planning-Calendar-26',
      policeCalendar: '?ModID=58&CID=Police-Department-Calendar-22',
      news: '?ModID=1&CID=Frederick-News-1',
      policeNews: '?ModID=1&CID=Police-News-5',
      sportsFieldClosures: '?ModID=1&CID=Sports-Field-Closures-10',
      emergencies: '?ModID=63&CID=City-Emergencies-4',
      jobs: '?ModID=66&CID=FullTime-95',
    },
  },
} as const;
