// delhi.rent — NCR Sector / Area Labels

import { CONFIG } from './config.js';

const labelMarkers = [];
let currentZoom = 0;

export function renderSectorLabels(map) {
  const allSectors = [
    ...(CONFIG.SECTOR_LABELS.gurgaon || []),
    ...(CONFIG.SECTOR_LABELS.noida  || []),
    ...(CONFIG.SECTOR_LABELS.delhi  || []),
  ];

  allSectors.forEach(sec => {
    const marker = new google.maps.Marker({
      position: { lat: sec.lat, lng: sec.lng },
      map: null,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0,
      },
      label: {
        text: sec.name,
        color: 'rgba(167,139,250,0.7)',
        fontSize: '11px',
        fontWeight: '700',
        fontFamily: 'Inter, sans-serif',
        borderBackgroundColor: 'rgba(15,15,26,0.6)',
        padding: '2px 6px',
      },
      zIndex: 1,
    });
    labelMarkers.push(marker);
  });
}

export function updateSectorLabelVisibility(map, zoom) {
  currentZoom = zoom;
  const show = zoom >= 12;
  const fontSize = zoom >= 14 ? '12px' : '10px';
  labelMarkers.forEach(m => {
    if (!m.label) return;
    m.label.fontSize = fontSize;
    m.setMap(show ? map : null);
  });
}
