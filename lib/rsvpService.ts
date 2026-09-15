import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
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

const COLLECTION_NAME = "rsvps";

export async function saveRSVP(rsvpData: Omit<RSVPRecord, "id">): Promise<void> {
  const recordWithId: RSVPRecord = {
    ...rsvpData,
    id: "rsvp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
  };

  // 1. Guardar localmente solo para que ESTE invitado vea su tarjeta de confirmación si refresca
  try {
    localStorage.setItem("boda_lucia_rsvp", JSON.stringify(recordWithId));
  } catch (e) {}

  // 2. Envío directo instantáneo HTTP POST al Servidor (/api/rsvp)
  try {
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordWithId),
    });
  } catch (e) {
    console.warn("Error al enviar RSVP al servidor", e);
  }

  // 3. Respaldo secundario en Firestore
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, {
      ...recordWithId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore fallback error", err);
  }
}

export function subscribeRSVPs(callback: (records: RSVPRecord[]) => void) {
  let isSubscribed = true;

  const fetchGlobalAPI = async () => {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const serverRsvps: RSVPRecord[] = Array.isArray(data.rsvps) ? data.rsvps : [];
        if (isSubscribed) {
          callback(serverRsvps);
        }
      }
    } catch (e) {
      console.warn("API fetch error", e);
    }
  };

  fetchGlobalAPI();

  // Consulta al servidor cada 3 segundos para el Panel de Novios
  const intervalId = setInterval(fetchGlobalAPI, 3000);

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



