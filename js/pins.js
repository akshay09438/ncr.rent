// delhi.rent — Supabase Pin Loading, Submission, Editing, Deletion

import { CONFIG } from './config.js';
import { Auth } from './auth.js';

let supabase = null;
let pins = []; // in-memory pin store
let formMode = 'rental';
let formData = {};

export async function initPins(sb) {
  supabase = sb;
  subscribeToRealtime();
}

export async function loadPins(filters = {}) {
  const { data, error } = await supabase.rpc('get_pins', {
    p_type:       filters.pinView   || null,
    p_bhk:        filters.bhk        || null,
    p_min_rent:   filters.minRent   || null,
    p_max_rent:   filters.maxRent   || null,
    p_gated:      filters.gated     || null,
    p_furnishing: filters.furnishing || null,
    p_min_rating: filters.rating     || null,
  });

  if (error) {
    console.error('loadPins error:', error);
    return [];
  }

  pins = data || [];
  window.__allPins = pins;
  window.delhiRentApp?.onPinsLoaded(pins);
  return pins;
}

function subscribeToRealtime() {
  supabase.channel('pins-channel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'pins',
    }, (payload) => {
      const newPin = payload.new;
      if (newPin.deleted_at || newPin.reports_count >= 3) return;
      if (!pins.find(p => p.id === newPin.id)) {
        pins.push(newPin);
        window.delhiRentApp?.onPinAdded(newPin);
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'pins',
    }, (payload) => {
      const updated = payload.new;
      const idx = pins.findIndex(p => p.id === updated.id);
      if (idx !== -1) {
        if (updated.deleted_at || updated.reports_count >= 3) {
          pins.splice(idx, 1);
          window.delhiRentApp?.onPinRemoved(updated.id);
        } else {
          pins[idx] = { ...pins[idx], ...updated };
          window.delhiRentApp?.onPinUpdated(pins[idx]);
        }
      }
    })
    .subscribe();
}

export async function submitPin(pinData) {
  const deviceId = Auth.getDeviceId();
  const ip = await Auth.fetchIP();

  // Build the insert payload
  const payload = {
    type:           pinData.type,
    lat:            pinData.lat,
    lng:            pinData.lng,
    bhk:            pinData.bhk,
    rent:           pinData.rent,
    device_id:      deviceId,
    creator_ip:     ip,
    furnishing:    pinData.furnishing    || null,
    gated:          pinData.gated        ?? null,
    landlord_type:  pinData.landlord_type || null,
    who_lives:      pinData.who_lives    || null,
    deposit_months: pinData.deposit      || null,
    pets_allowed:   pinData.pets_allowed || null,
    parking:        pinData.parking      || null,
    sqft:           pinData.sqft         || null,
    society_name:   pinData.society_name || null,
    commute_hub:   pinData.commute_hub  || null,
    water_supply:   pinData.water_supply || null,
    power_cuts:     pinData.power_cuts   || null,
    one_liner:      pinData.one_liner    || null,
    looking_for_flatmate: pinData.looking_for_flatmate || false,
    email:          pinData.email       || null,
  };

  const { data, error } = await supabase.from('pins').insert(payload).select().single();

  if (error) {
    console.error('submitPin error:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updatePin(pinId, updates) {
  const deviceId = Auth.getDeviceId();
  const { data, error } = await supabase
    .from('pins')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', pinId)
    .eq('device_id', deviceId) // RLS: only owner
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePin(pinId) {
  const deviceId = Auth.getDeviceId();
  const { error } = await supabase
    .from('pins')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', pinId)
    .eq('device_id', deviceId);

  if (error) throw new Error(error.message);
}

export async function ratePin(pinId, localityRating, builtRating) {
  const deviceId = Auth.getDeviceId();
  const { data, error } = await supabase
    .from('ratings')
    .upsert({
      pin_id: pinId,
      device_id: deviceId,
      locality_rating: localityRating,
      built_rating: builtRating,
    }, {
      onConflict: 'pin_id,device_id',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function commentPin(pinId, body) {
  const deviceId = Auth.getDeviceId();
  const { data, error } = await supabase
    .from('comments')
    .insert({ pin_id: pinId, device_id: deviceId, body })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function reportPin(pinId, reason) {
  const deviceId = Auth.getDeviceId();
  await supabase.from('reports').insert({ pin_id: pinId, device_id: deviceId, reason });
  // Use server-side function to increment reports_count (bypasses RLS)
  await supabase.rpc('increment_reports_count', { pin_id: pinId, x: 1 }).catch(() => {});
}

export async function sendInterest(pinId, seekerEmail, message) {
  const { data, error } = await supabase.rpc('send_interest', {
    p_pin_id: pinId,
    p_seeker_email: seekerEmail,
    p_message: message,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function watchArea(lat, lng, radiusKm, email, phone, durationMonths) {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

  await supabase.from('watched_areas').insert({
    lat, lng, radius_km: radiusKm, email, phone,
    duration_months: durationMonths,
    expires_at: expiresAt.toISOString(),
  });
}

export async function loadStats() {
  // Average rent by BHK
  const { data: avgData } = await supabase
    .from('pins')
    .select('bhk, rent, type')
    .is('deleted_at', null)
    .eq('type', 'rental')
    .lt('reports_count', 3);

  const grouped = {};
  if (avgData) {
    avgData.forEach(p => {
      const k = p.bhk <= 5 ? p.bhk : 5;
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(p.rent);
    });
  }

  const stats = {};
  Object.entries(grouped).forEach(([bhk, rents]) => {
    const avg = rents.reduce((a, b) => a + b, 0) / rents.length;
    stats[bhk] = { avg: Math.round(avg), count: rents.length };
  });

  return stats;
}

export async function loadLeaderboard() {
  const { data } = await supabase
    .from('pins')
    .select('bhk, rent, society_name, gated, lat, lng')
    .is('deleted_at', null)
    .eq('type', 'rental')
    .lt('reports_count', 3)
    .order('rent', { ascending: false })
    .limit(5);
  return data || [];
}

export function getPin(id) {
  return pins.find(p => p.id === id);
}

export function getAllPins() {
  return pins;
}

export { formMode, formData };
