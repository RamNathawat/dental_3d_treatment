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
      link.href = "/assets/treatment-main-CAtNramU.css";
      document.head.appendChild(link);
    }

    // 2. Dynamically load the bundled 3D viewer module
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/assets/treatment-main-2jrAHB-X.js";
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
      className="fixed inset-0 w-screen h-screen z-50 bg-[#151821] overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center w-full h-full text-slate-200">
        <div className="w-9 h-9 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-tight text-slate-300">
          Loading 3D Treatment Progression...
        </p>
      </div>
    </div>
  );
}

