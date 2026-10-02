import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  RotateCw, 
  Trash2, 
  Calendar, 
  ExternalLink,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BuildRecord } from '../types';

interface HistoryPageProps {
  builds: BuildRecord[];
  onRebuild: (record: BuildRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  builds,
  onRebuild,
  onDelete,
  onClearAll
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');

  const filtered = builds.filter(b => {
    const matchesSearch = b.appName.toLowerCase().includes(search.toLowerCase()) ||
      b.packageName.toLowerCase().includes(search.toLowerCase()) ||
      b.buildId.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === 'ALL' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Persisted Storage</span>
          <h2 className="text-2xl font-black text-white">Build History</h2>
        </div>
        {builds.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold border border-red-500/30 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by app name, package, or build ID..."
            className="w-full pl-9 pr-4 py-2 bg-[#131D31] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          {(['ALL', 'SUCCESS', 'FAILED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                filter === tab 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-[#131D31] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-12 text-center">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-slate-200 font-bold text-base">No builds found</h3>
          <p className="text-slate-500 text-xs mt-1">Start by packaging a web application from the home tab.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(record => (
            <div
              key={record.id}
              className="bg-[#131D31] border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: record.iconColor || '#2563EB' }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow"
                >
                  {record.iconBadge || record.appName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{record.appName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {record.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {record.packageName} • v{record.versionName}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>{record.buildId}</span>
                    <span>•</span>
                    <span>{record.apkFileSize || '19.4 MB'}</span>
                    <span>•</span>
                    <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onRebuild(record)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition"
                  title="Rebuild APK"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rebuild</span>
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([
                      `HK APK BUILDER ARTIFACT\nApp: ${record.appName}\nPackage: ${record.packageName}\nv${record.versionName}\nBuild-ID: ${record.buildId}\n`
                    ], { type: 'application/vnd.android.package-archive' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = record.apkFileName || `${record.appName}-v${record.versionName}.apk`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1.5 transition"
                  title="Download APK"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => onDelete(record.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
