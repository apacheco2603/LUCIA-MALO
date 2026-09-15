import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface RSVPRecord {
  id?: string;
  name: string;
  email: string;
  attending: "yes" | "no";
  guestsCount: number;
  dietary: string[];
  dietaryNotes: string;
  dedicatedSong: string;
  message: string;
  submittedAt: string;
  createdAt?: any;
}

const CLOUD_DB_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a0a515cba41037";
const COLLECTION_NAME = "rsvps";

function mergeRSVPLists(listA: RSVPRecord[], listB: RSVPRecord[]): RSVPRecord[] {
  const mergedMap = new Map<string, RSVPRecord>();
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

export async function saveRSVP(rsvpData: Omit<RSVPRecord, "id">): Promise<void> {
  const recordWithId: RSVPRecord = {
    ...rsvpData,
    id: "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
  };

  // 1. Guardar copia del invitado actual en localStorage para vista de confirmación
  try {
    localStorage.setItem("boda_lucia_rsvp", JSON.stringify(recordWithId));
  } catch (e) {}

  // 2. Guardado DIRECTO e instantáneo en la Base de Datos Cloud en tiempo real
  try {
    const cloudRes = await fetch(CLOUD_DB_URL, { cache: "no-store" });
    let currentList: RSVPRecord[] = [];
    if (cloudRes.ok) {
      const body = await cloudRes.json();
      if (body && body.data && Array.isArray(body.data.list)) {
        currentList = body.data.list;
      }
    }

    const updatedList = mergeRSVPLists([recordWithId], currentList);

    await fetch(CLOUD_DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "boda_lucia_rsvps",
        data: { list: updatedList },
      }),
    });
  } catch (e) {
    console.warn("Direct Cloud DB PUT error", e);
  }

  // 3. Respaldo en endpoint del servidor local /api/rsvp
  try {
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordWithId),
    });
  } catch (e) {}

  // 4. Respaldo secundario en Firestore
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, {
      ...recordWithId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {}
}

export function subscribeRSVPs(callback: (records: RSVPRecord[]) => void) {
  let isSubscribed = true;

  const fetchDirect = async () => {
    // 1. Intentar consulta DIRECTA a Cloud DB (cero almacenamiento intermedio, cero caché)
    try {
      const res = await fetch(CLOUD_DB_URL, { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        if (body && body.data && Array.isArray(body.data.list)) {
          if (isSubscribed) {
            callback(body.data.list);
          }
          return;
        }
      }
    } catch (e) {
      console.warn("Direct Cloud DB fetch error", e);
    }

    // 2. Respaldo a /api/rsvp si falla la conexión directa
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const serverRsvps: RSVPRecord[] = Array.isArray(data.rsvps) ? data.rsvps : [];
        if (isSubscribed) {
          callback(serverRsvps);
        }
      }
    } catch (e) {}
  };

  fetchDirect();

  // Polling rápido cada 2 segundos mientras el Panel de Novios esté abierto
  const intervalId = setInterval(fetchDirect, 2000);

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
  };
}

export function getLocalRSVPs(): RSVPRecord[] {
  if (typeof window === "undefined") return [];
  const savedSingleRaw = localStorage.getItem("boda_lucia_rsvp");
  if (savedSingleRaw) {
    try {
      const parsed = JSON.parse(savedSingleRaw);
      if (parsed && parsed.name) return [parsed];
    } catch (e) {}
  }
  return [];
}

export async function clearAllRSVPsCloud(): Promise<void> {
  try {
    await fetch(CLOUD_DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "boda_lucia_rsvps",
        data: { list: [] },
      }),
    });
  } catch (e) {}

  try {
    await fetch("/api/rsvp", { method: "DELETE" });
  } catch (e) {}

  if (typeof window !== "undefined") {
    localStorage.removeItem("boda_lucia_rsvp");
    localStorage.removeItem("boda_lucia_rsvp_list");
  }
}




