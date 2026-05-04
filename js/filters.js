// delhi.rent — Filter Panel State + Logic

const state = {
  pinView:     'rental',  // 'rental' | 'seeker' | 'both'
  bhk:         [],        // [1,2,3,4,5]
  minRent:     null,
  maxRent:     null,
  furnishing:  null,      // 'furnished' | 'unfurnished' | null
  gated:       null,      // true | false | null
  rating:      null,      // 2 | 3 | 4
  metroDist:   null,      // 0.5 | 1 | 2
  commuteHub:  null,
  metroOverlay: false,
  aqiOverlay:  false,
  expressOverlay: false,
};

const listeners = [];

export function onFilterChange(fn) {
  listeners.push(fn);
}

function emitChange() {
  listeners.forEach(fn => fn({ ...state }));
}

export function setFilter(key, value) {
  state[key] = value;
  updateActiveChips();
  emitChange();
}

export function toggleBHK(bhk) {
  const idx = state.bhk.indexOf(bhk);
  if (idx === -1) {
    state.bhk.push(bhk);
  } else {
    state.bhk.splice(idx, 1);
  }
  updateActiveChips();
  emitChange();
}

export function togglePinView(view) {
  state.pinView = view;
  emitChange();
}

export function clearAllFilters() {
  state.bhk = [];
  state.minRent = null;
  state.maxRent = null;
  state.furnishing = null;
  state.gated = null;
  state.rating = null;
  state.metroDist = null;
  state.commuteHub = null;
  updateActiveChips();
  emitChange();
}

export function getFilters() {
  return { ...state };
}

function updateActiveChips() {
  const container = document.getElementById('active-filters');
  if (!container) return;

  const chips = [];
  if (state.bhk.length) chips.push({ label: `BHK: ${state.bhk.join(',')}`, key: 'bhk' });
  if (state.minRent || state.maxRent) {
    chips.push({ label: `₹${state.minRent || '0'}–${state.maxRent || '∞'}`, key: 'rent' });
  }
  if (state.furnishing) chips.push({ label: state.furnishing, key: 'furnishing' });
  if (state.gated !== null) chips.push({ label: state.gated ? 'Gated' : 'Open', key: 'gated' });
  if (state.rating) chips.push({ label: `${state.rating}★+`, key: 'rating' });
  if (state.commuteHub) chips.push({ label: state.commuteHub.replace('_', ' '), key: 'commuteHub' });

  container.innerHTML = chips.map(c => `
    <span class="active-chip">
      ${c.label}
      <button data-key="${c.key}">✕</button>
    </span>
  `).join('');

  container.querySelectorAll('button[data-key]').forEach(btn => {
    btn.addEventListener('click', () => clearFilterKey(btn.dataset.key));
  });
}

function clearFilterKey(key) {
  if (key === 'bhk') state.bhk = [];
  else if (key === 'rent') { state.minRent = null; state.maxRent = null; }
  else if (key === 'furnishing') state.furnishing = null;
  else if (key === 'gated') state.gated = null;
  else if (key === 'rating') state.rating = null;
  else if (key === 'commuteHub') state.commuteHub = null;
  updateActiveChips();
  emitChange();
}

export { state };
