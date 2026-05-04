// delhi.rent — AQI Overlay via WAQI API (free, no key)

import { CONFIG } from './config.js';

let aqiPolygons = [];
let aqiLegendEl = null;
let aqiVisible = false;
let currentBounds = null;

const AQI_BREAKPOINTS = [
  { max: 50,  label: 'Good',             color: CONFIG.AQI_COLORS.good },
  { max: 100, label: 'Moderate',         color: CONFIG.AQI_COLORS.moderate },
  { max: 200, label: 'Unhealthy (SG)',   color: CONFIG.AQI_COLORS.unhealthy_sg },
  { max: 300, label: 'Unhealthy',         color: CONFIG.AQI_COLORS.unhealthy },
  { max: 500, label: 'Very Unhealthy',   color: CONFIG.AQI_COLORS.very_unhealthy },
];

function aqiColor(aqi) {
  for (const bp of AQI_BREAKPOINTS) {
    if (aqi <= bp.max) return bp.color;
  }
  return CONFIG.AQI_COLORS.very_unhealthy;
}

function aqiLabel(aqi) {
  for (const bp of AQI_BREAKPOINTS) {
    if (aqi <= bp.max) return bp.label;
  }
  return 'Hazardous';
}

export async function fetchAQIForBounds(bounds) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  // Sample a few points in the map bounds
  const points = [
    { lat: (ne.lat() + sw.lat()) / 2, lng: (ne.lng() + sw.lng()) / 2 },
    { lat: ne.lat(), lng: ne.lng() },
    { lat: sw.lat(), lng: sw.lng() },
    { lat: ne.lat(), lng: sw.lng() },
    { lat: sw.lat(), lng: ne.lng() },
  ];

  const results = await Promise.allSettled(
    points.map(({ lat, lng }) =>
      fetch(`${CONFIG.WAQI_BASE_URL}/geo:${lat.toFixed(2)}:${lng.toFixed(2)}/?token=`)
        .then(r => r.json())
        .then(d => ({
          lat, lng,
          aqi: d.data?.aqi,
          label: d.data?.idx ? aqiLabel(d.data.aqi) : null,
          color: d.data?.aqi ? aqiColor(d.data.aqi) : null,
        }))
        .catch(() => null)
    )
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value?.aqi)
    .map(r => r.value);
}

export function renderAQIZones(map, aqiPoints) {
  clearAQIZones();

  aqiPoints.forEach(point => {
    const circle = new google.maps.Circle({
      center: { lat: point.lat, lng: point.lng },
      radius: 3000, // 3km radius per AQI station
      fillColor: point.color,
      fillOpacity: 0.12,
      strokeColor: point.color,
      strokeWeight: 1,
      strokeOpacity: 0.4,
      map: aqiVisible ? map : null,
      zIndex: 1,
    });
    aqiPolygons.push(circle);
  });
}

export function clearAQIZones() {
  aqiPolygons.forEach(p => p.setMap(null));
  aqiPolygons = [];
}

export function toggleAQI(map, show, bounds) {
  aqiVisible = show;
  aqiPolygons.forEach(p => p.setMap(show ? map : null));
  if (aqiLegendEl) aqiLegendEl.style.display = show ? 'flex' : 'none';

  if (show && bounds) {
    currentBounds = bounds;
    fetchAQIForBounds(bounds).then(points => {
      renderAQIZones(map, points);
    });
  }
}

export function renderAQILegend(container) {
  aqiLegendEl = document.createElement('div');
  aqiLegendEl.id = 'aqi-legend';
  aqiLegendEl.style.cssText = `
    position:absolute;bottom:50px;left:12px;
    background:rgba(15,15,26,0.92);backdrop-filter:blur(8px);
    border:1px solid rgba(124,58,237,0.25);border-radius:10px;
    padding:10px 14px;z-index:10;font-family:Inter,sans-serif;
    display:flex;flex-direction:column;gap:5px;font-size:11px;
  `;
  aqiLegendEl.innerHTML = `
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:4px">🌬 AQI Overlay</div>
    ${AQI_BREAKPOINTS.map(bp =>
      `<div style="display:flex;align-items:center;gap:8px">
        <span style="width:12px;height:12px;border-radius:50%;background:${bp.color};flex-shrink:0"></span>
        <span style="color:#9ca3af">${bp.max === 500 ? '301+' : '0-'+bp.max}</span>
        <span style="color:#e2e8f0;font-weight:600">${bp.label}</span>
      </div>`
    ).join('')}
  `;
  aqiLegendEl.style.display = 'none';
  container.appendChild(aqiLegendEl);
}

export function showAQILegend() {
  if (aqiLegendEl) aqiLegendEl.style.display = 'flex';
}
