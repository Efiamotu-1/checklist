import { Task, TaskPriority } from "@/types/task";

export function calculateTaskPriority(task: Task): TaskPriority {
  const now = new Date();
  const target = new Date(task.due_date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (task.status === 'completed') return 'low';

  // Urgent if overdue by 0-2 days
  if (diffDays > 0 && diffDays < 3) {
    return 'urgent';
  }
  
  // Critical if overdue by 3+ days
  if (diffDays >= 3) {
    return 'critical';
  }

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
