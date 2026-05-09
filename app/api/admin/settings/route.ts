import { NextRequest, NextResponse } from "next/server";
import { adminDb, Timestamp } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const db = adminDb();
  if (!db) return NextResponse.json({ adminOnline: false, dev: true });
  const snap = await db.collection("adminSettings").doc("main").get();
  return NextResponse.json(snap.data() || { adminOnline: false });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin()) && process.env.NODE_ENV === "production") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const db = adminDb();
  if (db) await db.collection("adminSettings").doc("main").set({ ...body, updatedAt: Timestamp.now() }, { merge: true });
  return NextResponse.json({ ok: true });
}
