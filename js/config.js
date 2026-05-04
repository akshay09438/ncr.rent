// delhi.rent — Configuration
// Replace these values with your actual API keys

export const CONFIG = {
  // Supabase
  SUPABASE_URL:    'https://jbtsojxxryvanyxxdcxt.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidHNvanh4cnl2YW55eHhkY3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDI4MDQsImV4cCI6MjA5MzI3ODgwNH0.4UtxxySLmrO0GfnxsjjII_rFjlRhWZKxhgy3Xyf4fno',

  // Google Maps
  // Enable: Maps JavaScript API, Places API in Google Cloud Console
  GOOGLE_MAPS_KEY: 'AIzaSyAYWTVV8wHpjQMDLX388HFp2duaNB_BoJU',   // e.g. AIzaSy...

  // App constants
  MAP_CENTER: { lat: 28.4595, lng: 77.0266 }, // Gurgaon centre
  MAP_ZOOM: 12,
  PIN_CLUSTER_ZOOM: 14,                       // Start clustering below this zoom

  // Pin colours
  PIN_COLORS: {
    rental_gated:   '#22c55e', // green
    rental_open:    '#f97316', // orange
    seeker:         '#3b82f6', // blue
    flatmate:       '#7c3aed', // purple
    cluster:        '#7c3aed', // purple
  },

  // Pin sizes (px diameter)
  PIN_SIZE: 20,
  CLUSTER_SIZE: 40,

  // DMRC Metro line colours
  METRO_LINES: {
    red:    '#ee2d24',
    blue:   '#3b82f6',
    green:  '#a3e635',
    yellow: '#06b6d4',
    orange: '#f59e0b',
    violet: '#7c3aed',
    pink:   '#f97316',
    magenta:'#84cc16',
    grey:   '#6b7280',
    rapid:  '#0ea5e9', // Rapid Metro Gurgaon
  },

  // AQI colours
  AQI_COLORS: {
    good:         '#22c55e', // 0-50
    moderate:     '#facc15', // 51-100
    unhealthy_sg: '#f97316', // 101-200
    unhealthy:    '#ef4444', // 201-300
    very_unhealthy:'#7c3aed', // 301-500
  },

  // NCR Commute hubs (lat, lng, label)
  COMMUTE_HUBS: [
    { id: 'cyber_hub',     label: 'Cyber Hub, Gurgaon',    lat: 28.4956, lng: 77.0966 },
    { id: 'cp',            label: 'Connaught Place, Delhi', lat: 28.6329, lng: 77.2199 },
    { id: 'noida_sec62',   label: 'Noida Sector 62',       lat: 28.6065, lng: 77.3649 },
    { id: 'saket',         label: 'Saket, Delhi',          lat: 28.5243, lng: 77.2069 },
    { id: 'dwarka',        label: 'Dwarka Sector 21',      lat: 28.5682, lng: 77.0728 },
  ],

  // NCR Expressways (coordinates for polylines)
  EXPRESSWAYS: {
    nh48: {
      label: 'NH-48 (Delhi–Jaipur)',
      color: '#a78bfa',
      // Approximate waypoints along NH-48 through Gurgaon
      path: [
        { lat: 28.5700, lng: 76.9500 },
        { lat: 28.5300, lng: 77.0100 },
        { lat: 28.4950, lng: 77.0700 },
        { lat: 28.4700, lng: 77.1200 },
        { lat: 28.4400, lng: 77.1700 },
        { lat: 28.4100, lng: 77.2200 },
      ],
    },
    dwarka_exp: {
      label: 'Dwarka Expressway',
      color: '#38bdf8',
      path: [
        { lat: 28.6100, lng: 76.9900 },
        { lat: 28.5900, lng: 77.0200 },
        { lat: 28.5650, lng: 77.0500 },
        { lat: 28.5450, lng: 77.0700 },
        { lat: 28.5200, lng: 77.0900 },
        { lat: 28.4900, lng: 77.1000 },
      ],
    },
    yamuna_exp: {
      label: 'Yamuna Expressway',
      color: '#4ade80',
      path: [
        { lat: 28.5800, lng: 77.5000 },
        { lat: 28.5600, lng: 77.4200 },
        { lat: 28.5400, lng: 77.3300 },
        { lat: 28.5200, lng: 77.2600 },
        { lat: 28.5000, lng: 77.2000 },
      ],
    },
  },

  // NCR Sector labels
  SECTOR_LABELS: {
    gurgaon: [
      { name: 'Sector 14', lat: 28.4597, lng: 77.0266 },
      { name: 'Sector 15', lat: 28.4648, lng: 77.0361 },
      { name: 'Sector 17', lat: 28.4690, lng: 77.0185 },
      { name: 'Sector 21', lat: 28.4698, lng: 77.0476 },
      { name: 'Sector 22', lat: 28.4713, lng: 77.0346 },
      { name: 'Sector 23', lat: 28.4746, lng: 77.0439 },
      { name: 'Sector 28', lat: 28.4832, lng: 77.0515 },
      { name: 'Sector 29', lat: 28.4870, lng: 77.0411 },
      { name: 'Sector 30', lat: 28.4910, lng: 77.0320 },
      { name: 'Sector 31', lat: 28.4950, lng: 77.0400 },
      { name: 'Sector 39', lat: 28.4550, lng: 77.0650 },
      { name: 'Sector 40', lat: 28.4500, lng: 77.0550 },
      { name: 'Sector 44', lat: 28.4440, lng: 77.0550 },
      { name: 'Sector 45', lat: 28.4420, lng: 77.0470 },
      { name: 'Sector 46', lat: 28.4400, lng: 77.0380 },
      { name: 'Sector 47', lat: 28.4350, lng: 77.0520 },
      { name: 'Sector 48', lat: 28.4300, lng: 77.0600 },
      { name: 'Sector 49', lat: 28.4230, lng: 77.0570 },
      { name: 'Sector 50', lat: 28.4170, lng: 77.0510 },
      { name: 'Sector 51', lat: 28.4130, lng: 77.0620 },
      { name: 'Sector 52', lat: 28.4090, lng: 77.0730 },
      { name: 'Sector 53', lat: 28.4050, lng: 77.0670 },
      { name: 'Sector 54', lat: 28.4000, lng: 77.0600 },
      { name: 'Sector 55', lat: 28.3950, lng: 77.0530 },
      { name: 'Sector 56', lat: 28.3900, lng: 77.0460 },
      { name: 'Sector 57', lat: 28.3850, lng: 77.0390 },
      { name: 'Sector 58', lat: 28.3800, lng: 77.0320 },
      { name: 'Sector 59', lat: 28.3750, lng: 77.0250 },
      { name: 'Sector 60', lat: 28.3700, lng: 77.0180 },
      { name: 'Sector 61', lat: 28.3650, lng: 77.0110 },
      { name: 'Sector 62', lat: 28.3600, lng: 77.0040 },
      { name: 'Sector 63', lat: 28.3550, lng: 76.9970 },
      { name: 'Sector 66', lat: 28.4250, lng: 77.0820 },
      { name: 'Sector 67', lat: 28.4180, lng: 77.0900 },
      { name: 'Sector 69', lat: 28.4080, lng: 77.1000 },
      { name: 'Sector 70', lat: 28.4000, lng: 77.0950 },
      { name: 'Sector 71', lat: 28.3930, lng: 77.0880 },
      { name: 'Sector 72', lat: 28.3860, lng: 77.0810 },
      { name: 'Sector 73', lat: 28.3790, lng: 77.0740 },
      { name: 'Sector 74', lat: 28.3720, lng: 77.0670 },
      { name: 'Sector 75', lat: 28.3650, lng: 77.0600 },
      { name: 'Sector 76', lat: 28.3580, lng: 77.0530 },
      { name: 'Sector 77', lat: 28.3510, lng: 77.0460 },
      { name: 'Sector 78', lat: 28.3440, lng: 77.0390 },
      { name: 'Sector 82', lat: 28.3950, lng: 77.1100 },
      { name: 'Sector 83', lat: 28.3880, lng: 77.1180 },
      { name: 'Sector 84', lat: 28.3810, lng: 77.1260 },
      { name: 'Sector 85', lat: 28.3740, lng: 77.1340 },
      { name: 'DLF Phase 1', lat: 28.4713, lng: 77.0759 },
      { name: 'DLF Phase 2', lat: 28.4671, lng: 77.0982 },
      { name: 'DLF Phase 3', lat: 28.4599, lng: 77.1107 },
      { name: 'DLF Phase 4', lat: 28.4530, lng: 77.1040 },
      { name: 'DLF Phase 5', lat: 28.4430, lng: 77.0970 },
      { name: 'MG Road',    lat: 28.4756, lng: 77.0705 },
      { name: 'Udyog Vihar', lat: 28.4897, lng: 77.0485 },
    ],
    noida: [
      { name: 'Sector 1',   lat: 28.6437, lng: 77.3562 },
      { name: 'Sector 2',   lat: 28.6395, lng: 77.3610 },
      { name: 'Sector 3',   lat: 28.6353, lng: 77.3658 },
      { name: 'Sector 15',  lat: 28.6065, lng: 77.3549 },
      { name: 'Sector 18',  lat: 28.5987, lng: 77.3498 },
      { name: 'Sector 21',  lat: 28.5912, lng: 77.3460 },
      { name: 'Sector 22',  lat: 28.5845, lng: 77.3500 },
      { name: 'Sector 25',  lat: 28.5790, lng: 77.3400 },
      { name: 'Sector 37',  lat: 28.5695, lng: 77.3330 },
      { name: 'Sector 44',  lat: 28.5620, lng: 77.3400 },
      { name: 'Sector 50',  lat: 28.5555, lng: 77.3480 },
      { name: 'Sector 51',  lat: 28.5500, lng: 77.3550 },
      { name: 'Sector 52',  lat: 28.5445, lng: 77.3620 },
      { name: 'Sector 55',  lat: 28.5360, lng: 77.3690 },
      { name: 'Sector 62',  lat: 28.5982, lng: 77.3629 },
      { name: 'Sector 63',  lat: 28.5920, lng: 77.3680 },
      { name: 'Sector 100', lat: 28.5750, lng: 77.3250 },
      { name: 'Sector 125', lat: 28.5500, lng: 77.3100 },
      { name: 'Sector 137', lat: 28.5300, lng: 77.2950 },
    ],
    delhi: [
      { name: 'Lajpat Nagar',  lat: 28.5684, lng: 77.2436 },
      { name: 'Saket',         lat: 28.5243, lng: 77.2069 },
      { name: 'Vasant Kunj',   lat: 28.5175, lng: 77.1587 },
      { name: 'Hauz Khas',     lat: 28.5488, lng: 77.2012 },
      { name: 'Malviya Nagar', lat: 28.5379, lng: 77.2072 },
      { name: 'Rohini',        lat: 28.7169, lng: 77.1147 },
      { name: 'Dwarka',        lat: 28.5871, lng: 77.0461 },
      { name: 'Janakpuri',     lat: 28.6210, lng: 77.0856 },
      { name: 'Paharganj',     lat: 28.6446, lng: 77.2121 },
      { name: 'Karol Bagh',    lat: 28.6519, lng: 77.1908 },
      { name: 'Lajpat Nagar',  lat: 28.5684, lng: 77.2436 },
      { name: 'Greater Kailash', lat: 28.5451, lng: 77.2347 },
      { name: 'CR Park',      lat: 28.5510, lng: 77.2518 },
      { name: 'Nehru Place',  lat: 28.5503, lng: 77.2519 },
      { name: 'Okhla',        lat: 28.5357, lng: 77.2710 },
      { name: 'Govindpuri',    lat: 28.5300, lng: 77.2640 },
      { name: 'Jasola',       lat: 28.5350, lng: 77.2860 },
      { name: 'Sarita Vihar', lat: 28.5300, lng: 77.2950 },
      { name: 'Munirka',      lat: 28.5472, lng: 77.1760 },
      { name: 'R K Puram',     lat: 28.5651, lng: 77.1727 },
      { name: 'Vasant Vihar',  lat: 28.5580, lng: 77.1570 },
    ],
  },

  // WAQI API (free, no key needed for /feed endpoint)
  WAQI_BASE_URL: 'https://api.waqi.info/feed',

  // Spam prevention
  MAX_PINS_PER_DEVICE_PER_DAY: 3,
  MIN_MS_BETWEEN_PIN_SUBMISSIONS: 30000, // 30 seconds

  // Cluster appearance
  CLUSTER_STYLES: [
    { width: 40, height: 40, background: '#7c3aed', border: '#a78bfa', fontSize: 12 },
    { width: 50, height: 50, background: '#6d28d9', border: '#a78bfa', fontSize: 13 },
    { width: 60, height: 60, background: '#5b21b6', border: '#c4b5fd', fontSize: 14 },
  ],
};
