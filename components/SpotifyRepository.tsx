"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Music,
  Play,
  Pause,
  Heart,
  Plus,
  ExternalLink,
  Disc,
  Volume2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SongItem {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  genre: string;
  votes: number;
  audioPreviewUrl?: string;
  spotifyUrl: string;
  coverUrl: string;
}

export default function SpotifyRepository() {
  const { t } = useLanguage();

  const initialSongs: SongItem[] = [
    {
      id: "s1",
      title: "Vivienne",
      artist: "Sundara Karma",
      addedBy: "Lucía",
      genre: "Indie Pop",
      votes: 35,
      spotifyUrl: "https://open.spotify.com/track/1y2312",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "s2",
      title: "Danza Kuduro",
      artist: "Don Omar, Lucenzo",
      addedBy: "Malo",
      genre: "Fiesta / Reggaeton",
      votes: 48,
      spotifyUrl: "https://open.spotify.com/track/2x123",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "s3",
      title: "Love On Top",
      artist: "Beyoncé",
      addedBy: "Laura",
      genre: "Pop / Disco",
      votes: 29,
      spotifyUrl: "https://open.spotify.com/track/3y456",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const [songs, setSongs] = useState<SongItem[]>([]);
  const [votedSongs, setVotedSongs] = useState<Record<string, boolean>>({});
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [genreTag, setGenreTag] = useState("Pop / Fiesta");

  useEffect(() => {
    const saved = localStorage.getItem("boda_lucia_spotify_songs");
    if (saved) {
      try {
        setSongs(JSON.parse(saved));
      } catch (e) {
        setSongs(initialSongs);
      }
    } else {
      setSongs(initialSongs);
    }
  }, []);

  const saveSongs = (updated: SongItem[]) => {
    setSongs(updated);
    localStorage.setItem("boda_lucia_spotify_songs", JSON.stringify(updated));
  };

  const handleAddSong = (e: FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim() || !artistName.trim()) return;

    const newSong: SongItem = {
      id: "song_" + Date.now(),
      title: songTitle.trim(),
      artist: artistName.trim(),
      addedBy: guestName.trim() || "Invitado",
      genre: genreTag,
      votes: 1,
      spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(
        songTitle + " " + artistName
      )}`,
      coverUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
    };

    const updated = [newSong, ...songs];
    saveSongs(updated);

    setSongTitle("");
    setArtistName("");
    setGuestName("");
  };

  const handleVoteSong = (songId: string) => {
    const hasVoted = votedSongs[songId];
    setVotedSongs((prev) => ({ ...prev, [songId]: !hasVoted }));

    const updated = songs
      .map((s) => {
        if (s.id === songId) {
          return {
            ...s,
            votes: hasVoted ? s.votes - 1 : s.votes + 1,
          };
        }
        return s;
      })
      .sort((a, b) => b.votes - a.votes);

    saveSongs(updated);
  };

  const toggleSongPlayback = (id: string) => {
    if (playingSongId === id) {
      setPlayingSongId(null);
    } else {
      setPlayingSongId(id);
    }
  };

  return (
    <section id="spotify" className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Disc className="w-4 h-4 animate-spin text-emerald-600" />
          <span>{t("spotify_badge")}</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900 mb-4">
          {t("spotify_title")}
        </h2>
        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mb-6" />
        <p className="text-gray-600 font-light text-sm sm:text-base">
          {t("spotify_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          {/* Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/30">
            <h3 className="font-serif text-2xl font-bold text-sage-900 mb-2 flex items-center gap-2">
              <Plus className="w-6 h-6 text-gold-500" />
              <span>{t("spotify_form_title")}</span>
            </h3>

            <form onSubmit={handleAddSong} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-sage-900 uppercase tracking-wider mb-1">
                  {t("spotify_song_title_label")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Título..."
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-sage-900 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage-900 uppercase tracking-wider mb-1">
                  {t("spotify_artist_label")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Artista..."
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-sage-900 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sage-900 uppercase tracking-wider mb-1">
                    {t("spotify_your_name")}
                  </label>
                  <input
                    type="text"
                    placeholder="Tu Nombre..."
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-sage-900 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sage-900 uppercase tracking-wider mb-1">
                    {t("spotify_genre_label")}
                  </label>
                  <select
                    value={genreTag}
                    onChange={(e) => setGenreTag(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-sage-900 focus:outline-none focus:border-gold-500"
                  >
                    <option value="Pop / Fiesta">Pop / Fiesta</option>
                    <option value="Reggaeton / Latino">Reggaeton / Latino</option>
                    <option value="Rock / Indie">Rock / Indie</option>
                    <option value="Electrónica / Dance">Electrónica</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4" />
                <span>{t("spotify_add_btn")}</span>
              </button>
            </form>
          </div>

          {/* Spotify Direct Playlist Widget with Official Spotify Embed */}
          <div className="glass-panel-dark text-white rounded-3xl p-6 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
                  <Music className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t("spotify_playlist_title")}</h4>
                  <p className="text-[11px] text-emerald-300">{t("spotify_playlist_subtitle")}</p>
                </div>
              </div>

              <a
                href="https://open.spotify.com/playlist/7pAXtZlSeZzXsVP2OB0BVL?si=3d81956100d44109&pt=2477f1b862cd9b595ef38e6860eae772"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>{t("spotify_open_app")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Spotify Player Iframe */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <iframe
                style={{ borderRadius: "16px" }}
                src="https://open.spotify.com/embed/playlist/7pAXtZlSeZzXsVP2OB0BVL?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gold-500/30">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="font-serif text-2xl font-bold text-sage-900">
                {t("spotify_suggested_title")} ({songs.length})
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {t("spotify_voted_by")}
              </span>
            </div>

            <div className="space-y-4">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="bg-white/80 rounded-2xl p-4 border border-gray-100 hover:border-gold-500/40 transition-all flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-serif text-lg font-bold text-gray-400 w-6 text-center">
                      #{index + 1}
                    </span>

                    <button
                      onClick={() => toggleSongPlayback(song.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                        playingSongId === song.id
                          ? "bg-emerald-600 text-white animate-spin"
                          : "bg-gold-100 text-gold-700 hover:bg-gold-500 hover:text-white"
                      }`}
                    >
                      {playingSongId === song.id ? (
                        <Volume2 className="w-5 h-5" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </button>

                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-sm text-sage-900 truncate">
                        {song.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVoteSong(song.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        votedSongs[song.id]
                          ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                          : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          votedSongs[song.id] ? "fill-white" : ""
                        }`}
                      />
                      <span>{song.votes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
