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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
        >
          <HiXMark className="text-xl" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <HiShieldCheck className="text-3xl text-violet-600" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Task Intelligence</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-slate-50 mb-8 leading-tight">
          {task.title}
        </h2>

        <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-1.5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex-1 min-w-[200px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Due At</span>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50 font-bold">
              <HiCalendar className="text-violet-500" />
              {formatOverdueText(task.due_date)}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex-1 min-w-[200px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50 font-bold capitalize">
              <HiOutlineClock className="text-violet-500" />
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
