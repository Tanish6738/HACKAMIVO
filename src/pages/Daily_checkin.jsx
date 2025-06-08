import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Format feedback and recommendation text for pretty display
const formatFeedbackContent = (content) => {
  if (!content) return "";

  let formatted = content.replace(
    /\*\*(.*?)\*\*/g,
    '<h4 class="font-bold text-gray-800 dark:text-gray-200 mt-4 mb-2">$1</h4>'
  );

  formatted = formatted.replace(/(?<!\*)\*(?!\*)([^*\n]+)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

  let result = "";
  const paragraphs = formatted.split("\n\n");

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];

    if (para.includes('<h4 class="font-bold')) {
      result += para;
      continue;
    }

    if (para.trim().match(/^\s*\*\s+/m)) {
      let listItems = "";
      const lines = para.split("\n").filter((item) => item.trim());

      for (let j = 0; j < lines.length; j++) {
        const item = lines[j];
        const bulletMatch = item.match(/^\s*\*\s+(.*)/);
        listItems += `<li class="text-gray-700 dark:text-gray-300 my-1">${bulletMatch ? bulletMatch[1] : item}</li>`;
      }

      result += `<ul class="list-disc pl-5 space-y-1 my-4">${listItems}</ul>`;
      continue;
    }

    result += `<p class="text-gray-700 dark:text-gray-300 my-3">${para}</p>`;
  }

  return result;
};

export default function WellnessCheckIn() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    mood: 5,
    energy_level: 5,
    sleep_quality: 5,
    diet_level: 5,
    anxiety_level: 5,
    exercise_duration: 30,
    sleep_hours: 7.5
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    setResponse(null);
    setAlreadyLogged(false);

    const payload = {
      user_id: user.id,
      mood: Number(formData.mood),
      energy_level: Number(formData.energy_level),
      sleep_quality: Number(formData.sleep_quality),
      diet_level: Number(formData.diet_level),
      anxiety_level: Number(formData.anxiety_level),
      exercise_duration: parseInt(formData.exercise_duration, 10),
      sleep_hours: Number(formData.sleep_hours)
    };

    try {
      const res = await fetch("https://krish09bha-mindful-me.hf.space/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.status === 409) {
        setAlreadyLogged(true);
        toast.info("A log for today already exists. You can only submit once per day.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      setResponse(result);
      toast.success("Daily log submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit log. " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 p-4 sm:p-6 md:p-8 bg-transparent mt-6 sm:mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Form Section */}
      <div className="flex-1 w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-4 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 flex items-center gap-2 mb-2">
            📝 Daily Wellness Check-In
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Track your mental and physical wellbeing to receive personalized recommendations.
          </p>

          {[
            { label: "Mood", id: "mood", icon: "😊" },
            { label: "Energy Level", id: "energy_level", icon: "⚡" },
            { label: "Sleep Quality", id: "sleep_quality", icon: "😴" },
            { label: "Diet Quality", id: "diet_level", icon: "🥗" },
            { label: "Anxiety Level", id: "anxiety_level", icon: "😟" }
          ].map(({ label, id, icon }) => (
            <div key={id} className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
                <span className="flex gap-2 items-center">{icon} {label} (1-10)</span>
                <span className="text-green-700 font-bold">{formData[id]}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                className="w-full accent-green-600"
                disabled={loading || alreadyLogged}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low</span><span>High</span>
              </div>
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
              🏃‍♂️ Exercise Duration (minutes)
              <span className="text-green-700 font-bold">{formData.exercise_duration} min</span>
            </label>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={formData.exercise_duration}
              onChange={(e) => handleChange("exercise_duration", e.target.value)}
              className="w-full accent-green-600"
              disabled={loading || alreadyLogged}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 min</span><span>120 min</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
              🛏️ Sleep Hours
              <span className="text-green-700 font-bold">{formData.sleep_hours} hrs</span>
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleep_hours}
              onChange={(e) => handleChange("sleep_hours", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              disabled={loading || alreadyLogged}
            />
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-base shadow-md transition mt-6 ${loading || alreadyLogged ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={loading || alreadyLogged}
          >
            {loading ? (
              <>
                <CircularProgress size={22} color="inherit" className="mr-2" />
                Submitting...
              </>
            ) : alreadyLogged ? (
              "Already Submitted Today"
            ) : (
              "Submit Daily Log"
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      <div className="flex-1 w-full flex flex-col justify-center mt-8 lg:mt-0">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-4 sm:p-8 h-full overflow-y-auto max-h-[80vh]">
          {alreadyLogged && !response ? (
            <div className="p-4 sm:p-6 bg-yellow-50 border border-yellow-300 rounded-xl text-base text-yellow-900 shadow-inner text-center w-full">
              <span className="font-bold text-yellow-800 text-lg">A log for today already exists.</span>
              <div className="mt-2 text-yellow-700">You can only submit once per day.</div>
            </div>
          ) : response ? (
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">🧠 Personalized Feedback</h3>
              <div className="prose max-w-none prose-sm sm:prose lg:prose-lg prose-green" dangerouslySetInnerHTML={{ __html: formatFeedbackContent(response.feedback) }} />
            </div>
          ) : (
            <p className="text-gray-400 text-center">Submit your wellness check-in to receive feedback.</p>
          )}
        </div>
      </div>
    </div>
  );
}
