import { useState, useEffect, useRef } from "react";
import { Zap, Clock, ArrowLeft, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

const targetColors = ["bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-lime-500"];

export default function FocusTrainer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const [timer, setTimer] = useState(60);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [feedback, setFeedback] = useState(null);

  const gameAreaRef = useRef(null);
  const animationFrameRef = useRef();
  const lastSpawnTimeRef = useRef(0);

  const initializeGame = (diff) => {
    setDifficulty(diff);
    setScore(0);
    setTargets([]);
    setHits(0);
    setMisses(0);
    setCombo(0);
    setMaxCombo(0);
    setAccuracy(100);
    setTimer(60);
    setGameCompleted(false);
    setGameStarted(true);
    lastSpawnTimeRef.current = Date.now();
  };

  const handleTargetClick = (id) => {
    const target = targets.find((t) => t.id === id);
    if (!target || !target.active) return;

    const timeBonus = Math.round(target.timeLeft * 10);
    const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
    const comboMultiplier = 1 + combo * 0.1;
    const pointsEarned = Math.round((50 + timeBonus) * difficultyMultiplier * comboMultiplier);

    setScore((prev) => prev + pointsEarned);
    setHits((prev) => prev + 1);
    setCombo((prev) => prev + 1);
    setMaxCombo((prev) => Math.max(prev, combo + 1));

    const totalAttempts = hits + misses + 1;
    setAccuracy(Math.round(((hits + 1) / totalAttempts) * 100));

    setFeedback({
      text: `+${pointsEarned}`,
      color: combo >= 5 ? "text-amber-500" : "text-green-500",
    });
    setTimeout(() => setFeedback(null), 800);

    setTargets((prev) => prev.filter((t) => t.id !== id));

    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      confetti({
        particleCount: 15,
        startVelocity: 20,
        spread: 30,
        origin: {
          x: (target.x + target.size / 2) / rect.width,
          y: (target.y + target.size / 2) / rect.height,
        },
      });
    }
  };

  const handleBackgroundClick = (e) => {
    if (!gameStarted || gameCompleted) return;
    if (e.currentTarget === e.target) {
      setMisses((prev) => prev + 1);
      setCombo(0);
      const totalAttempts = hits + misses + 1;
      setAccuracy(Math.round((hits / totalAttempts) * 100));
      setFeedback({
        text: "Miss!",
        color: "text-red-500",
      });
      setTimeout(() => setFeedback(null), 800);
    }
  };

  useEffect(() => {
    if (!gameStarted || gameCompleted) return;

    const gameLoop = () => {
      const now = Date.now();
      const spawnInterval = difficulty === "easy" ? 1500 : difficulty === "medium" ? 1200 : 900;
      if (now - lastSpawnTimeRef.current > spawnInterval) {
        if (gameAreaRef.current) {
          const { width, height } = gameAreaRef.current.getBoundingClientRect();
          const targetSize = difficulty === "easy" ? 60 : difficulty === "medium" ? 50 : 40;
          const targetDuration = difficulty === "easy" ? 3 : difficulty === "medium" ? 2.5 : 2;
          const x = Math.random() * (width - targetSize);
          const y = Math.random() * (height - targetSize);

          const newTarget = {
            id: Date.now() + Math.random(),
            x,
            y,
            size: targetSize,
            color: targetColors[Math.floor(Math.random() * targetColors.length)],
            active: true,
            timeLeft: targetDuration,
          };

          setTargets((prev) => [...prev, newTarget]);
          lastSpawnTimeRef.current = now;
        }
      }

      setTargets((prev) =>
        prev
          .map((target) => {
            const newTimeLeft = target.timeLeft - 0.016;
            if (newTimeLeft <= 0) {
              setMisses((m) => m + 1);
              setCombo(0);
              const totalAttempts = hits + misses + 1;
              setAccuracy(Math.round((hits / totalAttempts) * 100));
              return { ...target, active: false };
            }
            return { ...target, timeLeft: newTimeLeft };
          })
          .filter((target) => target.active)
      );

      setTimer((prev) => {
        const newTime = prev - 0.016;
        if (newTime <= 0) {
          setGameCompleted(true);
          return 0;
        }
        return newTime;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameCompleted, difficulty, hits, misses]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateRating = () => {
    const accuracyFactor = accuracy / 100;
    const comboFactor = maxCombo / 10;
    const scoreFactor = score / (difficulty === "easy" ? 1000 : difficulty === "medium" ? 1500 : 2000);
    const rating = accuracyFactor * 0.4 + comboFactor * 0.3 + scoreFactor * 0.3;
    if (rating >= 0.8) return 3;
    if (rating >= 0.5) return 2;
    return 1;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-8 mt-8 transition hover:shadow-2xl border border-gray-100">
      {/* Header */}
      {!gameStarted ? (
        <div className="text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 shadow">
              <Zap className="text-green-500 w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Focus Trainer</h1>
              <p className="text-xs text-gray-500">
                Improve concentration with timed exercises. Click on targets as quickly as possible before they disappear. Build combos for bonus points!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {["#focus", "#attention", "#braintraining"].map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => initializeGame(level)}
                className={`border-2 rounded-xl py-4 font-semibold text-lg shadow transition-all duration-200
                  ${level === "easy" ? "border-green-400 text-green-700 hover:bg-green-50"
                  : level === "medium" ? "border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  : "border-blue-400 text-blue-700 hover:bg-blue-50"}
                `}
              >
                {level[0].toUpperCase() + level.slice(1)}{" "}
                <span className="text-xs font-normal">
                  {level === "easy"
                    ? "Larger Targets"
                    : level === "medium"
                    ? "Faster Pace"
                    : "Small Targets"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Game Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setGameStarted(false)}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition text-green-700 font-medium"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded text-green-700 font-semibold">
                <Clock size={16} /> {formatTime(timer)}
              </span>
              <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded text-blue-700 font-semibold">
                Score: {score}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize shadow
                ${difficulty === "easy" ? "bg-green-100 text-green-700"
                  : difficulty === "medium" ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"}
              `}>
                {difficulty}
              </span>
            </div>
          </div>

          {/* Game Area */}
          <div
            ref={gameAreaRef}
            className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-100 overflow-hidden mb-6"
            onClick={handleBackgroundClick}
          >
            {targets.map((target) => (
              <button
                key={target.id}
                className={`absolute rounded-full ${target.color} shadow-lg transition-transform border-2 border-white`}
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  width: `${target.size}px`,
                  height: `${target.size}px`,
                  opacity: target.timeLeft > 0.5 ? 1 : target.timeLeft * 2,
                  transform: `scale(${target.timeLeft > 0.5 ? 1 : 0.5 + target.timeLeft})`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTargetClick(target.id);
                }}
                tabIndex={-1}
                aria-label="Target"
                type="button"
              >
                <span className="sr-only">Target</span>
              </button>
            ))}
            {feedback && (
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold ${feedback.color} animate-bounce`}>
                {feedback.text}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-gray-50 rounded shadow">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Accuracy</span>
                <span className="font-medium">{accuracy}%</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded shadow">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Hits</span>
                <span className="font-medium text-green-500">{hits}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded shadow">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Misses</span>
                <span className="font-medium text-red-500">{misses}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded shadow">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Combo</span>
                <span className={`font-medium ${combo >= 5 ? "text-amber-500" : ""}`}>{combo}x</span>
              </div>
            </div>
          </div>

          {/* Game Completed Modal */}
          {gameCompleted && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 text-center border-2 border-green-100">
                <div className="text-4xl text-yellow-400 mb-2">
                  <Trophy size={56} className="mx-auto mb-2" />
                </div>
                <h2 className="font-extrabold text-2xl text-green-700 mb-1">Time's Up!</h2>
                <p className="text-gray-600 mb-4">Here's how you performed</p>
                <div className="flex justify-center gap-2 text-3xl mb-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={i < calculateRating() ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="space-y-2 text-left text-base">
                  <div className="flex justify-between">
                    <span>Final Score:</span> <span className="font-medium text-green-700">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span> <span>{accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hits / Misses:</span> <span>{hits} / {misses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Combo:</span> <span className="text-amber-500 font-medium">{maxCombo}x</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setGameStarted(false)}
                    className="flex-1 border py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Main Menu
                  </button>
                  <button
                    onClick={() => initializeGame(difficulty)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}