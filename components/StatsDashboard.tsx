import React, { useMemo } from 'react';
import { VisitorEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatDateID } from '../constants';
import { Users, FileText, UserCheck } from 'lucide-react';

interface StatsDashboardProps {
  data: VisitorEntry[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ data }) => {
  
  const stats = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    let totalVisitors = 0;
    
    data.forEach(entry => {
        const dateKey = entry.date;
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + entry.visitorCount;
        totalVisitors += entry.visitorCount;
    });

    const chartData = Object.keys(dailyCounts)
        .sort()
        .slice(-7) // Last 7 active days
        .map(date => ({
            name: formatDateID(date).split(',')[0], // Take day name only for brevity or full date
            fullDate: formatDateID(date),
            visitors: dailyCounts[date]
        }));

    return {
        totalVisitors,
        totalEntries: data.length,
        chartData
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">Total Pengunjung</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalVisitors}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <FileText size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">Total Laporan</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalEntries}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <UserCheck size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">Hari Aktif</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.chartData.length}</h3>
            </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Grafik Pengunjung (7 Hari Terakhir)</h3>
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                        cursor={{fill: '#f1f5f9'}}
                    />
                    <Bar dataKey="visitors" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} name="Jumlah Pengunjung" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;