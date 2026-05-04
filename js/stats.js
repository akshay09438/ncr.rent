// delhi.rent — Live Stats Modal + Area Draw-to-Analyse

import { CONFIG } from './config.js';
import { loadStats, loadLeaderboard } from './pins.js';
import { getMap } from './map.js';

let areaDrawOverlay = null;
let areaDrawStart = null;
let areaDrawRect = null;
let statsMode = 'averages'; // 'averages' | 'leaderboard' | 'area'

export function initStats() {
  bindStatsTabs();
  bindDrawArea();
  bindOverallToggle();
}

async function loadAndRenderStats() {
  const stats = await loadStats();
  renderAverages(stats);

  const top = await loadLeaderboard();
  renderLeaderboard(top);
}

function renderAverages(stats) {
  const bhkMap = { 1: '1bhk', 2: '2bhk', 3: '3bhk', 4: '4bhk', 5: '5bhk' };
  const maxRent = Math.max(...Object.values(stats).map(s => s.avg), 1);

  Object.entries(bhkMap).forEach(([bhk, key]) => {
    const el = document.getElementById(`avg-${key}`);
    const cnt = document.getElementById(`avg-${key}-count`);
    if (!el) return;
    const s = stats[bhk] || { avg: 0, count: 0 };
    el.textContent = `₹${(s.avg / 1000).toFixed(1)}K`;
    el.className = 'avg-rent';
    if (cnt) cnt.textContent = `${s.count} pins`;
  });

  document.getElementById('total-pins-stat').textContent =
    Object.values(stats).reduce((a, s) => a + s.count, 0);
}

function renderLeaderboard(top) {
  const container = document.getElementById('leaderboard-list');
  if (!container) return;

  container.innerHTML = top.map((pin, i) => `
    <div class="leaderboard-item">
      <span class="lb-rank">#${i + 1}</span>
      <span class="lb-area">${pin.society_name || 'Gurgaon Area'}</span>
      <span>
        <span class="lb-rent">₹${(pin.rent / 1000).toFixed(0)}K</span>
        <span class="lb-bhk"> / ${pin.bhk}BHK</span>
      </span>
    </div>
  `).join('');
}

function bindStatsTabs() {
  document.querySelectorAll('.stats-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.stats-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.getElementById('stats-averages').classList.add('hidden');
      document.getElementById('stats-leaderboard').classList.add('hidden');
      document.getElementById('stats-area').classList.add('hidden');
      document.getElementById(`stats-${tab.dataset.statsView}`).classList.remove('hidden');

      statsMode = tab.dataset.statsView;
      if (statsMode !== 'area') loadAndRenderStats();
    });
  });

  // Initial load
  loadAndRenderStats();
}

function bindOverallToggle() {
  document.getElementById('btn-near-you')?.addEventListener('click', () => {
    document.getElementById('btn-overall').classList.remove('active');
    document.getElementById('btn-near-you').classList.add('active');
    // TODO: filter stats by map center radius
    loadAndRenderStats();
  });

  document.getElementById('btn-overall')?.addEventListener('click', () => {
    document.getElementById('btn-near-you').classList.remove('active');
    document.getElementById('btn-overall').classList.add('active');
    loadAndRenderStats();
  });
}

function bindDrawArea() {
  const btn = document.getElementById('btn-draw-area');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const map = getMap();
    if (!map) return;

    btn.textContent = '✏️ Drawing... Click two points';
    btn.disabled = true;

    let points = [];

    const clickHandler = (e) => {
      points.push(e.latLng);
      if (points.length === 2) {
        google.maps.event.removeListener(clickHandler);
        finalizeAreaDraw(map, points[0], points[1]);
        btn.textContent = '✏️ Draw Area';
        btn.disabled = false;
      } else {
        btn.textContent = `✏️ Point 1 set — click second point`;
      }
    };

    const listener = map.addListener('click', clickHandler);
    // Allow ESC to cancel
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        google.maps.event.removeListener(listener);
        document.removeEventListener('keydown', escHandler);
        btn.textContent = '✏️ Draw Area';
        btn.disabled = false;
      }
    };
    document.addEventListener('keydown', escHandler);
  });
}

function finalizeAreaDraw(map, p1, p2) {
  if (areaDrawRect) areaDrawRect.setMap(null);

  const bounds = new google.maps.LatLngBounds(p1, p2);
  areaDrawRect = new google.maps.Rectangle({
    bounds,
    fillColor: '#7c3aed',
    fillOpacity: 0.1,
    strokeColor: '#a78bfa',
    strokeWeight: 2,
    map,
    zIndex: 20,
  });

  // Query Supabase for pins within bounds
  queryAreaStats(bounds).then(renderAreaStats);
}

async function queryAreaStats(bounds) {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  // Simple bounding-box filter (the RPC uses geography distance but bounds is simpler)
  const { data } = await window._supabase
    .from('pins')
    .select('bhk, rent, gated, type')
    .is('deleted_at', null)
    .eq('type', 'rental')
    .lt('reports_count', 3)
    .gte('lat', sw.lat())
    .lte('lat', ne.lat())
    .gte('lng', sw.lng())
    .lte('lng', ne.lng());

  const grouped = {};
  (data || []).forEach(p => {
    const k = p.bhk <= 5 ? p.bhk : 5;
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(p.rent);
  });

  const stats = {};
  Object.entries(grouped).forEach(([bhk, rents]) => {
    stats[bhk] = {
      avg: Math.round(rents.reduce((a, b) => a + b, 0) / rents.length),
      count: rents.length,
    };
  });

  return stats;
}

function renderAreaStats(stats) {
  const container = document.getElementById('area-stats-result');
  const table = document.getElementById('area-stats-table');
  if (!container || !table) return;

  container.classList.remove('hidden');
  table.innerHTML = Object.entries(stats).map(([bhk, s]) => `
    <div class="avg-row">
      <span class="avg-bhk">${bhk} BHK</span>
      <span class="avg-bar"><div class="avg-bar-fill" style="width:${Math.min(100, (s.avg / 150000) * 100)}%"></div></span>
      <span class="avg-rent">₹${(s.avg / 1000).toFixed(1)}K</span>
      <span class="avg-count">${s.count} pins</span>
    </div>
  `).join('') || '<p style="color:var(--text-muted);font-size:12px">No pins in this area</p>';
}

export { loadAndRenderStats };
