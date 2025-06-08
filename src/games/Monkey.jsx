import React, { useEffect, useRef } from "react";

// Monkey Game (Gorillas) - Canvas-based game embedded in React
const Monkey = ({ onBack }) => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) return;

    // Clean up previous content
    gameRef.current.innerHTML = "";

    // Create container for canvas and overlays
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.background = "#222";
    container.style.overflow = "hidden";

    // Canvas
    const canvas = document.createElement("canvas");
    canvas.id = "game";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    container.appendChild(canvas);

    // Info panels and overlays (minimal for demo)
    const infoLeft = document.createElement("div");
    infoLeft.id = "info-left";
    infoLeft.style.position = "absolute";
    infoLeft.style.top = "20px";
    infoLeft.style.left = "25px";
    infoLeft.style.color = "white";
    infoLeft.innerHTML = `<h3><span class="name">Player</span></h3>
      <p>Angle: <span class="angle">0</span>°</p>
      <p>Velocity: <span class="velocity">0</span></p>`;
    container.appendChild(infoLeft);

    const infoRight = document.createElement("div");
    infoRight.id = "info-right";
    infoRight.style.position = "absolute";
    infoRight.style.top = "20px";
    infoRight.style.right = "25px";
    infoRight.style.color = "white";
    infoRight.style.textAlign = "right";
    infoRight.innerHTML = `<h3><span class="name">Computer</span></h3>
      <p>Angle: <span class="angle">0</span>°</p>
      <p>Velocity: <span class="velocity">0</span></p>`;
    container.appendChild(infoRight);

    // Instructions
    const instructions = document.createElement("div");
    instructions.id = "instructions";
    instructions.style.position = "absolute";
    instructions.style.top = "50%";
    instructions.style.left = "50%";
    instructions.style.transform = "translate(-50%, -50%)";
    instructions.style.background = "rgba(255,255,255,0.9)";
    instructions.style.color = "#222";
    instructions.style.padding = "24px 32px";
    instructions.style.borderRadius = "16px";
    instructions.style.textAlign = "center";
    instructions.style.zIndex = "10";
    instructions.innerHTML = `<h3 id="game-mode">Player vs. Computer</h3>
      <h1>Drag the bomb to aim!</h1>`;
    container.appendChild(instructions);

    // Bomb grab area (for aiming)
    const bombGrabArea = document.createElement("div");
    bombGrabArea.id = "bomb-grab-area";
    bombGrabArea.style.position = "absolute";
    bombGrabArea.style.width = "30px";
    bombGrabArea.style.height = "30px";
    bombGrabArea.style.borderRadius = "50%";
    bombGrabArea.style.background = "rgba(0,0,0,0.1)";
    bombGrabArea.style.cursor = "grab";
    bombGrabArea.style.left = "100px";
    bombGrabArea.style.bottom = "100px";
    container.appendChild(bombGrabArea);

    // Congratulations overlay
    const congratulations = document.createElement("div");
    congratulations.id = "congratulations";
    congratulations.style.position = "absolute";
    congratulations.style.top = "50%";
    congratulations.style.left = "50%";
    congratulations.style.transform = "translate(-50%, -50%)";
    congratulations.style.background = "rgba(255,255,255,0.95)";
    congratulations.style.color = "#222";
    congratulations.style.padding = "40px 60px";
    congratulations.style.borderRadius = "16px";
    congratulations.style.textAlign = "center";
    congratulations.style.display = "none";
    congratulations.innerHTML = `<h1><span id="winner">?</span> won!</h1>
      <button id="restart-btn" style="margin-top:20px;padding:10px 24px;border-radius:8px;background:#38bdf8;color:white;font-weight:bold;">Restart</button>`;
    container.appendChild(congratulations);

    // Add to DOM
    gameRef.current.appendChild(container);

    // --- Minimal Game Logic (DEMO) ---
    // For brevity, this is a simplified version. You can expand it with your full JS logic.
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Draw gorillas and buildings (demo)
    function drawScene() {
      ctx.clearRect(0, 0, width, height);
      // Draw ground
      ctx.fillStyle = "#444";
      ctx.fillRect(0, height - 80, width, 80);
      // Draw buildings
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#6b7280" : "#a3a3a3";
        ctx.fillRect(80 + i * 120, height - 80 - (100 + Math.random() * 120), 80, 100 + Math.random() * 120);
      }
      // Draw gorillas
      ctx.beginPath();
      ctx.arc(120, height - 120, 30, 0, 2 * Math.PI);
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width - 120, height - 120, 30, 0, 2 * Math.PI);
      ctx.fillStyle = "#222";
      ctx.fill();
    }
    drawScene();

    // Dummy drag/aim logic
    let isDragging = false;
    bombGrabArea.addEventListener("mousedown", () => {
      isDragging = true;
      bombGrabArea.style.background = "#38bdf8";
    });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        bombGrabArea.style.left = `${e.clientX - 15}px`;
        bombGrabArea.style.top = `${e.clientY - 15}px`;
      }
    });
    window.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        bombGrabArea.style.background = "rgba(0,0,0,0.1)";
        // Show congratulations for demo
        congratulations.style.display = "block";
        document.getElementById("winner").innerText = "Player";
      }
    });
    document.getElementById("restart-btn").onclick = () => {
      congratulations.style.display = "none";
      bombGrabArea.style.left = "100px";
      bombGrabArea.style.top = "";
      bombGrabArea.style.bottom = "100px";
    };

    // Responsive
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      drawScene();
    });

    // Clean up on unmount
    return () => {
      window.removeEventListener("resize", drawScene);
      window.removeEventListener("mousemove", null);
      window.removeEventListener("mouseup", null);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="bg-white border border-gray-300 shadow-lg rounded-full p-3 hover:bg-gray-100 transition flex items-center gap-2"
        >
          Back
        </button>
      </div>
      <div ref={gameRef} className="w-full h-full" />
    </div>
  );
};

export default Monkey;