"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(formData: FormData) {
    if (!auth || !db || !hasFirebaseClientConfig) {
      toast.error("Firebase env vars are required for authentication.");
      return;
    }
    setLoading(true);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const name = String(formData.get("name") || "");
    try {
      const cred =
        mode === "signup"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);
      if (mode === "signup") {
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, "users", cred.user.uid), {
          email,
          name,
          role: email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "admin" : "client",
          createdAt: serverTimestamp()
        });
      }
      const idToken = await cred.user.getIdToken();
      await fetch("/api/auth/session", { method: "POST", body: JSON.stringify({ idToken }) });
      toast.success("Welcome to Revamp Digital");
      router.push(email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="glass mx-auto grid max-w-md gap-4 rounded-[2rem] p-6">
      {mode === "signup" ? <input name="name" required placeholder="Name" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" /> : null}
      <input name="email" type="email" required placeholder="Email" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
      <input name="password" type="password" required minLength={8} placeholder="Password" className="focus-ring rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5" />
      <Button disabled={loading}>{loading ? "Working..." : mode === "signup" ? "Create account" : "Log in"}</Button>
    </form>
  );
}
