import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CLOUD_DB_URL = "https://boda-lucia-malo-default-rtdb.firebaseio.com/photos.json";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "photos.json");

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), "utf-8");
  }
}

function getLocalPhotos(): any[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocalPhotos(data: any[]) {
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

  const localItems = getLocalPhotos();
  const mergedMap = new Map();
  [...cloudItems, ...localItems].forEach((item) => {
    const key = item.id || (item.url ? item.url.slice(-30) : Math.random().toString());
    if (!mergedMap.has(key)) {
      mergedMap.set(key, item);
    }
  });

  const merged = Array.from(mergedMap.values());
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
      uploadedAt: body.uploadedAt || "Hoy",
    };

    try {
      await fetch(CLOUD_DB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
    } catch (e) {
      console.warn("Cloud DB POST fallback", e);
    }

    const currentLocal = getLocalPhotos();
    saveLocalPhotos([newRecord, ...currentLocal]);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al guardar foto" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fetch(CLOUD_DB_URL, { method: "DELETE" });
  } catch (e) {}
  saveLocalPhotos([]);
  return NextResponse.json({ success: true });
}
