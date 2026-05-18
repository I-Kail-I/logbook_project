export interface User {
  nip: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    nip: string;
    nama?: string;
  };
}

export interface Tupoksi {
  id: string;
  nama: string;
  deskripsi?: string;
}

export interface Logbook {
  id: number;
  nip: string;
  tupoksiDdl: string;
  deskripsiPekerjaan: string;
  aktifitas: string;
  linkDokumen?: string;
  tanggal: string;
  fileDokumenLogbook?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LogbookFormData {
  nip: string;
  idLogbook?: string;
  tupoksiDdl: string;
  deskripsiPekerjaan: string;
  aktifitas: string;
  linkDokumen?: string;
  tanggal: string;
  fileDokumenLogbook?: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface CreateLogbookResponse {
  success: boolean;
  message?: string;
  data?: Logbook;
}

export interface GetLogbookResponse {
  success: boolean;
  data?: Logbook[];
  message?: string;
}

export interface GetTupoksiResponse {
  success: boolean;
  data?: Tupoksi[];
  message?: string;
}

export interface DeleteLogbookResponse {
  success: boolean;
  message?: string;
}

export interface Statistics {
  totalLogbook: number;
  thisMonth: number;
  avgPerDay: number;
  totalHours: number;
  weeklyData: { day: string; count: number }[];
  monthlyData: { week: string; count: number }[];
  byStatus: {
    completed: number;
    inProgress: number;
    pending: number;
  };
  byCategory: Record<string, number>;
}