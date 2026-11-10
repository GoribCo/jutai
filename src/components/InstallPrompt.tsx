import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

// iPadOS Safari reports itself as a Mac, hence the touch check.
const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 1);

/** Android/Chrome: Install button from beforeinstallprompt. iOS Safari: a how-to hint. Hidden once installed. */
export function InstallPrompt() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(standalone);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) return null;
  if (evt) {
    return (
      <button
        onClick={() => {
          void evt.prompt();
          setEvt(null);
        }}
        className="rounded-full bg-amber-950 px-5 py-2 text-sm font-bold text-amber-50 active:scale-95"
      >
        ⬇ Install app
      </button>
    );
  }
  if (isIos()) {
    return <p className="text-sm font-semibold opacity-80">To install: tap Share, then “Add to Home Screen”.</p>;
  }
  return null;
}
