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
    gauges: [
      '01637500', // Catoctin Creek near Middletown
      '01638500', // Potomac River at Point of Rocks
      '01639000', // Monocacy River at Bridgeport
      '01642190', // Monocacy River at Monocacy Blvd
      '01642198', // Carroll Creek near Frederick
      '01642600', // Linganore Creek near Frederick
      '01643000', // Monocacy River at Jug Bridge
      '01643500', // Bennett Creek at Park Mills
      '01643580', // Monocacy River near Dickerson
    ],
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
    // Property & Development
    propertyAssessments: 'https://opendata.maryland.gov/resource/gx8c-a963.json',
    cityPermits: 'https://opendata.maryland.gov/resource/xrz3-9xhj.json',
    codeViolations: 'https://opendata.maryland.gov/resource/fqwk-5r78.json',
    // Crime (1975-present, no key)
    crimeByCounty: 'https://opendata.maryland.gov/resource/jwfa-fdxs.json',
    crimeByMunicipality: 'https://opendata.maryland.gov/resource/2p5g-xrcb.json',
    // Health
    covidByCounty: 'https://opendata.maryland.gov/resource/tm86-dujs.json',
    overdoseDeaths: 'https://opendata.maryland.gov/resource/7zt7-r3mk.json',
    // Education
    compareCountiesEducation: 'https://opendata.maryland.gov/resource/63pe-mygy.json',
    schoolEnrollmentTrends: 'https://opendata.maryland.gov/resource/9ju3-j8k6.json',
    // Employment
    employmentByNAICS: 'https://opendata.maryland.gov/resource/hfcr-yjui.json',
    // Geology
    geologicFormations: 'https://opendata.maryland.gov/resource/3gdg-5gqr.json',
    geologicContacts: 'https://opendata.maryland.gov/resource/7x8t-qb4u.json',
    // Transit
    transitRoutesSocrata: 'https://opendata.maryland.gov/resource/2xca-jw6k.json',
    transitStopsSocrata: 'https://opendata.maryland.gov/resource/79ua-svwj.json',
    // Environment (MDE)
    wsaCompliance: 'https://opendata.maryland.gov/resource/hxmu-urvx.json',
    wsaComplaints: 'https://opendata.maryland.gov/resource/cnkn-n3pr.json',
    wsaViolations: 'https://opendata.maryland.gov/resource/jwx7-mgcz.json',
    dischargePermitsNoncompliance: 'https://opendata.maryland.gov/resource/cvuy-zwt6.json',
    envJusticeScreening: 'https://opendata.maryland.gov/resource/qa85-tv68.json',
  },

  // ==========================================
  // MARYLAND STATE GIS (iMAP — 120+ services)
  // Base: https://mdgeodata.md.gov/imap/rest/services
  // ==========================================
  marylandGIS: {
    base: 'https://mdgeodata.md.gov/imap/rest/services',
    // Transportation
    transitStops: '/Transportation/MD_LocalTransit/FeatureServer/16',
    transitRoutes: '/Transportation/MD_LocalTransit/FeatureServer/17',
    trafficCameras: '/Transportation/MD_TrafficCameras/FeatureServer',
    altFuelStations: '/Transportation/MD_AlternativeFuel/FeatureServer',
    parkAndRide: '/Transportation/MD_MDOTSHAParkandRideFacilities/FeatureServer',
    aadt: '/Transportation/MD_AnnualAverageDailyTraffic/FeatureServer',
    // Boundaries
    politicalBoundaries: '/Boundaries/MD_PoliticalBoundaries/FeatureServer',
    electionBoundaries: '/Boundaries/MD_ElectionBoundaries/FeatureServer',
    // Planning
    parcelBoundaries: '/PlanningCadastre/MD_ParcelBoundaries/MapServer',
    buildingFootprints: '/PlanningCadastre/MD_BuildingFootprints/MapServer',
    landUseLandCover: '/PlanningCadastre/MD_LandUseLandCover/MapServer',
    priorityFundingAreas: '/PlanningCadastre/MD_PriorityFundingAreas/FeatureServer',
    // Public Safety
    policeStations: '/PublicSafety/MD_Police/FeatureServer',
    fireStations: '/PublicSafety/MD_Fire/FeatureServer',
    emsStations: '/PublicSafety/MD_EMS/FeatureServer',
    // Health
    hospitals: '/Health/MD_Hospitals/FeatureServer',
    assistedLiving: '/Health/MD_LongTermCareAssistedLiving/FeatureServer',
    vitalStatistics: '/Health/MD_VitalStatistics/FeatureServer',
    // Environment
    protectedLands: '/Environment/MD_ProtectedLands/FeatureServer',
    enviroScreen: '/Environment/MD_EnviroScreen/FeatureServer',
    climateVulnerability: '/Environment/MD_Climate_Vulnerability_Score/FeatureServer',
    // Hydrology
    streamHealth: '/Hydrology/MD_StreamHealth/FeatureServer',
    floodplain: '/Hydrology/MD_Floodplain/FeatureServer',
    gauges: '/Hydrology/MD_Gauges/FeatureServer',
    // Biota
    greenInfrastructure: '/Biota/MD_GreenInfrastructure/FeatureServer',
    biodiversity: '/Biota/MD_BiodiversityConservationNetwork/FeatureServer',
    // Education
    educationFacilities: '/Education/MD_EducationFacilities/FeatureServer',
    libraries: '/Education/MD_Libraries/FeatureServer',
    // Business
    localBusinesses: '/BusinessEconomy/MD_LocalBusinesses/FeatureServer',
    incentiveZones: '/BusinessEconomy/MD_IncentiveZones/FeatureServer',
    // Historic
    historicProperties: '/Historic/MD_InventoryHistoricProperties/FeatureServer',
    nationalRegister: '/Historic/MD_NationalRegisterHistoricPlaces/FeatureServer',
    // Demographics
    acs: '/Demographics/MD_AmericanCommunitySurvey/FeatureServer',
    censusBoundaries: '/Demographics/MD_CensusBoundaries/MapServer',
    // Recreation
    recreationalUses: '/Society/MD_RecreationalUses/FeatureServer',
    // Broadband
    broadbandProviders: '/UtilityTelecom/MD_BroadbandProviderPerCensusBlock/MapServer',
  },

  // ==========================================
  // MARC TRAIN REAL-TIME (No key needed)
  // ==========================================
  marc: {
    gtfsStatic: 'https://feeds.mta.maryland.gov/gtfs/marc',
    gtfsRtTripUpdates: 'https://mdotmta-gtfs-rt.s3.amazonaws.com/MARC+RT/marc-tu.pb',
    gtfsRtVehiclePositions: 'https://mdotmta-gtfs-rt.s3.amazonaws.com/MARC+RT/marc-vp.pb',
    serviceAlerts: 'https://feeds.mta.maryland.gov/alerts.pb',
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
    cbp: 'https://api.census.gov/data/2022/cbp', // County Business Patterns
    dec2020: 'https://api.census.gov/data/2020/dec/pl', // Decennial
    tiger: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/',
    state: '24',
    county: '021',
    // Key variables: B01003_001E (pop), B19013_001E (median income),
    // B25077_001E (home value), B01002_001E (median age), B25001_001E (housing units)
    // Frederick County 2023: Pop=280,341 | Income=$120,458 | Home=$437,700 | Age=38.9
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

  // ==========================================
  // FEMA (No API key needed)
  // ==========================================
  fema: {
    disasters: 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state eq \'MD\' and designatedArea eq \'Frederick (County)\'&$top=100',
    floodHazard: 'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer',
    // 23 disaster declarations for Frederick County (1971-2026)
  },

  // ==========================================
  // BLS EMPLOYMENT (Free key optional)
  // ==========================================
  bls: {
    base: 'https://api.bls.gov/publicAPI/v2/timeseries/data/',
    series: {
      unemploymentRate: 'LAUCN240210000000003',
      unemployedPersons: 'LAUCN240210000000004',
      employedPersons: 'LAUCN240210000000005',
      laborForce: 'LAUCN240210000000006',
    },
  },

  // ==========================================
  // FBI CRIME DATA (Free API key required)
  // ==========================================
  fbi: {
    base: 'https://api.usa.gov/crime/fbi/sapi/',
    // Requires key from https://api.data.gov/signup/
  },

  // ==========================================
  // USDA FOOD ACCESS / SNAP
  // ==========================================
  usda: {
    foodAccess: 'https://gisportal.ers.usda.gov/server/rest/services/FARA/FARA_2019/MapServer',
    snapBenefits: 'https://gisportal.ers.usda.gov/server/rest/services/SNAP/SNAP_Benefits/MapServer',
    soilData: 'https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest',
  },

  // ==========================================
  // HUD HOUSING (Free key required)
  // ==========================================
  hud: {
    fairMarketRents: 'https://www.huduser.gov/hudapi/public/fmr/data/24021',
    incomeLimits: 'https://www.huduser.gov/hudapi/public/il/data/24021',
  },

  // ==========================================
  // NOAA CLIMATE (Free key required for CDO)
  // ==========================================
  noaa: {
    climateData: 'https://www.ncei.noaa.gov/cdo-web/api/v2/data?locationid=FIPS:24021',
    stormEvents: 'https://www.ncei.noaa.gov/stormevents/',
  },

  // ==========================================
  // USASPENDING (No key needed)
  // ==========================================
  usaspending: {
    base: 'https://api.usaspending.gov/api/v2/',
    // POST to /search/spending_by_geography/ with county FIPS 24021
  },

  // ==========================================
  // KEY IDENTIFIERS
  // ==========================================
  identifiers: {
    fips: '24021',
    state: '24',
    county: '021',
    nwsGrid: 'LWX/81,93',
    nwsCountyZone: 'MDC021',
    nwsForecastZone: 'MDZ004',
    radar: 'KLWX',
    femadfirm: '24021C',
    blsPrefix: 'LAUCN24021000000000',
    airport: 'KFDK',
    centroid: { lat: 39.4721, lng: -77.3980 },
  },
} as const;
