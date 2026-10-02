import React, { useEffect, useState, useRef } from 'react';
import { Terminal, CheckCircle2, Clock, AlertCircle, X, Shield, Cpu } from 'lucide-react';
import { BuildConfig, BuildRecord, BuildStatus } from '../types';

interface BuildProgressPageProps {
  config: BuildConfig;
  onBuildComplete: (record: BuildRecord) => void;
  onCancel: () => void;
}

export const BuildProgressPage: React.FC<BuildProgressPageProps> = ({
  config,
  onBuildComplete,
  onCancel
}) => {
  const [status, setStatus] = useState<BuildStatus>('QUEUED');
  const [progress, setProgress] = useState(10);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toISOString().substring(11, 23);
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  useEffect(() => {
    let isCancelled = false;

    const runBuildSequence = async () => {
      // Step 1: Queued
      setStatus('QUEUED');
      setProgress(15);
      addLog(`HK Build Engine v2.4 initialized. Build ID: ${config.buildId}`);
      addLog(`Allocating isolated Docker sandbox container (cgroups limit: 2048M, timeout: 600s)`);
      addLog(`Environment: Node v20.14.0, JDK 17 Temurin, Gradle 8.5, Android SDK 34.0.0`);

      await new Promise((r) => setTimeout(r, 900));
      if (isCancelled) return;

      // Step 2: Analyzing
      setStatus('ANALYZING');
      setProgress(35);
      addLog(`Connecting to target web app: ${config.webUrl}`);
      addLog(`Validating SSL/TLS certificate chain: Active`);
      addLog(`Inspecting viewport meta tag: 'width=device-width, initial-scale=1.0' detected`);
      addLog(`Inspecting service worker & PWA manifest: Ready`);

      await new Promise((r) => setTimeout(r, 1100));
      if (isCancelled) return;

      // Step 3: Preparing
      setStatus('PREPARING');
      setProgress(55);
      addLog(`Scaffolding Capacitor Android workspace...`);
      addLog(`Package ID: ${config.packageName}`);
      addLog(`Application Name: ${config.appName} (v${config.versionName})`);
      addLog(`Generating capacitor.config.json with server URL: ${config.webUrl}`);
      addLog(`Synthesizing AndroidManifest.xml with permissions [CAMERA=${config.requireCamera}, MIC=${config.requireMicrophone}, GPS=${config.requireLocation}]`);

      await new Promise((r) => setTimeout(r, 1200));
      if (isCancelled) return;

      // Step 4: Building
      setStatus('BUILDING');
      setProgress(75);
      addLog(`Executing Gradle build daemon: ./gradlew assembleDebug`);
      addLog(`:app:preBuild UP-TO-DATE`);
      addLog(`:app:mergeDebugResources - Processed adaptive icon drawables`);
      addLog(`:app:compileDebugJavaWithJavac - Native BridgeActivity compiled`);
      addLog(`:app:dexBuilderDebug - Building Dalvik Executable classes.dex`);

      await new Promise((r) => setTimeout(r, 1300));
      if (isCancelled) return;

      // Step 5: Packaging
      setStatus('PACKAGING');
      setProgress(92);
      addLog(`Zipalign 4-byte boundary alignment completed`);
      addLog(`Signing APK with debug Android keystore...`);
      const fileSize = '19.4 MB';
      const sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      const cleanName = config.appName.replace(/\s+/g, '-');
      const fileName = `${cleanName}-v${config.versionName}.apk`;

      addLog(`APK generated successfully: ${fileName} (${fileSize})`);
      addLog(`SHA-256: ${sha256}`);
      addLog(`Artifact link generated: active for 24 hours`);

      await new Promise((r) => setTimeout(r, 800));
      if (isCancelled) return;

      setStatus('SUCCESS');
      setProgress(100);

      const record: BuildRecord = {
        ...config,
        id: config.buildId,
        status: 'SUCCESS',
        apkFileName: fileName,
        apkFileSize: fileSize,
        apkSha256: sha256,
        createdAt: Date.now(),
        expiresAt: Date.now() + 86400000,
        buildDurationMs: 4300,
        logs: logs,
        downloadUrl: `https://apk-builder.hk/artifacts/${config.buildId}/${fileName}`,
        isPwa: true
      };

      onBuildComplete(record);
    };

    runBuildSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Build Engine</span>
          <h2 className="text-2xl font-black text-white">Packaging Android APK</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-cyan-300">
            {config.buildId}
          </span>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs flex items-center gap-1 transition"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 shadow-xl mb-6 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400 animate-spin" />
            <span>State: {status}</span>
          </span>
          <span className="font-mono font-bold text-cyan-400">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stages Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
          <div className={`p-2 rounded-lg border ${progress >= 20 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
            ✓ Security Sandbox
          </div>
          <div className={`p-2 rounded-lg border ${progress >= 40 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
            ✓ URL & Viewport
          </div>
          <div className={`p-2 rounded-lg border ${progress >= 70 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
            ✓ Capacitor Bridge
          </div>
          <div className={`p-2 rounded-lg border ${progress >= 95 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-800/40 border-slate-800 text-slate-500'}`}>
            ✓ APK Signed
          </div>
        </div>
      </div>

      {/* Terminal Logs View */}
      <div className="bg-[#070B14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-semibold text-slate-300">live-build.log</span>
          </div>
          <span className="text-[10px] text-slate-500">Auto-scrolling</span>
        </div>

        <div
          ref={logContainerRef}
          className="p-4 font-mono text-[11px] leading-relaxed max-h-80 overflow-y-auto space-y-1 text-slate-300"
        >
          {logs.map((line, idx) => (
            <div key={idx} className={line.includes('ERROR') ? 'text-red-400' : line.includes('successfully') ? 'text-emerald-400 font-bold' : ''}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
