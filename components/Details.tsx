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
  CalendarPlus,
  Heart,
  Train,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Details() {
  const { t } = useLanguage();
  const [copiedIBAN, setCopiedIBAN] = useState(false);
  const ibanNumber = "FR6220041010131282698J03457";

  const handleCopyIBAN = () => {
    navigator.clipboard.writeText(ibanNumber);
    setCopiedIBAN(true);
    setTimeout(() => setCopiedIBAN(false), 3000);
  };

  const ceremonyMapsUrl = "https://maps.app.goo.gl/j6LS7xTYFLrmKx3h9";
  const receptionMapsUrl = "https://www.google.com/maps/search/?api=1&query=17+Bd+du+Ch%C3%A2teau";

  const googleCalendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent("Boda Lucía & Malo 💍") +
    "&dates=20261003T143000Z/20261004T040000Z" +
    "&details=" +
    encodeURIComponent("¡Acompáñanos a celebrar nuestra boda! Municipalidad de Alfortville & Recepción.") +
    "&location=" +
    encodeURIComponent("Municipalidad de Alfortville, Francia");

  const downloadICS = () => {
    const icsData =
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "PRODID:-//Boda Lucia y Malo//ES\n" +
      "BEGIN:VEVENT\n" +
      "SUMMARY:Boda Lucía & Malo 💍\n" +
      "DESCRIPTION:¡Acompáñanos a celebrar nuestra boda! Municipalidad de Alfortville & Recepción.\n" +
      "LOCATION:Municipalidad de Alfortville, Francia\n" +
      "DTSTART:20261003T143000Z\n" +
      "DTEND:20261004T040000Z\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR";

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "boda_lucia_y_malo.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const itinerary = [
    {
      time: "14:30",
      title: t("itinerary_1_title"),
      description: t("itinerary_1_desc"),
      icon: Clock,
    },
    {
      time: "15:30",
      title: t("itinerary_2_title"),
      description: t("itinerary_2_desc"),
      icon: Wine,
    },
    {
      time: "18:00",
      title: t("itinerary_3_title"),
      description: t("itinerary_3_desc"),
      icon: Sparkles,
    },
    {
      time: "19:30",
      title: t("itinerary_4_title"),
      description: t("itinerary_4_desc"),
      icon: Utensils,
    },
    {
      time: "21:00",
      title: t("itinerary_5_title"),
      description: t("itinerary_5_desc"),
      icon: Music,
    },
  ];

  return (
    <section id="detalles" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
          {t("details_subtitle")}
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900 mb-4">
          {t("details_title")}
        </h2>
        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
        <p className="text-gray-600 font-light">
          {t("details_desc")}
        </p>
      </div>

      {/* Featured Photo Card 2 of Lucía & Malo - Paseos Junto al Mar */}
      <div className="mb-20 max-w-5xl mx-auto rounded-3xl overflow-hidden glass-card border border-gold-500/30 p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-7/12 h-[380px] sm:h-[480px] md:h-[520px] rounded-2xl overflow-hidden bg-gray-100 shadow-lg relative group">
          <img
            src="/images/couple/photo_2.jpg"
            alt="Lucía & Malo - Paseos Junto al Mar"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="w-full md:w-5/12 text-center md:text-left space-y-5 p-2 sm:p-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider border border-gold-400/30 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-gold-600 text-gold-600" />
            <span>Lucía & Malo</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-sage-900 leading-tight">
            "Paseos Junto al Mar"
          </h3>
          <div className="w-16 h-0.5 bg-gold-500 rounded-full mx-auto md:mx-0" />
          <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">
            Cada viaje y cada paso que hemos dado juntos nos ha conducido a este momento inolvidable. ¡Estamos impacientes por celebrar con todos vosotros!
          </p>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="mb-24">
        <h3 className="font-serif text-2xl sm:text-3xl text-center text-sage-900 mb-12">
          {t("details_itinerary_title")}
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

      {/* Calendar Buttons Bar */}
      <div className="glass-card rounded-3xl p-6 mb-16 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
            <CalendarPlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-sage-900">
              {t("cal_title")}
            </h4>
            <p className="text-xs text-gray-500">
              {t("hero_date")} • 14:30 H
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-sage-900 hover:bg-sage-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{t("cal_btn_google")}</span>
            <ExternalLink className="w-4 h-4 text-gold-400" />
          </a>

          <button
            onClick={downloadICS}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{t("cal_btn_ical")}</span>
          </button>
        </div>
      </div>

      {/* Location & Dress Code & Gifts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map & Venue Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/30 flex flex-col justify-between space-y-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-4">
              {t("venue_title")}
            </h3>

            {/* Location 1: Ceremonia */}
            <div className="bg-white/80 rounded-2xl p-4 border border-gold-500/20 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-gold-700">
                  {t("venue_ceremony_title")}
                </span>
                <span className="text-[10px] bg-gold-100 text-gold-800 font-semibold px-2 py-0.5 rounded-full">
                  14:30 H
                </span>
              </div>
              <p className="text-sm font-semibold text-sage-900 mb-1">
                {t("venue_ceremony_name")}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                <Train className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                <span>{t("venue_ceremony_access")}</span>
              </div>
              <a
                href={ceremonyMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sage-900 text-white font-medium text-[11px] tracking-wider uppercase hover:bg-sage-800 transition-colors shadow-sm"
              >
                <span>{t("venue_ceremony_maps_btn")}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              </a>
            </div>

            {/* Location 2: Recepción */}
            <div className="bg-white/80 rounded-2xl p-4 border border-gold-500/20 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-gold-700">
                  {t("venue_reception_title")}
                </span>
                <span className="text-[10px] bg-gold-100 text-gold-800 font-semibold px-2 py-0.5 rounded-full">
                  18:00 H
                </span>
              </div>
              <p className="text-sm font-semibold text-sage-900 mb-1">
                {t("venue_reception_address")}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                <Train className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                <span>{t("venue_reception_access")}</span>
              </div>
              <a
                href={receptionMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gold-500 text-white font-medium text-[11px] tracking-wider uppercase hover:bg-gold-600 transition-colors shadow-sm"
              >
                <span>{t("venue_reception_maps_btn")}</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Dress Code Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-6">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              {t("dress_title")}
            </h3>
            <p className="text-lg font-serif font-bold text-gold-600 mb-4">
              {t("dress_subtitle")}
            </p>

            <p className="text-xs text-gray-600 font-light leading-relaxed">
              Un estilo elegante pero cómodo para disfrutar durante toda la celebración.
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-gold-700 font-medium italic">
            {t("dress_quote")}
          </div>
        </div>

        {/* Gifts / Honeymoon Bank Account Card */}
        <div className="glass-card rounded-3xl p-8 border border-gold-500/30 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-3">
              {t("gift_title")}
            </h3>
            
            <p className="text-xs text-gray-600 leading-relaxed mb-6 font-light whitespace-pre-line italic bg-white/70 p-4 rounded-2xl border border-gray-100">
              {t("gift_desc")}
            </p>

            <div className="bg-sage-900 text-white rounded-2xl p-4 mb-4 text-center relative overflow-hidden">
              <span className="text-[10px] uppercase text-gold-300 tracking-wider block mb-1 font-semibold">
                {t("gift_iban_label")}
              </span>
              <p className="font-mono text-xs sm:text-sm tracking-wider font-semibold text-white break-all">
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
                <span>{t("gift_copied_btn")}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t("gift_copy_btn")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
