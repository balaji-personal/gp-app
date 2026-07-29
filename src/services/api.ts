import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export async function loginUserApi(phone: string, pin: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, pin }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');
    return data;
  } catch (err) {
    console.warn('API login offline or failed:', err);
    return null;
  }
}

export async function registerUserApi(userData: {
  fullName: string;
  fathersName?: string;
  mothersName?: string;
  phone: string;
  pin: string;
  districtId?: number;
  mandalId?: number;
  gramPanchayatId?: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: userData.fullName,
        fathersName: userData.fathersName || 'N/A',
        mothersName: userData.mothersName || 'N/A',
        phone: userData.phone,
        pin: userData.pin,
        districtId: userData.districtId || 1,
        mandalId: userData.mandalId || 1,
        gramPanchayatId: userData.gramPanchayatId || 1,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Registration failed');
    return data;
  } catch (err) {
    console.warn('API registration offline or failed:', err);
    return null;
  }
}

export async function createComplaintApi(complaintData: {
  category: string;
  description: string;
  token?: string;
}) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (complaintData.token) headers['Authorization'] = `Bearer ${complaintData.token}`;
    const res = await fetch(`${API_BASE_URL}/complaints/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        category: complaintData.category,
        description: complaintData.description,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('Failed to create complaint');
    return data;
  } catch (err) {
    console.warn('API create complaint offline or failed:', err);
    return null;
  }
}

export async function fetchMyComplaintsApi(token?: string) {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/complaints/my-complaints`, { headers });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('Failed to fetch complaints');
    return data;
  } catch (err) {
    console.warn('API my complaints offline or failed:', err);
    return null;
  }
}

export async function updateComplaintStatusApi(complaintId: string | number, newStatus: string, remarks?: string, token?: string) {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/sarpanch/complaints/${complaintId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        newStatus: newStatus.toUpperCase().replace(/\s+/g, '_'),
        remarks,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('Failed to update complaint status');
    return data;
  } catch (err) {
    console.warn('API update complaint status offline or failed:', err);
    return null;
  }
}
