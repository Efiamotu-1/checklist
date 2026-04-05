import { Task, TaskPriority } from "@/types/task";

export function calculateTaskPriority(task: Task): TaskPriority {
  const now = new Date();
  const target = new Date(task.due_date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (task.status === 'completed') return 'low';

  // Overdue logic (The Alarmist state)
  if (diffDays >= 3) return 'critical';
  if (diffDays > 0) return 'urgent';

  // Deadline Proximity logic (Tasks due within 48 hours)
  if (diffDays >= -2 && diffDays <= 0) return 'urgent';

  // If it's a future task, we return 'medium' for UI badges 
  // to avoid alarmist red/orange badges for tasks months away.
  // We only respect 'high' if it's within the next 7 days.
  if (diffDays < -7) return 'medium';

  return task.priority;
}

export function formatOverdueText(dueDate: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  const isOverdue = now > date;

  if (!isOverdue) {
    return `Due ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }

  return `Due since ${date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}
