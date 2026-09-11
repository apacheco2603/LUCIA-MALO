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

// Helper to compress base64 image before cloud upload so it uploads instantly
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

  // 1. Save locally as instant local fallback
  try {
    const savedRaw = localStorage.getItem("boda_lucia_photos");
    let existingList: PhotoItem[] = [];
    if (savedRaw) {
      try {
        existingList = JSON.parse(savedRaw);
        if (!Array.isArray(existingList)) existingList = [];
      } catch (e) {
        existingList = [];
      }
    }
    const localItem: PhotoItem = {
      ...payload,
      id: "p_" + Date.now(),
    };
    localStorage.setItem("boda_lucia_photos", JSON.stringify([localItem, ...existingList]));
  } catch (e) {
    console.warn("LocalStorage photo save warning", e);
  }

  // 2. Upload to Cloud Firestore for global cloud availability
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, payload);
  } catch (err) {
    console.warn("Firestore photo upload error", err);
  }
}

export function subscribePhotosCloud(callback: (records: PhotoItem[]) => void) {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const cloudDocs: PhotoItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PhotoItem;
          cloudDocs.push({
            ...data,
            id: docSnap.id,
          });
        });

        if (cloudDocs.length > 0) {
          callback(cloudDocs);
        } else {
          callback(getLocalPhotos());
        }
      },
      (error) => {
        console.warn("Firestore photo subscription error, using local storage", error);
        callback(getLocalPhotos());
      }
    );
  } catch (e) {
    console.warn("Firestore photo subscribe init error", e);
    callback(getLocalPhotos());
    return () => {};
  }
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
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
    await Promise.all(deletePromises);
  } catch (e) {
    console.warn("Clear photos cloud error", e);
  }
}
