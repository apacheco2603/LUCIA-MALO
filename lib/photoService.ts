import { supabase } from "./supabase";

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  author: string;
  category: "ceremonia" | "fiesta" | "coctel" | "invitados";
  likes: number;
  commentsCount: number;
  uploadedAt: string;
  isUserUploaded?: boolean;
  createdAt?: any;
}

export function compressImage(dataUrl: string, maxWidth = 1024, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function savePhotoCloud(photoData: Omit<PhotoItem, "id">): Promise<void> {
  let compressedUrl = photoData.url;
  if (photoData.url.startsWith("data:image")) {
    compressedUrl = await compressImage(photoData.url);
  }

  const record: PhotoItem = {
    ...photoData,
    id: "photo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    url: compressedUrl,
  };

  // 1. Save to Supabase
  try {
    await supabase.from("photos").insert([
      {
        id: record.id,
        url: record.url,
        title: record.title || "",
        author: record.author || "",
        category: record.category || "fiesta",
        likes: record.likes || 0,
        commentsCount: record.commentsCount || 0,
        uploadedAt: record.uploadedAt || new Date().toLocaleString("es-ES"),
        isUserUploaded: record.isUserUploaded ?? true,
      },
    ]);
  } catch (err) {
    console.warn("Supabase photo upload error", err);
  }

  // 2. Backup API call
  try {
    await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch (e) {}
}

export function subscribePhotosCloud(callback: (records: PhotoItem[]) => void) {
  let isSubscribed = true;

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted: PhotoItem[] = data.map((item: any) => ({
          id: item.id,
          url: item.url,
          title: item.title || "",
          author: item.author || "",
          category: item.category || "fiesta",
          likes: item.likes || 0,
          commentsCount: item.commentsCount || 0,
          uploadedAt: item.uploadedAt || "",
          isUserUploaded: item.isUserUploaded ?? true,
        }));
        if (isSubscribed) {
          callback(formatted);
          return;
        }
      }
    } catch (e) {}

    // Fallback API
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const serverPhotos: PhotoItem[] = Array.isArray(json.photos) ? json.photos : [];
        if (isSubscribed) {
          callback(serverPhotos);
        }
      }
    } catch (e) {}
  };

  fetchPhotos();

  let channel: any = null;
  try {
    channel = supabase
      .channel("public:photos")
      .on("postgres_changes", { event: "*", schema: "public", table: "photos" }, () => {
        fetchPhotos();
      })
      .subscribe();
  } catch (e) {}

  const intervalId = setInterval(fetchPhotos, 4000);

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}

export function getLocalPhotos(): PhotoItem[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("boda_lucia_photos");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  return [];
}

export async function clearAllPhotosCloud(): Promise<void> {
  try {
    await supabase.from("photos").delete().neq("id", "0");
  } catch (e) {}

  try {
    await fetch("/api/photos", { method: "DELETE" });
  } catch (e) {}

  if (typeof window !== "undefined") {
    localStorage.removeItem("boda_lucia_photos");
  }
}
