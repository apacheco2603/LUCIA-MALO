"use client";

import { useState, useEffect, FormEvent } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Heart, Send, Users, AlertCircle, Sparkles } from "lucide-react";

interface RSVPData {
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

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "yes" as "yes" | "no",
    guestsCount: 1,
    dietaryNotes: "",
    dedicatedSong: "",
    message: "",
  });

  const [dietaryOptions, setDietaryOptions] = useState({
    vegetariano: false,
    vegano: false,
    celiaco: false,
    sinLactosa: false,
    alergias: false,
  });

  const [submittedData, setSubmittedData] = useState<RSVPData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user already confirmed RSVP
    const savedRSVP = localStorage.getItem("boda_lucia_rsvp");
    if (savedRSVP) {
      try {
        setSubmittedData(JSON.parse(savedRSVP));
      } catch (e) {
        console.error("Error parsing saved RSVP", e);
      }
    }
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#4A5D4E", "#FAF5ED", "#E8C4C4"],
      });
    } catch (e) {
      console.warn("Confetti error", e);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    const activeDiets = Object.entries(dietaryOptions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key);

    const newRsvp: RSVPData = {
      ...formData,
      dietary: activeDiets,
      submittedAt: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTimeout(() => {
      localStorage.setItem("boda_lucia_rsvp", JSON.stringify(newRsvp));
      setSubmittedData(newRsvp);
      setIsSubmitting(false);
      triggerConfetti();
    }, 600);
  };

  const handleResetRSVP = () => {
    localStorage.removeItem("boda_lucia_rsvp");
    setSubmittedData(null);
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-sage-900 text-white relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-500/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold block mb-2">
            Confirmación de Asistencia
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            ¿Nos Acompañas? (RSVP)
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
          <p className="text-white/80 font-light max-w-xl mx-auto text-sm sm:text-base">
            Por favor, confirma tu asistencia antes del <strong>1 de Septiembre de 2026</strong> para poder organizar los lugares y el menú especial.
          </p>
        </div>

        {/* Form or Confirmed Card */}
        {submittedData ? (
          <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-gold-500/40 text-center max-w-2xl mx-auto shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-6 border border-gold-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-3xl font-bold text-gold-200 mb-2">
              ¡Asistencia Confirmada!
            </h3>
            <p className="text-sm text-white/90 mb-8">
              Gracias, <strong>{submittedData.name}</strong>. Hemos guardado tu confirmación con éxito.
            </p>

            <div className="bg-black/40 rounded-2xl p-6 text-left text-xs space-y-3 mb-8 border border-white/10">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gold-300">Asistencia:</span>
                <span className="font-semibold text-white">
                  {submittedData.attending === "yes"
                    ? "Sí, ¡allí estaré!"
                    : "No podré asistir"}
                </span>
              </div>
              {submittedData.attending === "yes" && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gold-300">Nº de Asistentes:</span>
                  <span className="font-semibold text-white">
                    {submittedData.guestsCount} persona(s)
                  </span>
                </div>
              )}
              {submittedData.dedicatedSong && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gold-300">Canción Dedicada:</span>
                  <span className="font-semibold text-white italic">
                    "{submittedData.dedicatedSong}"
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-gold-300">Fecha de Confirmación:</span>
                <span className="text-white/70">{submittedData.submittedAt}</span>
              </div>
            </div>

            <button
              onClick={handleResetRSVP}
              className="text-xs text-gold-400 hover:text-gold-300 underline tracking-wider uppercase transition-colors"
            >
              Modificar mi respuesta
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-panel-dark rounded-3xl p-6 sm:p-10 border border-gold-500/30 space-y-8 shadow-2xl"
          >
            {/* Attendance Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: "yes" })}
                className={`py-4 px-6 rounded-2xl border text-sm font-semibold tracking-wider flex items-center justify-center gap-3 transition-all ${
                  formData.attending === "yes"
                    ? "bg-gold-500 border-gold-400 text-white shadow-lg shadow-gold-500/30 scale-102"
                    : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
                }`}
              >
                <Heart className={`w-5 h-5 ${formData.attending === "yes" ? "fill-white" : ""}`} />
                <span>¡Sí, asistiré a la boda!</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, attending: "no" })}
                className={`py-4 px-6 rounded-2xl border text-sm font-semibold tracking-wider flex items-center justify-center gap-3 transition-all ${
                  formData.attending === "no"
                    ? "bg-rose-900/80 border-rose-500 text-white shadow-lg"
                    : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span>Lamentablemente no podré</span>
              </button>
            </div>

            {/* Guest Info inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. María García López"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>
            </div>

            {formData.attending === "yes" && (
              <>
                {/* Number of Guests */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                    Número de Asistentes Confirmados
                  </label>
                  <div className="flex items-center gap-4">
                    <Users className="w-5 h-5 text-gold-400" />
                    <select
                      value={formData.guestsCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guestsCount: parseInt(e.target.value),
                        })
                      }
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 text-sm font-medium"
                    >
                      <option value={1} className="bg-sage-900 text-white">1 Persona (Solo yo)</option>
                      <option value={2} className="bg-sage-900 text-white">2 Personas (Yo + 1 Acompañante)</option>
                      <option value={3} className="bg-sage-900 text-white">3 Personas</option>
                      <option value={4} className="bg-sage-900 text-white">Familia (4 Personas)</option>
                    </select>
                  </div>
                </div>

                {/* Dietary Requirements */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-3">
                    Restricciones Alimentarias / Alergias
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                      { key: "vegetariano", label: "Vegetariano" },
                      { key: "vegano", label: "Vegano" },
                      { key: "celiaco", label: "Celiaco / Sin Gluten" },
                      { key: "sinLactosa", label: "Sin Lactosa" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={
                            dietaryOptions[
                              item.key as keyof typeof dietaryOptions
                            ]
                          }
                          onChange={(e) =>
                            setDietaryOptions({
                              ...dietaryOptions,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="accent-gold-500 w-4 h-4 rounded"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Detalles sobre alguna alergia en específico..."
                    value={formData.dietaryNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, dietaryNotes: e.target.value })
                    }
                    className="w-full mt-3 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                {/* Dedicated Song */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                    Canción indispensable para ti en la fiesta 🎵
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 'Perfect' - Ed Sheeran o 'Bailando' - Enrique Iglesias"
                    value={formData.dedicatedSong}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dedicatedSong: e.target.value,
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                  />
                </div>
              </>
            )}

            {/* Message to Couple */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                Unas Palabras o Mensaje para los Novios ❤️
              </label>
              <textarea
                rows={3}
                placeholder="Escribe aquí un mensaje especial..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gold-500 hover:bg-gold-600 font-semibold text-sm tracking-wider uppercase transition-all shadow-lg shadow-gold-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Guardando confirmación...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Confirmación</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
