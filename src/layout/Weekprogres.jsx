import React, { useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaGripfire } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@clerk/clerk-react";

export default function Weekprogres() {
  const { user } = useUser();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prepare chart data for the last 7 days
  const chartData = logs.slice(-7).map((log) => ({
    day: log.timestamp,
    Mood: log.mood,
    Energy: log.energy_level,
    "Sleep Quality": log.sleep_quality,
    Diet: log.diet_level,
    Anxiety: log.anxiety_level,
    "Sleep Hours": log.sleep_hours,
    // Convert exercise_duration from minutes to hours (rounded to 1 decimal)
    Exercise: log.exercise_duration ? +(log.exercise_duration / 60).toFixed(1) : 0,
  }));

  // Mood entries and streak calculation
  const moodEntries = logs.length;
  // Calculate streak: count consecutive days with logs from the latest day backwards
  let streak = 0;
  if (logs.length > 0) {
    const sorted = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let prev = new Date(sorted[0].timestamp);
    streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const curr = new Date(sorted[i].timestamp);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        prev = curr;
      } else {
        break;
      }
    }
  }

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`https://krish09bha-mindful-me.hf.space/logs/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs);
        } else {
          setLogs([]);
        }
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md min-w-0 flex flex-col h-[500px] overflow-hidden">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4">Your Weekly Progress</h2>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Track your mood patterns over time</p>

      <div className="h-64 sm:h-72">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <svg className="animate-spin text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="48" height="48">
              <circle className="opacity-25" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6"></circle>
              <path className="opacity-75" fill="currentColor" d="M8 24a16 16 0 0132 0h-8z"></path>
            </svg>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value, name) =>
                  name === "Exercise"
                    ? [`${value} hr`, "Exercise"]
                    : value
                }
              />
              <Legend
                formatter={(value) =>
                  value === "Exercise"
                    ? "Exercise (hr)"
                    : value
                }
              />
              <Line type="monotone" dataKey="Mood" stroke="#3b82f6" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Energy" stroke="#22c55e" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Sleep Quality" stroke="#f97316" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Diet" stroke="#a855f7" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Anxiety" stroke="#ef4444" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Sleep Hours" stroke="#8b5cf6" strokeWidth={2} dot />
              <Line type="monotone" dataKey="Exercise" stroke="#0ea5e9" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-gray-400 text-center">
            <span className="mb-2">No data found for your weekly progress.</span>
            <span className="text-xs">I think you are new here. For more analysis, get the daily log check-in please.</span>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-700 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <IoDocumentTextOutline className="text-green-500" />
          <span>{moodEntries} mood entr{moodEntries === 1 ? "y" : "ies"} this week</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaGripfire className="text-orange-500" />
          <span>{streak}-day check-in streak</span>
        </div>
      </div>
    </div>
  );
}