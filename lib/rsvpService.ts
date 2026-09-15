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
  // 1. Save to Server API Endpoint (/api/rsvp) - Works globally across all devices
  try {
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rsvpData),
    });
  } catch (e) {
    console.warn("Server API save warning", e);
  }

  // 2. Save to LocalStorage as instant local fallback
  try {
    localStorage.setItem("boda_lucia_rsvp", JSON.stringify(rsvpData));
    const savedListRaw = localStorage.getItem("boda_lucia_rsvp_list");
    let savedList: RSVPRecord[] = [];
    if (savedListRaw) {
      try {
        const parsed = JSON.parse(savedListRaw);
        if (Array.isArray(parsed)) savedList = parsed;
      } catch (e) {
        savedList = [];
      }
    }
    localStorage.setItem(
      "boda_lucia_rsvp_list",
      JSON.stringify([rsvpData, ...savedList])
    );
  } catch (e) {
    console.warn("LocalStorage save error", e);
  }

  // 3. Save to Cloud Firestore
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, {
      ...rsvpData,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore save fallback", err);
  }
}

export function subscribeRSVPs(callback: (records: RSVPRecord[]) => void) {
  let isSubscribed = true;

  const fetchGlobalAPI = async () => {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.rsvps) && data.rsvps.length > 0) {
          if (isSubscribed) callback(data.rsvps);
          return true;
        }
      }
    } catch (e) {
      console.warn("API fetch warning", e);
    }
    return false;
  };

  fetchGlobalAPI();

  // Polling fallback to check API every 4 seconds
  const intervalId = setInterval(fetchGlobalAPI, 4000);

  // Firestore real-time listener as secondary sync
  let unsubscribeFirestore = () => {};
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));

    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        const cloudDocs: RSVPRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as RSVPRecord;
          cloudDocs.push({
            ...data,
            id: docSnap.id,
          });
        });

        if (cloudDocs.length > 0 && isSubscribed) {
          callback(cloudDocs);
        }
      },
      () => {
        // Fallback to local storage if needed
      }
    );
  } catch (e) {
    // Ignore init errors
  }

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    unsubscribeFirestore();
  };
}

export function getLocalRSVPs(): RSVPRecord[] {
  if (typeof window === "undefined") return [];
  const savedListRaw = localStorage.getItem("boda_lucia_rsvp_list");
  const savedSingleRaw = localStorage.getItem("boda_lucia_rsvp");

  let list: RSVPRecord[] = [];
  if (savedListRaw) {
    try {
      const parsed = JSON.parse(savedListRaw);
      if (Array.isArray(parsed)) list = parsed;
    } catch (e) {
      console.error(e);
    }
  }

  if (list.length === 0 && savedSingleRaw) {
    try {
      const parsed = JSON.parse(savedSingleRaw);
      list = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error(e);
    }
  }

  return list;
}
