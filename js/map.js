// delhi.rent — Google Maps core: init, clustering, pin rendering

import { CONFIG } from './config.js';

let map = null;
let markerClusterer = null;
const markers = {};       // pinId → google.maps.Marker
const infoWindows = {};   // pinId → google.maps.InfoWindow

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1040' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a78bfa' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f1a' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2d1b69' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#241a4a' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d2b7a' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
];

function pinColor(pin) {
  if (pin.type === 'seeker')   return CONFIG.PIN_COLORS.seeker;
  if (pin.type === 'flatmate') return CONFIG.PIN_COLORS.flatmate;
  return pin.gated ? CONFIG.PIN_COLORS.rental_gated : CONFIG.PIN_COLORS.rental_open;
}

function pinIcon(color) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: CONFIG.PIN_SIZE / 2,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: '#fff',
    strokeWeight: 1.5,
  };
}

function clusterIcon(count) {
  const style = CONFIG.CLUSTER_STYLES[Math.min(CONFIG.CLUSTER_STYLES.length - 1, Math.floor(Math.log10(count)))];
  return {
    html: `<div style="width:${style.width}px;height:${style.height}px;background:${style.background};border:${style.border} 2px solid;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${style.fontSize}px;font-weight:700;color:#fff;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${count}</div>`,
    anchor: new google.maps.Point(style.width / 2, style.height / 2),
  };
}

export function initMap(element) {
  map = new google.maps.Map(element, {
    center: CONFIG.MAP_CENTER,
    zoom: CONFIG.MAP_ZOOM,
    styles: DARK_MAP_STYLE,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    clickableIcons: false,
  });

  markerClusterer = new markerClusterer.MarkerClusterer({
    map,
    markers: [],
    renderer: {
      render: ({ count, position }) => {
        return new google.maps.Marker({
          position,
          icon: clusterIcon(count),
          label: { text: String(count), color: '#fff', fontSize: '12px' },
          zIndex: 10,
          clickable: true,
        });
      },
    },
  });

  // Click on map = open pin form
  map.addListener('click', (e) => {
    window.delhiRentApp?.openFormAt(e.latLng.lat(), e.latLng.lng());
  });

  return map;
}

export function getMap() { return map; }
export function getMarkerClusterer() { return markerClusterer; }

export function addPin(pin) {
  if (markers[pin.id]) return; // already rendered

  const color = pinColor(pin);
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map,
    icon: pinIcon(color),
    title: `₹${pin.rent.toLocaleString('en-IN')} · ${pin.bhk} BHK`,
    zIndex: 5,
  });

  marker.addListener('click', () => {
    window.delhiRentApp?.showPinPopup(pin);
  });

  markers[pin.id] = marker;
  markerClusterer.addMarker(marker);

  // Update cluster after adding
  markerClusterer.repaint();
  return marker;
}

export function removePin(pinId) {
  const marker = markers[pinId];
  if (marker) {
    markerClusterer.removeMarker(marker);
    marker.setMap(null);
    delete markers[pinId];
    markerClusterer.repaint();
  }
}

export function clearPins() {
  markerClusterer.clearMarkers();
  Object.values(markers).forEach(m => m.setMap(null));
  Object.keys(markers).forEach(k => delete markers[k]);
}

export function fitToBounds(pins) {
  if (!pins || pins.length === 0) return;
  const bounds = new google.maps.LatLngBounds();
  pins.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
  map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
}

export function mapCenter() {
  if (!map) return CONFIG.MAP_CENTER;
  return map.getCenter();
}

export function onMapIdle(callback) {
  if (map) google.maps.event.addListener(map, 'idle', () => callback(map.getBounds()));
}

export function getBounds() {
  return map?.getBounds();
}
