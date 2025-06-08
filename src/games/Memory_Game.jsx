import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { ArrowLeft, Clock, Sparkles, Trophy } from "lucide-react";

const cardTypes = [
  { emoji: "🌿", color: "bg-green-200" },
  { emoji: "🌱", color: "bg-emerald-200" },
  { emoji: "🍃", color: "bg-teal-200" },
  { emoji: "🌲", color: "bg-lime-200" },
  { emoji: "🌴", color: "bg-green-300" },
  { emoji: "🌵", color: "bg-emerald-300" },
  { emoji: "🍀", color: "bg-teal-300" },
  { emoji: "🌳", color: "bg-lime-300" },
  { emoji: "🪴", color: "bg-green-100" },
  { emoji: "🍂", color: "bg-yellow-200" },
  { emoji: "🍁", color: "bg-orange-200" },
  { emoji: "🌼", color: "bg-yellow-100" },
];

export default function Memory_Game() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState(0);

  const initializeGame = (diff) => {
    setDifficulty(diff);
    const pairsCount = diff === "easy" ? 6 : diff === "medium" ? 8 : 12;
    const typeCount = diff === "hard" ? 12 : 8;

    const newCards = [];
    for (let i = 0; i < pairsCount; i++) {
      const type = i % typeCount;
      newCards.push({ id: i * 2, type, flipped: false, matched: false });
      newCards.push({ id: i * 2 + 1, type, flipped: false, matched: false });
    }

    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setScore(0);
    setGameCompleted(false);
    setGameStarted(true);
  };

  const handleCardClick = (id) => {
    const clickedCard = cards.find((card) => card.id === id);
    if (flippedCards.length === 2 || flippedCards.includes(id) || clickedCard?.matched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first.type === second.type) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
            )
          );
          setMatchedPairs((mp) => mp + 1);
          setFlippedCards([]);

          const base = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
          const pairScore = Math.max(base - moves * 2 - Math.floor(timer / 5), 50);
          setScore((s) => s + pairScore);

          if (matchedPairs + 1 === cards.length / 2) {
            setGameCompleted(true);
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          }
        }, 500);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameCompleted]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const calculateStars = () => {
    const total = cards.length;
    const [best, ok] =
      difficulty === "easy"
        ? [total * 0.7, total * 1.2]
        : difficulty === "medium"
        ? [total * 0.8, total * 1.3]
        : [total * 0.9, total * 1.5];

    if (moves <= best) return 3;
    if (moves <= ok) return 2;
    return 1;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-8 mt-8 transition hover:shadow-2xl border border-gray-100">
      {/* Header */}
      {!gameStarted ? (
        <div className="text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shadow">
              <Sparkles className="text-yellow-400 w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Memory Match</h1>
              <p className="text-xs text-gray-500">Flip cards and find pairs. Fewer moves and faster time means a better score!</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {["#memory", "#focus", "#braintraining"].map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {["easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                className={`border-2 rounded-xl py-4 font-semibold text-lg shadow transition-all duration-200
                  ${diff === "easy" ? "border-green-400 text-green-700 hover:bg-green-50"
                  : diff === "medium" ? "border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  : "border-blue-400 text-blue-700 hover:bg-blue-50"}
                `}
                onClick={() => initializeGame(diff)}
              >
                {diff[0].toUpperCase() + diff.slice(1)}{" "}
                <span className="text-xs font-normal">
                  ({diff === "easy" ? "6" : diff === "medium" ? "8" : "12"} pairs)
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
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition text-blue-600 font-medium"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded text-blue-700 font-semibold">
                <Clock size={16} /> {formatTime(timer)}
              </span>
              <span className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded text-green-700 font-semibold">
                <Sparkles size={16} /> Moves: {moves}
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

          {/* Card Grid */}
          <div
            className={`grid gap-3 ${
              difficulty === "easy"
                ? "grid-cols-3 sm:grid-cols-4"
                : difficulty === "medium"
                ? "grid-cols-4 sm:grid-cols-4"
                : "grid-cols-4 sm:grid-cols-6"
            } mb-6`}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square rounded-xl cursor-pointer transition-transform duration-200 shadow-md hover:scale-105
                  ${card.matched ? "opacity-40 grayscale" : ""}
                `}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="relative w-full h-full" style={{ perspective: 1000 }}>
                  <div
                    className={`absolute inset-0 transition-transform duration-500 rounded-xl border-2 border-white shadow
                      ${flippedCards.includes(card.id) || card.matched ? "[transform:rotateY(180deg)]" : ""}
                    `}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Back */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl flex items-center justify-center text-3xl font-bold text-blue-700 backface-hidden select-none">
                      ?
                    </div>
                    {/* Front */}
                    <div
                      className={`absolute inset-0 ${cardTypes[card.type].color} rounded-xl flex items-center justify-center text-5xl [transform:rotateY(180deg)] backface-hidden select-none`}
                    >
                      {cardTypes[card.type].emoji}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Game Completed Modal */}
          {gameCompleted && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 text-center border-2 border-blue-100">
                <div className="text-4xl text-yellow-400 mb-2">
                  <Trophy size={56} className="mx-auto mb-2" />
                </div>
                <h2 className="font-extrabold text-2xl text-blue-700 mb-1">Congratulations!</h2>
                <p className="text-gray-600 mb-4">You've completed the game</p>
                <div className="flex justify-center gap-2 text-3xl mb-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={i < calculateStars() ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <div className="space-y-2 text-left text-base">
                  <div className="flex justify-between">
                    <span>⏱️ Time:</span> <span>{formatTime(timer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔄 Moves:</span> <span>{moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🏆 Score:</span> <span className="text-blue-600 font-bold">{score}</span>
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
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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