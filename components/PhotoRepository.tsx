"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Camera, Upload, Heart, Download, Maximize2, X, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { subscribePhotosCloud, savePhotoCloud, PhotoItem } from "@/lib/photoService";

export default function PhotoRepository() {
  const { t } = useLanguage();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState<PhotoItem["category"]>("fiesta");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribePhotosCloud((updatedPhotos) => {
      setPhotos(updatedPhotos);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const savePhotos = (updated: PhotoItem[]) => {
    setPhotos(updated);
    localStorage.setItem("boda_lucia_photos", JSON.stringify(updated));
  };

  const handleImageUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    setIsUploading(true);

    const newPhotoPayload: Omit<PhotoItem, "id"> = {
      url: imagePreview,
      title: newTitle.trim() || "Recuerdo de la Boda",
      author: newAuthor.trim() || "Invitado",
      category: newCategory,
      likes: 1,
      commentsCount: 0,
      uploadedAt: "Hoy",
      isUserUploaded: true,
    };

    await savePhotoCloud(newPhotoPayload);

    setIsUploading(false);
    setNewTitle("");
    setNewAuthor("");
    setImagePreview(null);
    setUploadModalOpen(false);
  };

  const handleToggleLike = (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isLiked = likedPhotos[photoId];
    setLikedPhotos((prev) => ({ ...prev, [photoId]: !isLiked }));

    const updated = photos.map((p) => {
      if (p.id === photoId) {
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
        };
      }
      return p;
    });

    savePhotos(updated);
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({
        ...selectedPhoto,
        likes: isLiked ? selectedPhoto.likes - 1 : selectedPhoto.likes + 1,
      });
    }
  };

  const filteredPhotos =
    activeFilter === "todas"
      ? photos
      : photos.filter((p) => p.category === activeFilter);

  return (
    <section id="fotos" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
            {t("photos_subtitle")}
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900 mb-4">
            {t("photos_title")}
          </h2>
          <p className="text-gray-600 font-light max-w-xl text-sm sm:text-base">
            {t("photos_desc")}
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-gold-500/20 transform hover:-translate-y-0.5"
        >
          <Camera className="w-5 h-5" />
          <span>{t("photos_upload_btn")}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-gold-500/20">
        {[
          { key: "todas", label: t("photos_tab_all") },
          { key: "ceremonia", label: t("photos_tab_ceremony") },
          { key: "coctel", label: t("photos_tab_cocktail") },
          { key: "fiesta", label: t("photos_tab_party") },
          { key: "invitados", label: t("photos_tab_guests") },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`py-2 px-4 rounded-full text-xs font-semibold tracking-wider transition-all ${
              activeFilter === tab.key
                ? "bg-sage-900 text-white shadow-md"
                : "bg-white/80 text-gray-600 hover:bg-gold-100 hover:text-sage-900 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty State or Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-dashed border-gold-500/40 max-w-xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-sage-900 mb-2">
            ¡Sé el primero en compartir una foto!
          </h3>
          <p className="text-xs text-gray-500 mb-6 max-w-sm">
            Este espacio es exclusivo para que todos los invitados compartan las fotos tomadas durante la boda.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-6 py-3 rounded-full bg-sage-900 hover:bg-sage-800 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-gold-400" />
            <span>Subir Mi Primera Foto</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => {
                setSelectedPhoto(photo);
                setModalOpen(true);
              }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-gold-500/20 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
                  <span className="text-white text-xs font-medium tracking-wide">
                    {photo.title}
                  </span>
                  <Maximize2 className="w-5 h-5 text-white/80" />
                </div>
                <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border border-white/20">
                  {photo.category}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-gray-600">
                <div>
                  <p className="font-semibold text-sage-900">{photo.title}</p>
                  <p className="text-[11px] text-gray-400">por {photo.author}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleToggleLike(photo.id, e)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      likedPhotos[photo.id]
                        ? "bg-rose-100 text-rose-600"
                        : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likedPhotos[photo.id] ? "fill-rose-600 text-rose-600" : ""
                      }`}
                    />
                    <span>{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-dark text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold-500/40 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-gold-300 mb-1">
              {t("photos_upload_btn")}
            </h3>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-gold-500/40 rounded-2xl p-6 text-center bg-white/5 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageUploadChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {imagePreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <Upload className="w-10 h-10 text-gold-400 mb-2" />
                    <span className="text-sm font-medium text-white">
                      Haz clic o arrastra tu foto aquí
                    </span>
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Título o Descripción..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre..."
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                />
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as PhotoItem["category"])
                  }
                  className="w-full bg-sage-900 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="fiesta">Fiesta</option>
                  <option value="ceremonia">Ceremonia</option>
                  <option value="coctel">Cóctel</option>
                  <option value="invitados">Invitados</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!imagePreview}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-600 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-gold-500/20 disabled:opacity-40"
              >
                {t("photos_upload_btn")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {modalOpen && selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gold-400 p-2"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="w-full rounded-2xl overflow-hidden bg-black max-h-[75vh] flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-white px-2">
              <div>
                <h4 className="font-serif text-xl font-bold text-gold-300">
                  {selectedPhoto.title}
                </h4>
                <p className="text-xs text-white/70">
                  Subida por {selectedPhoto.author}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleLike(selectedPhoto.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    likedPhotos[selectedPhoto.id]
                      ? "bg-rose-600 text-white"
                      : "bg-white/10 text-white hover:bg-rose-600"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPhotos[selectedPhoto.id] ? "fill-white" : ""
                    }`}
                  />
                  <span>{selectedPhoto.likes} {t("photos_like")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
