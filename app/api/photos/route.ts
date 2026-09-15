import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

function getPhotosFromFile(): any[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (e) {
    return [];
  }
}

function savePhotosToFile(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing photos file", e);
  }
}

export async function GET() {
  const photos = getPhotosFromFile();
  return NextResponse.json({ success: true, count: photos.length, photos });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.url) {
      return NextResponse.json({ error: "Imagen requerida" }, { status: 400 });
    }

    const currentPhotos = getPhotosFromFile();
    const newRecord = {
      ...body,
      id: "photo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      uploadedAt: body.uploadedAt || "Hoy",
    };

    const updated = [newRecord, ...currentPhotos];
    savePhotosToFile(updated);

    return NextResponse.json({ success: true, record: newRecord, totalCount: updated.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al guardar foto" }, { status: 500 });
  }
}

export async function DELETE() {
  savePhotosToFile([]);
  return NextResponse.json({ success: true, message: "Todas las fotos fueron eliminadas" });
}
