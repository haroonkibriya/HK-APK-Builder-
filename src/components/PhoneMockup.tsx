import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCw, ExternalLink, WifiOff, AlertTriangle } from 'lucide-react';

interface PhoneMockupProps {
  url: string;
  appName?: string;
  enableZoom?: boolean;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  url,
  appName = 'Web App Preview'
}) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const handleReload = () => {
    setIsLoading(true);
    setLoadError(false);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Controls Bar */}
      <div className="flex items-center justify-between w-full max-w-sm mb-3 px-2">
        <div className="flex items-center space-x-1 bg-[#1E293B] p-1 rounded-lg border border-slate-700/60">
          <button
            type="button"
            onClick={() => setIsDesktop(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
              !isDesktop ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDesktop(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
              isDesktop ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleReload}
            title="Reload web view"
            className="p-1.5 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            className="p-1.5 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hardware Frame */}
      <div
        className={`relative transition-all duration-300 bg-[#0F172A] border-[6px] border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col ${
          isDesktop ? 'w-full max-w-md h-[460px]' : 'w-[300px] h-[520px]'
        }`}
      >
        {/* Notch / Speaker bar */}
        <div className="h-6 bg-[#0F172A] flex items-center justify-center shrink-0">
          <div className="w-20 h-3 bg-slate-800 rounded-b-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          </div>
        </div>

        {/* Loading Progress Bar */}
        {isLoading && (
          <div className="h-0.5 w-full bg-slate-800 overflow-hidden shrink-0">
            <div className="h-full bg-blue-500 animate-pulse w-full" />
          </div>
        )}

        {/* Screen Iframe / Fallback */}
        <div className="relative flex-1 bg-white overflow-hidden">
          {url ? (
            <iframe
              key={iframeKey}
              src={url}
              title={appName}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadError(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center bg-[#0F172A]">
              <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-sm font-medium text-slate-200">No URL provided</p>
              <p className="text-xs text-slate-400 mt-1">Paste your live web app URL to see the live preview.</p>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 bg-[#0F172A] flex flex-col items-center justify-center p-6 text-center">
              <WifiOff className="w-10 h-10 text-red-400 mb-3" />
              <h4 className="text-white font-bold text-sm">Cannot load preview inside iframe</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Some websites block iframe embedding using X-Frame-Options headers. Your native APK will load this without restriction.
              </p>
              <button
                type="button"
                onClick={handleReload}
                className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Home gesture bar */}
        <div className="h-4 bg-[#0F172A] flex items-center justify-center shrink-0">
          <div className="w-20 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
