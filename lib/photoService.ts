import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

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

const COLLECTION_NAME = "photos";

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

  const payload = {
    ...photoData,
    url: compressedUrl,
    createdAt: serverTimestamp(),
  };

  // 1. Envío directo al Servidor (/api/photos)
  try {
    await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("Server API photo save error", e);
  }

  // 2. Respaldo en Firestore
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, payload);
  } catch (err) {
    console.warn("Firestore photo upload error", err);
  }
}

export function subscribePhotosCloud(callback: (records: PhotoItem[]) => void) {
  let isSubscribed = true;

  const fetchGlobalAPI = async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const serverPhotos: PhotoItem[] = Array.isArray(data.photos) ? data.photos : [];
        if (isSubscribed) {
          callback(serverPhotos);
        }
      }
    } catch (e) {
      console.warn("API photos fetch error", e);
    }
  };

  fetchGlobalAPI();
  const intervalId = setInterval(fetchGlobalAPI, 4000);

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
  };
}



export function getLocalPhotos(): PhotoItem[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("boda_lucia_photos");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

export async function clearAllPhotosCloud(): Promise<void> {
  localStorage.removeItem("boda_lucia_photos");
  try {
    await fetch("/api/photos", { method: "DELETE" });
  } catch (e) {}

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
    await Promise.all(deletePromises);
  } catch (e) {
    console.warn("Clear photos cloud error", e);
  }
}
