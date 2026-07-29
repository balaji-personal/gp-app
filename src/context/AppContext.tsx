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
}

// Pending complaint data that gets saved during the 3-step flow
// before the user is forced to authenticate
export interface PendingComplaint {
  category: string;
  description: string;
  hasPhoto: boolean;
  hasVoice: boolean;
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

const DEFAULT_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'GP-2026-0481',
    category: 'Roads & Infrastructure',
    description: 'Main road damage near Machnoor Gram Panchayat school gate. Large potholes causing difficulty for daily commuters.',
    date: '28 Jul 2026',
    status: 'Under Process',
    hasPhoto: true,
    voiceSeconds: 12,
    officialRemarks: 'Complaint received. Field inspection scheduled by Panchayat Secretary K. Narsaiah.',
    villagerName: 'B. Balaji',
    villagerPhone: '9812345678',
    location: 'Machnoor, Jharasangam, Sangareddy',
  },
  {
    id: 'GP-2026-0399',
    category: 'Water & Drainage',
    description: 'Water pipeline leakage near South Street water tank. Drinking water is getting wasted.',
    date: '21 Jul 2026',
    status: 'Under Process',
    hasPhoto: true,
    voiceSeconds: 8,
    officialRemarks: 'Pipe repair technician dispatched to site.',
    villagerName: 'K. Ramesh',
    villagerPhone: '9876500001',
    location: 'Machnoor, Jharasangam, Sangareddy',
  },
  {
    id: 'GP-2026-0312',
    category: 'Sanitation & Cleanliness',
    description: 'Garbage collection delayed in Ward 3 for 4 days. Need immediate cleaning.',
    date: '10 Jul 2026',
    status: 'Resolved',
    hasPhoto: false,
    officialRemarks: 'Sanitation crew deployed and site cleaned completely.',
    villagerName: 'M. Lakshmi',
    villagerPhone: '9876500002',
    location: 'Machnoor, Jharasangam, Sangareddy',
  },
  {
    id: 'GP-2026-0205',
    category: 'Govt Services & Certificates',
    description: 'Inquiry regarding Gram Sabha meeting agenda and street lighting approval.',
    date: '28 Jun 2026',
    status: 'Closed',
    hasPhoto: false,
    officialRemarks: 'Information provided to villager during Gram Panchayat session.',
    villagerName: 'P. Mallaiah',
    villagerPhone: '9876500003',
    location: 'Machnoor, Jharasangam, Sangareddy',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<{ screen: Screen; params: Record<string, any> }[]>([
    { screen: 'SPLASH', params: {} },
  ]);

  const [lang, setLangState] = useState<Language>('en');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(DEFAULT_COMPLAINTS);
  const [lastCreatedComplaintId, setLastCreatedComplaintId] = useState<string>('GP-2026-0481');
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
    id: c.complaintId || c.id || `GP-2026-0${Math.floor(100 + Math.random() * 900)}`,
    category: c.category,
    description: c.description,
    date: c.createdAt
      ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Today',
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
    officialRemarks: c.officialRemarks || 'Under Panchayat review',
    villagerName: c.villagerName || c.user?.fullName || session?.fullName || '',
    villagerPhone: c.villagerPhone || c.user?.phone || session?.phone || '',
    location: c.location || 'Machnoor, Jharasangam, Sangareddy',
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
        const raw: any[] = apiRes?.data || apiRes?.complaints || [];
        if (Array.isArray(raw) && raw.length > 0) {
          setComplaints(raw.map((c) => mapApiComplaint(c, userSession)));
        }
      } catch {
        // API offline — keep default/local data
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
      const user: UserSession = {
        id: apiRes.user?.id,
        fullName: apiRes.user?.fullName || 'User',
        fathersName: apiRes.user?.fathersName,
        mothersName: apiRes.user?.mothersName,
        phone: apiRes.user?.phone || phone,
        role: (apiRes.user?.role || 'VILLAGER') as any,
        district: apiRes.user?.district || 'Sangareddy',
        mandal: apiRes.user?.mandal || 'Jharasangam',
        village: apiRes.user?.village || apiRes.user?.gramPanchayat || 'Machnoor',
        token: apiRes.token,
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
      const user: UserSession = {
        id: apiRes.user?.id,
        fullName: apiRes.user?.fullName || details.fullName || '',
        fathersName: apiRes.user?.fathersName || details.fathersName,
        mothersName: apiRes.user?.mothersName || details.mothersName,
        phone: apiRes.user?.phone || details.phone || '',
        role: (apiRes.user?.role || 'VILLAGER') as any,
        district: details.district || 'Sangareddy',
        mandal: details.mandal || 'Jharasangam',
        village: details.village || 'Machnoor',
        token: apiRes.token,
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
      const randomId = `GP-2026-0${Math.floor(100 + Math.random() * 900)}`;
      let assignedId = randomId;
      try {
        const apiRes = await createComplaintApi({
          category: data.category || 'Roads & Infrastructure',
          description: data.description || 'Village issue requiring immediate Panchayat attention.',
          token: userSession?.token,
        });
        assignedId = apiRes?.data?.complaintId || randomId;
      } catch {
        // Offline — use local random ID
      }

      const newRecord: ComplaintRecord = {
        id: assignedId,
        category: data.category || 'Roads & Infrastructure',
        description: data.description || 'Village issue requiring Panchayat attention.',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Submitted',
        hasPhoto: data.hasPhoto || false,
        voiceSeconds: data.voiceSeconds || 0,
        officialRemarks: 'Complaint received by Gram Panchayat office.',
        villagerName: userSession?.fullName || 'B. Balaji',
        villagerPhone: userSession?.phone || '9812345678',
        location: `${userSession?.village || 'Machnoor'}, ${userSession?.mandal || 'Jharasangam'}, ${userSession?.district || 'Sangareddy'}`,
      };

      setComplaints((prev) => [newRecord, ...prev]);
      setLastCreatedComplaintId(assignedId);
      return assignedId;
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
