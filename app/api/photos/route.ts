import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Cloud DB endpoint for guaranteed cross-device photo synchronization
const CLOUD_OBJECT_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a0a5166b831041";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "photos.json");

function ensureDataFile() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
    }
  } catch (e) {
    console.warn("Disk mkdir/write warning for photos", e);
  }
}

function getLocalPhotos(): any[] {
  try {
    ensureDataFile();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (e) {
    console.warn("Local photos file read warning", e);
  }
  return [];
}

function saveLocalPhotos(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local photos file write warning", e);
  }
}

async function fetchCloudPhotos(): Promise<any[]> {
  try {
    const res = await fetch(CLOUD_OBJECT_URL, { cache: "no-store" });
    if (res.ok) {
      const body = await res.json();
      if (body && body.data && Array.isArray(body.data.list)) {
        return body.data.list;
      }
    }
  } catch (e) {
    console.warn("Cloud DB fetch photos warning", e);
  }
  return [];
}

async function syncCloudPhotos(list: any[]) {
  try {
    await fetch(CLOUD_OBJECT_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "boda_lucia_photos",
        data: { list },
      }),
    });
  } catch (e) {
    console.warn("Cloud DB sync photos warning", e);
  }
}

function mergePhotos(listA: any[], listB: any[]): any[] {
  const mergedMap = new Map();
  [...listA, ...listB].forEach((item) => {
    if (!item || !item.url) return;
    const key = item.id || item.url.slice(-40);
    if (!mergedMap.has(key)) {
      mergedMap.set(key, item);
    }
  });
  return Array.from(mergedMap.values());
}

export async function GET() {
  const localItems = getLocalPhotos();
  const cloudItems = await fetchCloudPhotos();

  const merged = mergePhotos(cloudItems, localItems);

  if (merged.length > localItems.length) {
    saveLocalPhotos(merged);
  }
  if (merged.length > cloudItems.length) {
    syncCloudPhotos(merged);
  }

  return NextResponse.json({ success: true, count: merged.length, photos: merged });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.url) {
      return NextResponse.json({ error: "Imagen requerida" }, { status: 400 });
    }

    const newRecord = {
      ...body,
      id: "photo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      uploadedAt: body.uploadedAt || "Hoy",
    };

    const currentLocal = getLocalPhotos();
    const cloudItems = await fetchCloudPhotos();
    const updated = mergePhotos([newRecord], mergePhotos(cloudItems, currentLocal));

    saveLocalPhotos(updated);
    await syncCloudPhotos(updated);

    return NextResponse.json({ success: true, record: newRecord, photos: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al guardar foto" }, { status: 500 });
  }
}

export async function DELETE() {
  saveLocalPhotos([]);
  await syncCloudPhotos([]);
  return NextResponse.json({ success: true, count: 0, photos: [] });
}

