import { supabase } from "./supabase";

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

  // 1. Guardar en localStorage para vista inmediata del usuario
  try {
    localStorage.setItem("boda_lucia_rsvp", JSON.stringify(recordWithId));
  } catch (e) {}

  // 2. Guardar en Supabase (Base de datos real de producción)
  try {
    const { error } = await supabase.from("rsvps").insert([
      {
        id: recordWithId.id,
        name: recordWithId.name,
        email: recordWithId.email || "",
        attending: recordWithId.attending,
        guestsCount: recordWithId.guestsCount || 1,
        dietary: recordWithId.dietary || [],
        dietaryNotes: recordWithId.dietaryNotes || "",
        dedicatedSong: recordWithId.dedicatedSong || "",
        message: recordWithId.message || "",
        submittedAt: recordWithId.submittedAt || new Date().toLocaleString("es-ES"),
      },
    ]);

    if (error) {
      console.warn("Supabase insert warning:", error);
    }
  } catch (e) {
    console.warn("Supabase save error:", e);
  }

  // 3. Respaldo secundario en /api/rsvp
  try {
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordWithId),
    });
  } catch (e) {}
}

export function subscribeRSVPs(callback: (records: RSVPRecord[]) => void) {
  let isSubscribed = true;

  const fetchRSVPs = async () => {
    // 1. Intentar obtener desde Supabase
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted: RSVPRecord[] = data.map((item: any) => ({
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

        if (isSubscribed) {
          callback(formatted);
          return;
        }
      }
    } catch (e) {
      console.warn("Supabase fetch warning:", e);
    }

    // 2. Respaldo a /api/rsvp si falla Supabase o tabla está vacía
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const serverRsvps: RSVPRecord[] = Array.isArray(json.rsvps) ? json.rsvps : [];
        if (isSubscribed) {
          callback(serverRsvps);
        }
      }
    } catch (e) {}
  };

  fetchRSVPs();

  // Suscripción Realtime Supabase (Escucha cambios instantáneos)
  let channel: any = null;
  try {
    channel = supabase
      .channel("public:rsvps")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps" },
        () => {
          fetchRSVPs();
        }
      )
      .subscribe();
  } catch (e) {}

  // Polling de respaldo cada 3 segundos
  const intervalId = setInterval(fetchRSVPs, 3000);

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (channel) {
      supabase.removeChannel(channel);
    }
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
    await supabase.from("rsvps").delete().neq("id", "0");
  } catch (e) {}

  try {
    await fetch("/api/rsvp", { method: "DELETE" });
  } catch (e) {}

  if (typeof window !== "undefined") {
    localStorage.removeItem("boda_lucia_rsvp");
    localStorage.removeItem("boda_lucia_rsvp_list");
  }
}
