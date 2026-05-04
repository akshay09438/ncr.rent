// delhi.rent — DMRC Metro Lines (all phases + Rapid Metro Gurgaon)

import { CONFIG } from './config.js';

const DMRC_LINES = {
  red: {
    label: 'Red Line',
    color: CONFIG.METRO_LINES.red,
    stations: [
      // Shaheed Stadium to Red Line extension
      { name: 'Shaheed Stadium',       lat: 28.6505, lng: 77.2384 },
      { name: 'Pradeep Kumar',         lat: 28.6398, lng: 77.2197 },
      { name: 'Anand Vihar',           lat: 28.6464, lng: 77.3153 },
      { name: 'Kashmere Gate',         lat: 28.6680, lng: 77.2080 },
      { name: 'Tis Hazari',            lat: 28.6724, lng: 77.2012 },
      { name: 'Pul Bangash',           lat: 28.6770, lng: 77.1951 },
      { name: 'Pratap Nagar',          lat: 28.6813, lng: 77.1889 },
      { name: 'Shastri Nagar',         lat: 28.6849, lng: 77.1825 },
      { name: 'Inderlok',              lat: 28.6891, lng: 77.1758 },
      { name: 'Kanhiya Nagar',         lat: 28.6937, lng: 77.1696 },
      { name: 'Keshav Puram',         lat: 28.6983, lng: 77.1633 },
      { name: 'Netaji Nagar',          lat: 28.7024, lng: 77.1577 },
      { name: 'Barwala',              lat: 28.7070, lng: 77.1500 },
      { name: 'Rohini Sec 16',        lat: 28.7121, lng: 77.1435 },
      { name: 'Rohini Sec 17',        lat: 28.7171, lng: 77.1380 },
      { name: 'Rohini East',           lat: 28.7206, lng: 77.1320 },
      { name: 'Jahangirpuri',         lat: 28.7256, lng: 77.1243 },
    ],
  },
  blue: {
    label: 'Blue Line',
    color: CONFIG.METRO_LINES.blue,
    stations: [
      { name: 'Dwarka Sec 21',        lat: 28.5682, lng: 77.0728 },
      { name: 'Dwarka Sec 8',          lat: 28.5741, lng: 77.0490 },
      { name: 'Dwarka Sec 9',          lat: 28.5765, lng: 77.0367 },
      { name: 'Dwarka Sec 12',         lat: 28.5772, lng: 77.0226 },
      { name: 'Dwarka Sec 11',        lat: 28.5765, lng: 77.0085 },
      { name: 'Dwarka Sec 10',         lat: 28.5769, lng: 76.9950 },
      { name: 'Dwarka Sec 9',          lat: 28.5787, lng: 76.9799 },
      { name: 'Dwarka Sec 6',          lat: 28.5817, lng: 76.9654 },
      { name: 'Dwarka Sec 5',          lat: 28.5873, lng: 76.9559 },
      { name: 'Dwarka Sec 3',          lat: 28.5920, lng: 76.9473 },
      { name: 'Dwarka Sec 2',          lat: 28.5980, lng: 76.9444 },
      { name: 'Dwarka Sec 1',         lat: 28.6025, lng: 76.9444 },
      { name: 'Nangli',               lat: 28.6089, lng: 76.9407 },
      { name: 'Najafgarh',            lat: 28.6095, lng: 76.9254 },
      { name: 'Janakpuri East',       lat: 28.6210, lng: 77.0856 },
      { name: 'Janakpuri West',        lat: 28.6278, lng: 77.0828 },
      { name: 'Uttam Nagar East',     lat: 28.6189, lng: 77.0638 },
      { name: 'Uttam Nagar West',      lat: 28.6176, lng: 77.0512 },
      { name: 'Rajouri Garden',        lat: 28.6431, lng: 77.1230 },
      { name: 'Ramesh Nagar',         lat: 28.6465, lng: 77.1315 },
      { name: 'Moti Nagar',           lat: 28.6506, lng: 77.1413 },
      { name: 'Kirti Nagar',          lat: 28.6556, lng: 77.1498 },
      { name: 'Shadipur',             lat: 28.6576, lng: 77.1581 },
      { name: 'Patel Nagar',          lat: 28.6511, lng: 77.1698 },
      { name: 'Rajendra Place',       lat: 28.6471, lng: 77.1785 },
      { name: 'Karol Bagh',           lat: 28.6519, lng: 77.1908 },
      { name: 'Jhandewalan',          lat: 28.6476, lng: 77.2004 },
      { name: 'Ramakrishna Ashram',   lat: 28.6448, lng: 77.2101 },
      { name: 'Rajiv Chowk',          lat: 28.6329, lng: 77.2199 },
      { name: 'Barakhamba Road',     lat: 28.6259, lng: 77.2263 },
      { name: 'Mandi House',          lat: 28.6205, lng: 77.2325 },
      { name: 'Supreme Court',        lat: 28.6156, lng: 77.2373 },
      { name: 'Pragati Maidan',       lat: 28.6107, lng: 77.2440 },
      { name: 'Indraprastha',         lat: 28.6049, lng: 77.2516 },
      { name: 'Yamuna Bank',          lat: 28.5972, lng: 77.2639 },
      { name: 'Akshardham',           lat: 28.5915, lng: 77.2724 },
      { name: 'Mayur Vihar Ext',      lat: 28.5852, lng: 77.2797 },
      { name: 'Mayur Vihar-I',        lat: 28.5794, lng: 77.2851 },
      { name: 'Sarita Vihar',         lat: 28.5653, lng: 77.2934 },
      { name: 'Jasola Apollo',        lat: 28.5562, lng: 77.2899 },
      { name: 'Kalindi Kunj',         lat: 28.5514, lng: 77.2959 },
      { name: 'Noida City Centre',     lat: 28.5703, lng: 77.3487 },
      { name: 'Golf Course',          lat: 28.5733, lng: 77.3370 },
      { name: 'Noida Sector 34',      lat: 28.5760, lng: 77.3250 },
      { name: 'Noida Sector 27',      lat: 28.5768, lng: 77.3135 },
      { name: 'Noida Sector 25',      lat: 28.5780, lng: 77.3025 },
      { name: 'Noida Sector 18',      lat: 28.5824, lng: 77.2940 },
      { name: 'Botanical Garden',     lat: 28.5875, lng: 77.3053 },
      { name: 'Okhla Bird Sanctuary', lat: 28.5750, lng: 77.3180 },
    ],
  },
  green: {
    label: 'Green Line',
    color: CONFIG.METRO_LINES.green,
    stations: [
      { name: 'Kirti Nagar',          lat: 28.6556, lng: 77.1498 },
      { name: 'Ashok Park Main',      lat: 28.6622, lng: 77.1486 },
      { name: 'Punjabi Bagh West',    lat: 28.6685, lng: 77.1413 },
      { name: 'Punjabi Bagh East',    lat: 28.6711, lng: 77.1325 },
      { name: 'Shalimar Bagh',        lat: 28.6810, lng: 77.1262 },
      { name: 'Badli Mor',           lat: 28.6938, lng: 77.1181 },
      { name: 'Jahangirpuri',        lat: 28.7256, lng: 77.1243 },
    ],
  },
  yellow: {
    label: 'Yellow Line (Rapid Metro Gurgaon)',
    color: CONFIG.METRO_LINES.yellow,
    stations: [
      // Delhi Yellow Line
      { name: 'Samaypur Badli',       lat: 28.7405, lng: 77.1272 },
      { name: 'Rohini Sec 22',        lat: 28.7343, lng: 77.1302 },
      { name: 'Vishwavidyalaya',      lat: 28.7276, lng: 77.1369 },
      { name: 'Vidya Market',          lat: 28.7200, lng: 77.1415 },
      { name: 'Jahangirpuri',         lat: 28.7136, lng: 77.1465 },
      { name: 'Civil Lines',          lat: 28.6955, lng: 77.1712 },
      { name: 'Kashmere Gate',        lat: 28.6680, lng: 77.2080 },
      { name: 'Chandni Chowk',        lat: 28.6569, lng: 77.2278 },
      { name: 'Chawri Bazar',         lat: 28.6522, lng: 77.2344 },
      { name: 'New Delhi',            lat: 28.6441, lng: 77.2169 },
      { name: 'Rajiv Chowk',         lat: 28.6329, lng: 77.2199 },
      { name: 'CK Birla',            lat: 28.6271, lng: 77.2195 },
      { name: 'Jor Bagh',            lat: 28.6206, lng: 77.2188 },
      { name: 'INA',                 lat: 28.5872, lng: 77.2078 },
      { name: 'AIIMS',              lat: 28.5691, lng: 77.2078 },
      { name: 'Gulmohar Park',       lat: 28.5524, lng: 77.2048 },
      { name: 'Hauz Khas',           lat: 28.5488, lng: 77.2012 },
      { name: 'Malviya Nagar',       lat: 28.5379, lng: 77.2072 },
      { name: 'Saket',               lat: 28.5243, lng: 77.2069 },
      { name: 'Qutab Minar',         lat: 28.5161, lng: 77.2092 },
      { name: 'Chhattarpur',         lat: 28.5036, lng: 77.2173 },
      { name: 'Sultanpur',           lat: 28.4909, lng: 77.2210 },
      { name: 'Gurgaon',             lat: 28.4785, lng: 77.2252 },
      // Rapid Metro Gurgaon
      { name: 'Sector 53-54',        lat: 28.4785, lng: 77.2399 },
      { name: 'Sector 54',           lat: 28.4748, lng: 77.2523 },
      { name: 'Sector 55-56',         lat: 28.4717, lng: 77.2649 },
      { name: 'DLF Phase 1',         lat: 28.4713, lng: 77.0759 },
      { name: 'Sikanderpur',         lat: 28.4681, lng: 77.2805 },
      { name: 'DLF Phase 2',         lat: 28.4671, lng: 77.0982 },
    ],
  },
  orange: {
    label: 'Orange Line (Airport Express)',
    color: CONFIG.METRO_LINES.orange,
    stations: [
      { name: 'New Delhi',            lat: 28.6441, lng: 77.2169 },
      { name: 'Shivaji Stadium',     lat: 28.6372, lng: 77.2083 },
      { name: 'Dhaula Kuan',         lat: 28.6243, lng: 77.1973 },
      { name: 'Delhi Aerocity',      lat: 28.5685, lng: 77.0856 },
      { name: 'IGI Airport T3',     lat: 28.5624, lng: 77.0710 },
    ],
  },
  violet: {
    label: 'Violet Line',
    color: CONFIG.METRO_LINES.violet,
    stations: [
      { name: 'Kashmere Gate',       lat: 28.6680, lng: 77.2080 },
      { name: 'Lal Quila',           lat: 28.6619, lng: 77.2333 },
      { name: 'Jama Masjid',         lat: 28.6575, lng: 77.2303 },
      { name: 'Chandni Chowk',       lat: 28.6569, lng: 77.2278 },
      { name: 'Kashmere Gate',       lat: 28.6680, lng: 77.2080 },
      { name: 'Civil Lines',         lat: 28.6955, lng: 77.1712 },
      { name: 'Kashmere Gate',       lat: 28.6680, lng: 77.2080 },
      { name: 'ITO',                 lat: 28.6189, lng: 77.2411 },
      { name: 'Janpath',            lat: 28.6264, lng: 77.2172 },
      { name: 'Central Sec.',       lat: 28.6268, lng: 77.2060 },
      { name: 'Barakhamba Road',    lat: 28.6259, lng: 77.2263 },
      { name: 'Mandi House',        lat: 28.6205, lng: 77.2325 },
      { name: 'Kohinoor Tower',     lat: 28.6144, lng: 77.2355 },
      { name: 'Nehru Place',        lat: 28.5503, lng: 77.2519 },
      { name: 'Greater Kailash',     lat: 28.5451, lng: 77.2347 },
      { name: 'CR Park',            lat: 28.5510, lng: 77.2518 },
      { name: 'Nehru Place',        lat: 28.5503, lng: 77.2519 },
      { name: 'Govindpuri',         lat: 28.5300, lng: 77.2640 },
      { name: 'Okhla',              lat: 28.5357, lng: 77.2710 },
      { name: 'Jasola Vihar Shaheen Bagh', lat: 28.5420, lng: 77.2760 },
      { name: 'Okhla NSIC',         lat: 28.5478, lng: 77.2795 },
      { name: 'Sukhdev Vihar',      lat: 28.5616, lng: 77.2833 },
      { name: 'Jamia Millia Islamia', lat: 28.5716, lng: 77.2849 },
      { name: 'Okhla Vihar',        lat: 28.5766, lng: 77.2844 },
      { name: 'Jasola Apologies',   lat: 28.5820, lng: 77.2840 },
    ],
  },
  pink: {
    label: 'Pink Line',
    color: CONFIG.METRO_LINES.pink,
    stations: [
      { name: 'Majlis Park',         lat: 28.7423, lng: 77.1058 },
      { name: 'Azadpur',            lat: 28.7166, lng: 77.1102 },
      { name: 'Shalimar Bagh',       lat: 28.6810, lng: 77.1262 },
      { name: 'Netaji Nagar',        lat: 28.7024, lng: 77.1577 },
      { name: 'Punjabi Bagh East',   lat: 28.6711, lng: 77.1325 },
      { name: 'Rajouri Garden',       lat: 28.6431, lng: 77.1230 },
      { name: 'Maya Puri',          lat: 28.6376, lng: 77.1111 },
      { name: 'Narayana',           lat: 28.6306, lng: 77.0998 },
      { name: 'Rajouri Garden',      lat: 28.6431, lng: 77.1230 },
      { name: 'ESI Hospital',       lat: 28.6315, lng: 77.1340 },
      { name: 'Motive Chowk',      lat: 28.6188, lng: 77.1451 },
      { name: 'Shakurpur',         lat: 28.6130, lng: 77.1531 },
      { name: 'Punjabi Bagh',       lat: 28.6685, lng: 77.1413 },
      { name: 'Mayapuri',          lat: 28.6376, lng: 77.1111 },
      { name: 'Azadpur',           lat: 28.7166, lng: 77.1102 },
    ],
  },
  magenta: {
    label: 'Magenta Line',
    color: CONFIG.METRO_LINES.magenta,
    stations: [
      { name: 'Janakpuri West',     lat: 28.6278, lng: 77.0828 },
      { name: 'Dabri Mor',         lat: 28.6225, lng: 77.0713 },
      { name: 'Dashrathpuri',      lat: 28.6174, lng: 77.0574 },
      { name: 'Palam',             lat: 28.6107, lng: 77.0449 },
      { name: 'Sadar Bazar',       lat: 28.6021, lng: 77.0321 },
      { name: 'Narela',            lat: 28.8528, lng: 77.0923 },
      { name: 'Anandvas',         lat: 28.7615, lng: 77.0950 },
      { name: 'Shakurpur',         lat: 28.6130, lng: 77.1531 },
    ],
  },
  grey: {
    label: 'Grey Line',
    color: CONFIG.METRO_LINES.grey,
    stations: [
      { name: 'Dwarka Sec 21',     lat: 28.5682, lng: 77.0728 },
      { name: 'Nangli',           lat: 28.6089, lng: 76.9407 },
      { name: 'Najafgarh',         lat: 28.6095, lng: 76.9254 },
    ],
  },
};

let lineOverlays = [];
let stationMarkers = [];
let metroVisible = false;

export function renderMetroLines(map) {
  Object.entries(DMRC_LINES).forEach(([key, line]) => {
    const polyline = new google.maps.Polyline({
      path: line.stations.map(s => ({ lat: s.lat, lng: s.lng })),
      strokeColor: line.color,
      strokeWeight: 4,
      strokeOpacity: 0.85,
      map: metroVisible ? map : null,
      zIndex: 2,
    });
    lineOverlays.push(polyline);

    // Station markers (only show at higher zoom)
    line.stations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: null,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 4,
          fillColor: line.color,
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 1,
        },
        title: station.name,
        zIndex: 3,
      });
      stationMarkers.push(marker);
    });
  });
}

export function toggleMetro(map, show) {
  metroVisible = show;
  lineOverlays.forEach(p => p.setMap(show ? map : null));
  const zoom = map.getZoom();
  const showStations = zoom >= 13;
  stationMarkers.forEach(m => m.setMap(show && showStations ? map : null));
}

export function updateMetroStationVisibility(map, zoom) {
  const show = metroVisible && zoom >= 13;
  stationMarkers.forEach(m => {
    if (metroVisible) m.setMap(show ? map : null);
  });
}

export { DMRC_LINES };
