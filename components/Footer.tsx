"use client";

import { useState } from "react";
import { Heart, Sparkles, ChevronUp, Lock } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <footer className="bg-sage-900 text-white pt-16 pb-12 px-4 border-t border-gold-500/30 relative">
      {/* Closing Couple Photo Banner Card (Photo 1 - Desert Dunes) */}
      <div className="max-w-4xl mx-auto mb-16 rounded-3xl overflow-hidden glass-panel-dark border border-gold-500/40 p-4 sm:p-6 text-center shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-black/50 border border-gold-500/40 flex-shrink-0 shadow-lg">
          <img
            src="/images/couple/photo_1.jpg"
            alt="Lucía & Malo"
            className="w-full h-full object-cover object-[center_20%]"
          />
        </div>
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider border border-gold-500/30">
            <Heart className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>¡Nos vemos en Madrid!</span>
          </div>
          <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            "¡Gracias por formar parte de nuestra historia!"
          </h4>
          <p className="text-xs text-gold-200/80 font-light">
            Lucía & Malo • 3 de Octubre de 2026
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center">
        {/* Monogram */}
        <div className="w-16 h-16 rounded-full border border-gold-500/60 flex items-center justify-center bg-white/5 mx-auto mb-6">
          <span className="font-serif text-2xl font-bold gold-text-gradient">
            L&M
          </span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-widest text-gold-200 uppercase mb-2">
          Lucía & Malo
        </h3>

        <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-6">
          3 de Octubre de 2026 • Madrid
        </p>

        {/* Wedding Hashtag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold tracking-wider text-gold-300 mb-8">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>{t("footer_hashtag")}</span>
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>

        <div className="w-full h-px bg-white/10 max-w-xl mx-auto mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-white/60">
          <p className="flex items-center justify-center gap-1">
            {t("footer_made_with")}
          </p>

          <span className="hidden sm:inline">•</span>

          <button
            onClick={() => setAdminModalOpen(true)}
            className="text-gold-400 hover:text-gold-300 flex items-center gap-1 hover:underline transition-all"
          >
            <Lock className="w-3 h-3" />
            <span>{t("footer_admin_btn")}</span>
          </button>
        </div>
      </div>

      <a
        href="#hero"
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-gold-500 text-white transition-colors border border-white/20"
        aria-label="Volver arriba"
      >
        <ChevronUp className="w-5 h-5" />
      </a>

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </footer>
  );
}
