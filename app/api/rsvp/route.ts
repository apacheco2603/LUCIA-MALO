import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

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
  } catch (e) {}
}

function getLocalRSVPs(): any[] {
  try {
    ensureDataFile();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (e) {}
  return [];
}

function saveLocalRSVPs(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {}
}

function mergeRSVPs(listA: any[], listB: any[]): any[] {
  const mergedMap = new Map();
  [...listA, ...listB].forEach((item) => {
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
        id: item.id || existing.id,
      });
    }
  });
  return Array.from(mergedMap.values());
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const { data: supaData, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(supaData) && supaData.length > 0) {
      const formatted = supaData.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email || "",
        attending: item.attending || "yes",
        guestsCount: item.guestsCount || 1,
        dietary: Array.isArray(item.dietary) ? item.dietary : [],
        dietaryNotes: item.dietaryNotes || "",
        dedicatedSong: item.dedicatedSong || "",
        message: item.message || "",
        submittedAt: item.submittedAt || "",
      }));
      return NextResponse.json(
        { success: true, count: formatted.length, rsvps: formatted },
        { headers: corsHeaders }
      );
    }
  } catch (e) {
    console.warn("API GET Supabase warning", e);
  }

  const localItems = getLocalRSVPs();
  return NextResponse.json(
    { success: true, count: localItems.length, rsvps: localItems },
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
        id: item.id || "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        name: item.name,
        email: item.email || "",
        attending: item.attending || "yes",
        guestsCount: item.guestsCount || 1,
        dietary: Array.isArray(item.dietary) ? item.dietary : [],
        dietaryNotes: item.dietaryNotes || "",
        dedicatedSong: item.dedicatedSong || "",
        message: item.message || "",
        submittedAt: item.submittedAt || new Date().toLocaleString("es-ES"),
      }));
    } else if (body.name) {
      newRecords = [
        {
          id: body.id || "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          name: body.name,
          email: body.email || "",
          attending: body.attending || "yes",
          guestsCount: body.guestsCount || 1,
          dietary: Array.isArray(body.dietary) ? body.dietary : [],
          dietaryNotes: body.dietaryNotes || "",
          dedicatedSong: body.dedicatedSong || "",
          message: body.message || "",
          submittedAt: body.submittedAt || new Date().toLocaleString("es-ES"),
        },
      ];
    } else {
      return NextResponse.json({ error: "Nombre es requerido" }, { status: 400, headers: corsHeaders });
    }

    // Save to Supabase
    try {
      await supabase.from("rsvps").upsert(newRecords);
    } catch (e) {
      console.warn("API POST Supabase warning", e);
    }

    const currentLocal = getLocalRSVPs();
    const updatedLocal = mergeRSVPs(newRecords, currentLocal);
    saveLocalRSVPs(updatedLocal);

    return NextResponse.json(
      { success: true, count: updatedLocal.length, rsvps: updatedLocal },
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
  try {
    await supabase.from("rsvps").delete().neq("id", "0");
  } catch (e) {}

  saveLocalRSVPs([]);
  return NextResponse.json({ success: true, count: 0, rsvps: [] }, { headers: corsHeaders });
}
