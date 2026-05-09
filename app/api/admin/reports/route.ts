import { NextRequest, NextResponse } from "next/server";
import { generateAI } from "@/lib/ai/gemini";
import { adminDb, Timestamp } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await requireAdmin()) && process.env.NODE_ENV === "production") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const report = await generateAI(
    `Create a concise maintenance report with completed work, risks, recommendations, and next actions. Details: ${JSON.stringify(body)}`,
    "Maintenance report: updates reviewed, performance checked, SEO basics inspected, and next actions prepared."
  );
  const db = adminDb();
  let id = "dev-report";
  if (db) {
    const doc = await db.collection("maintenanceReports").add({ ...body, report, createdAt: Timestamp.now() });
    id = doc.id;
  }
  return NextResponse.json({ id, report });
}
