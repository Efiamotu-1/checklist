"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { HiCheck, HiOutlineClock, HiExclamation, HiTrash, HiCalendar } from "react-icons/hi";
import { calculateTaskPriority, formatOverdueText } from "@/lib/taskLogic";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onClick }: TaskCardProps) {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const priority = calculateTaskPriority(task);
  const isCritical = priority === "critical";
  const isUrgent = priority === "urgent";
  const isOverdue = new Date() > new Date(task.due_date);

  const toggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(task.id, { 
      status: task.status === "completed" ? "pending" : "completed",
      completed_at: task.status === "completed" ? undefined : new Date().toISOString()
    });
  };

  const toggleHalfway = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === "completed") return;
    onUpdate(task.id, { 
      status: task.status === "halfway" ? "pending" : "halfway" 
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onUpdate(task.id, { due_date: new Date(e.target.value).toISOString() });
    setIsEditingDate(false);
  };

  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-500 cursor-pointer ${
        task.status === "completed"
          ? "bg-slate-500/5 dark:bg-zinc-900/40 border-border/40 opacity-60 grayscale backdrop-blur-sm shadow-none"
          : isCritical
          ? "bg-red-500/5 dark:bg-red-950/10 border-red-500/30 dark:border-red-900/40 shadow-xl shadow-red-500/5 ring-1 ring-red-500/20"
          : "bg-surface dark:bg-zinc-900/60 border-border dark:border-zinc-800 shadow-md hover:border-accent dark:hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 backdrop-blur-md"
      }`}
    >
      <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
        {/* Main Completion Checkbox */}
        <button
          onClick={toggleComplete}
          className={`shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
            task.status === "completed"
              ? "bg-accent border-accent text-white shadow-lg shadow-accent/40"
              : "border-border dark:border-zinc-700 hover:border-accent dark:hover:border-accent hover:rotate-12"
          }`}
        >
          {task.status === "completed" && <HiCheck className="text-sm md:text-base" strokeWidth={2} />}
        </button>

        <div className="flex flex-col min-w-0 pr-4">
          <span
            className={`text-sm md:text-base font-bold truncate text-foreground transition-all ${
              task.status === "completed" ? "line-through text-muted/60" : ""
            }`}
          >
            {task.title}
          </span>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-1.5 min-w-0">
            {/* Date Display / Inline Edit */}
            {isEditingDate ? (
              <input
                type="datetime-local"
                autoFocus
                defaultValue={new Date(task.due_date).toJSON().slice(0, 16)}
                onClick={(e) => e.stopPropagation()}
                onBlur={() => setIsEditingDate(false)}
                onChange={handleDateChange}
                className="bg-surface dark:bg-zinc-800 border-border rounded-lg px-2 py-1 text-[10px] font-bold focus:ring-1 focus:ring-accent w-full sm:w-auto text-foreground"
              />
            ) : task.status === "completed" ? (
              <span className="text-[10px] font-bold text-muted flex items-center gap-1.5 uppercase tracking-wider">
                <HiCheck size={12} className="text-green-500" />
                Completed {task.completed_at && new Date(task.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingDate(true);
                }}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-colors whitespace-normal text-left ${
                  isOverdue 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-muted hover:text-accent"
                }`}
              >
                <HiCalendar size={12} className="shrink-0" />
                {formatOverdueText(task.due_date)}
              </button>
            )}

            <div className="flex items-center gap-2">
              {/* Halfway Toggle */}
              {task.status !== "completed" && (
                <button
                  onClick={toggleHalfway}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 transition-all border shrink-0 ${
                    task.status === "halfway"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 shadow-sm"
                      : "bg-background/50 dark:bg-zinc-800/80 text-muted dark:text-zinc-400 border-border dark:border-zinc-700 hover:border-accent"
                  }`}
                >
                  <HiOutlineClock size={12} /> {task.status === "halfway" ? "IN PROGRESS" : "SET PROGRESS"}
                </button>
              )}
              
              {/* Priority Badges */}
              {task.status !== "completed" && (isCritical || isUrgent) && (
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border shadow-sm shrink-0 ${
                  isCritical 
                  ? "bg-red-600 text-white border-red-700 animate-pulse" 
                  : "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                }`}>
                  <HiExclamation size={12} /> {isCritical ? "CRITICAL" : "URGENT"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="shrink-0 p-3 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:rotate-6 shadow-sm"
      >
        <HiTrash size={20} />
      </button>
    </div>
  );
}
