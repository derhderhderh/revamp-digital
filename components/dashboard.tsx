"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FileUp, MessageSquare, TrendingUp } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { LiveChat } from "@/components/live-chat";
import { Button } from "@/components/ui/button";

export function Dashboard({ admin = false }: { admin?: boolean }) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    const unsubQuotes = onSnapshot(query(collection(db, "quotes"), orderBy("createdAt", "desc")), (snap) => setQuotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
    const unsubReports = onSnapshot(query(collection(db, "maintenanceReports"), orderBy("createdAt", "desc")), (snap) => setReports(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
    return () => {
      unsubQuotes();
      unsubReports();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={TrendingUp} label="Quotes" value={quotes.length || 0} />
        <Stat icon={MessageSquare} label="Open chats" value="Live" />
        <Stat icon={FileUp} label="Reports" value={reports.length || 0} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="glass rounded-[2rem] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{admin ? "Quote Pipeline" : "Your Requests"}</h2>
            <Button href="/quote" className="h-10">New quote</Button>
          </div>
          <div className="mt-5 space-y-3">
            {quotes.length ? quotes.slice(0, 8).map((quote) => (
              <div key={quote.id} className="rounded-3xl bg-white/70 p-4 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{quote.name || quote.businessType}</p>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">{quote.status || "new"}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{quote.summary || quote.features}</p>
              </div>
            )) : <Empty text="No quote requests yet. Submissions appear here in real time." />}
          </div>
        </div>
        <div>
          <LiveChat admin={admin} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="glass rounded-3xl p-5">
      <Icon className="text-cyan-600" size={22} />
      <p className="mt-5 text-3xl font-black">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-white/15">{text}</div>;
}
