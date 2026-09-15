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

function mergeRSVPs(newRecords: any[], existingRecords: any[]): any[] {
  const mergedMap = new Map();

  // Process existing (older) records first, then newRecords second so new records overwrite existing ones
  [...existingRecords, ...newRecords].forEach((item) => {
    if (!item || !item.name || !String(item.name).trim()) return;
    const nameKey = String(item.name).trim().toLowerCase();
    const emailKey = item.email ? String(item.email).trim().toLowerCase() : "";
    const key = `${nameKey}_${emailKey}`;

    const existing = mergedMap.get(key);
    if (!existing) {
      mergedMap.set(key, item);
    } else {
      mergedMap.set(key, {
        ...existing,
        ...item,
      });
    }
  });

  return Array.from(mergedMap.values());
}





const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
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

  return NextResponse.json(
    { success: true, count: merged.length, rsvps: merged },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Cuerpo de solicitud requerido" }, { status: 400, headers: corsHeaders });
    }

    let newRecords: any[] = [];
    if (Array.isArray(body)) {
      newRecords = body.map((item) => ({
        ...item,
        id: item.id || "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        submittedAt: item.submittedAt || new Date().toLocaleString("es-ES"),
      }));
    } else if (body.name) {
      newRecords = [
        {
          ...body,
          id: body.id || "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          submittedAt: body.submittedAt || new Date().toLocaleString("es-ES"),
        },
      ];
    } else {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400, headers: corsHeaders });
    }

    const currentLocal = getLocalRSVPs();
    const cloudItems = await fetchCloudRSVPs();
    const updated = mergeRSVPs(newRecords, mergeRSVPs(cloudItems, currentLocal));

    saveLocalRSVPs(updated);
    await syncCloudRSVPs(updated);

    return NextResponse.json(
      { success: true, count: updated.length, rsvps: updated },
      { headers: corsHeaders }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Error al guardar confirmación" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE() {
  saveLocalRSVPs([]);
  await syncCloudRSVPs([]);
  return NextResponse.json({ success: true, count: 0, rsvps: [] }, { headers: corsHeaders });
}



