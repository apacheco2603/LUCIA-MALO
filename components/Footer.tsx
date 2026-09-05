import { useState } from "react";
import { Heart, Sparkles, ChevronUp, Lock } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function Footer() {
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <footer className="bg-sage-900 text-white pt-16 pb-12 px-4 border-t border-gold-500/30 relative">
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
          24 de Octubre de 2026 • Madrid
        </p>

        {/* Wedding Hashtag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold tracking-wider text-gold-300 mb-8">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>#BodaLuciaYMalo2026</span>
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>

        <div className="w-full h-px bg-white/10 max-w-xl mx-auto mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-white/60">
          <p className="flex items-center justify-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para celebrar el amor eterno.
          </p>

          <span className="hidden sm:inline">•</span>

          {/* Admin Novios Access button */}
          <button
            onClick={() => setAdminModalOpen(true)}
            className="text-gold-400 hover:text-gold-300 flex items-center gap-1 hover:underline transition-all"
          >
            <Lock className="w-3 h-3" />
            <span>Panel Novios (RSVP Export)</span>
          </button>
        </div>
      </div>

      {/* Back to Top Floating Arrow */}
      <a
        href="#hero"
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-gold-500 text-white transition-colors border border-white/20"
        aria-label="Volver arriba"
      >
        <ChevronUp className="w-5 h-5" />
      </a>

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </footer>
  );
}
