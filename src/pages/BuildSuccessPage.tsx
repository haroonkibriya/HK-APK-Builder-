import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  QrCode, 
  CheckCircle2, 
  RotateCcw, 
  Share2, 
  Info, 
  FileCode, 
  Smartphone, 
  ArrowLeft,
  Calendar,
  HardDrive
} from 'lucide-react';
import { BuildRecord } from '../types';
import { QrCodeModal } from '../components/QrCodeModal';
import { GithubActionExport } from '../components/GithubActionExport';

interface BuildSuccessPageProps {
  record: BuildRecord;
  onBuildAgain: () => void;
  onViewHistory: () => void;
}

export const BuildSuccessPage: React.FC<BuildSuccessPageProps> = ({
  record,
  onBuildAgain,
  onViewHistory
}) => {
  const [showQr, setShowQr] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleDownload = () => {
    // Generate a compliant dummy APK binary download for demonstration
    const blob = new Blob([
      `HK APK BUILDER ARTIFACT\nApp: ${record.appName}\nPackage: ${record.packageName}\nv${record.versionName}\nBuild-ID: ${record.buildId}\n`
    ], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.apkFileName || `${record.appName}-v${record.versionName}.apk`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Celebration Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Build Completed Successfully</span>
        <h2 className="text-3xl font-black text-white mt-1">APK Ready for Download!</h2>
        <p className="text-slate-400 text-sm mt-1">
          Your web application has been packaged inside an Android native shell.
        </p>
      </div>

      {/* Main Details Card */}
      <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 shadow-2xl mb-6">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          <div
            style={{ backgroundColor: record.iconColor }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white/20 shrink-0"
          >
            {record.iconBadge || record.appName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{record.appName}</h3>
            <p className="text-xs text-slate-400 font-mono truncate">{record.packageName}</p>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
              <span>v{record.versionName}</span>
              <span>•</span>
              <span className="text-cyan-400 font-mono">{record.buildId}</span>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">APK Size</span>
            <span className="text-white font-bold">{record.apkFileSize || '19.4 MB'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Format</span>
            <span className="text-white font-bold">Debug APK</span>
          </div>
          <div>
            <span className="text-slate-500 block">Validity</span>
            <span className="text-emerald-400 font-semibold">24 Hours</span>
          </div>
          <div>
            <span className="text-slate-500 block">Built</span>
            <span className="text-white font-bold">Just Now</span>
          </div>
        </div>

        {/* Primary Action Button: Download */}
        <div className="pt-5 space-y-3">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD APK ({record.apkFileSize || '19.4 MB'})</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowQr(true)}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Show QR Code</span>
            </button>

            <button
              onClick={() => setShowWorkflow(!showWorkflow)}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>GitHub Actions CI</span>
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Actions CI Export Section */}
      {showWorkflow && (
        <div className="mb-6 animate-fade-in">
          <GithubActionExport config={record} />
        </div>
      )}

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6 text-xs text-slate-300">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Android Installation Notice:</strong> Android may ask you to allow installation from this source. This is normal for APK files installed outside Google Play.
        </p>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBuildAgain}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Build Another App</span>
        </button>

        <button
          onClick={onViewHistory}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-semibold transition"
        >
          <span>View in History</span>
        </button>
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        downloadUrl={record.downloadUrl}
        appName={record.appName}
        versionName={record.versionName}
      />
    </div>
  );
};
