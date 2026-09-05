"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "es" | "fr";

export const translations = {
  es: {
    // Navbar
    nav_home: "Inicio",
    nav_details: "Detalles & Mapa",
    nav_rsvp: "Confirmar RSVP",
    nav_photos: "Fotos Invitados",
    nav_spotify: "Playlist Spotify",
    nav_share: "Compartir",
    nav_music_active: "Música Activa",
    nav_music_bg: "Música Boda",

    // Hero
    hero_we_are_getting_married: "¡Nos Casamos!",
    hero_quote: `"Hay momentos en la vida que son inolvidables, pero compartirlos con quienes más queremos los hace eternos."`,
    hero_date: "Sábado, 3 de Octubre de 2026",
    hero_location: "Alfortville, Francia",
    hero_countdown_title: "Cuenta Regresiva para Nuestro Gran Día",
    hero_days: "Días",
    hero_hours: "Horas",
    hero_minutes: "Minutos",
    hero_seconds: "Segundos",
    hero_btn_rsvp: "Confirmar Asistencia (RSVP)",
    hero_btn_spotify: "Sugerir Canción Spotify",

    // Details & Itinerary
    details_subtitle: "Programa & Ubicación",
    details_title: "Detalles de Nuestra Boda",
    details_desc: "Queremos que disfrutes cada segundo. Aquí tienes toda la información para planificar tu asistencia.",
    details_itinerary_title: "Itinerario del Evento",
    itinerary_1_title: "Ceremonia",
    itinerary_1_desc: "Ceremonia en la Municipalidad de Alfortville.",
    itinerary_2_title: "Aperitivo",
    itinerary_2_desc: "Brindis y aperitivos para compartir.",
    itinerary_3_title: "Recepción",
    itinerary_3_desc: "Llegada y bienvenida de invitados.",
    itinerary_4_title: "Banquete",
    itinerary_4_desc: "Cena especial de celebración.",
    itinerary_5_title: "Fiesta",
    itinerary_5_desc: "¡Música, baile y mucha diversión!",

    // Calendar
    cal_title: "Guarda el Evento en tu Calendario",
    cal_btn_google: "Google Calendar",
    cal_btn_ical: "Apple / iCal",

    // Venue & Access
    venue_title: "¿Dónde se celebra?",
    venue_name: "Municipalidad de Alfortville & Recepción",
    venue_address: "Alfortville, Francia",
    venue_access_muni: "Municipalidad de Alfortville: Metro 8 y RER D",
    venue_access_recep: "Para la recepción: RER A y RER E",
    venue_maps_btn: "Abrir Ubicación en Google Maps",

    // Dress code
    dress_title: "Código de Vestimenta",
    dress_subtitle: "Sport Elegante",
    dress_quote: `"¡Lo más importante es tu presencia, tu sonrisa y tus ganas de compartir!"`,

    // Gifts & IBAN
    gift_title: "Muestra de Cariño",
    gift_desc: `"¡Nuestro viaje de luna de miel finalmente será… en casa!\nDespués de encontrar nuestro hogar, hemos decidido invertir en otro gran viaje: el que consiste en transformar cuatro paredes en un lugar lleno de recuerdos, amor y momentos compartidos.\nSi desean ser parte de esta aventura, su aporte nos ayudará a darle vida a nuestra casa y a construir el escenario de todos los momentos felices que nos esperan.\nGracias por formar parte de esta hermosa historia ❤️"`,
    gift_iban_label: "Número de Cuenta (IBAN)",
    gift_copy_btn: "Copiar IBAN",
    gift_copied_btn: "¡IBAN Copiado al Portapapeles!",

    // RSVP
    rsvp_subtitle: "Confirmación de Asistencia",
    rsvp_title: "¿Nos Acompañas? (RSVP)",
    rsvp_desc: "Por favor, confirma tu asistencia antes del 25 de Septiembre de 2026 para poder organizar los lugares y la recepción.",
    rsvp_yes: "¡Sí, asistiré a la boda!",
    rsvp_no: "Lamentablemente no podré",
    rsvp_name_label: "Nombre Completo *",
    rsvp_email_label: "Correo Electrónico",
    rsvp_guests_label: "Número de Asistentes Confirmados",
    rsvp_guests_1: "1 Persona (Solo yo)",
    rsvp_guests_2: "2 Personas (Yo + 1 Acompañante)",
    rsvp_guests_3: "3 Personas",
    rsvp_guests_4: "Familia (4 Personas)",
    rsvp_diet_label: "Restricciones Alimentarias / Alergias",
    rsvp_diet_veg: "Vegetariano",
    rsvp_diet_vegan: "Vegano",
    rsvp_diet_celiac: "Celiaco / Sin Gluten",
    rsvp_diet_lactose: "Sin Lactosa",
    rsvp_song_label: "Canción indispensable para ti en la fiesta 🎵",
    rsvp_msg_label: "Unas Palabras o Mensaje para los Novios ❤️",
    rsvp_submit_btn: "Enviar Confirmación",
    rsvp_confirmed_title: "¡Asistencia Confirmada!",
    rsvp_confirmed_thanks: "Gracias. Hemos guardado tu confirmación con éxito.",
    rsvp_modify_btn: "Modificar mi respuesta",

    // Photos
    photos_subtitle: "Galería Compartida de los Invitados",
    photos_title: "Repositorio de Fotos de la Boda",
    photos_desc: "¡Queremos ver la boda desde tus ojos! Sube tus mejores fotos tomadas durante la fiesta y descarga los recuerdos del evento.",
    photos_upload_btn: "Subir Mis Fotos",
    photos_tab_all: "Todas las Fotos",
    photos_tab_ceremony: "Ceremonia",
    photos_tab_cocktail: "Aperitivo / Cóctel",
    photos_tab_party: "Fiesta",
    photos_tab_guests: "Invitados",
    photos_like: "Me gusta",
    photos_download: "Descargar Foto",

    // Spotify
    spotify_badge: "Spotify Playlist Oficial",
    spotify_title: "Añade tus Canciones para la Fiesta",
    spotify_desc: "¡Queremos que nadie se quede sin bailar! Propón los temas que quieres escuchar durante la fiesta y vota por tus favoritos.",
    spotify_form_title: "Pedir una Canción",
    spotify_song_title_label: "Nombre de la Canción *",
    spotify_artist_label: "Artista / Grupo *",
    spotify_your_name: "Tu Nombre",
    spotify_genre_label: "Género / Estilo",
    spotify_add_btn: "Enviar Canción a la Playlist",
    spotify_suggested_title: "Canciones Sugeridas por los Invitados",
    spotify_voted_by: "Ordenadas por Votos",
    spotify_open_app: "Abrir App",

    // Footer & Admin
    footer_hashtag: "#BodaLuciaYMalo2026",
    footer_made_with: "Hecho con amor para celebrar el amor eterno.",
    footer_admin_btn: "Panel Novios (RSVP Export)",
  },

  fr: {
    // Navbar
    nav_home: "Accueil",
    nav_details: "Détails & Carte",
    nav_rsvp: "Confirmer RSVP",
    nav_photos: "Photos Invités",
    nav_spotify: "Playlist Spotify",
    nav_share: "Partager",
    nav_music_active: "Musique Active",
    nav_music_bg: "Musique Mariage",

    // Hero
    hero_we_are_getting_married: "Nous nous marions !",
    hero_quote: `"Il y a des moments dans la vie qui sont inoubliables, mais les partager avec ceux que nous aimons les rend éternels."`,
    hero_date: "Samedi 3 Octobre 2026",
    hero_location: "Alfortville, France",
    hero_countdown_title: "Compte à rebours pour notre grand jour",
    hero_days: "Jours",
    hero_hours: "Heures",
    hero_minutes: "Minutes",
    hero_seconds: "Secondes",
    hero_btn_rsvp: "Confirmer Présence (RSVP)",
    hero_btn_spotify: "Suggérer une Chanson",

    // Details & Itinerary
    details_subtitle: "Programme & Lieu",
    details_title: "Détails de notre Mariage",
    details_desc: "Nous voulons que vous profitiez de chaque instant. Voici toutes les informations pour planifier votre venue.",
    details_itinerary_title: "Programme de la Journée",
    itinerary_1_title: "Cérémonie",
    itinerary_1_desc: "Cérémonie à la Mairie d'Alfortville.",
    itinerary_2_title: "Apéritif",
    itinerary_2_desc: "Toast et rafraîchissements.",
    itinerary_3_title: "Réception",
    itinerary_3_desc: "Arrivée et accueil des invités.",
    itinerary_4_title: "Banquet",
    itinerary_4_desc: "Dîner spécial de célébration.",
    itinerary_5_title: "Fête",
    itinerary_5_desc: "Musique, danse et grande fête !",

    // Calendar
    cal_title: "Enregistrer l'Événement dans votre Calendrier",
    cal_btn_google: "Google Calendar",
    cal_btn_ical: "Apple / iCal",

    // Venue & Access
    venue_title: "Où se déroule la fête ?",
    venue_name: "Mairie d'Alfortville & Réception",
    venue_address: "Alfortville, France",
    venue_access_muni: "Mairie d'Alfortville : Métro 8 et RER D",
    venue_access_recep: "Pour la réception : RER A et RER E",
    venue_maps_btn: "Ouvrir la Localisation sur Google Maps",

    // Dress code
    dress_title: "Code Vestimentaire",
    dress_subtitle: "Sport Élégant",
    dress_quote: `"Le plus important est votre présence, votre sourire et votre envie de partager !"`,

    // Gifts & IBAN
    gift_title: "Geste d'Affection",
    gift_desc: `"Notre voyage de noces se fera enfin… à la maison !\nAprès avoir trouvé notre chez-nous, nous avons décidé d'investir dans un autre grand voyage : celui qui consiste à transformer quatre murs en un lieu rempli de souvenirs, d'amour et de moments partagés.\nSi vous souhaitez faire partie de cette aventure, votre contribution nous aidera à donner vie à notre maison et à construire le décor de tous les moments heureux qui nous attendent.\nMerci de faire partie de cette belle histoire ❤️"`,
    gift_iban_label: "Numéro de Compte (IBAN)",
    gift_copy_btn: "Copier l'IBAN",
    gift_copied_btn: "IBAN Copié dans le Presse-papier !",

    // RSVP
    rsvp_subtitle: "Confirmation de Présence",
    rsvp_title: "Serez-vous des nôtres ? (RSVP)",
    rsvp_desc: "Merci de confirmer votre présence avant le 25 Septembre 2026 afin d'organiser les places et la réception.",
    rsvp_yes: "Oui, je serai présent !",
    rsvp_no: "Malheureusement je ne pourrai pas",
    rsvp_name_label: "Nom Complet *",
    rsvp_email_label: "Adresse E-mail",
    rsvp_guests_label: "Nombre de Personnes Confirmées",
    rsvp_guests_1: "1 Personne (Moi uniquement)",
    rsvp_guests_2: "2 Personnes (Moi + 1 Accompagnateur)",
    rsvp_guests_3: "3 Personnes",
    rsvp_guests_4: "Famille (4 Personnes)",
    rsvp_diet_label: "Restrictions Alimentaires / Allergies",
    rsvp_diet_veg: "Végétarien",
    rsvp_diet_vegan: "Végétalien",
    rsvp_diet_celiac: "Sans Gluten",
    rsvp_diet_lactose: "Sans Lactose",
    rsvp_song_label: "Chanson indispensable sur la piste de danse 🎵",
    rsvp_msg_label: "Quelques mots ou un message pour les mariés ❤️",
    rsvp_submit_btn: "Envoyer la Confirmation",
    rsvp_confirmed_title: "Présence Confirmée !",
    rsvp_confirmed_thanks: "Merci. Votre confirmation a bien été enregistrée.",
    rsvp_modify_btn: "Modifier ma réponse",

    // Photos
    photos_subtitle: "Galerie Partagée des Invités",
    photos_title: "Galerie de Photos du Mariage",
    photos_desc: "Nous voulons voir le mariage à travers vos yeux ! Partagez vos plus belles photos et téléchargez les souvenirs de la fête.",
    photos_upload_btn: "Télécharger Mes Photos",
    photos_tab_all: "Toutes les Photos",
    photos_tab_ceremony: "Cérémonie",
    photos_tab_cocktail: "Apéritif / Cocktail",
    photos_tab_party: "Fête",
    photos_tab_guests: "Invités",
    photos_like: "J'aime",
    photos_download: "Télécharger",

    // Spotify
    spotify_badge: "Playlist Officielle Spotify",
    spotify_title: "Ajoutez vos Chansons pour la Fête",
    spotify_desc: "Personne ne doit s'arrêter de danser ! Proposez les morceaux que vous souhaitez entendre et votez pour vos favoris.",
    spotify_form_title: "Demander une Chanson",
    spotify_song_title_label: "Titre de la Chanson *",
    spotify_artist_label: "Artiste / Groupe *",
    spotify_your_name: "Votre Nom",
    spotify_genre_label: "Genre / Style",
    spotify_add_btn: "Ajouter à la Playlist",
    spotify_suggested_title: "Chansons Proposées par les Invités",
    spotify_voted_by: "Triées par Votes",
    spotify_open_app: "Ouvrir l'App",

    // Footer & Admin
    footer_hashtag: "#MariageLuciaEtMalo2026",
    footer_made_with: "Fait avec amour pour célébrer l'amour éternel.",
    footer_admin_btn: "Espace Mariés (Export RSVP)",
  },
};

type TranslationKeys = keyof typeof translations.es;

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("es");

  useEffect(() => {
    const saved = localStorage.getItem("boda_lucia_lang") as Language;
    if (saved === "es" || saved === "fr") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("boda_lucia_lang", newLang);
  };

  const t = (key: TranslationKeys): string => {
    return translations[lang]?.[key] || translations["es"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
