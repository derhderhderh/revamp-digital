import fs from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const text = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

const fileEnv = parseEnvFile(envPath);
for (const [key, value] of Object.entries(fileEnv)) {
  process.env[key] ||= value;
}

const adminEmail = process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.");
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
  throw new Error("Firebase Admin credentials are missing from .env.local.");
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });

const auth = getAuth();
const db = getFirestore();

async function getAccessToken() {
  const token = await app.options.credential.getAccessToken();
  if (!token.access_token) throw new Error("Could not get a Google access token.");
  return token.access_token;
}

async function authedFetch(url, options = {}) {
  const accessToken = await getAccessToken();
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  });
}

async function enableGoogleService(serviceName) {
  const url = `https://serviceusage.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/services/${serviceName}:enable`;
  const response = await authedFetch(url, { method: "POST", body: "{}" });
  if (response.ok) return;
  const text = await response.text();
  if (text.includes("already enabled") || text.includes("already being enabled")) return;
  throw new Error(`Could not enable ${serviceName}: ${text}`);
}

async function ensureFirebaseServices() {
  for (const service of ["identitytoolkit.googleapis.com", "firestore.googleapis.com"]) {
    try {
      await enableGoogleService(service);
      console.log(`Service ready: ${service}`);
    } catch (error) {
      console.warn(error.message);
    }
  }
}

async function ensureFirestoreDatabase() {
  const base = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)`;
  const getResponse = await authedFetch(base);
  if (getResponse.ok) return;

  const getText = await getResponse.text();
  if (!getText.includes("NOT_FOUND")) {
    console.warn(`Could not check Firestore database: ${getText}`);
    return;
  }

  const createUrl = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases?databaseId=(default)`;
  const createResponse = await authedFetch(createUrl, {
    method: "POST",
    body: JSON.stringify({
      locationId: "nam5",
      type: "FIRESTORE_NATIVE"
    })
  });

  if (!createResponse.ok) {
    const text = await createResponse.text();
    console.warn(`Could not create Firestore database automatically: ${text}`);
    return;
  }

  console.log("Firestore database creation requested. Waiting for propagation...");
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

async function enableEmailPasswordAuth() {
  const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${process.env.FIREBASE_PROJECT_ID}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`;
  const response = await authedFetch(url, {
    method: "PATCH",
    body: JSON.stringify({
      signIn: {
        email: {
          enabled: true,
          passwordRequired: true
        }
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Could not enable Email/Password auth automatically: ${text}`);
  }
}

async function upsertAdminUser() {
  let user;
  try {
    user = await auth.getUserByEmail(adminEmail);
    await auth.updateUser(user.uid, {
      emailVerified: true,
      password: adminPassword,
      displayName: "Revamp Digital Admin"
    });
  } catch (error) {
    if (error.code === "auth/configuration-not-found") {
      console.log("Firebase Auth is not initialized. Trying to enable Email/Password auth...");
      try {
        await enableEmailPasswordAuth();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        user = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          emailVerified: true,
          displayName: "Revamp Digital Admin"
        });
      } catch (setupError) {
        console.warn(setupError.message);
        console.warn("Continuing with Firestore seed. Enable Firebase Authentication Email/Password, then rerun this script to create the login.");
        await db.collection("users").doc("pending-admin").set(
          {
            email: adminEmail,
            name: "Revamp Digital Admin",
            role: "admin",
            authStatus: "pending-firebase-auth-initialization",
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: FieldValue.serverTimestamp()
          },
          { merge: true }
        );
        return "pending-admin";
      }
    } else if (error.code === "auth/user-not-found") {
      user = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        emailVerified: true,
        displayName: "Revamp Digital Admin"
      });
    } else {
      throw error;
    }
  }

  if (!user) {
    throw new Error("Could not create or update the admin user.");
  }

  await auth.setCustomUserClaims(user.uid, { role: "admin" });
  await db.collection("users").doc(user.uid).set(
    {
      email: adminEmail,
      name: "Revamp Digital Admin",
      role: "admin",
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return user.uid;
}

async function setDoc(collectionName, id, data) {
  await db.collection(collectionName).doc(id).set(
    {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

async function seedCollections(adminUid) {
  await setDoc("adminSettings", "main", {
    adminOnline: true,
    adminEmail,
    brandName: "Revamp Digital",
    supportMode: "email-password-auth",
    authProvider: "firebase-email-password",
    liveChatFallback: "ai",
    seededBy: adminUid
  });

  const plans = [
    {
      id: "tune-up",
      name: "Tune-Up",
      price: "$149/mo",
      description: "Updates, uptime checks, email support, and a basic monthly report.",
      features: ["Monthly updates", "Uptime checks", "Email support", "Basic report"],
      active: true,
      sort: 1
    },
    {
      id: "growth-care",
      name: "Growth Care",
      price: "$349/mo",
      description: "Proactive SEO, chat support, optimization, and AI maintenance reports.",
      features: ["SEO improvements", "Chat support", "Speed checks", "AI report"],
      active: true,
      sort: 2
    },
    {
      id: "scale-partner",
      name: "Scale Partner",
      price: "$749/mo",
      description: "Priority support, automation setup, monthly strategy, and advanced reporting.",
      features: ["Priority support", "Monthly strategy", "Automation setup", "Advanced reporting"],
      active: true,
      sort: 3
    }
  ];

  for (const plan of plans) await setDoc("maintenancePlans", plan.id, plan);

  const testimonials = [
    {
      id: "maya-chen",
      name: "Maya Chen",
      company: "Bloom Local Studio",
      quote: "Revamp Digital made our site feel like the business we were trying to become.",
      active: true
    },
    {
      id: "evan-brooks",
      name: "Evan Brooks",
      company: "Oak & Iron",
      quote: "The dashboard and weekly updates are the first web service that actually feels transparent.",
      active: true
    }
  ];

  for (const item of testimonials) await setDoc("testimonials", item.id, item);

  const portfolio = [
    {
      id: "brightpath-dental",
      name: "BrightPath Dental",
      category: "Healthcare",
      before: "Legacy brochure site with slow pages and buried contact forms.",
      after: "Fast local SEO hub with booking CTAs, service pages, and mobile-first navigation.",
      stats: ["+41 speed score", "+63% booking clicks", "+28 SEO points"],
      active: true
    },
    {
      id: "oak-iron-contractors",
      name: "Oak & Iron Contractors",
      category: "Home Services",
      before: "Outdated gallery, unclear trust signals, weak quote flow.",
      after: "Project showcase, review-rich landing pages, and AI-backed quote intake.",
      stats: ["2.3s faster load", "+52% form starts", "+34 mobile score"],
      active: true
    }
  ];

  for (const project of portfolio) await setDoc("portfolioProjects", project.id, project);

  const posts = [
    {
      id: "small-business-website-revamp",
      title: "How to Know When Your Small Business Website Needs a Revamp",
      slug: "small-business-website-revamp",
      excerpt: "A practical checklist for spotting outdated design, weak CTAs, and hidden conversion leaks.",
      status: "published"
    },
    {
      id: "maintenance-checklist",
      title: "Website Maintenance Checklist for Local Businesses",
      slug: "website-maintenance-checklist",
      excerpt: "Monthly tasks that keep your website fast, secure, fresh, and easier to trust.",
      status: "published"
    }
  ];

  for (const post of posts) await setDoc("blogPosts", post.id, post);

  await setDoc("analytics", "overview", {
    leads: 0,
    quotes: 0,
    openTickets: 0,
    activeProjects: 0,
    websiteHealthAverage: 0
  });

  await db.collection("notifications").add({
    userId: adminUid,
    title: "Revamp Digital database seeded",
    message: "Starter admin settings, plans, testimonials, portfolio, blog posts, and analytics are ready.",
    read: false,
    createdAt: FieldValue.serverTimestamp()
  });
}

await ensureFirebaseServices();
await ensureFirestoreDatabase();

const adminUid = await upsertAdminUser();
await seedCollections(adminUid);

console.log(`Firebase setup complete for admin ${adminEmail}`);
