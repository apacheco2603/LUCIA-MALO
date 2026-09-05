"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Details from "@/components/Details";
import RSVP from "@/components/RSVP";
import PhotoRepository from "@/components/PhotoRepository";
import SpotifyRepository from "@/components/SpotifyRepository";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";

export default function Home() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio((prev) => !prev);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Navbar */}
      <Navbar isPlayingAudio={isPlayingAudio} toggleAudio={toggleAudio} />

      {/* Hero Section with Countdown */}
      <Hero />

      {/* Details & Location & Itinerary */}
      <Details />

      {/* RSVP Confirmation Form */}
      <RSVP />

      {/* Guest Photo Repository & Gallery */}
      <PhotoRepository />

      {/* Spotify Playlist Song Request Hub */}
      <SpotifyRepository />

      {/* Floating Ambient Music Audio Player */}
      <AudioPlayer isPlaying={isPlayingAudio} togglePlay={toggleAudio} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
