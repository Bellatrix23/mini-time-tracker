import { useState, useCallback } from "react";
import TimeEntryForm from "./components/TimeEntryForm";
import TimeEntryList from "./components/TimeEntryList";
import type { TimeEntry } from "./types";

// Helper to format seconds into HH:MM:SS
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  const handleAdd = (entry: TimeEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const handleStart = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        isRunning: e.id === id,
      }))
    );
  };

  const handleStop = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRunning: false } : e))
    );
  };

  const handleTick = useCallback((id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, secondsElapsed: e.secondsElapsed + 1 } : e
      )
    );
  }, []);

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (id: string, updated: Partial<TimeEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  // Calculate total estimated and elapsed time
  const totalEstimatedSeconds = entries.reduce(
    (sum, entry) => sum + entry.estimatedSeconds,
    0
  );
  const totalElapsedSeconds = entries.reduce(
    (sum, entry) => sum + entry.secondsElapsed,
    0
  );

  const totalEstimatedFormatted = formatTime(totalEstimatedSeconds);
  const totalElapsedFormatted = formatTime(totalElapsedSeconds);

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Task Countdown Tracker
      </h1>

      <TimeEntryForm onAdd={handleAdd} />

      <TimeEntryList
        entries={entries}
        onStart={handleStart}
        onStop={handleStop}
        onTick={handleTick}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Time summaries */}
      <div
        className="mt-6 text-center font-semibold text-lg text-gray-200"
        aria-live="polite"
      >
        Total Estimated Time: {totalEstimatedFormatted}
      </div>
      <div
        className="mt-2 text-center font-semibold text-lg text-gray-200"
        aria-live="polite"
      >
        Total Actual Time Worked: {totalElapsedFormatted}
      </div>
    </div>
  );
}
