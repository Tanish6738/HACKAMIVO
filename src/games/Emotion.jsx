import { useState, useEffect } from "react";
import { SmilePlus, Clock, ArrowLeft, Trophy, CheckCircle, XCircle } from "lucide-react";
import {
  FaSmile,
  FaSadTear,
  FaAngry,
  FaSurprise,
  FaFrownOpen,
  FaTired,
  FaMeh,
  FaGrinBeam,
  FaGrinStars,
  
} from "react-icons/fa";
import confetti from "canvas-confetti";
import { TbMoodConfuzed } from "react-icons/tb";

const emotions = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300&text=😊",
    correct: "Happy",
    options: ["Happy", "Sad", "Angry", "Surprised"],
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300&text=😢",
    correct: "Sad",
    options: ["Anxious", "Sad", "Tired", "Bored"],
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300&text=😠",
    correct: "Angry",
    options: ["Disgusted", "Frustrated", "Angry", "Annoyed"],
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300&text=😲",
    correct: "Surprised",
    options: ["Excited", "Shocked", "Surprised", "Scared"],
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300&text=😨",
    correct: "Fearful",
    options: ["Worried", "Fearful", "Nervous", "Stressed"],
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300&text=🤢",
    correct: "Disgusted",
    options: ["Disgusted", "Sick", "Uncomfortable", "Disapproving"],
  },
  {
    id: 7,
    image: "/placeholder.svg?height=300&width=300&text=😐",
    correct: "Neutral",
    options: ["Bored", "Calm", "Neutral", "Tired"],
  },
  {
    id: 8,
    image: "/placeholder.svg?height=300&width=300&text=🙄",
    correct: "Contempt",
    options: ["Annoyed", "Contempt", "Judgmental", "Dismissive"],
  },
  {
    id: 9,
    image: "/placeholder.svg?height=300&width=300&text=😌",
    correct: "Content",
    options: ["Relaxed", "Content", "Peaceful", "Satisfied"],
  },
  {
    id: 10,
    image: "/placeholder.svg?height=300&width=300&text=🤔",
    correct: "Confused",
    options: ["Thinking", "Confused", "Curious", "Doubtful"],
  },
];

// Map emotion names to react-icons
const emotionIcons = {
  Happy: <FaSmile className="text-yellow-400" size={90} />,
  Sad: <FaSadTear className="text-blue-400" size={90} />,
  Angry: <FaAngry className="text-red-500" size={90} />,
  Surprised: <FaSurprise className="text-yellow-500" size={90} />,
  Fearful: <FaFrownOpen className="text-indigo-400" size={90} />,
  Disgusted: <FaTired className="text-green-700" size={90} />,
  Neutral: <FaMeh className="text-gray-400" size={90} />,
  Contempt: <FaGrinBeam className="text-pink-400" size={90} />,
  Content: <FaGrinStars className="text-green-400" size={90} />,
  Confused: <TbMoodConfuzed   className="text-blue-400" size={90} />,
};

export default function EmotionRecognition() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timer, setTimer] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const initializeGame = (diff) => {
    setDifficulty(diff);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimer(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setFeedback(null);
    setShowExplanation(false);
    setGameCompleted(false);

    const questionCount = diff === "easy" ? 5 : diff === "medium" ? 7 : 10;
    setTotalQuestions(questionCount);

    const shuffled = [...emotions].sort(() => Math.random() - 0.5);
    setSelectedEmotions(shuffled.slice(0, questionCount));

    setGameStarted(true);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;

    const currentEmotion = selectedEmotions[currentQuestion];
    const correct = answer === currentEmotion.correct;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      const basePoints =
        difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 200;
      const timeBonus = Math.max(0, 10 - Math.floor((timer % 60) / 6)) * 10;
      const pointsEarned = basePoints + timeBonus;

      setScore((prev) => prev + pointsEarned);
      setCorrectAnswers((prev) => prev + 1);
      setFeedback(`Correct! +${pointsEarned} points`);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setWrongAnswers((prev) => prev + 1);
      setFeedback(`Incorrect. The answer was ${currentEmotion.correct}`);
    }

    setShowExplanation(true);

    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        setGameCompleted(true);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setFeedback(null);
        setShowExplanation(false);
      }
    }, 2000);
  };

  useEffect(() => {
    let interval;
    if (gameStarted && !gameCompleted && !showExplanation) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted, showExplanation]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateAccuracy = () => {
    if (correctAnswers + wrongAnswers === 0) return 0;
    return Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100);
  };

  const calculateRating = () => {
    const accuracy = calculateAccuracy();

    if (accuracy >= 80) return 3;
    if (accuracy >= 60) return 2;
    return 1;
  };

  const getEmotionExplanation = (emotion) => {
    const explanations = {
      Happy:
        "Happiness is characterized by smiling, raised cheeks, and crinkled eyes.",
      Sad:
        "Sadness often shows in downturned mouth corners, raised inner eyebrows, and sometimes tears.",
      Angry:
        "Anger features lowered eyebrows, intense or narrowed eyes, and a tight jaw or mouth.",
      Surprised:
        "Surprise involves raised eyebrows, widened eyes, and an open mouth.",
      Fearful:
        "Fear displays raised eyebrows, widened eyes, and a tense mouth or grimace.",
      Disgusted:
        "Disgust shows in a wrinkled nose, raised upper lip, and sometimes a protruding tongue.",
      Neutral:
        "Neutral expressions lack intense muscle movements and show a relaxed face.",
      Contempt:
        "Contempt is uniquely shown by a one-sided mouth raise or smirk.",
      Content:
        "Contentment appears as a gentle smile, relaxed eyes, and an overall peaceful expression.",
      Confused:
        "Confusion often features furrowed brows, squinted eyes, and sometimes a tilted head.",
    };

    return explanations[emotion] || "This emotion is shown through specific facial muscle patterns.";
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mb-8 mt-8 transition hover:shadow-2xl border border-blue-200">
      {/* Header */}
      {!gameStarted ? (
        <div className="text-center">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shadow">
              <SmilePlus className="text-blue-600 w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emotion Recognition</h1>
              <p className="text-xs text-gray-500">
                Practice identifying emotional expressions. Test your emotional intelligence by identifying the correct emotion shown in each image.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {["#emotion", "#empathy", "#eq"].map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { label: "Easy", value: "easy", count: 5 },
              { label: "Medium", value: "medium", count: 7 },
              { label: "Hard, 10 Questions", value: "hard", count: 10 },
            ].map(({ label, value, count }) => (
              <button
                key={value}
                onClick={() => initializeGame(value)}
                className={`border-2 rounded-xl py-4 font-semibold text-lg shadow transition-all duration-200
                  ${value === "easy" ? "border-green-400 text-green-700 hover:bg-green-50"
                  : value === "medium" ? "border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                  : "border-blue-400 text-blue-700 hover:bg-blue-50"}
                `}
              >
                {label}
                <span className="text-xs font-normal block">{count} Questions</span>
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
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition text-blue-700 font-medium"
            >
              <ArrowLeft size={18} /> Back
            </button>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded text-blue-700 font-semibold">
                <Clock size={16} /> {formatTime(timer)}
              </span>
              <span className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded text-yellow-700 font-semibold">
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

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
              <span>
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span>{Math.round(((currentQuestion) / totalQuestions) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-300 rounded h-2">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {selectedEmotions.length > 0 && currentQuestion < selectedEmotions.length && (
            <div className="shadow-lg rounded-xl border border-blue-100 p-6 max-w-xl mx-auto bg-blue-50">
              {/* Emotion Image (now emoji icon) */}
              <div className="flex justify-center mb-6">
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-white border-4 border-blue-200 overflow-hidden flex items-center justify-center text-6xl shadow">
                  {/* Show emoji icon for the correct answer */}
                  {emotionIcons[selectedEmotions[currentQuestion].correct] || <FaQuestion size={90} className="text-gray-400" />}
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-center text-xl font-semibold mb-4">
                What emotion is being expressed?
              </h2>

              {/* Feedback */}
              {feedback && (
                <p
                  className={`text-center text-lg font-semibold mb-4 ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {feedback}
                </p>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {selectedEmotions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`capitalize rounded-lg py-3 border font-medium text-center
                      ${
                        selectedAnswer === option
                          ? isCorrect
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-blue-50"
                      }
                      transition-colors
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <p className="mt-6 italic text-center text-gray-600">
                  {getEmotionExplanation(selectedEmotions[currentQuestion].correct)}
                </p>
              )}
            </div>
          )}

          {/* Game Over Screen */}
          {gameCompleted && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 text-center border-2 border-blue-200">
                <div className="text-4xl text-yellow-400 mb-2">
                  <Trophy size={56} className="mx-auto mb-2" />
                </div>
                <h2 className="font-extrabold text-2xl text-blue-700 mb-1">Game Over</h2>
                <p className="text-gray-600 mb-4">Here's how you performed</p>
                <div className="flex justify-center gap-2 text-3xl mb-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i}>
                      {i < calculateRating() ? (
                        <CheckCircle className="text-yellow-400 w-7 h-7" />
                      ) : (
                        <XCircle className="text-gray-300 w-7 h-7" />
                      )}
                    </span>
                  ))}
                </div>
                <div className="space-y-2 text-left text-base">
                  <div className="flex justify-between">
                    <span>Final Score:</span> <span className="font-medium text-blue-700">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span> <span>{calculateAccuracy()}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correct / Wrong:</span> <span>{correctAnswers} / {wrongAnswers}</span>
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