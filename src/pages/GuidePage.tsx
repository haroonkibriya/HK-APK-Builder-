import React from 'react';
import { Sparkles, GitBranch, Globe, Download, Smartphone, ArrowRight, HelpCircle } from 'lucide-react';

export const GuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Workflow Documentation</span>
        <h2 className="text-3xl font-black text-white mt-1">How to Turn AI Studio Apps into APKs</h2>
        <p className="text-slate-400 text-sm mt-2">
          A seamless path from Google AI Studio web development to a production-ready Android APK.
        </p>
      </div>

      {/* 5-Step Process */}
      <div className="space-y-4 mb-10">
        <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm shrink-0">
            01
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Create Web App in Google AI Studio</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Design and prompt your application in Google AI Studio. AI Studio generates a modern React, Vite, or web application with complete frontend code.
            </p>
          </div>
        </div>

        <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm shrink-0">
            02
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Push to GitHub Repository</span>
              <GitBranch className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Use AI Studio's built-in Git export or settings menu to connect and push your project to a GitHub repository (e.g. <code className="text-cyan-300 font-mono">github.com/your-username/my-app</code>).
            </p>
          </div>
        </div>

        <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm shrink-0">
            03
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Deploy to Live HTTPS Host</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Deploy your project using GitHub Pages, Cloud Run, Vercel, or Netlify. Copy your public live HTTPS URL.
            </p>
          </div>
        </div>

        <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black text-sm shrink-0">
            04
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Paste URL into HK APK Builder</span>
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Open HK APK Builder, paste your live URL, inspect mobile viewport compatibility, customize the package ID, icon, orientation, and hardware permissions.
            </p>
          </div>
        </div>

        <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm shrink-0">
            05
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Build & Download Android APK</span>
              <Download className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Click Build APK. The engine packages the application inside a native Capacitor shell, runs the build tasks, and gives you a direct download link and phone QR code!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#131D31] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Frequently Asked Questions</span>
        </h3>
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-semibold text-slate-200">Will my web app work offline?</h4>
            <p className="text-slate-400 mt-0.5">
              If your web app is built with service workers or PWA caching, cached assets work offline. Dynamic API requests require internet connectivity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Can I publish the generated APK to Google Play?</h4>
            <p className="text-slate-400 mt-0.5">
              The generated APK is a debug APK designed for immediate testing and sideloading. You can export the Capacitor project and sign a release Android App Bundle (.aab) with your keystore for Google Play.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
