import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");
  const userId = String(form.get("userId") || "anonymous");
  if (!(file instanceof File)) return NextResponse.json({ error: "File required" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Max file size is 10MB" }, { status: 400 });
  const storage = adminStorage();
  if (!storage) return NextResponse.json({ error: "Firebase Storage admin env vars are required." }, { status: 503 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const path = `uploads/${userId}/${Date.now()}-${file.name}`;
  const bucket = storage.bucket();
  await bucket.file(path).save(bytes, { metadata: { contentType: file.type } });
  const [url] = await bucket.file(path).getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  return NextResponse.json({ path, url });
}
