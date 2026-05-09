"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(localStorage.getItem("cookie-ok") !== "yes"), []);
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900">
      <p className="text-sm text-slate-600 dark:text-slate-300">We use essential cookies for login, security, analytics preferences, and dashboard syncing.</p>
      <Button className="mt-3 h-9 px-4" onClick={() => { localStorage.setItem("cookie-ok", "yes"); setShow(false); }}>Accept</Button>
    </div>
  );
}
