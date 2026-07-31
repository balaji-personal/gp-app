import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, translations } from '../translations/i18n';
import { loginUserApi, registerUserApi, createComplaintApi, fetchMyComplaintsApi, fetchAllComplaintsApi, updateComplaintStatusApi } from '../services/api';

export type Screen =
  | 'SPLASH'
  | 'WELCOME'
  | 'REGISTER'
  | 'LOGIN'
  | 'AUTH_PROMPT'
  | 'HOME'
  | 'REGISTER_COMPLAINT'
  | 'COMPLAINT_SUBMITTED'
  | 'MY_COMPLAINTS'
  | 'COMPLAINT_DETAILS'
  | 'PROFILE'
  | 'SARPANCH_PORTAL';

export interface UserSession {
  id?: number;
  fullName: string;
  fathersName?: string;
  mothersName?: string;
  phone: string;
  role: 'VILLAGER' | 'SARPANCH' | 'ADMIN';
  district: string;
  mandal: string;
  village: string;
  gramPanchayatId?: number;
  mandalId?: number;
  districtId?: number;
  state?: string;
  token?: string;
}

export interface ComplaintRecord {
  id: string;
  category: string;
  description: string;
  date: string;
  status: 'Submitted' | 'Under Process' | 'Resolved' | 'Closed';
  hasPhoto: boolean;
  voiceSeconds?: number;
  officialRemarks?: string;
  villagerName?: string;
  villagerPhone?: string;
  location?: string;
  imageUri?: string;
  imageName?: string;
  imageType?: string;
  voiceUri?: string;
  voiceName?: string;
  voiceType?: string;
}

// Pending complaint data that gets saved during the 3-step flow
// before the user is forced to authenticate
export interface PendingComplaint {
  category: string;
  description: string;
  hasPhoto: boolean;
  hasVoice: boolean;
  imageUri?: string;
  imageName?: string;
  imageType?: string;
  voiceUri?: string;
  voiceName?: string;
  voiceType?: string;
}

interface AppContextState {
  screen: Screen;
  params: Record<string, any>;
  navigate: (screen: Screen, params?: Record<string, any>) => void;
  resetStack: (screen: Screen, params?: Record<string, any>) => void;
  back: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof translations['en'], vars?: Record<string, any>) => string;
  userSession: UserSession | null;
  isAuthenticated: boolean;
  loginUser: (phone: string, pin: string) => Promise<{ success: boolean; role: string; error?: string }>;
  registerUser: (details: Partial<UserSession> & { pin: string; districtId?: number; mandalId?: number; gramPanchayatId?: number }) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  complaints: ComplaintRecord[];
  addComplaint: (complaint: Partial<ComplaintRecord>) => Promise<string>;
  updateComplaintStatus: (id: string, newStatus: 'Submitted' | 'Under Process' | 'Resolved' | 'Closed', remarks?: string) => Promise<void>;
  lastCreatedComplaintId: string;
  // Pending complaint (saved before login/register redirect)
  pendingComplaint: PendingComplaint | null;
  setPendingComplaint: (c: PendingComplaint | null) => void;
}

const AppContext = createContext<AppContextState | null>(null);

function normalizeRole(role: unknown): UserSession['role'] {
  const normalizedRole = String(role || 'VILLAGER').trim().toUpperCase();
  if (normalizedRole === 'SARPANCH' || normalizedRole === 'ADMIN') return normalizedRole;
  return 'VILLAGER';
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<{ screen: Screen; params: Record<string, any> }[]>([
    { screen: 'SPLASH', params: {} },
  ]);

  const [lang, setLangState] = useState<Language>('en');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [lastCreatedComplaintId, setLastCreatedComplaintId] = useState<string>('');
  // Pending complaint saved before auth redirect
  const [pendingComplaint, setPendingComplaint] = useState<PendingComplaint | null>(null);

  // STRICT language setter — only 'en' or 'te' allowed
  const setLang = useCallback((l: Language) => {
    if (l === 'en' || l === 'te') {
      setLangState(l);
    }
  }, []);

  // Translation function — strictly uses selected language, no mixing
  const t = useCallback(
    (key: keyof typeof translations['en'], vars?: Record<string, any>): string => {
      // Use ONLY the selected language dictionary
      const dict = lang === 'te' ? translations['te'] : translations['en'];
      let val = (dict as any)[key];
      // Fallback: if key missing in dict, use English (but don't mix Telugu into English mode)
      if (val === undefined || val === null) {
        val = (translations['en'] as any)[key] || String(key);
      }
      if (vars) {
        Object.keys(vars).forEach((k) => {
          val = val.replace(`{${k}}`, String(vars[k]));
        });
      }
      return val;
    },
    [lang]
  );

  // Map raw API complaint to our internal ComplaintRecord shape
  const mapApiComplaint = (c: any, session: UserSession | null): ComplaintRecord => ({
    id: String(c.complaintId || c.id || ''),
    category: c.category || '',
    description: c.description || '',
    date: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    status:
      c.status === 'UNDER_PROCESS'
        ? 'Under Process'
        : c.status === 'RESOLVED'
          ? 'Resolved'
          : c.status === 'CLOSED'
            ? 'Closed'
            : 'Submitted',
    hasPhoto: !!(c.imageUrls && c.imageUrls.length > 0),
    voiceSeconds: c.voiceUrl ? 12 : 0,
    officialRemarks: c.officialRemarks || '',
    villagerName: c.villagerName || c.user?.fullName || session?.fullName || '',
    villagerPhone: c.villagerPhone || c.user?.phone || session?.phone || '',
    location: c.location || '',
  });

  useEffect(() => {
    async function loadApiComplaints() {
      if (!userSession?.token) return;
      try {
        // SARPANCH/ADMIN load all complaints; villager loads their own
        const isSarpanch = userSession.role === 'SARPANCH' || userSession.role === 'ADMIN';
        const apiRes = isSarpanch
          ? await fetchAllComplaintsApi(userSession.token)
          : await fetchMyComplaintsApi(userSession.token);
        const raw: any[] = Array.isArray(apiRes)
          ? apiRes
          : Array.isArray(apiRes?.data)
            ? apiRes.data
            : Array.isArray(apiRes?.data?.complaints)
              ? apiRes.data.complaints
              : Array.isArray(apiRes?.complaints)
                ? apiRes.complaints
                : [];
        setComplaints(raw.map((c) => mapApiComplaint(c, userSession)));
      } catch {
        setComplaints([]);
      }
    }
    loadApiComplaints();
  }, [userSession?.token]);

  const navigate = useCallback((screen: Screen, params: Record<string, any> = {}) => {
    setStack((s) => [...s, { screen, params }]);
  }, []);

  const resetStack = useCallback((screen: Screen, params: Record<string, any> = {}) => {
    setStack([{ screen, params }]);
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const loginUser = useCallback(async (phone: string, pin: string): Promise<{ success: boolean; role: string; error?: string }> => {
    try {
      // This will THROW on wrong credentials — no silent fallback
      const apiRes = await loginUserApi(phone, pin);
      const authData = apiRes?.data || apiRes;
      const apiUser = authData?.user || apiRes?.user || {};
      const user: UserSession = {
        id: apiUser.id,
        fullName: apiUser.fullName || '',
        fathersName: apiUser.fathersName,
        mothersName: apiUser.mothersName,
        phone: apiUser.phone || phone,
        role: normalizeRole(apiUser.role),
        district: apiUser.districtName || apiUser.district || '',
        mandal: apiUser.mandalName || apiUser.mandal || '',
        village: apiUser.gramPanchayatName || apiUser.village || apiUser.gramPanchayat || '',
        gramPanchayatId: apiUser.gramPanchayatId,
        mandalId: apiUser.mandalId,
        districtId: apiUser.districtId,
        state: apiUser.stateName || apiUser.state || '',
        token: authData?.token || apiRes?.token,
      };
      setUserSession(user);
      return { success: true, role: user.role };
    } catch (err: any) {
      // Real API failure — return error, do NOT create a fake session
      return { success: false, role: '', error: err?.message || 'Login failed. Please check your phone number and PIN.' };
    }
  }, []);

  const registerUser = useCallback(async (details: Partial<UserSession> & { pin: string; districtId?: number; mandalId?: number; gramPanchayatId?: number }): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiRes = await registerUserApi({
        fullName: details.fullName || '',
        fathersName: details.fathersName,
        mothersName: details.mothersName,
        phone: details.phone || '',
        pin: details.pin,
        districtId: details.districtId || 1,
        mandalId: details.mandalId || 1,
        gramPanchayatId: details.gramPanchayatId || 1,
      });
      const authData = apiRes?.data || apiRes;
      const apiUser = authData?.user || apiRes?.user || {};
      const user: UserSession = {
        id: apiUser.id,
        fullName: apiUser.fullName || details.fullName || '',
        fathersName: apiUser.fathersName || details.fathersName,
        mothersName: apiUser.mothersName || details.mothersName,
        phone: apiUser.phone || details.phone || '',
        role: normalizeRole(apiUser.role),
        district: apiUser.districtName || apiUser.district || details.district || '',
        mandal: apiUser.mandalName || apiUser.mandal || details.mandal || '',
        village: apiUser.gramPanchayatName || apiUser.village || apiUser.gramPanchayat || details.village || '',
        gramPanchayatId: apiUser.gramPanchayatId || details.gramPanchayatId,
        mandalId: apiUser.mandalId || details.mandalId,
        districtId: apiUser.districtId || details.districtId,
        state: apiUser.stateName || apiUser.state || '',
        token: authData?.token || apiRes?.token,
      };
      setUserSession(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed. Phone may already be registered.' };
    }
  }, []);

  const logoutUser = useCallback(() => {
    setUserSession(null);
    setPendingComplaint(null);
    setStack([{ screen: 'WELCOME', params: {} }]);
  }, []);

  const addComplaint = useCallback(
    async (data: Partial<ComplaintRecord>): Promise<string> => {
      try {
        const apiRes = await createComplaintApi({
          category: data.category || 'Roads & Infrastructure',
          description: data.description || 'Village issue requiring immediate Panchayat attention.',
          imageUri: data.imageUri,
          imageName: data.imageName,
          imageType: data.imageType,
          voiceUri: data.voiceUri,
          voiceName: data.voiceName,
          voiceType: data.voiceType,
          token: userSession?.token,
        });
        const assignedId = apiRes?.data?.complaintId || apiRes?.complaintId || apiRes?.data?.id || apiRes?.id;
        if (!assignedId) return '';

        const newRecord: ComplaintRecord = {
          id: String(assignedId),
          category: data.category || '',
          description: data.description || '',
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Submitted',
          hasPhoto: data.hasPhoto || false,
          voiceSeconds: data.voiceSeconds || 0,
          officialRemarks: '',
          villagerName: userSession?.fullName || '',
          villagerPhone: userSession?.phone || '',
          location: userSession ? `${userSession.village}, ${userSession.mandal}, ${userSession.district}` : '',
        };

        setComplaints((prev) => [newRecord, ...prev]);
        setLastCreatedComplaintId(String(assignedId));
        return String(assignedId);
      } catch {
        return '';
      }
    },
    [userSession]
  );

  const updateComplaintStatus = useCallback(
    async (id: string, newStatus: 'Submitted' | 'Under Process' | 'Resolved' | 'Closed', remarks?: string) => {
      const defaultRemark = remarks || `Status updated to ${newStatus} by Panchayat Secretary.`;
      try {
        await updateComplaintStatusApi(id, newStatus, defaultRemark, userSession?.token);
      } catch {
        // Offline update only in local state
      }
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status: newStatus, officialRemarks: defaultRemark }
            : c
        )
      );
    },
    [userSession?.token]
  );

  const current = stack[stack.length - 1];

  return (
    <AppContext.Provider
      value={{
        screen: current.screen,
        params: current.params,
        navigate,
        resetStack,
        back,
        lang,
        setLang,
        t,
        userSession,
        isAuthenticated: !!userSession,
        loginUser,
        registerUser,
        logoutUser,
        complaints,
        addComplaint,
        updateComplaintStatus,
        lastCreatedComplaintId,
        pendingComplaint,
        setPendingComplaint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
