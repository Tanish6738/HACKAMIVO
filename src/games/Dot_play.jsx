import React, { useEffect, useRef } from "react";

// Dot Play Game: "Follow the Dot" focus game with improved logic and UI
const DotPlay = ({ onBack }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    // Clean up previous content
    gameRef.current.innerHTML = "";

    // Create container
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.minHeight = "350px";
    container.style.width = "100%";

    // Game state
    let score = 0;
    let timeLeft = 20;
    let running = false;
    let intervalId = null;
    let dot = { x: 100, y: 100, r: 18 };
    let misses = 0;
    let bestScore = Number(localStorage.getItem("dotplay_best")) || 0;

    // UI Elements
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    canvas.style.border = "2px solid #38bdf8";
    canvas.style.borderRadius = "16px";
    canvas.style.background = "#f0fdf4";
    canvas.style.marginBottom = "16px";
    canvas.style.cursor = "pointer";
    container.appendChild(canvas);

    const info = document.createElement("div");
    info.style.marginBottom = "8px";
    info.style.fontWeight = "bold";
    info.style.fontSize = "1.1rem";
    info.innerText = "Click the moving dot as many times as you can in 20 seconds!";
    container.appendChild(info);

    const scoreDiv = document.createElement("div");
    scoreDiv.style.fontSize = "1.2rem";
    scoreDiv.style.marginBottom = "4px";
    container.appendChild(scoreDiv);

    const bestDiv = document.createElement("div");
    bestDiv.style.fontSize = "1rem";
    bestDiv.style.marginBottom = "4px";
    bestDiv.style.color = "#16a34a";
    bestDiv.innerText = `Best: ${bestScore}`;
    container.appendChild(bestDiv);

    const missDiv = document.createElement("div");
    missDiv.style.fontSize = "1rem";
    missDiv.style.marginBottom = "4px";
    missDiv.style.color = "#f59e42";
    container.appendChild(missDiv);

    const timerDiv = document.createElement("div");
    timerDiv.style.fontSize = "1.1rem";
    timerDiv.style.marginBottom = "16px";
    container.appendChild(timerDiv);

    const startBtn = document.createElement("button");
    startBtn.innerText = "Start Game";
    startBtn.style.background = "#22c55e";
    startBtn.style.color = "#fff";
    startBtn.style.padding = "0.75rem 2rem";
    startBtn.style.borderRadius = "0.5rem";
    startBtn.style.fontWeight = "bold";
    startBtn.style.border = "none";
    startBtn.style.cursor = "pointer";
    startBtn.style.fontSize = "1rem";
    startBtn.style.marginTop = "8px";
    container.appendChild(startBtn);

    gameRef.current.appendChild(container);

    // Draw dot
    function drawDot() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#0ea5e9";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Move dot to a new random position
    function moveDot() {
      dot.x = Math.random() * (canvas.width - 2 * dot.r) + dot.r;
      dot.y = Math.random() * (canvas.height - 2 * dot.r) + dot.r;
      drawDot();
    }

    // Update UI
    function updateScore() {
      scoreDiv.innerText = `Score: ${score}`;
    }
    function updateBest() {
      bestDiv.innerText = `Best: ${bestScore}`;
    }
    function updateMiss() {
      missDiv.innerText = `Misses: ${misses}`;
    }
    function updateTimer() {
      timerDiv.innerText = `Time Left: ${timeLeft}s`;
    }

    // End game
    function endGame() {
      running = false;
      clearInterval(intervalId);
      drawDot();
      info.innerText = `Game Over! Your score: ${score}`;
      timerDiv.innerText = "";
      startBtn.innerText = "Restart";
      startBtn.style.display = "inline-block";
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("dotplay_best", bestScore);
        updateBest();
        info.innerText += " (New Best!)";
      }
    }

    // Canvas click handler
    canvas.addEventListener("click", (e) => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dist = Math.sqrt((mx - dot.x) ** 2 + (my - dot.y) ** 2);
      if (dist <= dot.r) {
        score++;
        updateScore();
        moveDot();
      } else {
        misses++;
        updateMiss();
      }
    });

    // Start game logic
    function startGame() {
      score = 0;
      misses = 0;
      timeLeft = 20;
      running = true;
      updateScore();
      updateBest();
      updateMiss();
      updateTimer();
      info.innerText = "Click the moving dot as many times as you can in 20 seconds!";
      startBtn.style.display = "none";
      moveDot();

      intervalId = setInterval(() => {
        if (!running) return;
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
          endGame();
        }
      }, 1000);
    }

    startBtn.onclick = () => {
      if (intervalId) clearInterval(intervalId);
      startGame();
    };

    // Initial state
    updateScore();
    updateBest();
    updateMiss();
    updateTimer();
    drawDot();
    startBtn.style.display = "inline-block";

    // Clean up
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 sm:p-8 md:p-10 min-h-[300px] flex flex-col items-center justify-center">
      <div className="sticky top-4 self-end z-50">
        <button
          onClick={onBack}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-full p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
          style={{ minWidth: 0 }}
        >
          Back
        </button>
      </div>
      <div ref={gameRef} className="w-full flex flex-col items-center justify-center" />
    </div>
  );
};

export default DotPlay;