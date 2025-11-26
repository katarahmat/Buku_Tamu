import { VisitorEntry } from "../types";

const STORAGE_KEY = 'bapas_guestbook_data';

export const getEntries = (): VisitorEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEntry = (entry: VisitorEntry) => {
  const entries = getEntries();
  const existingIndex = entries.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.unshift(entry); // Add to top
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const deleteEntry = (id: string) => {
  const entries = getEntries();
  const filtered = entries.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Mock Google Drive Upload
export const mockUploadToDrive = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a Drive ID
      const driveId = `DRIVE_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      resolve(driveId);
    }, 2000); // 2 seconds delay to simulate network
  });
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};