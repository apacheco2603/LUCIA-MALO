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
  // 1. Save to LocalStorage as instant local fallback
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

  // 2. Save to Cloud Firestore in the cloud
  try {
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, {
      ...rsvpData,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore save fallback to local storage", err);
  }
}

export function subscribeRSVPs(callback: (records: RSVPRecord[]) => void) {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const cloudDocs: RSVPRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as RSVPRecord;
          cloudDocs.push({
            ...data,
            id: doc.id,
          });
        });

        if (cloudDocs.length > 0) {
          callback(cloudDocs);
        } else {
          callback(getLocalRSVPs());
        }
      },
      (error) => {
        console.warn("Firestore subscription error, using local storage", error);
        callback(getLocalRSVPs());
      }
    );
  } catch (e) {
    console.warn("Firestore subscription init error", e);
    callback(getLocalRSVPs());
    return () => {};
  }
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
