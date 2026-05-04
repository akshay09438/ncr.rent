// delhi.rent — NCR Expressway Polylines

import { CONFIG } from './config.js';

const overlays = [];
let expressVisible = false;

export function renderExpressways(map) {
  Object.entries(CONFIG.EXPRESSWAYS).forEach(([key, exp]) => {
    const polyline = new google.maps.Polyline({
      path: exp.path.map(p => ({ lat: p.lat, lng: p.lng })),
      strokeColor: exp.color,
      strokeWeight: 3,
      strokeOpacity: 0.7,
      map: expressVisible ? map : null,
      zIndex: 2,
    });

    // Label at midpoint
    const mid = exp.path[Math.floor(exp.path.length / 2)];
    const label = new google.maps.Marker({
      position: { lat: mid.lat, lng: mid.lng },
      map: null,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0, // invisible anchor
      },
      label: {
        text: exp.label,
        color: exp.color,
        fontSize: '10px',
        fontWeight: '700',
        fontFamily: 'Inter, sans-serif',
        borderColor: '#0f0f1a',
        backgroundColor: 'rgba(15,15,26,0.8)',
        padding: '2px 6px',
      },
      zIndex: 3,
    });

    overlays.push({ polyline, label });
  });
}

export function toggleExpressways(map, show) {
  expressVisible = show;
  overlays.forEach(({ polyline, label }) => {
    polyline.setMap(show ? map : null);
    label.setMap(show ? map : null);
  });
}
