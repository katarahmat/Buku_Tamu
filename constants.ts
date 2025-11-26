export const APP_NAME = "BAPAS MPP Teluk Kuantan";
export const APP_SUBTITLE = "Sistem Informasi Buku Tamu Digital";

export const STAFF_LIST = [
  "Petugas Piket A",
  "Petugas Piket B",
  "Staff Administrasi",
  "Kepala BAPAS",
  "Lainnya"
];

export const MOCK_DRIVE_FOLDER_ID = "1A2B3C4D5E6F_MOCK_FOLDER";

// Helper to format date for display (Indonesia)
export const formatDateID = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const formatTimeID = (dateString: string) => {
   return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}