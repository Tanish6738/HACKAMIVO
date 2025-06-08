import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useUser } from "@clerk/clerk-react";

// Helper to get day name from date string (YYYY-MM-DD)
function getDayName(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

const Get_Logs_by_User_ID = () => {
  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  // Automatically set userId to current user on mount
  useEffect(() => {
    if (user && user.id) {
      setUserId(user.id);
    }
  }, [user]);

  // Automatically fetch logs when userId changes and is not empty
  useEffect(() => {
    if (!userId.trim()) {
      setLogs([]);
      setSearched(false);
      return;
    }
    const fetchLogs = async () => {
      setLoading(true);
      setLogs([]);
      setSearched(false);
      try {
        const res = await fetch(`https://krish09bha-mindful-me.hf.space/logs/${userId.trim()}`);
        if (!res.ok) throw new Error("No logs found for this user.");
        const data = await res.json();
        setLogs(data.logs || []);
        setSearched(true);
      } catch (err) {
        setLogs([]);
        setSearched(true);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [userId]);

  // Filter logs by date only
  let filteredLogs = logs;
  if (searchDate) {
    filteredLogs = logs.filter((log) => log.timestamp === searchDate);
  }

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-6 md:p-8 bg-white rounded-2xl shadow-xl mt-4 sm:mt-10">
   
      
     
      {/* Date filter only */}
      {logs.length > 0 && (
        <div className="mb-3 flex flex-col sm:flex-row gap-2 items-center">
          <label className="text-xs sm:text-sm text-gray-700 font-semibold">Filter by Date:</label>
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="border border-green-200 rounded px-2 py-1 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {searchDate && (
            <button
              onClick={() => setSearchDate("")}
              className="ml-2 text-[11px] sm:text-xs text-gray-500 underline"
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center h-20">
          <CircularProgress size={28} color="success" />
        </div>
      )}
      {!loading && searched && filteredLogs.length === 0 && (
        <div className="text-gray-400 text-center py-6 text-xs sm:text-base">
          {searchDate
            ? "No logs found for this user ID on this date."
            : "No logs found for this user ID."
          }
        </div>
      )}
      {!loading && filteredLogs.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          {filteredLogs.map((log, idx) => (
            <div
              key={idx}
              className="border border-green-200 rounded-xl p-2 sm:p-5 shadow bg-gradient-to-br from-green-50 to-white"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                <div className="text-[11px] sm:text-xs text-green-700 font-semibold flex items-center gap-1 sm:gap-2">
                  <span role="img" aria-label="calendar">📅</span>
                  {log.timestamp} <span className="ml-2 text-gray-500">({getDayName(log.timestamp)})</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Get_Logs_by_User_ID;