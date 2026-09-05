"use client";

import { useState } from "react";
import {
  Clock,
  MapPin,
  Sparkles,
  Shirt,
  Gift,
  Check,
  Copy,
  ExternalLink,
  Utensils,
  Wine,
  Music,
} from "lucide-react";

export default function Details() {
  const [copiedIBAN, setCopiedIBAN] = useState(false);
  const ibanNumber = "ES91 2100 0418 4502 0005 1234";

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(ibanNumber);
    setCopiedIBAN(true);
    setTimeout(() => setCopiedIBAN(false), 3000);
  };

  const itinerary = [
    {
      time: "17:30",
      title: "Recepción de Invitados",
      description: "Bienvenida a los asistentes en los jardines principales.",
      icon: Sparkles,
    },
    {
      time: "18:00",
      title: "Ceremonia de Enlace",
      description: "Nuestra ceremonia donde nos diremos el 'Sí, quiero'.",
      icon: Clock,
    },
    {
      time: "19:30",
      title: "Cóctel de Bienvenida",
      description: "Aperitivos, música en directo y brindis al atardecer.",
      icon: Wine,
    },
    {
      time: "21:00",
      title: "Banquete de Gala",
      description: "Cena especial y sorpresas preparadas con cariño.",
      icon: Utensils,
    },
    {
      time: "23:30",
      title: "Gran Fiesta & Barra Libre",
      description: "¡Música, baile y diversión hasta que salga el sol!",
      icon: Music,
    },
  ];

  return (
    <section id="detalles" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
          Programa & Ubicación
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900 mb-4">
          Detalles de Nuestra Boda
        </h2>
        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
        <p className="text-gray-600 font-light">
          Queremos que disfrutes cada segundo. Aquí tienes toda la información para planificar tu asistencia.
        </p>
      </div>

      {/* Itinerary Timeline */}
      <div className="mb-24">
        <h3 className="font-serif text-2xl sm:text-3xl text-center text-sage-900 mb-12">
          Itinerario del Evento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {itinerary.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center flex flex-col items-center justify-between border border-gold-500/20 relative group hover:border-gold-500 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-serif text-2xl font-bold text-gold-600 mb-1">
                  {item.time}
                </span>
                <h4 className="font-serif text-lg font-semibold text-sage-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location & Dress Code & Gifts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map & Venue Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              ¿Dónde se celebra?
            </h3>
            <p className="text-sm font-semibold text-gold-600 mb-1">
              Finca La Gaivota
            </p>
            <p className="text-xs text-gray-600 mb-6">
              Carretera de La Coruña Km 22, 28224 Madrid, España
            </p>

            <div className="bg-sage-100/60 rounded-2xl p-4 text-xs text-gray-700 mb-6 space-y-2">
              <p>🚗 <strong>Parking amplio</strong> disponible en el recinto.</p>
              <p>🚌 <strong>Autobuses de regreso</strong> a Madrid a las 02:30 y 05:00.</p>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Finca+La+Gaivota+Madrid"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sage-900 text-white font-medium text-xs tracking-wider uppercase hover:bg-sage-700 transition-colors shadow-md"
          >
            <span>Ver en Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Dress Code Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-6">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              Código de Vestimenta
            </h3>
            <p className="text-sm font-semibold text-gold-600 mb-4">
              Formal / Elegante (Wedding Chic)
            </p>

            <div className="space-y-4 text-xs text-gray-600 font-light">
              <div className="p-3 bg-white/70 rounded-xl border border-gray-100">
                <strong className="block text-sage-900 font-semibold mb-1">
                  Ellas 👗:
                </strong>
                Vestido largo o de cóctel elegante. Sugerimos colores vivos o tonos pastel (el color blanco y marfil están reservados para la novia).
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-gray-100">
                <strong className="block text-sage-900 font-semibold mb-1">
                  Ellos 👔:
                </strong>
                Traje oscuro clásico, esmoquin o chaqueta formal con corbata o pajarita.
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gold-700 font-medium italic">
            "¡Lo más importante es tu sonrisa y tus ganas de bailar!"
          </div>
        </div>

        {/* Gifts / Bank Account Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              Muestra de Cariño
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light">
              El mejor regalo que nos puedes hacer es compartir nuestro gran día. Sin embargo, si deseas contribuir a nuestra luna de miel, ponemos a tu disposición nuestro número de cuenta:
            </p>

            {/* IBAN Box */}
            <div className="bg-sage-900 text-white rounded-2xl p-4 mb-4 text-center relative overflow-hidden">
              <span className="text-[10px] uppercase text-gold-300 tracking-wider block mb-1">
                Número de Cuenta (IBAN)
              </span>
              <p className="font-mono text-sm tracking-wider font-semibold text-white">
                {ibanNumber}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyIBAN}
            className={`w-full py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
              copiedIBAN
                ? "bg-green-600 text-white"
                : "bg-gold-500 hover:bg-gold-600 text-white shadow-md shadow-gold-500/20"
            }`}
          >
            {copiedIBAN ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡IBAN Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Número de Cuenta</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
