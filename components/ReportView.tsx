import React, { useEffect, useState } from 'react';
import { VisitorEntry } from '../types';
import { formatDateID, APP_NAME } from '../constants';
import { generateDailyReport } from '../services/geminiService';
import { Printer, Sparkles, AlertCircle } from 'lucide-react';

interface ReportViewProps {
  data: VisitorEntry[];
  onClose: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ data, onClose }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const today = new Date().toISOString().split('T')[0];

  // Filter for today only for the report
  const todaysData = data.filter(d => d.date === today);
  const totalVisitorsToday = todaysData.reduce((acc, curr) => acc + curr.visitorCount, 0);

  useEffect(() => {
    const fetchSummary = async () => {
      if (todaysData.length > 0) {
        setLoadingAi(true);
        const summary = await generateDailyReport(todaysData);
        setAiSummary(summary);
        setLoadingAi(false);
      } else {
        setAiSummary("Belum ada data kunjungan hari ini untuk dianalisis.");
      }
    };
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Actions - Hidden on Print */}
      <div className="no-print p-4 border-b flex justify-between items-center bg-slate-50 sticky top-0 z-10">
        <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
          &larr; Kembali
        </button>
        <div className="flex gap-2">
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            >
                <Printer size={18} /> Cetak Laporan
            </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-4xl mx-auto p-8 bg-white" id="printable-area">
        
        {/* Letterhead */}
        <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{APP_NAME}</h1>
          <p className="text-slate-600">Laporan Harian Buku Tamu Digital</p>
          <p className="text-sm text-slate-500 mt-2">Tanggal: {formatDateID(today)}</p>
        </div>

        {/* AI Summary Section */}
        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-purple-700">
                <Sparkles size={20} />
                <h3 className="font-bold text-lg">Ringkasan Eksekutif (AI Generated)</h3>
            </div>
            {loadingAi ? (
                <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
            ) : (
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                    {aiSummary}
                </div>
            )}
            {!process.env.API_KEY && !loadingAi && (
                 <div className="mt-4 flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded">
                    <AlertCircle size={16}/>
                    <span>API Key belum diset. Fitur AI tidak dapat membuat ringkasan real-time.</span>
                 </div>
            )}
        </div>

        {/* Stats Table */}
        <div className="mb-8">
            <h3 className="font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">Statistik Hari Ini</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-white">
                    <span className="text-slate-500 block text-sm">Total Grup/Tamu</span>
                    <span className="text-2xl font-bold">{todaysData.length}</span>
                </div>
                <div className="p-4 border rounded-lg bg-white">
                    <span className="text-slate-500 block text-sm">Total Jumlah Orang</span>
                    <span className="text-2xl font-bold">{totalVisitorsToday}</span>
                </div>
            </div>
        </div>

        {/* Detailed Table */}
        <div>
            <h3 className="font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">Detail Kunjungan</h3>
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-slate-100 border-y border-slate-200">
                        <th className="p-3 font-semibold text-slate-700">Waktu</th>
                        <th className="p-3 font-semibold text-slate-700">Nama</th>
                        <th className="p-3 font-semibold text-slate-700">Pekerjaan</th>
                        <th className="p-3 font-semibold text-slate-700">Keperluan</th>
                        <th className="p-3 font-semibold text-slate-700 text-center">Jml</th>
                        <th className="p-3 font-semibold text-slate-700">Penerima</th>
                        <th className="p-3 font-semibold text-slate-700 text-center">TTD</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {todaysData.map((entry) => (
                        <tr key={entry.id}>
                            <td className="p-3 text-slate-600">
                                {new Date(entry.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="p-3 font-medium text-slate-900">{entry.name}</td>
                            <td className="p-3 text-slate-600">{entry.occupation}</td>
                            <td className="p-3 text-slate-600">{entry.purpose}</td>
                            <td className="p-3 text-slate-600 text-center">{entry.visitorCount}</td>
                            <td className="p-3 text-slate-600">{entry.receivedBy}</td>
                            <td className="p-3 text-center">
                                <img src={entry.signatureData} alt="ttd" className="h-8 inline-block opacity-80" />
                            </td>
                        </tr>
                    ))}
                    {todaysData.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                                Tidak ada data kunjungan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Footer Signature Area for Hardcopy */}
        <div className="mt-16 flex justify-end print-only">
            <div className="text-center w-64">
                <p className="mb-16">Mengetahui,</p>
                <p className="font-bold underline">Kepala BAPAS</p>
                <p className="text-sm text-slate-500">NIP. ..........................</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ReportView;