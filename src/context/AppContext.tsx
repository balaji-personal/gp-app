import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, translations } from '../translations/i18n';
import { loginUserApi, registerUserApi, createComplaintApi, fetchMyComplaintsApi, updateComplaintStatusApi } from '../services/api';

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

interface AppContextState {
  screen: Screen;
  params: Record<string, any>;
  navigate: (screen: Screen, params?: Record<string, any>) => void;
  back: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof translations['en'], vars?: Record<string, any>) => string;
  userSession: UserSession | null;
  isAuthenticated: boolean;
  loginUser: (phone: string, pin: string) => Promise<{ success: boolean; role: string }>;
  registerUser: (details: Partial<UserSession> & { pin: string }) => Promise<boolean>;
  logoutUser: () => void;
  complaints: ComplaintRecord[];
  addComplaint: (complaint: Partial<ComplaintRecord>) => Promise<string>;
  updateComplaintStatus: (id: string, newStatus: 'Submitted' | 'Under Process' | 'Resolved' | 'Closed', remarks?: string) => Promise<void>;
  lastCreatedComplaintId: string;
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

  const setLang = useCallback((l: Language) => {
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: keyof typeof translations['en'], vars?: Record<string, any>): string => {
      const dict = translations[lang] || translations['en'];
      let val = (dict as any)[key] || (translations['en'] as any)[key] || key;
      if (vars) {
        Object.keys(vars).forEach((k) => {
          val = val.replace(`{${k}}`, vars[k]);
        });
      }
      return val;
    },
    [lang]
  );

  useEffect(() => {
    async function loadApiComplaints() {
      const apiRes = await fetchMyComplaintsApi(userSession?.token);
      if (apiRes && Array.isArray(apiRes.data) && apiRes.data.length > 0) {
        const mapped: ComplaintRecord[] = apiRes.data.map((c: any) => ({
          id: c.complaintId || `GP-2026-0${c.id}`,
          category: c.category,
          description: c.description,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
          status: c.status === 'UNDER_PROCESS' ? 'Under Process' : c.status === 'RESOLVED' ? 'Resolved' : c.status === 'CLOSED' ? 'Closed' : 'Submitted',
          hasPhoto: c.imageUrls && c.imageUrls.length > 0,
          voiceSeconds: c.voiceUrl ? 12 : 0,
          officialRemarks: c.officialRemarks || 'Under Panchayat review',
          villagerName: userSession?.fullName || 'B. Balaji',
          villagerPhone: userSession?.phone || '9812345678',
          location: 'Machnoor, Jharasangam, Sangareddy',
        }));
        setComplaints(mapped);
      }
    }
    loadApiComplaints();
  }, [userSession?.token]);

  const navigate = useCallback((screen: Screen, params: Record<string, any> = {}) => {
    setStack((s) => [...s, { screen, params }]);
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const loginUser = useCallback(async (phone: string, pin: string): Promise<{ success: boolean; role: string }> => {
    const apiRes = await loginUserApi(phone, pin);
    let user: UserSession;

    const isSarpanchCreds = phone === '9876543210' || (apiRes && apiRes.user && (apiRes.user.role === 'SARPANCH' || apiRes.user.role === 'ADMIN'));

    if (apiRes && apiRes.token) {
      user = {
        fullName: apiRes.user.fullName || (isSarpanchCreds ? 'K. Narsaiah (Panchayat Secretary)' : 'B. Balaji'),
        phone: apiRes.user.phone || phone,
        role: (apiRes.user.role || (isSarpanchCreds ? 'SARPANCH' : 'VILLAGER')) as any,
        district: 'Sangareddy',
        mandal: 'Jharasangam',
        village: 'Machnoor',
        token: apiRes.token,
      };
    } else {
      user = {
        fullName: isSarpanchCreds ? 'K. Narsaiah (Panchayat Secretary)' : 'B. Balaji',
        fathersName: isSarpanchCreds ? 'K. Mallaiah' : 'B. Ramesh',
        mothersName: isSarpanchCreds ? 'K. Laxmi' : 'B. Lakshmi',
        phone: phone || '9812345678',
        role: isSarpanchCreds ? 'SARPANCH' : 'VILLAGER',
        district: 'Sangareddy',
        mandal: 'Jharasangam',
        village: 'Machnoor',
      };
    }

    setUserSession(user);
    return { success: true, role: user.role };
  }, []);

  const registerUser = useCallback(async (details: Partial<UserSession> & { pin: string }): Promise<boolean> => {
    const apiRes = await registerUserApi({
      fullName: details.fullName || 'B. Balaji',
      fathersName: details.fathersName,
      mothersName: details.mothersName,
      phone: details.phone || '9812345678',
      pin: details.pin || '1234',
      districtId: 1,
      mandalId: 1,
      gramPanchayatId: 1,
    });

    let user: UserSession;
    if (apiRes && apiRes.token) {
      user = {
        fullName: apiRes.user.fullName,
        phone: apiRes.user.phone,
        role: apiRes.user.role || 'VILLAGER',
        district: 'Sangareddy',
        mandal: 'Jharasangam',
        village: 'Machnoor',
        token: apiRes.token,
      };
    } else {
      user = {
        fullName: details.fullName || 'B. Balaji',
        fathersName: details.fathersName || 'B. Ramesh',
        mothersName: details.mothersName || 'B. Lakshmi',
        phone: details.phone || '9812345678',
        role: 'VILLAGER',
        district: details.district || 'Sangareddy',
        mandal: details.mandal || 'Jharasangam',
        village: details.village || 'Machnoor',
      };
    }
    setUserSession(user);
    return true;
  }, []);

  const logoutUser = useCallback(() => {
    setUserSession(null);
    setStack([{ screen: 'WELCOME', params: {} }]);
  }, []);

  const addComplaint = useCallback(
    async (data: Partial<ComplaintRecord>): Promise<string> => {
      const randomId = `GP-2026-0${Math.floor(100 + Math.random() * 900)}`;
      const apiRes = await createComplaintApi({
        category: data.category || 'Roads & Infrastructure',
        description: data.description || 'Village issue requiring immediate Panchayat attention.',
        token: userSession?.token,
      });

      const assignedId = apiRes?.data?.complaintId || randomId;
      const newRecord: ComplaintRecord = {
        id: assignedId,
        category: data.category || 'Roads & Infrastructure',
        description: data.description || 'Village issue requiring immediate Panchayat attention.',
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
      const defaultRemark = remarks || `Status updated to ${newStatus} by Panchayat Secretary K. Narsaiah.`;
      
      // Update backend DB if online
      await updateComplaintStatusApi(id, newStatus, defaultRemark, userSession?.token);

      // Update shared state so villagers see changes instantly
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: newStatus,
                officialRemarks: defaultRemark,
              }
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
