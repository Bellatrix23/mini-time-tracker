import { useState, useEffect } from "react";

interface Props {
  onSave: (entry: { taskName: string; hours: number }) => void; // Save timer data callback
}

// Format seconds to HH:MM:SS string for display
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function Timer({ onSave }: Props) {
  // State for current task name, elapsed seconds, and whether timer is running
  const [taskName, setTaskName] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // Effect to increment seconds every 1 second while timer is running
  useEffect(() => {
    if (!running) return; // Do nothing if timer not running
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval); // Cleanup interval on stop/unmount
  }, [running]);

  // Stop the timer, save the entry, reset state
  const stop = () => {
    const hours = seconds / 3600;
    if (taskName.trim()) {
      // Call onSave with task and elapsed hours (rounded to 2 decimals)
      onSave({ taskName, hours: parseFloat(hours.toFixed(2)) });
    }
    setRunning(false); // Stop timer
    setSeconds(0); // Reset seconds
    setTaskName(""); // Reset task input
  };

  return (
    <div className="p-4 border-t mt-4">
      <h2 className="text-xl font-bold mb-2">⏱️ Timer</h2>
      {/* Task name input */}
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
        className="border p-2 rounded mr-4"
      />
      {/* Timer display with pulse animation when running */}
      <span
        className={`text-2xl font-mono ${
          running ? "animate-pulse text-green-600" : "text-gray-800"
        }`}
      >
        {formatTime(seconds)}
      </span>
      <div className="mt-4">
        {!running ? (
          // Start button when timer is not running
          <button
            onClick={() => setRunning(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          // Stop and save button when timer is running
          <button
            onClick={stop}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop & Save
          </button>
        )}
      </div>
    </div>
  );
}
