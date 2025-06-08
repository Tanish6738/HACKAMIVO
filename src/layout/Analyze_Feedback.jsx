import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import CircularProgress from "@mui/material/CircularProgress";

// --- Formatting function from Item5.jsx ---
function formatFeedbackContent(content) {
  if (!content) return "";

  // Replace **bold**
  let formatted = content.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-green-800">$1</strong>'
  );

  // Replace *italic*
  formatted = formatted.replace(
    /\*(.*?)\*/g,
    '<em>$1</em>'
  );

  // Remove leading dots, asterisks, bullets, and numbers from each line
  formatted = formatted
    .split('\n')
    .map(line =>
      line
        .replace(/^(\d+\.)\s*/, "") // Remove "1. ", "2. ", etc.
        .replace(/^•\s*/, "")       // Remove "• "
        .replace(/^\*\s*/, "")      // Remove "* "
        .replace(/^\.\s*/, "")      // Remove ". "
        .trim()
    )
    .join('\n');

  // Process paragraphs and lists
  let result = "";
  const paragraphs = formatted.split("\n\n");

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];

    // Bullet/list detection
    if (
      para.trim().startsWith("- ") ||
      para.trim().startsWith("* ") ||
      para.trim().match(/^(\d+\.)\s/)
    ) {
      // List
      const items = para
        .split('\n')
        .map(item =>
          item
            .replace(/^-\s*/, "")
            .replace(/^\*\s*/, "")
            .replace(/^(\d+\.)\s*/, "")
            .replace(/^•\s*/, "")
            .replace(/^\.\s*/, "")
            .trim()
        )
        .filter(Boolean);
      result += `<ul class="list-disc pl-5 space-y-2">${items
        .map(
          (item) =>
            `<li class="mb-1">${item}</li>`
        )
        .join("")}</ul>`;
    } else if (para.trim()) {
      // Paragraph
      result += `<p class="mb-2">${para.trim()}</p>`;
    }
  }

  return result;
}

const Analyze_Feedback = () => {
  const { user } = useUser();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    if (!user || !user.id) return;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://krish09bha-mindful-me.hf.space/logs/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        // Sort logs by timestamp descending (newest first)
        const sortedLogs = (data.logs || []).sort((a, b) => {
          // Try to parse as date, fallback to string compare
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateB - dateA;
        });
        setLogs(sortedLogs);
      } catch (err) {
        setLogs([]);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded-2xl shadow-xl mt-4 sm:mt-10">
      <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-green-700 mb-1 sm:mb-2">
        <span role="img" aria-label="analyze">📊</span> Analyze Your Feedback
      </h2>
      <p className="text-xs sm:text-base text-gray-500 mb-3 sm:mb-6">
        Review your daily logs and AI feedback for insights and improvement.
      </p>
      {loading ? (
        <div className="flex justify-center items-center h-32 sm:h-40">
          <CircularProgress size={32} color="success" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-gray-400 text-center py-8 text-xs sm:text-base">
          No logs found for your account.
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className="border border-green-200 rounded-xl p-2 sm:p-6 shadow-md bg-gradient-to-br from-green-50 to-white hover:from-green-100 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                <div className="text-[11px] sm:text-xs text-green-700 font-semibold flex items-center gap-1 sm:gap-2">
                  <span role="img" aria-label="calendar">📅</span>
                  {log.timestamp}
                </div>
                <div className="text-[11px] sm:text-xs text-gray-500">
                  User ID: <span className="font-mono">{log.user_id}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 sm:gap-x-6 sm:gap-y-2 text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                <div>
                  <span className="font-semibold text-black">Mood:</span> {log.mood}/10
                </div>
                <div>
                  <span className="font-semibold text-black">Energy:</span> {log.energy_level}/10
                </div>
                <div>
                  <span className="font-semibold text-black">Sleep Quality:</span> {log.sleep_quality}/10
                </div>
                <div>
                  <span className="font-semibold text-black">Diet:</span> {log.diet_level}/10
                </div>
                <div>
                  <span className="font-semibold text-black">Exercise:</span> {log.exercise_duration} min
                </div>
                <div>
                  <span className="font-semibold text-black">Anxiety:</span> {log.anxiety_level}/10
                </div>
                <div>
                  <span className="font-semibold text-black">Sleep Hours:</span> {log.sleep_hours} hrs
                </div>
              </div>
              <div className="mb-1 sm:mb-2">
                <span className="font-semibold text-green-800">Recommended Action:</span>{" "}
                <span className="bg-green-100 px-1.5 py-0.5 rounded font-bold text-black text-xs sm:text-base">{log.action}</span>
              </div>
              <div className="mb-1 sm:mb-2">
                <span className="font-semibold text-blue-800">AI Feedback:</span>
                <div
                  className="bg-blue-50 border border-blue-100 rounded p-2 sm:p-3 mt-1 text-gray-800 whitespace-pre-line text-xs sm:text-base"
                  dangerouslySetInnerHTML={{ __html: formatFeedbackContent(log.feedback) }}
                />
              </div>
          
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analyze_Feedback;