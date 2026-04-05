export type TaskStatus = 'pending' | 'halfway' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'urgent' | 'critical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  phase?: string;
  week?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  due_date: string; // ISO string for the day
  completed_at?: string;
  user_id?: string;
}
