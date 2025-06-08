"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { Sparkles, Clock, ArrowLeft, Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function BreathingZen() {
  const [gameStarted, setGameStarted] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);

  const circleRef = useRef(null);
  const audioRef = useRef(null);

  const breathingPatterns = {
    easy: { inhale: 4, hold: 2, exhale: 4, rest: 2, cycles: 7 },
    medium: { inhale: 4, hold: 4, exhale: 6, rest: 2, cycles: 10 },
    hard: { inhale: 6, hold: 6, exhale: 8, rest: 2, cycles: 12 },
  };

  const initializeExercise = (diff) => {
    setDifficulty(diff);
    const pattern = breathingPatterns[diff];
    const totalSeconds = (pattern.inhale + pattern.hold + pattern.exhale + pattern.rest) * pattern.cycles;

    setTotalTime(totalSeconds);
    setTimer(0);
    setBreathPhase("inhale");
    setPhaseTime(0);
    setBreathCount(0);
    setExerciseStarted(false);
    setGameStarted(true);
  };

  const toggleExercise = () => {
    setExerciseStarted((prev) => !prev);

    if (audioRef.current && !isMuted) {
      if (!exerciseStarted) {
        audioRef.current.play().catch(() => setIsMuted(true));
      } else {
        try {
          audioRef.current.pause();
        } catch {}
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (_, newValue) => {
    setVolume(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!exerciseStarted) return;

    const pattern = breathingPatterns[difficulty];
    let interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer + 1;
        setPhaseTime((prevPhaseTime) => {
          let newPhaseTime = prevPhaseTime + 1;
          let currentPhaseDuration = pattern[breathPhase];

          if (newPhaseTime >= currentPhaseDuration) {
            newPhaseTime = 0;
            if (breathPhase === "inhale") setBreathPhase("hold");
            else if (breathPhase === "hold") setBreathPhase("exhale");
            else if (breathPhase === "exhale") setBreathPhase("rest");
            else if (breathPhase === "rest") {
              setBreathPhase("inhale");
              setBreathCount((prev) => prev + 1);
            }
          }
          return newPhaseTime;
        });

        if (newTimer >= totalTime || breathCount >= pattern.cycles) {
          clearInterval(interval);
          setExerciseStarted(false);
          if (audioRef.current) audioRef.current.pause();
          return totalTime;
        }
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [exerciseStarted, difficulty, breathPhase, breathCount, totalTime]);

  useEffect(() => {
    if (!circleRef.current) return;
    const pattern = breathingPatterns[difficulty];
    let scale = 1;
    let transition = "all 0.3s ease";
    switch (breathPhase) {
      case "inhale":
        scale = 1.5;
        transition = `all ${pattern.inhale}s cubic-bezier(0.4, 0, 0.2, 1)`;
        break;
      case "hold":
        scale = 1.5;
        transition = `all ${pattern.hold}s ease`;
        break;
      case "exhale":
        scale = 1;
        transition = `all ${pattern.exhale}s cubic-bezier(0.4, 0, 0.2, 1)`;
        break;
      case "rest":
        scale = 1;
        transition = `all ${pattern.rest}s ease`;
        break;
      default:
        break;
    }
    circleRef.current.style.transform = `scale(${scale})`;
    circleRef.current.style.transition = transition;
  }, [breathPhase, difficulty]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getInstructionText = () => {
    switch (breathPhase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "rest":
        return "Rest";
      default:
        return "";
    }
  };

  const getPhaseProgress = () => {
    const pattern = breathingPatterns[difficulty];
    let currentPhaseDuration = pattern[breathPhase];
    return (phaseTime / currentPhaseDuration) * 100;
  };

  const getOverallProgress = () => {
    return (timer / totalTime) * 100;
  };

  // --- Improved Difficulty Selection UI (Memory Game style) ---
  return (
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto", mt: 6, mb: 6 }}>
      {!gameStarted ? (
        <Box
          sx={{
            background: "#fff",
            borderRadius: 4,
            boxShadow: 3,
            p: { xs: 2, sm: 4 },
            mb: 4,
            border: "1px solid #e0e7ef",
            textAlign: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center", mb: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "primary.light", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={28} color="#1976d2" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Breathing Zen</Typography>
              <Typography variant="body2" color="text.secondary">
                Follow the pattern for deep relaxation
              </Typography>
            </Box>
          </Box>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Practice guided breathing exercises to reduce stress and improve focus. Follow the animated circle to regulate your breath.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 2 }}>
            {["#breathe", "#focus", "#relax"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "#e0f2fe",
                  color: "#2563eb",
                  fontSize: 12,
                  padding: "2px 10px",
                  borderRadius: 12,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 3, mt: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderWidth: 2,
                borderColor: "#22c55e",
                color: "#166534",
                fontWeight: 700,
                borderRadius: 3,
                py: 3,
                fontSize: 18,
                flexDirection: "column",
                boxShadow: "0 2px 8px 0 rgba(34,197,94,0.03)",
                background: "#f0fdf4",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#fff",
                  borderColor: "#22c55e",
                  boxShadow: "0 4px 16px 0 #22c55e33",
                },
              }}
              onClick={() => initializeExercise("easy")}
            >
              Easy
              <Typography variant="body2" sx={{ color: "#888", fontWeight: 400, fontSize: 14 }}>
                4-2-4-2 Pattern
              </Typography>
              <Typography variant="caption" sx={{ color: "#bbb", fontSize: 12 }}>
                3 min
              </Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderWidth: 2,
                borderColor: "#eab308",
                color: "#713f12",
                fontWeight: 700,
                borderRadius: 3,
                py: 3,
                fontSize: 18,
                flexDirection: "column",
                boxShadow: "0 2px 8px 0 rgba(234,179,8,0.03)",
                background: "#fefce8",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#fff",
                  borderColor: "#eab308",
                  boxShadow: "0 4px 16px 0 #eab30833",
                },
              }}
              onClick={() => initializeExercise("medium")}
            >
              Medium
              <Typography variant="body2" sx={{ color: "#888", fontWeight: 400, fontSize: 14 }}>
                4-4-6-2 Pattern
              </Typography>
              <Typography variant="caption" sx={{ color: "#bbb", fontSize: 12 }}>
                5 min
              </Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderWidth: 2,
                borderColor: "#2563eb",
                color: "#1e3a8a",
                fontWeight: 700,
                borderRadius: 3,
                py: 3,
                fontSize: 18,
                flexDirection: "column",
                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.03)",
                background: "#eff6ff",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#fff",
                  borderColor: "#2563eb",
                  boxShadow: "0 4px 16px 0 #2563eb33",
                },
              }}
              onClick={() => initializeExercise("hard")}
            >
              Deep
              <Typography variant="body2" sx={{ color: "#888", fontWeight: 400, fontSize: 14 }}>
                6-6-8-2 Pattern
              </Typography>
              <Typography variant="caption" sx={{ color: "#bbb", fontSize: 12 }}>
                7 min
              </Typography>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          {/* Game Header */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 4 }}>
            <Button variant="outlined" onClick={() => setGameStarted(false)} startIcon={<ArrowLeft size={20} />}>
              Back
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "grey.100", p: 1, borderRadius: 1 }}>
                <Clock size={18} color="#1976d2" />
                <Typography fontWeight={500}>
                  {formatTime(timer)} / {formatTime(totalTime)}
                </Typography>
              </Box>
              <Chip
                label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                color={difficulty === "easy" ? "success" : difficulty === "medium" ? "warning" : "primary"}
                variant="outlined"
              />
            </Box>
          </Box>
          {/* Breathing Exercise */}
          <Card variant="outlined" sx={{ border: 0, boxShadow: 3, overflow: "hidden" }}>
            <CardContent sx={{ p: 0 }}>
              {/* Progress Bar */}
              <Box sx={{ height: 4, bgcolor: "primary.light", width: `${getOverallProgress()}%` }} />
              <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 500, position: "relative", overflow: "hidden" }}>
                {/* Background Elements */}
                <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 800,
                      height: 800,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      opacity: 0.1,
                      animation: "pulse 10s infinite"
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 600,
                      height: 600,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      opacity: 0.1,
                      animation: "pulse 15s infinite",
                      animationDelay: "1s"
                    }}
                  />
                </Box>
                {/* Breathing Circle */}
                <Box
                  ref={circleRef}
                  sx={{
                    position: "relative",
                    width: 256,
                    height: 256,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 6,
                    zIndex: 1,
                    bgcolor:
                      breathPhase === "inhale"
                        ? "success.light"
                        : breathPhase === "hold"
                        ? "primary.light"
                        : breathPhase === "exhale"
                        ? "info.light"
                        : "grey.100",
                  }}
                >
                  <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid", borderColor: "primary.light" }} />
                  <Box sx={{ textAlign: "center", zIndex: 2 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>{getInstructionText()}</Typography>
                    <Typography variant="h3" color="primary">
                      {Math.max(
                        0,
                        Math.ceil(
                          breathPhase === "inhale"
                            ? breathingPatterns[difficulty].inhale - phaseTime
                            : breathPhase === "hold"
                            ? breathingPatterns[difficulty].hold - phaseTime
                            : breathPhase === "exhale"
                            ? breathingPatterns[difficulty].exhale - phaseTime
                            : breathingPatterns[difficulty].rest - phaseTime
                        )
                      )}
                    </Typography>
                  </Box>
                </Box>
                {/* Controls */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, zIndex: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton color="primary" size="large" sx={{ width: 56, height: 56 }} onClick={toggleExercise}>
                      {exerciseStarted ? <Pause size={32} /> : <Play size={32} />}
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                    <IconButton color="default" onClick={toggleMute}>
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </IconButton>
                    <Slider
                      value={volume}
                      min={0}
                      max={100}
                      step={1}
                      onChange={handleVolumeChange}
                      disabled={isMuted}
                      sx={{ width: 120 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Breath cycle: {breathCount + 1} of {breathingPatterns[difficulty].cycles}
                  </Typography>
                </Box>
                {/* Audio Element */}
                <div style={{ display: "none" }}>
                  <audio
                    ref={audioRef}
                    loop
                    preload="auto"
                    onError={() => setIsMuted(true)}
                  >
                    <source src="/audio/ambient-sound.mp3" type="audio/mpeg" />
                    <source src="/audio/ambient-sound.ogg" type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </Box>
            </CardContent>
            <CardActions sx={{ bgcolor: "grey.100", p: 2, justifyContent: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {difficulty === "easy"
                  ? "This gentle 4-2-4-2 pattern is perfect for beginners and quick stress relief."
                  : difficulty === "medium"
                  ? "The 4-4-6-2 pattern helps deepen your practice and increase relaxation."
                  : "This advanced 6-6-8-2 pattern promotes deep relaxation and mindfulness."}
              </Typography>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
}