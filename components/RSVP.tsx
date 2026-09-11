"use client";

import { useState, useEffect, FormEvent } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Heart, Send, Users, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { saveRSVP, RSVPRecord } from "@/lib/rsvpService";

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
  const { t } = useLanguage();

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
  });

  const [submittedData, setSubmittedData] = useState<RSVPData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedRSVP = localStorage.getItem("boda_lucia_rsvp");
    if (savedRSVP) {
      try {
        setSubmittedData(JSON.parse(savedRSVP));
      } catch (e) {
        console.error(e);
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

  const handleSubmit = async (e: FormEvent) => {
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

    await saveRSVP(newRsvp);
    setSubmittedData(newRsvp);
    setIsSubmitting(false);
    triggerConfetti();
  };

  const handleResetRSVP = () => {
    localStorage.removeItem("boda_lucia_rsvp");
    setSubmittedData(null);
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-sage-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-500/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold block mb-2">
            {t("rsvp_subtitle")}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            {t("rsvp_title")}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
          <p className="text-white/80 font-light max-w-xl mx-auto text-sm sm:text-base">
            {t("rsvp_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Side Photo Card 3 of Lucía & Malo (Autumn Leaves Pergola Selfie) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="glass-panel-dark rounded-3xl p-3 sm:p-4 border border-gold-500/40 shadow-2xl overflow-hidden w-full max-w-sm">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <img
                  src="/images/couple/photo_3.jpg"
                  alt="Lucía & Malo"
                  className="w-full h-full object-cover object-[center_25%]"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="font-serif italic text-gold-200 text-sm">
                  "¡Esperamos celebrar este gran día a tu lado!"
                </p>
              </div>
            </div>
          </div>

          {/* RSVP Form Column */}
          <div className="lg:col-span-7">
            {submittedData ? (
              <div className="glass-panel-dark rounded-3xl p-8 sm:p-12 border border-gold-500/40 text-center max-w-2xl mx-auto shadow-2xl animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto mb-6 border border-gold-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="font-serif text-3xl font-bold text-gold-200 mb-2">
                  {t("rsvp_confirmed_title")}
                </h3>
                <p className="text-sm text-white/90 mb-8">
                  {t("rsvp_confirmed_thanks")} (<strong>{submittedData.name}</strong>)
                </p>

                <button
                  onClick={handleResetRSVP}
                  className="text-xs text-gold-400 hover:text-gold-300 underline tracking-wider uppercase transition-colors"
                >
                  {t("rsvp_modify_btn")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-panel-dark rounded-3xl p-6 sm:p-10 border border-gold-500/30 space-y-8 shadow-2xl"
              >
                {/* Choice */}
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
                    <span>{t("rsvp_yes")}</span>
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
                    <span>{t("rsvp_no")}</span>
                  </button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                      {t("rsvp_name_label")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="María García..."
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                      {t("rsvp_email_label")}
                    </label>
                    <input
                      type="email"
                      placeholder="exemple@email.com"
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
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                        {t("rsvp_guests_label")}
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
                          <option value={1} className="bg-sage-900 text-white">{t("rsvp_guests_1")}</option>
                          <option value={2} className="bg-sage-900 text-white">{t("rsvp_guests_2")}</option>
                          <option value={3} className="bg-sage-900 text-white">{t("rsvp_guests_3")}</option>
                          <option value={4} className="bg-sage-900 text-white">{t("rsvp_guests_4")}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-3">
                        {t("rsvp_diet_label")}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        {[
                          { key: "vegetariano", label: t("rsvp_diet_veg") },
                          { key: "vegano", label: t("rsvp_diet_vegan") },
                          { key: "celiaco", label: t("rsvp_diet_celiac") },
                          { key: "sinLactosa", label: t("rsvp_diet_lactose") },
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
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                        {t("rsvp_song_label")}
                      </label>
                      <input
                        type="text"
                        placeholder="Ed Sheeran / Bad Bunny..."
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

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gold-300 font-semibold mb-2">
                    {t("rsvp_msg_label")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-gold-500 hover:bg-gold-600 font-semibold text-sm tracking-wider uppercase transition-all shadow-lg shadow-gold-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{t("rsvp_submit_btn")}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
