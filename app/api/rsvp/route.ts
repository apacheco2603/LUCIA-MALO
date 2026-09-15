import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cloud DB endpoint for guaranteed cross-device synchronization (PC & Mobile)
const CLOUD_OBJECT_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a0a515cba41037";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "rsvps.json");

function ensureDataFile() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
    }
  } catch (e) {
    console.warn("Disk mkdir/write warning", e);
  }
}

function getLocalRSVPs(): any[] {
  try {
    ensureDataFile();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (e) {
    console.warn("Local file read warning", e);
  }
  return [];
}

function saveLocalRSVPs(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local file write warning", e);
  }
}

async function fetchCloudRSVPs(): Promise<any[]> {
  try {
    const res = await fetch(CLOUD_OBJECT_URL, { cache: "no-store" });
    if (res.ok) {
      const body = await res.json();
      if (body && body.data && Array.isArray(body.data.list)) {
        return body.data.list;
      }
    }
  } catch (e) {
    console.warn("Cloud DB fetch warning", e);
  }
  return [];
}

async function syncCloudRSVPs(list: any[]) {
  try {
    await fetch(CLOUD_OBJECT_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "boda_lucia_rsvps",
        data: { list },
      }),
    });
  } catch (e) {
    console.warn("Cloud DB sync warning", e);
  }
}

function mergeRSVPs(listA: any[], listB: any[]): any[] {
  const mergedMap = new Map();
  [...listA, ...listB].forEach((item) => {
    if (!item || !item.name) return;
    const key =
      item.id || `${item.name.trim().toLowerCase()}_${item.email ? item.email.trim().toLowerCase() : ""}_${item.submittedAt || ""}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, item);
    }
  });
  return Array.from(mergedMap.values());
}

export async function GET() {
  const localItems = getLocalRSVPs();
  const cloudItems = await fetchCloudRSVPs();

  const merged = mergeRSVPs(cloudItems, localItems);

  // Keep local file and cloud DB synchronized with merged list
  if (merged.length > localItems.length) {
    saveLocalRSVPs(merged);
  }
  if (merged.length > cloudItems.length) {
    syncCloudRSVPs(merged);
  }

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
      id: "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      submittedAt: body.submittedAt || new Date().toLocaleString("es-ES"),
    };

    const currentLocal = getLocalRSVPs();
    const cloudItems = await fetchCloudRSVPs();
    const updated = mergeRSVPs([newRecord], mergeRSVPs(cloudItems, currentLocal));

    saveLocalRSVPs(updated);
    await syncCloudRSVPs(updated);

    return NextResponse.json({ success: true, record: newRecord, rsvps: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al guardar confirmación" }, { status: 500 });
  }
}

export async function DELETE() {
  saveLocalRSVPs([]);
  await syncCloudRSVPs([]);
  return NextResponse.json({ success: true, count: 0, rsvps: [] });
}

