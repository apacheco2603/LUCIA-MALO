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
  // 1. Immediately save locally to LocalStorage (boda_lucia_rsvp and boda_lucia_rsvp_list)
  try {
    localStorage.setItem("boda_lucia_rsvp", JSON.stringify(rsvpData));
    const currentLocal = getLocalRSVPs();
    const updatedLocal = mergeRSVPArrays([rsvpData as RSVPRecord], currentLocal);
    localStorage.setItem("boda_lucia_rsvp_list", JSON.stringify(updatedLocal));
  } catch (e) {
    console.warn("LocalStorage save error", e);
  }

  // 2. Post to Server API Endpoint (/api/rsvp) - Syncs with cloud DB and server file
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rsvpData),
    });
    if (res.ok) {
      const body = await res.json();
      if (body && Array.isArray(body.rsvps) && body.rsvps.length > 0) {
        const merged = mergeRSVPArrays(body.rsvps, getLocalRSVPs());
        localStorage.setItem("boda_lucia_rsvp_list", JSON.stringify(merged));
      }
    }
  } catch (e) {
    console.warn("Server API save warning", e);
  }

  // 3. Save to Cloud Firestore fallback
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

function isTestRecord(item: any): boolean {
  if (!item || !item.name) return true;
  const lowerName = String(item.name).trim().toLowerCase();
  return (
    lowerName.includes("test") ||
    lowerName === "dummy" ||
    lowerName === "prueba" ||
    lowerName === "user"
  );
}

function mergeRSVPArrays(listA: RSVPRecord[], listB: RSVPRecord[]): RSVPRecord[] {
  const mergedMap = new Map<string, RSVPRecord>();
  [...listA, ...listB].forEach((item) => {
    if (!item || !item.name || isTestRecord(item)) return;
    const key =
      item.id || `${item.name.trim().toLowerCase()}_${item.email ? item.email.trim().toLowerCase() : ""}_${item.submittedAt || ""}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, item);
    }
  });
  return Array.from(mergedMap.values());
}

export function subscribeRSVPs(callback: (records: RSVPRecord[]) => void) {
  let isSubscribed = true;

  // 1. Instantly return local items on subscription start (no blank state on reload!)
  const initialLocal = getLocalRSVPs();
  callback(initialLocal);

  const fetchGlobalAPI = async () => {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const serverRsvps: RSVPRecord[] = Array.isArray(data.rsvps) ? data.rsvps : [];
        const localRsvps = getLocalRSVPs();
        const merged = mergeRSVPArrays(serverRsvps, localRsvps);

        // If client device has local items not present on server, sync them to server!
        if (localRsvps.length > 0 && merged.length > serverRsvps.length) {
          try {
            fetch("/api/rsvp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(localRsvps),
            });
          } catch (e) {
            console.warn("Auto-sync local to server error", e);
          }
        }

        try {
          localStorage.setItem("boda_lucia_rsvp_list", JSON.stringify(merged));
        } catch (e) {}

        if (isSubscribed) {
          callback(merged);
        }
        return true;
      }
    } catch (e) {
      console.warn("API fetch warning", e);
    }

    // Fallback: if network API call fails, provide local storage
    if (isSubscribed) {
      callback(getLocalRSVPs());
    }
    return false;
  };

  fetchGlobalAPI();

  // Polling fallback to check API every 3 seconds for real-time updates
  const intervalId = setInterval(fetchGlobalAPI, 3000);

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
          if (!isTestRecord(data)) {
            cloudDocs.push({
              ...data,
              id: docSnap.id,
            });
          }
        });

        if (isSubscribed) {
          const merged = mergeRSVPArrays(cloudDocs, getLocalRSVPs());
          callback(merged);
        }
      },
      () => {}
    );
  } catch (e) {}

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
      if (Array.isArray(parsed)) list = parsed.filter((i) => !isTestRecord(i));
    } catch (e) {
      console.error(e);
    }
  }

  if (savedSingleRaw) {
    try {
      const parsed = JSON.parse(savedSingleRaw);
      if (parsed && parsed.name && !isTestRecord(parsed)) {
        list = mergeRSVPArrays([parsed], list);
      } else if (isTestRecord(parsed)) {
        localStorage.removeItem("boda_lucia_rsvp");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return list.filter((i) => !isTestRecord(i));
}


