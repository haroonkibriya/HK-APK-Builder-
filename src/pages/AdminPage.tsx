import React from 'react';
import { Cpu, HardDrive, ShieldCheck, Activity, Layers, Terminal, Zap } from 'lucide-react';
import { BuildRecord } from '../types';

interface AdminPageProps {
  builds: BuildRecord[];
}

export const AdminPage: React.FC<AdminPageProps> = ({ builds }) => {
  const successCount = builds.filter(b => b.status === 'SUCCESS').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">System Infrastructure</span>
          <h2 className="text-2xl font-black text-white">Engine Health & Metrics</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>All Systems Operational</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#131D31] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Total Builds</span>
          <div className="text-2xl font-black text-white mt-1">{builds.length}</div>
          <span className="text-[10px] text-cyan-400">Current Session</span>
        </div>
        <div className="bg-[#131D31] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Success Rate</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {builds.length > 0 ? `${Math.round((successCount / builds.length) * 100)}%` : '100%'}
          </div>
          <span className="text-[10px] text-slate-400">{successCount} Completed</span>
        </div>
        <div className="bg-[#131D31] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Worker Status</span>
          <div className="text-2xl font-black text-white mt-1">4 Active</div>
          <span className="text-[10px] text-emerald-400">Docker Isolated</span>
        </div>
        <div className="bg-[#131D31] border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Storage TTL</span>
          <div className="text-2xl font-black text-white mt-1">24 Hours</div>
          <span className="text-[10px] text-slate-400">Auto-Purge Active</span>
        </div>
      </div>

      {/* System Specifications */}
      <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Container Runtime Specifications</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Capacitor Engine:</span>
            <span className="text-white font-mono font-semibold">v6.0.0 (Capacitor Android)</span>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Gradle Toolchain:</span>
            <span className="text-white font-mono font-semibold">Gradle 8.5 / AGP 8.3</span>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Target Android SDK:</span>
            <span className="text-white font-mono font-semibold">API 34 / Java 17 Temurin</span>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Security Sandbox:</span>
            <span className="text-emerald-400 font-semibold">SSRF Filter & Memory Limit</span>
          </div>
        </div>
      </div>

      {/* Security Policies */}
      <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security & Build Isolation Policies</span>
        </h3>
        <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
          <li>Loopback and private RFC1918 subnets (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16) are automatically rejected to prevent SSRF vulnerabilities.</li>
          <li>Temporary build workspaces and generated APK files are automatically purged after 24 hours.</li>
          <li>No secrets, passwords, or personal signing keystores are stored in browser storage or plaintext files.</li>
        </ul>
      </div>
    </div>
  );
};
