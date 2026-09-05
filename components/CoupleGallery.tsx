"use client";

import { useState } from "react";
import { Heart, Maximize2, X, Sparkles } from "lucide-react";

interface CouplePhoto {
  id: string;
  url: string;
  title: string;
  location: string;
}

export default function CoupleGallery() {
  // Photos array containing current 5 photos, ready to easily expand to 12+
  const couplePhotos: CouplePhoto[] = [
    {
      id: "cp1",
      url: "/images/couple/photo_1.jpg",
      title: "Aventuras en el Desierto",
      location: "Dunas de Huacachina",
    },
    {
      id: "cp2",
      url: "/images/couple/photo_2.jpg",
      title: "Atardeceres Junto al Mar",
      location: "Playa & Brisa del Océano",
    },
    {
      id: "cp3",
      url: "/images/couple/photo_3.jpg",
      title: "Risas & Complicidad",
      location: "Nuestros Momentos Especiales",
    },
    {
      id: "cp4",
      url: "/images/couple/photo_4.jpg",
      title: "Descubriendo Lugares",
      location: "Plaza & Rincones Únicos",
    },
    {
      id: "cp5",
      url: "/images/couple/photo_5.jpg",
      title: "Miradores Inolvidables",
      location: "Canyon & Paisajes Infinitos",
    },
    // Ready for photo_6 through photo_12 when user uploads them
  ];

  const [selectedPhoto, setSelectedPhoto] = useState<CouplePhoto | null>(null);

  return (
    <section id="historia" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Lucía & Malo</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900 mb-4">
          Nuestra Historia en Fotos
        </h2>
        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
        <p className="text-gray-600 font-light text-sm sm:text-base">
          Algunos de los mejores momentos que hemos compartido alrededor del mundo antes de dar el "Sí, quiero".
        </p>
      </div>

      {/* Grid of Couple Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {couplePhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] border border-gold-500/20 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-100"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-sage-900/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-300 mb-1">
                {photo.location}
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-tight mb-2">
                {photo.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-white/80 border-t border-white/20 pt-2">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Lucía & Malo</span>
                </span>
                <Maximize2 className="w-4 h-4 text-gold-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full rounded-2xl overflow-hidden bg-black max-h-[75vh] flex items-center justify-center shadow-2xl border border-white/10">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="w-full mt-4 text-center text-white">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                {selectedPhoto.location}
              </span>
              <h3 className="font-serif text-2xl font-bold text-gold-200 mt-1">
                {selectedPhoto.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
