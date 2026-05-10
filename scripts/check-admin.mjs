import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

for (const [key, value] of Object.entries(parseEnvFile(path.join(process.cwd(), ".env.local")))) {
  process.env[key] ||= value;
}

const email = process.argv[2] || process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!email) throw new Error("Pass an email or set ADMIN_EMAIL.");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    })
  });
}

const auth = getAuth();
const db = getFirestore();
const user = await auth.getUserByEmail(email);
const snap = await db.collection("users").doc(user.uid).get();

console.log(JSON.stringify({
  uid: user.uid,
  email: user.email,
  emailVerified: user.emailVerified,
  customClaims: user.customClaims || {},
  firestoreUser: snap.exists ? snap.data() : null
}, null, 2));
