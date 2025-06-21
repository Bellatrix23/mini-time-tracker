export interface TimeEntry {
  id: string; // Unique identifier
  taskName: string; // Description/name of the task
  estimatedSeconds: number; // Expected duration for the task, in seconds
  secondsElapsed: number; // Time already spent on the task, in seconds
  isRunning: boolean; // Whether the timer is currently active for this task
  createdAt: string; // ISO string timestamp for when the entry was created
}
