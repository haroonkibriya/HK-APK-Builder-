import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { BuildProgressPage } from './pages/BuildProgressPage';
import { BuildSuccessPage } from './pages/BuildSuccessPage';
import { HistoryPage } from './pages/HistoryPage';
import { GuidePage } from './pages/GuidePage';
import { AdminPage } from './pages/AdminPage';
import { BuildConfig, BuildRecord } from './types';
import { Smartphone, Github, Heart } from 'lucide-react';

const STORAGE_KEY = 'hk_apk_builder_history';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeConfig, setActiveConfig] = useState<BuildConfig | null>(null);
  const [latestBuild, setLatestBuild] = useState<BuildRecord | null>(null);
  const [builds, setBuilds] = useState<BuildRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial example build
    return [
      {
        id: 'HK-2026-000101',
        buildId: 'HK-2026-000101',
        appName: 'HK Clinic Portal',
        packageName: 'com.hkclinic.portal',
        versionName: '1.0.0',
        versionCode: 1,
        webUrl: 'https://example.github.io/hk-clinic/',
        orientation: 'auto',
        iconColor: '#10B981',
        iconBadge: 'CP',
        enableSplashScreen: true,
        splashColor: '#0B1220',
        showStatusBar: true,
        fullScreen: false,
        allowExternalBrowser: true,
        enablePullToRefresh: true,
        enableZoom: false,
        requireCamera: true,
        requireMicrophone: false,
        requireLocation: false,
        status: 'SUCCESS',
        apkFileName: 'HK-Clinic-Portal-v1.0.0.apk',
        apkFileSize: '19.4 MB',
        apkSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        createdAt: Date.now() - 86400000,
        expiresAt: Date.now() + 86400000,
        buildDurationMs: 4200,
        logs: [
          '[14:22:01.120] Scaffolding Capacitor wrapper',
          '[14:22:03.450] Gradle assembleDebug SUCCESS',
          '[14:22:04.200] APK generated'
        ],
        downloadUrl: 'https://apk-builder.hk/artifacts/HK-2026-000101/HK-Clinic-Portal-v1.0.0.apk',
        isPwa: true
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
    } catch (e) {
      console.error(e);
    }
  }, [builds]);

  const handleStartBuild = (config: BuildConfig) => {
    setActiveConfig(config);
    setCurrentTab('progress');
  };

  const handleBuildComplete = (record: BuildRecord) => {
    setLatestBuild(record);
    setBuilds((prev) => [record, ...prev.filter((b) => b.id !== record.id)]);
    setCurrentTab('success');
  };

  const handleRebuild = (record: BuildRecord) => {
    setActiveConfig(record);
    setCurrentTab('progress');
  };

  const handleDeleteBuild = (id: string) => {
    setBuilds((prev) => prev.filter((b) => b.id !== id));
  };

  const handleClearAll = () => {
    setBuilds([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-slate-100">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        buildsCount={builds.length}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage onStartBuild={handleStartBuild} />
        )}

        {currentTab === 'progress' && activeConfig && (
          <BuildProgressPage
            config={activeConfig}
            onBuildComplete={handleBuildComplete}
            onCancel={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'success' && latestBuild && (
          <BuildSuccessPage
            record={latestBuild}
            onBuildAgain={() => setCurrentTab('home')}
            onViewHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            builds={builds}
            onRebuild={handleRebuild}
            onDelete={handleDeleteBuild}
            onClearAll={handleClearAll}
          />
        )}

        {currentTab === 'guide' && (
          <GuidePage />
        )}

        {currentTab === 'admin' && (
          <AdminPage builds={builds} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B1220]/80 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">HK APK Builder</span>
            <span>—</span>
            <span>Turn Web Apps Into Android APKs</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/haroonkibriya/HK-APK-Builder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>haroonkibriya/HK-APK-Builder</span>
            </a>
            <span>•</span>
            <span>Built with Google AI Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
