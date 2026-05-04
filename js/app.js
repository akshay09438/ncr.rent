// delhi.rent — Main App Entry Point
// Ties together all modules; dispatches events to appropriate handlers

import { CONFIG } from './config.js';
import { initMap, addPin, removePin, clearPins, fitToBounds } from './map.js';
import { renderSectorLabels, updateSectorLabelVisibility } from './sectors.js';
import { renderMetroLines, toggleMetro, updateMetroStationVisibility } from './metro.js';
import { renderExpressways, toggleExpressways } from './expressways.js';
import { renderAQILegend, toggleAQI } from './aqi.js';
import { initPins, submitPin, deletePin, ratePin, commentPin, sendInterest, watchArea, getAllPins, getPin } from './pins.js';
import { onFilterChange, toggleBHK, togglePinView, clearAllFilters, setFilter, getFilters } from './filters.js';
import { initStats, loadAndRenderStats } from './stats.js';
import { showToast, openModal, closeModal, showPinPopup, closePinPopup, openShareModal, openWatchModal, openInterestModal, closeInterestModal } from './ui.js';
import { Auth } from './auth.js';

let supabase = null;
let map = null;
let pinFormLat = null;
let pinFormLng = null;
let editingPinId = null;
let selectedRatings = { locality: 0, built: 0 };

window.delhiRentApp = {
  deviceId: null,
  onPinsLoaded,
  onPinAdded,
  onPinRemoved,
  onPinUpdated,
  showPinPopup,
};

// ===== INIT =====

async function init() {
  // Wait for Google Maps to load
  if (typeof google === 'undefined' || !google.maps) {
    window.addEventListener('google-maps-loaded', init);
    return;
  }

  try {
    // Map must be created before overlays render
    await initSupabase();
    await initAuth();
    initMap_();
    initOverlays();
    initFilters();
    initForms();
    initStats();
    initNav();
    initStatsBtn();
    bindMapControls();

    document.getElementById('pin-count').textContent = '...';
  } catch (err) {
    console.error('[delhi.rent] init failed:', err);
    const errEl = document.createElement('div');
    errEl.style = 'position:fixed;top:70px;left:300px;background:#2d1b69;padding:16px;border-radius:10px;color:#fff;z-index:9999;font-family:Inter,sans-serif;max-width:400px';
    errEl.textContent = '⚠️ Init error: ' + err.message;
    document.body.appendChild(errEl);
    document.body.style.background = '#0f0f1a';
  }
}

// ===== SUPABASE =====

async function initSupabase() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  window._supabase = supabase; // for stats.js queries

  await initPins(supabase);
  await loadPinsOnFilterChange(); // initial pin load
}

// ===== AUTH =====

async function initAuth() {
  const did = await Auth.init(supabase);
  window.delhiRentApp.deviceId = did;
}

// ===== MAP =====

function initMap_() {
  const el = document.getElementById('map');
  if (!el) { console.error('[delhi.rent] No #map element'); return; }

  map = initMap(el);

  // On idle, refresh AQI if visible and sector labels
  google.maps.event.addListener(map, 'idle', () => {
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    updateSectorLabelVisibility(map, zoom);
    if (CONFIG._aqiVisible) toggleAQI(map, true, bounds);
  });
}

function initOverlays() {
  renderMetroLines(map);
  renderExpressways(map);
  renderSectorLabels(map);

  const mapContainer = document.getElementById('map-container');
  renderAQILegend(mapContainer);
}

// ===== MAP CONTROLS =====

function bindMapControls() {
  // Metro toggle
  const btnMetro = document.getElementById('btn-metro');
  btnMetro.addEventListener('click', () => {
    CONFIG._metroVisible = !CONFIG._metroVisible;
    btnMetro.classList.toggle('active', CONFIG._metroVisible);
    toggleMetro(map, CONFIG._metroVisible);
    showToast(CONFIG._metroVisible ? 'Metro lines ON' : 'Metro lines OFF');
  });

  // AQI toggle
  const btnAqi = document.getElementById('btn-aqi');
  btnAqi.addEventListener('click', async () => {
    CONFIG._aqiVisible = !CONFIG._aqiVisible;
    btnAqi.classList.toggle('active', CONFIG._aqiVisible);
    if (CONFIG._aqiVisible) {
      const bounds = map.getBounds();
      const { fetchAQIForBounds, renderAQIZones } = await import('./aqi.js');
      const points = await fetchAQIForBounds(bounds);
      renderAQIZones(map, points);
      showToast('AQI overlay ON — data from WAQI');
    } else {
      const { clearAQIZones } = await import('./aqi.js');
      clearAQIZones();
      showToast('AQI overlay OFF');
    }
  });

  // Expressway toggle
  const btnExp = document.getElementById('btn-express');
  btnExp.addEventListener('click', () => {
    CONFIG._expressVisible = !CONFIG._expressVisible;
    btnExp.classList.toggle('active', CONFIG._expressVisible);
    toggleExpressways(map, CONFIG._expressVisible);
    showToast(CONFIG._expressVisible ? 'Expressways ON' : 'Expressways OFF');
  });

  // Legend
  document.getElementById('btn-legend')?.addEventListener('click', () => {
    openModal('legend-modal');
  });
}

// ===== FILTERS =====

function initFilters() {
  // BHK chips
  document.querySelectorAll('#bhk-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      toggleBHK(parseInt(chip.dataset.bhk));
    });
  });

  // Pin view toggle
  document.querySelectorAll('[data-pin-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-pin-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      togglePinView(btn.dataset.pinView);
    });
  });

  // Rent inputs
  document.getElementById('rent-min')?.addEventListener('change', e => {
    setFilter('minRent', e.target.value ? parseInt(e.target.value) : null);
  });
  document.getElementById('rent-max')?.addEventListener('change', e => {
    setFilter('maxRent', e.target.value ? parseInt(e.target.value) : null);
  });

  // Furnishing
  document.querySelectorAll('[data-furnishing]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-furnishing]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setFilter('furnishing', btn.dataset.furnishing === 'any' ? null : btn.dataset.furnishing);
    });
  });

  // Gated
  document.querySelectorAll('[data-gated]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-gated]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setFilter('gated', btn.dataset.gated === 'any' ? null : btn.dataset.gated === 'gated');
    });
  });

  // Rating chips
  document.querySelectorAll('#rating-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#rating-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      setFilter('rating', parseInt(chip.dataset.rating));
    });
  });

  // Metro distance
  document.getElementById('metro-distance')?.addEventListener('change', e => {
    setFilter('metroDist', e.target.value ? parseFloat(e.target.value) : null);
  });

  // Commute hub
  document.getElementById('commute-hub')?.addEventListener('change', e => {
    setFilter('commuteHub', e.target.value || null);
  });

  // Clear all
  document.getElementById('btn-clear-filters')?.addEventListener('click', () => {
    clearAllFilters();
    document.querySelectorAll('.chip, .toggle-btn').forEach(el => {
      if (el.classList.contains('active') && el.dataset.bhk) el.classList.remove('active');
    });
  });
}

async function loadPinsOnFilterChange() {
  // Wire up window.__loadPins so filters.js can trigger a pin reload
  const { loadPins } = await import('./pins.js');
  window.__loadPins = async (filters) => {
    window.__allPins = await loadPins(filters);
  };

  onFilterChange(async (filters) => {
    await window.__loadPins(filters);
    document.getElementById('visible-pin-count').textContent = window.__allPins.length;
  });
}

// ===== NAV =====

function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const view = btn.dataset.view;
      if (view === 'stats') {
        openModal('stats-modal');
        loadAndRenderStats();
      }
    });
  });
}

function initStatsBtn() {
  document.querySelector('[data-view="stats"]')?.addEventListener('click', () => {
    openModal('stats-modal');
    loadAndRenderStats();
  });
}

// ===== PIN FORM =====

function initForms() {
  // Modal closes
  document.querySelectorAll('.modal-close, .modal .modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      modal?.classList.add('hidden');
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });

  // Mode tabs in form
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.form-section').forEach(s => s.classList.add('hidden'));
      document.getElementById(`form-section-${tab.dataset.mode}`)?.classList.remove('hidden');
    });
  });

  // Toggle buttons in form
  document.querySelectorAll('[data-field]').forEach(btn => {
    if (btn.tagName === 'BUTTON') {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const val = btn.dataset.val;
        const group = document.querySelectorAll(`[data-field="${field}"]`);
        group.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Store in a formData map
        window._formData = window._formData || {};
        window._formData[field] = val;
      });
    }
  });

  // Form submit
  document.getElementById('pin-form')?.addEventListener('submit', handlePinSubmit);

  // Form close
  document.getElementById('form-close')?.addEventListener('click', closeFormPanel);

  // ===== POPUP =====

  document.getElementById('popup-close')?.addEventListener('click', closePinPopup);

  document.getElementById('btn-interested')?.addEventListener('click', () => {
    const pinId = document.getElementById('btn-interested').dataset.pinId;
    openInterestModal(pinId);
  });

  document.getElementById('btn-watch-area')?.addEventListener('click', () => {
    const pin = getPin(document.getElementById('btn-watch-area').dataset.pinId);
    if (pin) openWatchModal(pin.lat, pin.lng);
  });

  document.getElementById('btn-share')?.addEventListener('click', () => {
    const pin = getPin(document.getElementById('pin-popup').dataset.pinId);
    if (pin) openShareModal(pin);
  });

  // Star ratings
  document.querySelectorAll('.star-picker').forEach(picker => {
    picker.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', () => {
        const field = picker.dataset.field;
        const val = parseInt(star.dataset.val);
        selectedRatings[field] = val;
        const stars = picker.querySelectorAll('.star');
        stars.forEach((s, i) => {
          s.classList.toggle('lit', i < val);
        });
      });
    });
  });

  document.getElementById('btn-submit-rating')?.addEventListener('click', async () => {
    const pinId = document.getElementById('pin-popup').dataset.pinId;
    try {
      await ratePin(pinId, selectedRatings.locality, selectedRatings.built);
      showToast('Rating saved!', 'success');
    } catch (e) {
      showToast('Failed to save rating', 'error');
    }
  });

  document.getElementById('btn-submit-comment')?.addEventListener('click', async () => {
    const pinId = document.getElementById('pin-popup').dataset.pinId;
    const body = document.getElementById('comment-input')?.value?.trim();
    if (!body) return;
    try {
      await commentPin(pinId, body);
      document.getElementById('comment-input').value = '';
      showToast('Comment posted!', 'success');
    } catch (e) {
      showToast('Failed to post comment', 'error');
    }
  });

  document.getElementById('btn-edit-pin')?.addEventListener('click', () => {
    const pinId = document.getElementById('popup-footer').dataset.pinId;
    editPin(pinId);
  });

  document.getElementById('btn-delete-pin')?.addEventListener('click', async () => {
    const pinId = document.getElementById('popup-footer').dataset.pinId;
    if (!confirm('Delete this listing?')) return;
    try {
      await deletePin(pinId);
      showToast('Listing deleted', 'success');
      closePinPopup();
      onPinRemoved(pinId);
    } catch (e) {
      showToast('Failed to delete', 'error');
    }
  });

  // ===== INTEREST MODAL =====

  document.getElementById('interest-close')?.addEventListener('click', closeInterestModal);

  document.getElementById('interest-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pinId = document.getElementById('interest-modal').dataset.pinId;
    const email = document.getElementById('int-email').value;
    const msg = document.getElementById('int-msg').value;
    try {
      await sendInterest(pinId, email, msg);
      showToast('Interest sent! Owner will be notified.', 'success');
      closeInterestModal();
    } catch (err) {
      showToast('Failed to send. Try again.', 'error');
    }
  });

  // ===== WATCH MODAL =====

  document.getElementById('watch-close')?.addEventListener('click', () => closeModal('watch-modal'));

  document.getElementById('watch-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modal = document.getElementById('watch-modal');
    const lat = parseFloat(modal.dataset.lat);
    const lng = parseFloat(modal.dataset.lng);
    const email = document.getElementById('w-email').value;
    const phone = document.getElementById('w-phone').value;
    const duration = parseInt(document.getElementById('w-duration').value);
    try {
      await watchArea(lat, lng, 1, email, phone, duration);
      showToast(`Alert set for ${duration} month${duration > 1 ? 's' : ''}!`, 'success');
      closeModal('watch-modal');
    } catch (err) {
      showToast('Failed to set alert', 'error');
    }
  });

  // ===== SHARE MODAL =====

  document.getElementById('share-close')?.addEventListener('click', () => closeModal('share-modal'));

  // Stats modal
  document.getElementById('stats-close')?.addEventListener('click', () => closeModal('stats-modal'));
  document.getElementById('legend-close')?.addEventListener('click', () => closeModal('legend-modal'));
}

// ===== PIN FORM =====

window.delhiRentApp.openFormAt = function(lat, lng) {
  pinFormLat = lat;
  pinFormLng = lng;
  editingPinId = null;

  document.getElementById('f-lat').value = lat;
  document.getElementById('f-lng').value = lng;
  document.getElementById('f-edit-id').value = '';
  document.getElementById('form-title').textContent = 'Drop a Pin';
  document.getElementById('btn-submit-pin').textContent = 'Drop Pin on Map';
  document.getElementById('pin-form')?.reset();

  const panel = document.getElementById('pin-form-panel');
  panel.classList.remove('hidden');
  panel.scrollTop = 0;
};

function editPin(pinId) {
  const pin = getPin(pinId);
  if (!pin) return;

  editingPinId = pinId;
  pinFormLat = pin.lat;
  pinFormLng = pin.lng;

  document.getElementById('f-lat').value = pin.lat;
  document.getElementById('f-lng').value = pin.lng;
  document.getElementById('f-edit-id').value = pinId;
  document.getElementById('form-title').textContent = 'Edit Pin';
  document.getElementById('btn-submit-pin').textContent = 'Save Changes';

  // Pre-fill form fields
  if (pin.bhk) document.getElementById('f-bhk').value = pin.bhk;
  if (pin.rent) document.getElementById('f-rent').value = pin.rent;
  if (pin.society_name) document.getElementById('f-society').value = pin.society_name;
  if (pin.email) document.getElementById('f-email').value = pin.email;

  const panel = document.getElementById('pin-form-panel');
  panel.classList.remove('hidden');
  closePinPopup();
}

function closeFormPanel() {
  document.getElementById('pin-form-panel')?.classList.add('hidden');
  pinFormLat = null;
  pinFormLng = null;
  editingPinId = null;
}

async function handlePinSubmit(e) {
  e.preventDefault();

  const mode = document.querySelector('.mode-tab.active')?.dataset.mode || 'rental';
  const lat = parseFloat(document.getElementById('f-lat').value);
  const lng = parseFloat(document.getElementById('f-lng').value);

  if (!lat || !lng) {
    showToast('Invalid location', 'error');
    return;
  }

  const formData = collectFormData(mode);

  try {
    if (editingPinId) {
      const { updatePin } = await import('./pins.js');
      await updatePin(editingPinId, formData);
      showToast('Listing updated!', 'success');
    } else {
      await submitPin({ ...formData, lat, lng, type: mode === 'flatmate' ? 'flatmate' : mode });
      showToast('Pin dropped on map!', 'success');
    }
    closeFormPanel();
    // Pins will update via realtime
  } catch (err) {
    showToast(err.message || 'Failed to save', 'error');
  }
}

function collectFormData(mode) {
  const getField = (field) => {
    const btn = document.querySelector(`[data-field="${field}"].active`);
    return btn ? btn.dataset.val : null;
  };

  if (mode === 'rental') {
    return {
      bhk: parseInt(document.getElementById('f-bhk').value),
      rent: parseInt(document.getElementById('f-rent').value),
      furnishing: getField('furnishing'),
      gated: getField('gated') === 'true',
      landlord_type: getField('landlord_type') || null,
      who_lives: getField('who_lives') || null,
      deposit_months: parseInt(document.getElementById('f-deposit').value) || null,
      pets_allowed: getField('pets_allowed') || null,
      parking: parseInt(document.getElementById('f-parking').value) || null,
      sqft: parseInt(document.getElementById('f-sqft').value) || null,
      society_name: document.getElementById('f-society').value || null,
      commute_hub: document.getElementById('f-commute-hub').value || null,
      water_supply: document.getElementById('f-water').value || null,
      power_cuts: document.getElementById('f-power').value || null,
      one_liner: document.getElementById('f-one-liner').value || null,
      looking_for_flatmate: document.getElementById('f-flatmate').checked,
      email: document.getElementById('f-email').value || null,
    };
  } else if (mode === 'seeker') {
    const bhkPrefs = [...document.querySelectorAll('[data-bhk-pref]')].find(c => c.classList.contains('active'))?.dataset.bhkPref;
    return {
      budget: parseInt(document.getElementById('f-budget').value),
      bhk_pref: bhkPrefs || null,
      available_from: document.getElementById('f-movein').value || null,
      food_pref: getField('food_pref') || null,
      smoker_ok: getField('smoker_ok') || null,
      gender_pref: getField('gender_pref') || null,
      lifestyle_note: document.getElementById('f-lifestyle').value || null,
      email: document.getElementById('f-seeker-email').value || null,
      phone: document.getElementById('f-seeker-phone').value || null,
    };
  } else {
    return {
      rent: parseInt(document.getElementById('f-room-rent').value),
      available_from: document.getElementById('f-available-from').value || null,
      gender_pref: getField('flatmate_gender') || null,
      smoker_ok: getField('flatmate_smoker') || null,
      food_pref: getField('flatmate_food') || null,
      parking: parseInt(document.getElementById('f-flatmate-parking').value) || null,
      email: document.getElementById('f-flatmate-email').value || null,
      phone: document.getElementById('f-flatmate-phone').value || null,
    };
  }
}

// ===== PIN EVENTS =====

async function onPinsLoaded(pins) {
  clearPins();
  pins.forEach(pin => addPin(pin));
  document.getElementById('pin-count').textContent = pins.length;
  document.getElementById('visible-pin-count').textContent = pins.length;

  if (pins.length > 0) {
    fitToBounds(pins.slice(0, 200)); // don't fit to all 500
  }
}

function onPinAdded(pin) {
  addPin(pin);
  showToast('New pin dropped nearby!', '');
}

function onPinRemoved(pinId) {
  removePin(pinId);
}

function onPinUpdated(pin) {
  removePin(pin.id);
  addPin(pin);
}

// ===== BOOT =====

// Wait for Google Maps to be ready
if (typeof google !== 'undefined' && google.maps) {
  init();
} else {
  window.addEventListener('google-maps-loaded', init);
}
