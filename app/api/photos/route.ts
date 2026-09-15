import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

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
  } catch (e) {}
}

function getLocalPhotos(): any[] {
  try {
    ensureDataFile();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (e) {}
  return [];
}

function saveLocalPhotos(data: any[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {}
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
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(supaData) && supaData.length > 0) {
      return NextResponse.json(
        { success: true, count: supaData.length, photos: supaData },
        { headers: corsHeaders }
      );
    }
  } catch (e) {}

  const localItems = getLocalPhotos();
  return NextResponse.json(
    { success: true, count: localItems.length, photos: localItems },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.url) {
      return NextResponse.json({ error: "Imagen requerida" }, { status: 400, headers: corsHeaders });
    }

    const newRecord = {
      id: body.id || "photo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      url: body.url,
      title: body.title || "",
      author: body.author || "",
      category: body.category || "fiesta",
      likes: body.likes || 0,
      commentsCount: body.commentsCount || 0,
      uploadedAt: body.uploadedAt || new Date().toLocaleString("es-ES"),
      isUserUploaded: body.isUserUploaded ?? true,
    };

    try {
      await supabase.from("photos").upsert([newRecord]);
    } catch (e) {}

    const currentLocal = getLocalPhotos();
    const updatedLocal = [newRecord, ...currentLocal];
    saveLocalPhotos(updatedLocal);

    return NextResponse.json(
      { success: true, record: newRecord, photos: updatedLocal },
      { headers: corsHeaders }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Error al guardar foto" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE() {
  try {
    await supabase.from("photos").delete().neq("id", "0");
  } catch (e) {}

  saveLocalPhotos([]);
  return NextResponse.json({ success: true, count: 0, photos: [] }, { headers: corsHeaders });
}
