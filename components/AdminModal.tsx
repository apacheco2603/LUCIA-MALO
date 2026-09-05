"use client";

import { useState, useEffect } from "react";
import {
  X,
  Lock,
  Download,
  Users,
  Utensils,
  Music,
  ShieldCheck,
  Trash2,
  Edit3,
  Globe,
  Save,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  useLanguage,
  Language,
  TranslationKeys,
  translations,
} from "@/context/LanguageContext";

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
  const { customTexts, updateCustomText, resetCustomTexts } = useLanguage();

  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [rsvpList, setRsvpList] = useState<RSVPRecord[]>([]);
  const [clearPhotoNotice, setClearPhotoNotice] = useState(false);

  // Sub-menu Tab state
  const [activeTab, setActiveTab] = useState<"rsvp" | "texts">("rsvp");

  // Text editor state
  const [editLang, setEditLang] = useState<Language>("es");
  const [localTexts, setLocalTexts] = useState<Record<string, string>>({});
  const [saveNotice, setSaveNotice] = useState(false);

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

  // Load texts into local state when editLang or customTexts change
  useEffect(() => {
    const base = translations[editLang] || translations.es;
    const overrides = customTexts[editLang] || {};
    const merged: Record<string, string> = {};

    Object.keys(base).forEach((k) => {
      const key = k as TranslationKeys;
      merged[key] = overrides[key] !== undefined ? overrides[key] : base[key];
    });

    setLocalTexts(merged);
  }, [editLang, customTexts, isOpen]);

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
    link.setAttribute(
      "download",
      `boda_lucia_y_malo_confirmaciones_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearPhotos = () => {
    localStorage.removeItem("boda_lucia_photos");
    setClearPhotoNotice(true);
    setTimeout(() => {
      setClearPhotoNotice(false);
      window.location.reload();
    }, 1200);
  };

  const handleTextChange = (key: string, val: string) => {
    setLocalTexts((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSaveTexts = () => {
    Object.entries(localTexts).forEach(([key, val]) => {
      updateCustomText(editLang, key as TranslationKeys, val);
    });
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const handleResetTexts = () => {
    if (
      confirm(
        "¿Restablecer todos los textos a la versión original por defecto?"
      )
    ) {
      resetCustomTexts();
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 2500);
    }
  };

  const totalConfirmedAttendees = rsvpList
    .filter((r) => r.attending === "yes")
    .reduce((acc, curr) => acc + (curr.guestsCount || 1), 0);

  // Grouped text keys for organized editing
  const textCategories = [
    {
      title: "Hero & Portada",
      keys: [
        { key: "hero_we_are_getting_married", label: "Título Principal" },
        { key: "hero_quote", label: "Frase Emotiva", multiline: true },
        { key: "hero_date", label: "Fecha mostrada" },
        { key: "hero_location", label: "Lugar mostrada" },
        { key: "hero_countdown_title", label: "Título Cuenta Regresiva" },
      ],
    },
    {
      title: "Detalles & Programación (Itinerario)",
      keys: [
        { key: "details_subtitle", label: "Subtítulo Sección" },
        { key: "details_title", label: "Título Sección" },
        { key: "details_desc", label: "Descripción Sección" },
        { key: "details_itinerary_title", label: "Título Itinerario" },
        { key: "itinerary_1_title", label: "Evento 1 Título" },
        { key: "itinerary_1_desc", label: "Evento 1 Descripción" },
        { key: "itinerary_2_title", label: "Evento 2 Título" },
        { key: "itinerary_2_desc", label: "Evento 2 Descripción" },
        { key: "itinerary_3_title", label: "Evento 3 Título" },
        { key: "itinerary_3_desc", label: "Evento 3 Descripción" },
        { key: "itinerary_4_title", label: "Evento 4 Título" },
        { key: "itinerary_4_desc", label: "Evento 4 Descripción" },
        { key: "itinerary_5_title", label: "Evento 5 Título" },
        { key: "itinerary_5_desc", label: "Evento 5 Descripción" },
      ],
    },
    {
      title: "Dónde se Celebra & Accesos",
      keys: [
        { key: "venue_title", label: "Título Dónde se Celebra" },
        { key: "venue_name", label: "Lugar" },
        { key: "venue_address", label: "Dirección" },
        { key: "venue_access_muni", label: "Acceso Municipalidad" },
        { key: "venue_access_recep", label: "Acceso Recepción" },
        { key: "venue_maps_btn", label: "Texto Botón Google Maps" },
      ],
    },
    {
      title: "Código de Vestimenta",
      keys: [
        { key: "dress_title", label: "Título Vestimenta" },
        { key: "dress_subtitle", label: "Estilo (ej. Sport Elegante)" },
        { key: "dress_quote", label: "Mensaje Vestimenta", multiline: true },
      ],
    },
    {
      title: "Luna de Miel & IBAN",
      keys: [
        { key: "gift_title", label: "Título Regalos" },
        { key: "gift_desc", label: "Mensaje de Luna de Miel", multiline: true },
        { key: "gift_iban_label", label: "Etiqueta IBAN" },
      ],
    },
    {
      title: "Confirmación RSVP",
      keys: [
        { key: "rsvp_subtitle", label: "Subtítulo RSVP" },
        { key: "rsvp_title", label: "Título RSVP" },
        { key: "rsvp_desc", label: "Descripción / Fecha Límite", multiline: true },
        { key: "rsvp_yes", label: "Opción Confirmación Sí" },
        { key: "rsvp_no", label: "Opción Confirmación No" },
      ],
    },
    {
      title: "Galería de Fotos & Spotify",
      keys: [
        { key: "photos_subtitle", label: "Subtítulo Fotos" },
        { key: "photos_title", label: "Título Repositorio Fotos" },
        { key: "photos_desc", label: "Descripción Galería", multiline: true },
        { key: "spotify_title", label: "Título Spotify" },
        { key: "spotify_desc", label: "Descripción Spotify", multiline: true },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-dark text-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-gold-500/40 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {!isAuthenticated ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-4 border border-gold-500/40">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-gold-300 mb-2">
              Acceso Panel de Novios (Lucía & Malo)
            </h3>
            <p className="text-xs text-white/70 mb-6">
              Ingresa el código PIN para consultar las confirmaciones y editar los textos de la página.
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
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header & Main Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-gold-400" />
                <h3 className="font-serif text-2xl font-bold text-gold-200">
                  Panel de Administración
                </h3>
              </div>

              {/* Sub-menu Navigation Bar */}
              <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("rsvp")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === "rsvp"
                      ? "bg-gold-500 text-white shadow-md"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Confirmaciones RSVP</span>
                </button>

                <button
                  onClick={() => setActiveTab("texts")}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === "texts"
                      ? "bg-gold-500 text-white shadow-md"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Textos Web</span>
                </button>
              </div>
            </div>

            {/* TAB 1: RSVP & REPOSITORY ADMIN */}
            {activeTab === "rsvp" && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-gold-200">
                      Resumen de Asistencia
                    </h4>
                    <p className="text-xs text-gray-400">
                      Exporta las respuestas o administra el repositorio de fotos de los invitados.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportToCSV}
                      className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar CSV</span>
                    </button>

                    <button
                      onClick={handleClearPhotos}
                      className="px-3 py-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-rose-500/40 transition-colors"
                      title="Vaciar fotos del repositorio de invitados"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Limpiar Fotos</span>
                    </button>
                  </div>
                </div>

                {clearPhotoNotice && (
                  <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs p-3 rounded-xl text-center">
                    ¡Repositorio de fotos vaciado con éxito! Recargando...
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
                    <Users className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                    <span className="block text-2xl font-bold text-white">
                      {totalConfirmedAttendees}
                    </span>
                    <span className="text-[10px] uppercase text-gold-300 font-medium">
                      Asistentes
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
                <div className="space-y-3">
                  <h5 className="text-xs uppercase tracking-wider text-gold-300 font-semibold">
                    Lista de Respuestas ({rsvpList.length})
                  </h5>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
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
                            <span className="text-[11px] text-gray-300">
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
              </div>
            )}

            {/* TAB 2: TEXT EDITOR */}
            {activeTab === "texts" && (
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* Language Switcher & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gold-400" />
                    <span className="text-xs font-semibold text-gray-300">
                      Idioma a editar:
                    </span>
                    <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                      <button
                        onClick={() => setEditLang("es")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          editLang === "es"
                            ? "bg-gold-500 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Español 🇪🇸
                      </button>
                      <button
                        onClick={() => setEditLang("fr")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          editLang === "fr"
                            ? "bg-gold-500 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Français 🇫🇷
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleResetTexts}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      title="Restablecer textos por defecto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer</span>
                    </button>

                    <button
                      onClick={handleSaveTexts}
                      className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>

                {saveNotice && (
                  <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-200 text-xs p-3 rounded-xl text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Textos guardados exitosamente! La página se ha actualizado.</span>
                  </div>
                )}

                {/* Categorized Fields */}
                <div className="space-y-6">
                  {textCategories.map((cat, catIdx) => (
                    <div
                      key={catIdx}
                      className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-4"
                    >
                      <h4 className="font-serif text-lg font-bold text-gold-300 border-b border-white/10 pb-2">
                        {cat.title}
                      </h4>

                      <div className="grid grid-cols-1 gap-4">
                        {cat.keys.map((item) => {
                          const val = localTexts[item.key] || "";
                          return (
                            <div key={item.key} className="space-y-1">
                              <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block">
                                {item.label}
                              </label>
                              {item.multiline ? (
                                <textarea
                                  rows={3}
                                  value={val}
                                  onChange={(e) =>
                                    handleTextChange(item.key, e.target.value)
                                  }
                                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold-500 leading-relaxed font-sans"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) =>
                                    handleTextChange(item.key, e.target.value)
                                  }
                                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold-500 font-sans"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
