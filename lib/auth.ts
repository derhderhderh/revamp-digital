import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function getSessionUser() {
  const token = (await cookies()).get("session")?.value;
  const auth = adminAuth();
  if (!token || !auth) return null;
  try {
    return await auth.verifySessionCookie(token, true);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) return false;
  if (user.email && user.email === process.env.ADMIN_EMAIL) return true;
  const db = adminDb();
  if (!db) return false;
  const snap = await db.collection("users").doc(user.uid).get();
  return snap.data()?.role === "admin";
}
