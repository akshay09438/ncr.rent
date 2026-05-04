// delhi.rent — UI: Modals, Bottom Sheets, Toasts, Popups

let toastTimer = null;
let currentPopupPin = null;

export function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

export function showToast(message, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.className = `toast ${type}`;
  el.classList.remove('hidden');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

// ===== PIN POPUP =====

export function showPinPopup(pin, onClose) {
  currentPopupPin = pin;
  const popup = document.getElementById('pin-popup');
  if (!popup) return;

  // Fill popup data
  document.getElementById('popup-rent').textContent = `₹${pin.rent.toLocaleString('en-IN')}`;

  // Badges
  const badgesEl = document.getElementById('popup-badges');
  badgesEl.innerHTML = `
    <span class="badge badge-bhk">${pin.bhk} BHK</span>
    ${pin.furnishing ? `<span class="badge badge-fulfill">${pin.furnishing}</span>` : ''}
    ${pin.maintenance_included ? `<span class="badge badge-tag">+ Maint.</span>` : ''}
  `;

  // Tags
  const tagsEl = document.getElementById('popup-tags');
  const tags = [
    pin.gated !== null && (`<span class="popup-tag">${pin.gated ? '🏘 Gated' : '🏚 Open'}</span>`),
    pin.landlord_type === 'direct' && '<span class="popup-tag">👤 Direct Landlord</span>',
    pin.landlord_type === 'broker' && '<span class="popup-tag">🏢 Broker</span>',
    pin.pets_allowed === 'yes' && '<span class="popup-tag">🐾 Pets OK</span>',
    pin.pets_allowed === 'unsure' && '<span class="popup-tag">🐾 Pets ?</span>',
    (pin.parking > 0) && `<span class="popup-tag">🅿️ ${pin.parking} car parking</span>`,
    pin.looking_for_flatmate && '<span class="popup-tag">👥 Needs flatmate</span>',
    pin.who_lives && `<span class="popup-tag">👤 ${pin.who_lives}</span>`,
  ].filter(Boolean).join('');
  tagsEl.innerHTML = tags;

  // Meta
  const posted = pin.created_at
    ? timeAgo(new Date(pin.created_at))
    : '';
  document.getElementById('popup-meta').innerHTML = `
    ${pin.society_name ? `<strong>${pin.society_name}</strong>` : ''}
    ${pin.commute_hub ? ` · Near ${pin.commute_hub.replace('_', ' ')}` : ''}
    ${posted ? ` · ${posted} ago` : ''}
  `;

  // One-liner
  const ol = document.getElementById('popup-one-liner');
  if (pin.one_liner) {
    ol.textContent = `"${pin.one_liner}"`;
    ol.classList.remove('hidden');
  } else {
    ol.classList.add('hidden');
  }

  // Rating display
  if (pin.avg_locality || pin.avg_built) {
    const avg = ((pin.avg_locality || 0) + (pin.avg_built || 0)) / 2;
    const stars = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
    document.querySelector('#popup-rating .stars').textContent = stars;
    document.querySelector('#popup-rating .rating-num').textContent = avg.toFixed(1);
  }

  // Owner actions (footer)
  const footer = document.getElementById('popup-footer');
  const isOwner = pin.device_id === window.delhiRentApp?.deviceId;
  if (isOwner) {
    footer.classList.remove('hidden');
    footer.dataset.pinId = pin.id;
  } else {
    footer.classList.add('hidden');
  }

  // Store pin id on interest button
  document.getElementById('btn-interested').dataset.pinId = pin.id;
  document.getElementById('btn-watch-area').dataset.pinId = pin.id;

  popup.dataset.pinId = pin.id;
  popup.classList.remove('hidden');
}

export function closePinPopup() {
  document.getElementById('pin-popup')?.classList.add('hidden');
  currentPopupPin = null;
}

export function getCurrentPopupPin() {
  return currentPopupPin;
}

// ===== SHARE =====

export function openShareModal(pin) {
  const modal = document.getElementById('share-modal');
  if (!modal) return;

  const url = `https://delhi.rent?pin=${pin.id}`;
  const msg = `Check out this listing on delhi.rent: ₹${pin.rent?.toLocaleString('en-IN')} / ${pin.bhk} BHK${pin.society_name ? ` at ${pin.society_name}` : ''}`;

  document.getElementById('share-whatsapp').href =
    `https://wa.me/?text=${encodeURIComponent(msg + ' ' + url)}`;
  document.getElementById('btn-copy-link').onclick = () => {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied!', 'success');
    });
  };

  modal.classList.remove('hidden');
}

// ===== WATCH AREA =====

export function openWatchModal(lat, lng) {
  const modal = document.getElementById('watch-modal');
  if (!modal) return;
  modal.dataset.lat = lat;
  modal.dataset.lng = lng;
  modal.classList.remove('hidden');
}

// ===== INTEREST =====

export function openInterestModal(pinId) {
  const modal = document.getElementById('interest-modal');
  if (!modal) return;
  modal.dataset.pinId = pinId;
  modal.classList.remove('hidden');
}

export function closeInterestModal() {
  document.getElementById('interest-modal')?.classList.add('hidden');
}

// ===== HELPERS =====

export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year',  s: 31536000 },
    { label: 'month', s: 2592000  },
    { label: 'week',  s: 604800   },
    { label: 'day',   s: 86400    },
    { label: 'hour',  s: 3600     },
    { label: 'min',   s: 60       },
  ];
  for (const { label, s } of intervals) {
    const n = Math.floor(seconds / s);
    if (n >= 1) return `${n} ${label}${n > 1 ? 's' : ''}`;
  }
  return 'just now';
}
