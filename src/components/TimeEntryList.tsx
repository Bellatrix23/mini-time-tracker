import { useState, useEffect } from "react";
import type { TimeEntry } from "../types";

interface Props {
  entries: TimeEntry[]; // List of all time entries to display
  onStart: (id: string) => void; // Start timer callback
  onStop: (id: string) => void; // Stop timer callback
  onTick: (id: string) => void; // Tick callback, increments seconds elapsed
  onDelete: (id: string) => void; // Delete entry callback
  onEdit: (id: string, updated: Partial<TimeEntry>) => void; // Edit entry callback
}

// Helper to format seconds into HH:MM:SS string
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function TimeEntryList({
  entries,
  onStart,
  onStop,
  onTick,
  onDelete,
  onEdit,
}: Props) {
  // Track which entry is currently being edited and its temporary fields
  const [editId, setEditId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editH, setEditH] = useState("");
  const [editM, setEditM] = useState("");
  const [editS, setEditS] = useState("");

  // Effect to trigger onTick every second for the running timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Find the first running entry (only one allowed to run at a time)
      const running = entries.find((e) => e.isRunning);
      if (running) onTick(running.id); // Notify parent to increment secondsElapsed
    }, 1000);
    return () => clearInterval(interval); // Clean up on unmount or entries change
  }, [entries, onTick]);

  // Handle saving edits to an entry
  const handleEditSubmit = (id: string) => {
    const h = parseInt(editH) || 0;
    const m = parseInt(editM) || 0;
    const s = parseInt(editS) || 0;
    const total = h * 3600 + m * 60 + s;

    // Validation: must have non-empty task and positive time
    if (!editTask.trim() || total <= 0) {
      alert("Valid task and time required.");
      return;
    }

    // Call parent edit callback with updated data
    onEdit(id, { taskName: editTask, estimatedSeconds: total });
    setEditId(null); // Exit edit mode
  };

  return (
    <div>
      {entries.map((entry) => {
        // Calculate remaining time, negative if overtime
        const remaining = entry.estimatedSeconds - entry.secondsElapsed;
        const isOvertime = remaining < 0;

        // Format time display, prefix with "-" if overtime
        const displayTime = isOvertime
          ? `-${formatTime(-remaining)}`
          : formatTime(remaining);

        return (
          <div
            key={entry.id}
            className={`task-card ${isOvertime ? "overtime" : ""}`} // Add overtime style if needed
          >
            {editId === entry.id ? (
              // Edit mode UI
              <div
                className="flex justify-between w-full"
                style={{ alignItems: "flex-start" }}
              >
                <div className="task-info" style={{ flex: 1 }}>
                  {/* Editable task name input */}
                  <input
                    className="edit-input"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    placeholder="Task name"
                  />
                  {/* Editable time inputs */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <input
                      className="edit-input"
                      value={editH}
                      onChange={(e) => setEditH(e.target.value)}
                      placeholder="HH"
                    />
                    <input
                      className="edit-input"
                      value={editM}
                      onChange={(e) => setEditM(e.target.value)}
                      placeholder="MM"
                    />
                    <input
                      className="edit-input"
                      value={editS}
                      onChange={(e) => setEditS(e.target.value)}
                      placeholder="SS"
                    />
                  </div>
                </div>
                {/* Action buttons for save and cancel */}
                <div className="task-actions" style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleEditSubmit(entry.id)}
                    className="edit"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditId(null)} className="delete">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Normal display mode
              <div className="flex justify-between w-full">
                <div className="task-info">
                  {/* Task name */}
                  <div className="task-name">{entry.taskName}</div>
                  {/* Timer display with overtime styling */}
                  <div
                    className={`timer-display ${
                      isOvertime ? "overtime" : "normal"
                    }`}
                  >
                    {displayTime}
                  </div>
                </div>
                {/* Action buttons: start/stop, edit, delete */}
                <div className="task-actions">
                  {entry.isRunning ? (
                    <button onClick={() => onStop(entry.id)} className="stop">
                      Stop
                    </button>
                  ) : (
                    <button onClick={() => onStart(entry.id)} className="start">
                      Start
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Enter edit mode, initialize edit state with current entry data
                      setEditId(entry.id);
                      setEditTask(entry.taskName);
                      const t = entry.estimatedSeconds;
                      setEditH(Math.floor(t / 3600).toString());
                      setEditM(Math.floor((t % 3600) / 60).toString());
                      setEditS((t % 60).toString());
                    }}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button onClick={() => onDelete(entry.id)} className="delete">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
