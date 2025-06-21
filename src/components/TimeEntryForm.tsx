import { useState, type FormEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { TimeEntry } from "../types";

interface Props {
  onAdd: (entry: TimeEntry) => void; // Function to add a new time entry, passed from parent
  setErrorMessage: Dispatch<SetStateAction<string>>; // Setter for error message in parent component
}

export default function TimeEntryForm({ onAdd, setErrorMessage }: Props) {
  // Local state to hold input values for the task and time
  const [taskName, setTaskName] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  // Handles form submission, validating and sending new entry to parent
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Parse time inputs as integers, fallback to 0 if invalid
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    // Calculate total seconds from hours, minutes, and seconds
    const totalSeconds = h * 3600 + m * 60 + s;

    // Validate task name presence
    if (!taskName.trim()) {
      setErrorMessage("Please enter a task name.");
      return; // Stop submission if no task name
    }

    // Validate that total time is more than 0
    if (totalSeconds <= 0) {
      setErrorMessage("Please enter a timeframe greater than 0.");
      return; // Stop submission if no time entered
    }

    // If valid, clear error and add task
    setErrorMessage("");

    // Call parent callback to add the new entry with generated id and timestamps
    onAdd({
      id: crypto.randomUUID(), // Unique ID for the entry
      taskName,
      estimatedSeconds: totalSeconds,
      secondsElapsed: 0, // No time spent yet
      isRunning: false, // Timer not started initially
      createdAt: new Date().toISOString(), // Timestamp of creation
    });

    // Reset form fields after successful submission
    setTaskName("");
    setHours("");
    setMinutes("");
    setSeconds("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-2 mb-2 items-end justify-center"
    >
      {/* Task name input */}
      <input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
      />
      {/* Hours input */}
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="Hours"
        min="0"
      />
      {/* Minutes input */}
      <input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        placeholder="Minutes"
        min="0"
      />
      {/* Seconds input */}
      <input
        type="number"
        value={seconds}
        onChange={(e) => setSeconds(e.target.value)}
        placeholder="Seconds"
        min="0"
      />
      {/* Submit button */}
      <button type="submit">Add Task</button>
    </form>
  );
}
