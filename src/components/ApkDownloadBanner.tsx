import React, { useState, useEffect } from 'react';
import { Smartphone, Download, ShieldCheck, Check, X, ExternalLink, Sparkles, Layers } from 'lucide-react';

interface ApkDownloadBannerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'te' | 'en';
}

export const ApkDownloadBanner: React.FC<ApkDownloadBannerProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const isTe = language === 'te';
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for browsers without active prompt
      alert(
        isTe
          ? 'మీ బ్రౌజర్ మెనూ (పైన 3 చుక్కలు ⋮) నొక్కి "Install app" లేదా "Add to Home screen" ఎంచుకోండి.'
          : 'Tap browser menu (3 dots ⋮) and select "Install app" or "Add to Home screen".'
      );
    }
  };

  const handleDownload = () => {
    setDownloadTriggered(true);

    const link = document.createElement('a');
    link.href = './downloads/telugu-panchangam-2027.apk';
    link.download = 'TeluguPanchangam2027.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadTriggered(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-telugu animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-emerald-800/40 flex items-center justify-between text-emerald-200">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {isTe ? 'ఆండ్రాయిడ్ యాప్ & APK ఆర్టిఫాక్ట్' : 'Android App & APK Artifact'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs md:text-sm text-slate-200 max-h-[80vh] overflow-y-auto">
          {/* OPTION 1: 1-Click Native Phone App Install (PWA) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-600/50 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isTe ? 'సిఫార్సు: హోమ్ స్క్రీన్‌పై 1-క్లిక్ ఇన్‌స్టాల్' : 'Recommended: 1-Click Install to Phone'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTe
                ? 'ఏ విధమైన థర్డ్-పార్టీ APK ఫైల్స్ డౌన్‌లోడ్ చేయకుండా, మీ ఫోన్ హోమ్ స్క్రీన్‌పై అధికారిక యాప్‌గా ఇన్‌స్టాల్ అవుతుంది. ఇంటర్నెట్ లేకపోయినా 100% ఆఫ్‌లైన్‌లో పనిచేస్తుంది.'
                : 'Installs directly as a native standalone app on your phone home screen without untrusted APK warnings. 100% offline ready.'}
            </p>
            <button
              onClick={handlePwaInstall}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {isInstalled
                  ? (isTe ? 'యాప్ ఇప్పటికే ఇన్‌స్టాల్ చేయబడింది ✓' : 'App Already Installed ✓')
                  : (isTe ? 'ఫోన్‌లో నేరుగా ఇన్‌స్టాల్ చేయండి' : 'Install Direct to Phone Home Screen')}
              </span>
            </button>
          </div>

          {/* OPTION 2: DIRECT DOWNLOAD TELUGU PANCHANGAM APK */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-700/60 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isTe ? 'నేరుగా APK ఫైల్ డౌన్‌లోడ్ (Direct Download)' : 'Direct Standalone APK Download'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTe
                ? 'మెయిన్ రిపోజిటరీ నుండి నేరుగా Telugu-Panchangam-2027.apk ఫైల్ డౌన్‌లోడ్ అవుతుంది. ఎలాంటి Actions లేదా లాగిన్ అవసరం లేదు.'
                : 'Directly download the Telugu-Panchangam-2027.apk file hosted on the main branch.'}
            </p>
            <div className="pt-1">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {downloadTriggered ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>
                  {downloadTriggered
                    ? (isTe ? 'డౌన్‌లోడ్ ప్రారంభమైంది!' : 'Download Started!')
                    : (isTe ? 'Telugu-Panchangam-2027.apk డౌన్‌లోడ్ చేయండి' : 'Download Telugu-Panchangam-2027.apk')}
                </span>
              </button>
            </div>
          </div>

          {/* Installation Tips */}
          <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <div className="font-semibold text-amber-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTe ? 'గమనిక:' : 'Note:'}</span>
            </div>
            <p>
              {isTe
                ? 'ఫోన్‌లో ఇన్స్టాలేషన్ సమయంలో "Unknown sources" అనుమతి అడిగితే Enable చేయండి.'
                : 'If Android prompts with "Install unknown apps", toggle Allow from this source to complete installation.'}
            </p>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              {isTe ? 'మూసివేయి' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
