import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Firebase Realtime Cloud Database REST API endpoint for cross-device sync
const CLOUD_DB_URL = "https://boda-lucia-malo-default-rtdb.firebaseio.com/rsvps.json";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "rsvps.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
  }
}

function getLocalRSVPs(): any[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocalRSVPs(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {}
}

export async function GET() {
  let cloudItems: any[] = [];
  try {
    const res = await fetch(CLOUD_DB_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        cloudItems = Object.keys(data)
          .map((key) => ({
            ...data[key],
            id: key,
          }))
          .reverse();
      }
    }
  } catch (e) {
    console.warn("Cloud DB fetch fallback", e);
  }

  const localItems = getLocalRSVPs();
  const mergedMap = new Map();
  [...cloudItems, ...localItems].forEach((item) => {
    const key = item.id || (item.name ? item.name + "_" + (item.submittedAt || "") : Math.random().toString());
    if (!mergedMap.has(key)) {
      mergedMap.set(key, item);
    }
  });

  const merged = Array.from(mergedMap.values());
  return NextResponse.json({ success: true, count: merged.length, rsvps: merged });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
    }

    const newRecord = {
      ...body,
      submittedAt: body.submittedAt || new Date().toLocaleString("es-ES"),
    };

    // 1. Post to Cloud DB for instant cross-device synchronization (PC & Mobile Phone)
    try {
      await fetch(CLOUD_DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
    } catch (e) {
      console.warn("Cloud DB POST fallback", e);
    }

    // 2. Save locally
    const currentLocal = getLocalRSVPs();
    const updatedLocal = [newRecord, ...currentLocal];
    saveLocalRSVPs(updatedLocal);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al guardar confirmación" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fetch(CLOUD_DB_URL, { method: "DELETE" });
  } catch (e) {}
  saveLocalRSVPs([]);
  return NextResponse.json({ success: true });
}
