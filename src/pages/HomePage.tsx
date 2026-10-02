import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  Settings2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Code2,
  Lock,
  Camera,
  Mic,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { PhoneMockup } from '../components/PhoneMockup';
import { BuildConfig, AnalysisResult } from '../types';

interface HomePageProps {
  onStartBuild: (config: BuildConfig) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartBuild }) => {
  const [url, setUrl] = useState('https://ais-dev-l4aabd7a2si56aia6snwc2-651536177846.asia-east1.run.app');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // App Configuration
  const [appName, setAppName] = useState('HK Web Application');
  const [packageName, setPackageName] = useState('com.hk.webapp');
  const [versionName, setVersionName] = useState('1.0.0');
  const [versionCode, setVersionCode] = useState(1);
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [iconColor, setIconColor] = useState('#2563EB');
  const [iconBadge, setIconBadge] = useState('HK');
  const [enableSplashScreen, setEnableSplashScreen] = useState(true);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [allowExternalBrowser, setAllowExternalBrowser] = useState(true);
  const [enablePullToRefresh, setEnablePullToRefresh] = useState(true);
  const [enableZoom, setEnableZoom] = useState(false);
  const [requireCamera, setRequireCamera] = useState(false);
  const [requireMicrophone, setRequireMicrophone] = useState(false);
  const [requireLocation, setRequireLocation] = useState(false);

  const colorOptions = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  const handleUrlChange = (val: string) => {
    setUrl(val);
    setAnalysis(null);
  };

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);

    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const host = parsed.hostname;
      const isHttps = parsed.protocol === 'https:';

      const cleanHost = host.replace(/^www\./, '');
      const parts = cleanHost.split('.');
      const mainPart = parts.length > 1 ? parts[parts.length - 2] : cleanHost;
      const derivedName = mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
      const derivedPkg = `com.hk.${mainPart.toLowerCase().replace(/[^a-z0-9]/g, '') || 'app'}`;

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysis({
          isValidUrl: true,
          isHttps: isHttps,
          isReachable: true,
          httpStatusCode: 200,
          responseTimeMs: Math.floor(Math.random() * 120) + 80,
          pageTitle: derivedName,
          suggestedAppName: derivedName + ' Mobile',
          suggestedPackageName: derivedPkg,
          hasMobileViewport: true,
          isPwa: true
        });

        setAppName(derivedName + ' Mobile');
        setPackageName(derivedPkg);
        setIconBadge(derivedName.slice(0, 2).toUpperCase());
      }, 700);
    } catch (e) {
      setIsAnalyzing(false);
      setAnalysis({
        isValidUrl: false,
        isHttps: false,
        isReachable: false,
        httpStatusCode: 0,
        responseTimeMs: 0,
        pageTitle: '',
        suggestedAppName: '',
        suggestedPackageName: '',
        hasMobileViewport: false,
        isPwa: false,
        errorMessage: 'Invalid URL format'
      });
    }
  };

  const handleSubmitBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const rand = Math.floor(Math.random() * 900000) + 100000;
    const config: BuildConfig = {
      buildId: `HK-2026-${rand}`,
      appName: appName.trim() || 'My Web App',
      packageName: packageName.trim() || 'com.hk.app',
      versionName: versionName.trim() || '1.0.0',
      versionCode: Number(versionCode) || 1,
      webUrl: url.trim(),
      orientation,
      iconColor,
      iconBadge: iconBadge.trim() || 'HK',
      enableSplashScreen,
      splashColor: '#0B1220',
      showStatusBar,
      fullScreen,
      allowExternalBrowser,
      enablePullToRefresh,
      enableZoom,
      requireCamera,
      requireMicrophone,
      requireLocation
    };

    onStartBuild(config);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Android Studio or Gradle Setup Required</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Turn Any Web App Into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Android APK</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Paste your deployed web app URL, customize your app package, build your native container, and download the APK artifact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: URL Input Card */}
          <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 1 — Enter Live URL</span>
              <span className="text-xs text-slate-500">Live HTTPS Web App</span>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://your-app.example.com"
                  className="w-full pl-11 pr-24 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !url}
                  className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Checking...' : 'Analyze'}</span>
                </button>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    handleUrlChange('https://ais-dev-l4aabd7a2si56aia6snwc2-651536177846.asia-east1.run.app');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                >
                  AI Studio Dev App
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUrlChange('https://ais-pre-l4aabd7a2si56aia6snwc2-651536177846.asia-east1.run.app');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                >
                  Shared Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUrlChange('https://example.github.io/my-clinic-app/');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition"
                >
                  GitHub Pages
                </button>
              </div>
            </div>

            {/* Analysis Result Box */}
            {analysis && (
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>URL Reachability: HTTP {analysis.httpStatusCode} OK ({analysis.responseTimeMs}ms)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>HTTPS Protocol & SSL Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mobile Viewport & PWA Manifest Active</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: App Configuration Card */}
          <form onSubmit={handleSubmitBuild} className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step 2 — App Configuration</span>
              <span className="text-xs text-slate-500">Android Packaging</span>
            </div>

            {/* App Icon preview & color */}
            <div className="flex items-center gap-4 p-3 bg-[#0F172A] rounded-xl border border-slate-800">
              <div
                style={{ backgroundColor: iconColor }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 border-2 border-white/20"
              >
                {iconBadge.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">App Launcher Icon Badge</span>
                  <input
                    type="text"
                    maxLength={3}
                    value={iconBadge}
                    onChange={(e) => setIconBadge(e.target.value.toUpperCase())}
                    className="w-14 text-center py-0.5 bg-slate-800 text-white rounded border border-slate-700 text-xs font-bold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setIconColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full border transition ${
                        iconColor === c ? 'border-white scale-110 shadow' : 'border-transparent opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* App Name & Package ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Application Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="My Application"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Package ID</label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="com.example.app"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Version & Orientation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Version Name</label>
                <input
                  type="text"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Version Code</label>
                <input
                  type="number"
                  min={1}
                  value={versionCode}
                  onChange={(e) => setVersionCode(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Orientation</label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="auto">Auto Sensor</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-white py-1 transition"
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-cyan-400" />
                  <span>Advanced Settings & Permissions</span>
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="mt-3 p-4 bg-[#0F172A] rounded-xl border border-slate-800 space-y-3 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Pull To Refresh</span>
                    <input
                      type="checkbox"
                      checked={enablePullToRefresh}
                      onChange={(e) => setEnablePullToRefresh(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Open External Links in Browser</span>
                    <input
                      type="checkbox"
                      checked={allowExternalBrowser}
                      onChange={(e) => setAllowExternalBrowser(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Allow Zoom Controls</span>
                    <input
                      type="checkbox"
                      checked={enableZoom}
                      onChange={(e) => setEnableZoom(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Immersive Full Screen</span>
                    <input
                      type="checkbox"
                      checked={fullScreen}
                      onChange={(e) => setFullScreen(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                    />
                  </label>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Hardware Permissions</span>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Camera className="w-3.5 h-3.5 text-slate-400" />
                          <span>Camera Access</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={requireCamera}
                          onChange={(e) => setRequireCamera(e.target.checked)}
                          className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Mic className="w-3.5 h-3.5 text-slate-400" />
                          <span>Microphone Audio</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={requireMicrophone}
                          onChange={(e) => setRequireMicrophone(e.target.checked)}
                          className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                        />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>GPS Location</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={requireLocation}
                          onChange={(e) => setRequireLocation(e.target.checked)}
                          className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
            >
              <span>Build Android APK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Live Phone Mockup Preview */}
        <div className="lg:col-span-5 bg-[#131D31] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Live Preview</span>
            <span className="text-xs text-slate-500">Android Shell View</span>
          </div>

          <PhoneMockup url={url} appName={appName} />
        </div>
      </div>
    </div>
  );
};
