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
  // State for all time entries
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  // Global error message for the form validation
  const [errorMessage, setErrorMessage] = useState("");

  // Add new time entry to the list
  const handleAdd = (entry: TimeEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  // Start timer for the selected entry and stop others
  const handleStart = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        isRunning: e.id === id,
      }))
    );
  };

  // Stop timer for the selected entry
  const handleStop = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRunning: false } : e))
    );
  };

  // Increment elapsed seconds every second for the running timer
  const handleTick = useCallback((id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, secondsElapsed: e.secondsElapsed + 1 } : e
      )
    );
  }, []);

  // Delete an entry from the list
  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Edit an existing entry's data
  const handleEdit = (id: string, updated: Partial<TimeEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  // Calculate total estimated and elapsed seconds for all tasks
  const totalEstimatedSeconds = entries.reduce(
    (sum, entry) => sum + entry.estimatedSeconds,
    0
  );
  const totalElapsedSeconds = entries.reduce(
    (sum, entry) => sum + entry.secondsElapsed,
    0
  );

  // Format totals into HH:MM:SS for display
  const totalEstimatedFormatted = formatTime(totalEstimatedSeconds);
  const totalElapsedFormatted = formatTime(totalElapsedSeconds);

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      {/* Main Heading */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        Task Countdown Tracker
      </h1>

      {/* Display form validation error below the heading, centered */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Form to add new task entries */}
      <TimeEntryForm onAdd={handleAdd} setErrorMessage={setErrorMessage} />

      {/* List of existing time entries with controls */}
      <TimeEntryList
        entries={entries}
        onStart={handleStart}
        onStop={handleStop}
        onTick={handleTick}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Total time summaries */}
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
