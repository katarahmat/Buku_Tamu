export interface VisitorEntry {
  id: string;
  date: string; // ISO string for sorting
  timestamp: number;
  name: string;
  visitorCount: number;
  occupation: string;
  purpose: string;
  receivedBy: string;
  signatureData: string; // Base64
  photoUrl?: string; // Base64 or Drive Link
  driveFileId?: string; // Mock Drive ID
}

export interface DailyStats {
  date: string;
  totalVisitors: number;
  totalGroups: number;
}

export type ViewState = 'form' | 'list' | 'dashboard' | 'report';

export enum AppColors {
  Primary = '#0f172a', // Slate 900
  Secondary = '#334155', // Slate 700
  Accent = '#0ea5e9', // Sky 500
}