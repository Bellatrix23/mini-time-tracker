import { useState, useEffect } from "react";
import type { TimeEntry } from "../types";

interface Props {
  entries: TimeEntry[];
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onTick: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updated: Partial<TimeEntry>) => void;
}

// Helper to format seconds into HH:MM:SS
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
  // State for currently edited entry ID and its input fields
  const [editId, setEditId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState("");
  const [editH, setEditH] = useState("");
  const [editM, setEditM] = useState("");
  const [editS, setEditS] = useState("");
  const [editError, setEditError] = useState("");

  // Effect for ticking the running timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const running = entries.find((e) => e.isRunning);
      if (running) onTick(running.id);
    }, 1000);
    return () => clearInterval(interval);
  }, [entries, onTick]);

  // Validate and submit edits for a task entry
  const handleEditSubmit = (id: string) => {
    const h = parseInt(editH) || 0;
    const m = parseInt(editM) || 0;
    const s = parseInt(editS) || 0;
    const total = h * 3600 + m * 60 + s;

    // Validate task name presence
    if (!editTask.trim()) {
      setEditError("Please enter a task name.");
      return;
    }

    // Validate that total time is more than 0
    if (total <= 0) {
      setEditError("Please enter a timeframe greater than 0.");
      return;
    }

    // Call parent to update entry, then clear editing state
    onEdit(id, { taskName: editTask, estimatedSeconds: total });
    setEditId(null);
    setEditError("");
  };

  return (
    <div>
      {entries.map((entry) => {
        const remaining = entry.estimatedSeconds - entry.secondsElapsed;
        const isOvertime = remaining < 0;
        const displayTime = isOvertime
          ? `-${formatTime(-remaining)}`
          : formatTime(remaining);

        return (
          <div
            key={entry.id}
            className={`task-card ${isOvertime ? "overtime" : ""}`}
          >
            {editId === entry.id ? (
              <div
                className="flex justify-between w-full"
                style={{ alignItems: "flex-start" }}
              >
                <div className="task-info" style={{ flex: 1 }}>
                  {/* Task name edit input */}
                  <input
                    className="edit-input"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    placeholder="Task name"
                  />
                  {/* Time edit inputs */}
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
                  {/* Inline edit validation error */}
                  {editError && (
                    <div className="text-red-400 font-medium text-sm mt-2">
                      {editError}
                    </div>
                  )}
                </div>
                {/* Action buttons for editing */}
                <div className="task-actions" style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleEditSubmit(entry.id)}
                    className="edit"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditError("");
                    }}
                    className="delete"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display task info and controls when not editing
              <div className="flex justify-between w-full">
                <div className="task-info">
                  <div className="task-name">{entry.taskName}</div>
                  <div
                    className={`timer-display ${
                      isOvertime ? "overtime" : "normal"
                    }`}
                  >
                    {displayTime}
                  </div>
                </div>
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
                      // Populate edit form with existing entry data
                      setEditId(entry.id);
                      setEditTask(entry.taskName);
                      const t = entry.estimatedSeconds;
                      setEditH(Math.floor(t / 3600).toString());
                      setEditM(Math.floor((t % 3600) / 60).toString());
                      setEditS((t % 60).toString());
                      setEditError("");
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
