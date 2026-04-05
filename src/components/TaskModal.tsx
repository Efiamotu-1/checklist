import { Task } from "@/types/task";
import { HiXMark, HiShieldCheck, HiCalendar, HiOutlineClock } from "react-icons/hi2";
import { formatOverdueText } from "@/lib/taskLogic";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-2xl bg-surface dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-border dark:border-zinc-800 p-8 md:p-12 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full bg-background dark:bg-zinc-800 text-muted hover:text-red-500 transition-colors"
        >
          <HiXMark className="text-xl" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <HiShieldCheck className="text-3xl text-accent" />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted">Task Intelligence</span>
            {(task.phase || task.week) && (
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider mt-1">
                {task.phase} {task.week && `• ${task.week}`}
              </span>
            )}
          </div>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-foreground mb-6 leading-tight">
          {task.title}
        </h2>

        {task.description && (
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3">Execution Notes</span>
            <div className="bg-background/40 dark:bg-zinc-800/40 rounded-2xl border border-border p-5 max-h-[250px] overflow-y-auto custom-scrollbar">
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                {task.description}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
          <div className="flex flex-col gap-1.5 p-4 bg-background/50 dark:bg-zinc-800/50 rounded-2xl border border-border flex-1 min-w-[200px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Due At</span>
            <div className="flex items-center gap-2 text-foreground font-bold">
              <HiCalendar className="text-accent" />
              {formatOverdueText(task.due_date)}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-4 bg-background/50 dark:bg-zinc-800/50 rounded-2xl border border-border flex-1 min-w-[200px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Status</span>
            <div className="flex items-center gap-2 text-foreground font-bold capitalize">
              <HiOutlineClock className="text-accent" />
              {task.status.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay Closer */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
