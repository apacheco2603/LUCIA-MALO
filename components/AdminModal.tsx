"use client";

import { useState, useEffect } from "react";
import { X, Lock, Download, Users, Utensils, Music, ShieldCheck } from "lucide-react";

interface RSVPRecord {
  name: string;
  email: string;
  attending: "yes" | "no";
  guestsCount: number;
  dietary: string[];
  dietaryNotes: string;
  dedicatedSong: string;
  message: string;
  submittedAt: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [rsvpList, setRsvpList] = useState<RSVPRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      const savedRSVP = localStorage.getItem("boda_lucia_rsvp");
      if (savedRSVP) {
        try {
          const parsed = JSON.parse(savedRSVP);
          setRsvpList(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "2026" || pinInput === "1234") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const exportToCSV = () => {
    if (rsvpList.length === 0) return;

    const headers = [
      "Nombre",
      "Email",
      "Asistira",
      "Num Asistentes",
      "Restricciones Dieteticas",
      "Notas Alergias",
      "Cancion Dedicada",
      "Mensaje",
      "Fecha Confirmacion",
    ];

    const rows = rsvpList.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      r.attending === "yes" ? "SI" : "NO",
      r.guestsCount,
      `"${(r.dietary || []).join(", ")}"`,
      `"${(r.dietaryNotes || "").replace(/"/g, '""')}"`,
      `"${(r.dedicatedSong || "").replace(/"/g, '""')}"`,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `boda_lucia_y_malo_confirmaciones_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalConfirmedAttendees = rsvpList
    .filter((r) => r.attending === "yes")
    .reduce((acc, curr) => acc + (curr.guestsCount || 1), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-dark text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-gold-500/40 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {!isAuthenticated ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-4 border border-gold-500/40">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-gold-300 mb-2">
              Acceso Panel de Novios (Lucía & Malo)
            </h3>
            <p className="text-xs text-white/70 mb-6">
              Ingresa el código PIN para consultar las confirmaciones de asistencia.
            </p>

            <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
              <input
                type="password"
                placeholder="Código PIN (ej. 2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-white placeholder-white/40 focus:outline-none focus:border-gold-500 font-mono tracking-widest text-lg"
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-semibold">
                  PIN incorrecto. Intenta con 2026.
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gold-500 hover:bg-gold-600 font-semibold text-xs tracking-wider uppercase text-white shadow-lg shadow-gold-500/20"
              >
                Entrar al Panel
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-gold-400" />
                <h3 className="font-serif text-2xl font-bold text-gold-200">
                  Resumen de Confirmaciones
                </h3>
              </div>

              <button
                onClick={exportToCSV}
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar a Excel / CSV</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                <Users className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                <span className="block text-2xl font-bold text-white">
                  {totalConfirmedAttendees}
                </span>
                <span className="text-[10px] uppercase text-gold-300 font-medium">
                  Asistentes Confirmados
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                <Utensils className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="block text-2xl font-bold text-white">
                  {
                    rsvpList.filter(
                      (r) => r.dietary && r.dietary.length > 0
                    ).length
                  }
                </span>
                <span className="text-[10px] uppercase text-emerald-300 font-medium">
                  Menús Especiales
                </span>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                <Music className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <span className="block text-2xl font-bold text-white">
                  {rsvpList.filter((r) => r.dedicatedSong).length}
                </span>
                <span className="text-[10px] uppercase text-indigo-300 font-medium">
                  Canciones Pedidas
                </span>
              </div>
            </div>

            {/* RSVPs Table list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {rsvpList.length === 0 ? (
                <p className="text-xs text-white/50 text-center py-6">
                  Aún no hay respuestas guardadas en este dispositivo.
                </p>
              ) : (
                rsvpList.map((record, i) => (
                  <div
                    key={i}
                    className="bg-black/40 rounded-xl p-3.5 border border-white/10 text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {record.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {record.attending === "yes"
                          ? ` Confirmado (${record.guestsCount} pers)`
                          : " No asistirá"}
                      </span>
                      {record.dedicatedSong && (
                        <p className="text-[11px] text-gold-300 italic mt-0.5">
                          "{record.dedicatedSong}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-white/50">
                      {record.submittedAt}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
