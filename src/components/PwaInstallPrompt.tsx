'use client';

import React, { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, X, WifiOff, CheckCircle2, Sparkles, Smartphone, Laptop, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker error:', err);
        });
    }

    // 2. Check Standalone mode
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);

    // 3. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    // 4. Capture BeforeInstallPrompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Custom Event Listener for Global "Install App" triggers from header
    const handleTriggerInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt().then(() => {
          deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
              setIsStandalone(true);
              setShowBanner(false);
            }
            setDeferredPrompt(null);
          });
        });
      } else {
        setShowGuideModal(true);
      }
    };

    window.addEventListener('trigger-pwa-install', handleTriggerInstall);

    // 6. Track App Installed
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setShowBanner(false);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 7. Online / Offline Listener
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('trigger-pwa-install', handleTriggerInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsStandalone(true);
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA install prompt error:', err);
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-zinc-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md backdrop-blur-md">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>You are offline. Running from cached PWA storage with full speed.</span>
        </div>
      )}

      {/* Install Success Toast */}
      {installedSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-2xl bg-emerald-500 text-zinc-950 font-bold text-xs shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ethio Student App installed successfully!</span>
          </div>
        </div>
      )}

      {/* Floating Bottom PWA Install Card / Banner */}
      {showBanner && (
        <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp">
          <div className="p-3.5 rounded-2xl bg-zinc-950/95 border border-emerald-500/40 shadow-2xl shadow-emerald-500/15 backdrop-blur-xl flex items-center justify-between gap-3 text-xs ring-1 ring-emerald-500/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 bg-zinc-900 shadow-md">
                <img
                  src="/logo.png"
                  alt="Ethio Student Material Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                  <span>Install App</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    PWA
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate">
                  Instant launch & offline Ethiopian freshman hub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:opacity-95 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/30 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install</span>
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Install Guide Modal (For iOS / Android / Desktop) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-emerald-500/40 bg-zinc-900 shrink-0">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Install Ethio Student App</h4>
                  <p className="text-[11px] text-zinc-400">Available for Android, iOS & PC</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIos ? (
              /* iOS Safari Instructions */
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                  <span>iPhone / iPad (Safari):</span>
                </div>
                <div className="space-y-2.5 text-xs text-zinc-300 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Tap the <strong>Share</strong> icon <Share2 className="w-3.5 h-3.5 text-sky-400 inline mx-1" /> at the bottom of Safari.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline mx-1" />.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Tap <strong>Add</strong> at top right to open full-screen anytime!
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Chrome / Edge Instructions */
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Monitor className="w-4 h-4" />
                  <span>Chrome, Edge or Android Browser:</span>
                </div>
                <div className="space-y-2.5 text-xs text-zinc-300 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Click the <strong>Install App icon</strong> (or 3-dots menu ⋮) in your browser address bar.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Select <strong>Install Ethio Student Material</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Enjoy instant desktop & mobile native app launch with offline caching!
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-zinc-950 font-bold text-xs transition cursor-pointer active:scale-98"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
