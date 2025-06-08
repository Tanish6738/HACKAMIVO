import React, { useState, useRef, useEffect } from 'react';
import '../pages/page_css/INNER_Music.css'; // Import the CSS file
import music1 from "../music/music1.mp3";
import music2 from "../music/music2.mp3";
import music3 from "../music/music3.mp3";
import Music4 from '../music/music4.mp3';
import { IoPlay } from "react-icons/io5";
import { FaPause } from "react-icons/fa";
import { BiSkipPreviousCircle } from "react-icons/bi";
import { BiSkipNextCircle } from "react-icons/bi";
import image1 from "../images/player_pic.jpeg";
import image2 from "../images/player_pic2.jpeg";
import image3 from "../images/player_pic3.jpeg";
import image4 from "../images/player_pic4.jpeg";

const tracks = [
  { title: 'Deep Relaxation Music 1', src: music1, image: image1 },
  { title: 'Tranquil Mind Meditation', src: music2, image: image2 },
  { title: 'Healing Soundscapes', src: music3, image: image3 },
  { title: 'Shri Hanumanji bhajan ', src: Music4, image: image4 },
];

const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Play audio when track changes if already playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    // eslint-disable-next-line
  }, [currentTrack]);

  // Pause/play audio when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Auto play next track when current ends
  const handleEnded = () => {
    handleNextTrack(true);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = (auto = false) => {
    setCurrentTrack((prevTrack) => {
      const nextTrack = (prevTrack + 1) % tracks.length;
      if (isPlaying || auto) setTimeout(() => setIsPlaying(true), 0);
      return nextTrack;
    });
  };

  const handlePrevTrack = () => {
    setCurrentTrack((prevTrack) => {
      const prev = (prevTrack - 1 + tracks.length) % tracks.length;
      if (isPlaying) setTimeout(() => setIsPlaying(true), 0);
      return prev;
    });
  };

  return (
    <div className="music-player w-full bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Playlist Section */}
      <div className="playlist-section w-full md:w-1/3 flex flex-col gap-2 border-b md:border-b-0 md:border-r md:pr-4 mb-4 md:mb-0 max-h-[350px] md:max-h-none overflow-y-auto">
        <h3 className="text-lg font-bold text-green-700 mb-2 text-center md:text-left">Playlist</h3>
        <div className="flex flex-col gap-2">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`track flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all duration-200 ${
                index === currentTrack
                  ? 'bg-green-100 font-semibold ring-2 ring-green-400'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setCurrentTrack(index);
                setIsPlaying(true);
              }}
            >
              <img src={track.image} alt="Track" className="w-10 h-10 rounded object-cover shadow" />
              <span className="text-sm truncate">{track.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Player Section */}
      <div className="player-section w-full md:w-2/3 flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 w-full">
          <img
            src={tracks[currentTrack].image}
            alt="Now Playing"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover shadow-lg border-4 border-green-200"
          />
          <span className="text-lg sm:text-xl font-semibold text-gray-800 text-center mt-2 break-words max-w-full">
            {tracks[currentTrack].title}
          </span>
        </div>
        {/* Playback controls */}
        <div className="playback-controls flex items-center gap-6 mt-2">
          <button
            onClick={handlePrevTrack}
            aria-label="Previous"
            className="focus:outline-none hover:scale-110 transition"
          >
            <BiSkipPreviousCircle size={44} className="text-green-500" />
          </button>
          <button
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="focus:outline-none bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition"
          >
            {isPlaying ? (
              <FaPause size={28} />
            ) : (
              <IoPlay size={28} />
            )}
          </button>
          <button
            onClick={handleNextTrack}
            aria-label="Next"
            className="focus:outline-none hover:scale-110 transition"
          >
            <BiSkipNextCircle size={44} className="text-green-500" />
          </button>
        </div>
        {/* Audio Player */}
        <audio
          ref={audioRef}
          src={tracks[currentTrack].src}
          onEnded={handleEnded}
          id="audio-player"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;