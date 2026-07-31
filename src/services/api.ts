import { Platform } from 'react-native';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://gp-be-git-main-bal335957.vercel.app/api';

console.log('[API Base URL]:', API_BASE_URL);

// Helper to safely parse JSON response or throw meaningful error
async function parseResponse(res: Response, endpointName: string) {
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let errorMsg = `HTTP ${res.status} ${res.statusText}`;
    if (contentType.includes('application/json')) {
      try {
        const errJson = await res.json();
        errorMsg = errJson.error || errJson.message || errorMsg;
      } catch {}
    } else {
      const text = await res.text();
      console.warn(`[API ${endpointName}] Non-JSON error response (${res.status}):`, text.slice(0, 150));
    }
    throw new Error(errorMsg);
  }

  if (contentType.includes('application/json')) {
    return await res.json();
  }
  throw new Error(`Expected JSON from ${endpointName} but got ${contentType}`);
}

// ─── Locations ────────────────────────────────────────────────────────────────

export async function fetchDistrictsApi() {
  const url = `${API_BASE_URL}/locations/districts`;
  try {
    console.log('[API] Fetching districts from:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[API districts] Returned HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || data?.districts || [];
  } catch (err) {
    console.warn('[API districts] fetch failed:', err);
    return [];
  }
}

export async function fetchMandalsApi(districtId: number) {
  const url = `${API_BASE_URL}/locations/mandals?districtId=${districtId || 1}`;
  try {
    console.log('[API] Fetching mandals from:', url);
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[API mandals] Returned HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || data?.mandals || [];
  } catch (err) {
    console.warn('[API mandals] fetch failed:', err);
    return [];
  }
}

export async function fetchGramPanchayatsApi(mandalId: number) {
  // Backend route is /locations/gps as defined in locations.ts
  let url = `${API_BASE_URL}/locations/gps?mandalId=${mandalId || 1}`;
  try {
    console.log('[API] Fetching gram panchayats from:', url);
    let res = await fetch(url);
    if (!res.ok && res.status === 404) {
      url = `${API_BASE_URL}/locations/gram-panchayats?mandalId=${mandalId || 1}`;
      res = await fetch(url);
    }
    if (!res.ok) {
      console.warn(`[API gram panchayats] Returned HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || data?.gramPanchayats || [];
  } catch (err) {
    console.warn('[API gram panchayats] fetch failed:', err);
    return [];
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUserApi(phone: string, pin: string) {
  const url = `${API_BASE_URL}/auth/login`;
  console.log('[API] Logging in to:', url, { phone });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, pin }),
  });
  const data = await parseResponse(res, 'login');
  return data; // { success: true, token, user }
}

export async function registerUserApi(userData: {
  fullName: string;
  fathersName?: string;
  mothersName?: string;
  phone: string;
  pin: string;
  districtId: number;
  mandalId: number;
  gramPanchayatId: number;
}) {
  const url = `${API_BASE_URL}/auth/register`;
  console.log('[API] Registering villager to:', url, userData);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: userData.fullName,
      fathersName: userData.fathersName || 'N/A',
      mothersName: userData.mothersName || 'N/A',
      phone: userData.phone,
      pin: userData.pin,
      districtId: Number(userData.districtId),
      mandalId: Number(userData.mandalId),
      gramPanchayatId: Number(userData.gramPanchayatId),
    }),
  });
  const data = await parseResponse(res, 'register');
  return data; // { success: true, token, user }
}

// ─── Complaints ───────────────────────────────────────────────────────────────

export async function createComplaintApi(complaintData: {
  category: string;
  description: string;
  imageUri?: string;
  imageName?: string;
  imageType?: string;
  voiceUri?: string;
  voiceName?: string;
  voiceType?: string;
  token?: string;
}) {
  const url = `${API_BASE_URL}/complaints/register`;
  try {
    const headers: Record<string, string> = {};
    if (complaintData.token) headers['Authorization'] = `Bearer ${complaintData.token}`;

    let catKey = complaintData.category.toUpperCase();
    if (catKey.includes('WATER')) catKey = 'WATER';
    else if (catKey.includes('ROAD')) catKey = 'ROADS';
    else if (catKey.includes('LAND')) catKey = 'LAND';
    else if (catKey.includes('GOVT')) catKey = 'GOVT';
    else if (catKey.includes('SANITATION')) catKey = 'SANITATION';
    else catKey = 'OTHER';

    console.log('[API] Creating complaint at:', url, { category: catKey });
    const body = new FormData();
    body.append('category', catKey);
    body.append('description', complaintData.description);
    if (complaintData.imageUri) {
      body.append('images', {
        uri: complaintData.imageUri,
        name: complaintData.imageName || `complaint-image-${Date.now()}.jpg`,
        type: complaintData.imageType || 'image/jpeg',
      } as any);
    }
    if (complaintData.voiceUri) {
      body.append('voice', {
        uri: complaintData.voiceUri,
        name: complaintData.voiceName || `complaint-voice-${Date.now()}.m4a`,
        type: complaintData.voiceType || 'audio/m4a',
      } as any);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    const data = await parseResponse(res, 'createComplaint');
    return data;
  } catch (err) {
    console.warn('[API create complaint] failed (offline fallback):', err);
    return null;
  }
}

export async function fetchMyComplaintsApi(token?: string) {
  const url = `${API_BASE_URL}/complaints/my-complaints`;
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] Fetching my complaints from:', url);
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API my complaints] failed (offline fallback):', err);
    return null;
  }
}

export async function fetchAllComplaintsApi(token?: string) {
  const url = `${API_BASE_URL}/sarpanch/complaints`;
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] Fetching all complaints from:', url);
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API all complaints] failed (offline fallback):', err);
    return null;
  }
}

export async function updateComplaintStatusApi(
  complaintId: string | number,
  newStatus: string,
  remarks?: string,
  token?: string,
) {
  const url = `${API_BASE_URL}/sarpanch/complaints/${complaintId}/status`;
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] Updating complaint status at:', url);
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        newStatus: newStatus.toUpperCase().replace(/\s+/g, '_'),
        remarks,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API update status] failed (offline fallback):', err);
    return null;
  }
}
