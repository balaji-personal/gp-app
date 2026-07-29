export type ScreenName =
  | 'SPLASH'
  | 'WELCOME'
  | 'LOGIN_PROMPT'
  | 'LOGIN'
  | 'REGISTER_VILLAGER'
  | 'CATEGORY_SELECT'
  | 'EXPLAIN_PROBLEM'
  | 'REVIEW_LOCATION'
  | 'COMPLAINT_SUCCESS'
  | 'HOME'
  | 'MY_COMPLAINTS'
  | 'COMPLAINT_DETAIL'
  | 'PROFILE'
  | 'SACHIV_PORTAL';

export type UserRole = 'VILLAGER' | 'SARPANCH' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  fathersName?: string;
  mothersName?: string;
  phone: string;
  role: UserRole;
  gramPanchayatId?: number;
  gramPanchayatName?: string;
  mandalName?: string;
  districtName?: string;
}

export type ComplaintStatus = 'SUBMITTED' | 'UNDER_PROCESS' | 'RESOLVED' | 'CLOSED';

export interface Complaint {
  id: number | string;
  complaintId: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  priority?: string;
  officialRemarks?: string;
  voiceUrl?: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt?: string;
  villagerName?: string;
  villagerPhone?: string;
  gramPanchayatName?: string;
  mandalName?: string;
  districtName?: string;
}
