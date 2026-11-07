"use client";

import { useEffect, useRef } from "react";

export default function TreatmentViewerClient() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Ensure the treatment viewer stylesheet is loaded
    if (!document.querySelector('link[href*="treatment-main"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/assets/treatment-main-BP7orjFN.css";
      document.head.appendChild(link);
    }

    // 2. Dynamically load the bundled 3D viewer module
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/assets/treatment-main-5OQ3MgD7.js";
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="app"
      className="fixed inset-0 w-screen h-screen z-50 bg-[#ebe7e0] dark:bg-[#0f141f] text-slate-800 dark:text-slate-200 overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        <div className="w-10 h-10 border-[3.5px] border-amber-300/20 border-t-[#ffd166] rounded-full animate-spin shadow-[0_0_16px_rgba(255,209,102,0.35)]" />
        <p className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Loading 3D Models…
        </p>
      </div>
    </div>
  );
}

