import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

function getRSVPsFromFile(): any[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (e) {
    console.error("Error reading RSVPs file", e);
    return [];
  }
}

function saveRSVPsToFile(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing RSVPs file", e);
  }
}

export async function GET() {
  const rsvps = getRSVPsFromFile();
  return NextResponse.json({ success: true, count: rsvps.length, rsvps });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400 });
    }

    const currentRSVPs = getRSVPsFromFile();
    const newRecord = {
      ...body,
      id: "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      submittedAt: body.submittedAt || new Date().toLocaleString("es-ES"),
    };

    const updated = [newRecord, ...currentRSVPs];
    saveRSVPsToFile(updated);

    return NextResponse.json({ success: true, record: newRecord, totalCount: updated.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error al guardar confirmación" }, { status: 500 });
  }
}

export async function DELETE() {
  saveRSVPsToFile([]);
  return NextResponse.json({ success: true, message: "Todas las confirmaciones fueron eliminadas" });
}
