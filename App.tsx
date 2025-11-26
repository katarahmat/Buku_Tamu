import React, { useState, useEffect } from 'react';
import { ViewState, VisitorEntry } from './types';
import { getEntries, deleteEntry } from './services/storageService';
import { APP_NAME, APP_SUBTITLE, formatDateID } from './constants';

import GuestForm from './components/GuestForm';
import StatsDashboard from './components/StatsDashboard';
import ReportView from './components/ReportView';

import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileBarChart, 
  Menu, 
  X, 
  Pencil, 
  Trash2, 
  Search,
  Image as ImageIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('form');
  const [entries, setEntries] = useState<VisitorEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<VisitorEntry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data on mount and when view changes
  useEffect(() => {
    setEntries(getEntries());
  }, [view]);

  const handleSuccess = () => {
    setEditingEntry(null);
    setEntries(getEntries());
    setView('list'); // Redirect to list after save
    // Show toast notification? (omitted for brevity)
  };

  const handleEdit = (entry: VisitorEntry) => {
    setEditingEntry(entry);
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      deleteEntry(id);
      setEntries(getEntries());
    }
  };

  // Filter entries
  const filteredEntries = entries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render content based on view
  const renderContent = () => {
    switch (view) {
      case 'form':
        return <GuestForm onSuccess={handleSuccess} editData={editingEntry} />;
      
      case 'dashboard':
        return <StatsDashboard data={entries} />;

      case 'report':
        return <ReportView data={entries} onClose={() => setView('list')} />;

      case 'list':
      default:
        return (
          <div className="space-y-4">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800">Riwayat Kunjungan</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cari nama, keperluan..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Keperluan</th>
                                <th className="px-6 py-4 text-center">Jml</th>
                                <th className="px-6 py-4 text-center">File</th>
                                <th className="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEntries.map(entry => (
                                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                        <div className="font-medium text-slate-900">{formatDateID(entry.date)}</div>
                                        <div className="text-xs">{new Date(entry.timestamp).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{entry.name}</div>
                                        <div className="text-xs text-slate-500">{entry.occupation}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{entry.purpose}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                                            {entry.visitorCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {entry.photoUrl ? (
                                            <div className="flex justify-center group relative">
                                                <ImageIcon size={18} className="text-slate-400 group-hover:text-blue-500 cursor-pointer"/>
                                                {/* Tooltip for Mock Drive */}
                                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded w-32 z-20">
                                                    Saved to Drive ID: {entry.driveFileId || 'Local'}
                                                </div>
                                            </div>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleEdit(entry)}
                                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(entry.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEntries.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
        );
    }
  };

  // If in Report view, we render full screen without sidebar structure
  if (view === 'report') {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b flex justify-between items-center shadow-sm z-20 sticky top-0">
         <span className="font-bold text-slate-800">Buku Tamu Digital</span>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-700">
            <h1 className="font-bold text-lg leading-tight">{APP_NAME}</h1>
            <p className="text-xs text-slate-400 mt-1">{APP_SUBTITLE}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            <button 
                onClick={() => { setView('form'); setEditingEntry(null); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'form' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                <PlusCircle size={20} />
                <span>Isi Buku Tamu</span>
            </button>

            <button 
                onClick={() => { setView('list'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                <History size={20} />
                <span>Riwayat & Data</span>
            </button>

            <button 
                onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
                <LayoutDashboard size={20} />
                <span>Dashboard Statistik</span>
            </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
             <button 
                onClick={() => { setView('report'); setIsSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-400 hover:bg-slate-800 transition-colors"
            >
                <FileBarChart size={20} />
                <span>Cetak Laporan</span>
            </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
         <div className="max-w-5xl mx-auto">
            {renderContent()}
         </div>
      </main>

    </div>
  );
};

export default App;