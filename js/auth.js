// delhi.rent — Device ID + ownership tracking

export const Auth = (() => {
  const DEVICE_ID_KEY = 'delhi_rent_device_id';
  let _deviceId = null;

  function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function getDeviceId() {
    if (_deviceId) return _deviceId;
    _deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!_deviceId) {
      _deviceId = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, _deviceId);
    }
    return _deviceId;
  }

  async function fetchIP() {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const json = await res.json();
      return json.ip;
    } catch {
      return null;
    }
  }

  // Call this once at app init
  async function init(supabase) {
    const did = getDeviceId();
    // Set device_id in supabase session so RLS policies work
    await supabase.rpc('set_config', {
      key: 'app.device_id',
      value: did,
    }).catch(() => {
      // set_config may not be available; auth module handles it differently
    });
    return did;
  }

  return { getDeviceId, fetchIP, init };
})();
