"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import { calculateTaskPriority } from "@/lib/taskLogic";
import { useUser, useLogin, useSignup, useLogout } from "@/hooks/useAuth";
import { useTasks, useAddTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import TaskModal from "@/components/TaskModal";
import { 
  HiPlus, 
  HiShieldCheck, 
  HiOutlineFire, 
  HiOutlineSparkles, 
  HiCheck, 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiExclamationCircle, 
  HiOutlineRocketLaunch 
} from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { user, isLoading: isUserLoading, isAuthenticated } = useUser();
  const { login, isLoading: isLoggingIn } = useLogin();
  const { signup, isLoading: isSigningUp } = useSignup();
  const { logout, isLoading: isLoggingOut } = useLogout();

  // Task Mutations & Query
  const { data: tasks = [], isLoading: isTasksLoading } = useTasks(user?.id);
  const { mutate: addTaskMutation } = useAddTask();
  const { mutate: updateTaskMutation } = useUpdateTask();
  const { mutate: deleteTaskMutation } = useDeleteTask();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "halfway" | "completed">("all");
  const [filterDate, setFilterDate] = useState<"all" | "today" | string>("all");
  const [showHistory, setShowHistory] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { register, handleSubmit } = useForm();

  // Initialize dueDateTime to current time rounded to nearest 15 mins
  useEffect(() => {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toJSON().slice(0, 16);
    setDueDateTime(localISOTime);
  }, []);

  const addTask = () => {
    if (!newTaskTitle.trim() || !user) return;
    addTaskMutation({
      title: newTaskTitle,
      due_date: new Date(dueDateTime).toISOString(),
      user_id: user.id
    });
    setNewTaskTitle("");
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    if (!user) return;
    updateTaskMutation({ id, updates, user_id: user.id });
  };

  const deleteTask = (id: string) => {
    if (!user) return;
    deleteTaskMutation({ id, user_id: user.id });
  };

  // Logic Calculations
  const now = new Date();
  
  const filteredTasks = tasks.filter((task: Task) => {
    const isStatusMatch = filterStatus === "all" || task.status === filterStatus;
    if (!isStatusMatch) return false;

    const dueDate = new Date(task.due_date);
    const dueDateStr = dueDate.toLocaleDateString("en-CA");
    const todayStr = now.toLocaleDateString("en-CA");

    if (filterDate === "today") return dueDateStr === todayStr;
    if (filterDate !== "all") return dueDateStr === filterDate;
    
    return true;
  });

  const isDashboardMode = filterStatus === "all" && filterDate === "all";

  // Dashboard Categories
  const lingeringTasks = tasks.filter((t: Task) => {
    const dueDate = new Date(t.due_date);
    return t.status !== "completed" && dueDate < now && dueDate.toDateString() !== now.toDateString();
  });

  const dailyFocusTasks = tasks.filter((t: Task) => {
    const dueDate = new Date(t.due_date);
    return t.status !== "completed" && dueDate.toDateString() === now.toDateString();
  });

  const upcomingTasks = tasks.filter((t: Task) => {
    const dueDate = new Date(t.due_date);
    return t.status !== "completed" && dueDate > now && dueDate.toDateString() !== now.toDateString();
  });

  const completedToday = tasks.filter(
    (t: Task) => t.status === "completed" && new Date(t.completed_at || "").toDateString() === now.toDateString()
  );

  const completedHistory = tasks.filter(
    (t: Task) => t.status === "completed" && new Date(t.completed_at || "").toDateString() !== now.toDateString()
  );

  const integrityScore = tasks.length > 0 ? Math.round(
    ((tasks.filter((t: Task) => t.status === 'completed').length + tasks.filter((t: Task) => t.status === 'halfway').length * 0.5) / tasks.length) * 100
  ) : 0;

  // Auth Submission
  const onAuthSubmit = (data: any) => {
    if (isLoginMode) {
      login({ email: data.email, password: data.password });
    } else {
      signup({ email: data.email, password: data.password });
    }
  };

  if (!isAuthenticated && !isUserLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface dark:bg-zinc-900/60 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-border dark:border-zinc-800 shadow-2xl">
          <div className="text-center mb-10">
            <HiShieldCheck className="text-6xl text-accent mx-auto mb-6" />
            <h1 className="text-3xl font-black mb-4">Integrity System</h1>
            <p className="text-muted font-medium italic text-sm">"Integrity is doing the right thing, even when no one is watching."</p>
          </div>
          
          <form onSubmit={handleSubmit(onAuthSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                <input 
                  {...register("email", { required: true })}
                  type="email" 
                  placeholder="you@example.com"
                  className="w-full bg-background dark:bg-zinc-800/50 border border-border dark:border-zinc-700 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-accent transition-all text-foreground"
                  disabled={isLoggingIn || isSigningUp}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                <input 
                  {...register("password", { required: true })}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-background dark:bg-zinc-800/50 border border-border dark:border-zinc-700 rounded-2xl pl-12 pr-12 py-4 text-sm focus:outline-accent transition-all text-foreground"
                  disabled={isLoggingIn || isSigningUp}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors"
                >
                  {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn || isSigningUp}
              className="w-full bg-accent hover:opacity-90 text-white py-4 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-accent/20 uppercase tracking-widest text-xs"
            >
              {isLoggingIn || isSigningUp ? "Processing..." : isLoginMode ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-4">
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-[10px] font-black text-muted hover:text-accent uppercase tracking-widest transition-all"
            >
              {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (isUserLoading || (isAuthenticated && isTasksLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <HiShieldCheck className="text-5xl text-accent mb-4" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Syncing Integrity Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-500 overflow-x-hidden p-4 md:p-12 text-foreground">
      <div className="max-w-4xl mx-auto py-6 md:py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <HiShieldCheck className="text-accent text-2xl md:text-3xl" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                Integrity Dashboard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              Integrity System
            </h1>
            <p className="mt-2 md:mt-4 text-muted font-medium text-base md:text-lg max-w-md">
              Maintain integrity by completing tasks before their deadlines.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center justify-between md:justify-start gap-4 md:gap-6 bg-surface p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-xl shadow-accent/5 dark:shadow-none backdrop-blur-xl">
               <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-1">
                    Integrity Rating
                  </span>
                  <div className={`text-2xl md:text-4xl font-black ${integrityScore > 75 ? 'text-green-500' : 'text-accent'}`}>
                    {integrityScore}%
                  </div>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 bg-background dark:bg-zinc-800/50 rounded-xl md:rounded-2xl flex items-center justify-center text-accent">
                  <HiOutlineSparkles className="text-xl md:text-2xl" />
               </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated && (
                <button 
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="text-[10px] font-black text-muted hover:text-red-500 uppercase tracking-widest transition-all p-2 disabled:opacity-50"
                >
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Simplified Input area with Date/Time selection */}
        <section className="mb-10">
          <div className="flex flex-col gap-3 md:gap-4 bg-surface p-4 rounded-2xl md:rounded-3xl border-2 border-border shadow-sm backdrop-blur-sm">
            <div className="relative flex-1">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="What focus task needs doing?"
                className="w-full h-10 md:h-12 pl-10 md:pl-12 pr-4 bg-transparent border-none focus:outline-none text-base md:text-xl font-medium text-foreground dark:text-zinc-50"
              />
              <HiPlus className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted text-xl md:text-2xl" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t border-border pt-3 md:pt-4 px-1 md:px-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Due At:</span>
                <input
                  type="datetime-local"
                  value={dueDateTime}
                  min={new Date().toLocaleDateString('sv') + 'T' + new Date().toLocaleTimeString('sv').slice(0, 5)}
                  onChange={(e) => setDueDateTime(e.target.value)}
                  className="bg-background dark:bg-zinc-800/50 border border-border dark:border-zinc-700 rounded-lg md:rounded-xl px-2 py-1 text-[11px] md:text-xs font-semibold text-foreground dark:text-zinc-300 focus:outline-accent"
                />
              </div>
              <div className="flex-1" />
              <button
                onClick={addTask}
                className="w-full sm:w-auto bg-accent hover:opacity-90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20"
              >
                ADD TASK
              </button>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="mb-12 flex flex-col gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest mr-2 shrink-0">Status:</span>
            {(["all", "halfway", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${
                  filterStatus === status
                    ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                    : "bg-surface text-muted border-border hover:border-accent"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest mr-2 shrink-0">Dates:</span>
            {(["all", "today"] as const).map((date) => (
              <button
                key={date}
                onClick={() => setFilterDate(date)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${
                  filterDate === date
                    ? "bg-foreground text-background border-foreground shadow-lg shadow-accent/10"
                    : "bg-surface text-muted border-border hover:border-accent"
                }`}
              >
                {date}
              </button>
            ))}
            
            <div className="h-6 w-[1px] bg-border mx-1 shrink-0" />
            
            <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-2 shrink-0 group focus-within:border-accent transition-all hover:border-accent cursor-pointer">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">On:</span>
              <input 
                type="date"
                value={filterDate !== "all" && filterDate !== "today" ? filterDate : ""}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent border-none text-[12px] font-bold text-foreground focus:ring-0 p-0 h-6 leading-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        <div className="space-y-12 md:space-y-20">
          {isDashboardMode ? (
            <>
              {/* Top Priority: Lingering Concerns */}
              {lingeringTasks.length > 0 && (
                <section className="bg-red-500/5 dark:bg-red-900/5 p-4 md:p-8 rounded-[2rem] border border-red-500/10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl md:text-2xl font-black text-red-600 dark:text-red-400 animate-pulse flex items-center gap-3">
                      Lingering Concerns <HiExclamationCircle className="text-red-500" />
                    </h2>
                    <span className="text-[10px] md:text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-3 md:px-4 py-1.5 rounded-full border border-red-200 dark:border-red-800">
                      {lingeringTasks.length} OVERDUE
                    </span>
                  </div>
                  <div className="space-y-4">
                    {lingeringTasks.map((task: Task) => (
                      <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onClick={() => setSelectedTask(task)} />
                    ))}
                  </div>
                </section>
              )}

              {/* Core Mission: Daily Focus */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-3">
                    Daily Focus <HiOutlineFire className="text-orange-500" />
                  </h2>
                  <span className="text-[10px] md:text-xs font-bold text-muted bg-surface px-3 md:px-4 py-1.5 rounded-full border border-border uppercase tracking-widest">
                    Today
                  </span>
                </div>
                <div className="space-y-4">
                  {dailyFocusTasks.length > 0 ? (
                    dailyFocusTasks.map((task: Task) => (
                      <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onClick={() => setSelectedTask(task)} />
                    ))
                  ) : (
                    <div className="p-12 text-center bg-surface/50 rounded-[2rem] border border-dashed border-border text-muted font-medium">
                      Your daily focus is clear. Set a mission for today.
                    </div>
                  )}
                </div>
              </section>

              {/* Future Ambition: Upcoming Missions */}
              {upcomingTasks.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
                    <h2 className="text-xl md:text-2xl font-black text-accent flex items-center gap-3">
                      Upcoming Missions <HiOutlineRocketLaunch className="text-accent" />
                    </h2>
                    <span className="text-[10px] md:text-xs font-bold text-accent bg-accent/10 px-3 md:px-4 py-1.5 rounded-full border border-accent/20">
                      {upcomingTasks.length} PLANNED
                    </span>
                  </div>
                  <div className="space-y-4">
                    {upcomingTasks.map((task: Task) => (
                      <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onClick={() => setSelectedTask(task)} />
                    ))}
                  </div>
                </section>
              )}

              {/* Succession: Completed Today */}
              {completedToday.length > 0 && (
                <section className="bg-surface p-4 md:p-8 rounded-[2rem] border border-border">
                  <h2 className="text-xl font-black text-muted mb-8 flex items-center gap-3">
                    Completed Today <HiCheck className="text-green-500" />
                  </h2>
                  <div className="space-y-3">
                    {completedToday.map((task: Task) => (
                      <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onClick={() => setSelectedTask(task)} />
                    ))}
                  </div>
                </section>
              )}

              {/* Longevity: History */}
              {completedHistory.length > 0 && (
                <section className="pt-4 border-t border-border">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-[10px] font-black text-muted hover:text-accent uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                  >
                    {showHistory ? "Hide Historical Performance" : `Show History (${completedHistory.length})`}
                  </button>
                  {showHistory && (
                    <div className="mt-8 space-y-3">
                      {completedHistory.map((task: Task) => (
                        <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onClick={() => setSelectedTask(task)} />
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          ) : (
            /* Focus View: Filtered Results */
            <section>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <h2 className="text-xl font-black text-foreground uppercase tracking-widest">
                  Focused View
                </h2>
                <span className="text-[10px] font-black text-accent bg-accent/10 px-4 py-2 rounded-full border border-accent/20 uppercase tracking-widest">
                  {filteredTasks.length} RESULTS
                </span>
              </div>
              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task: Task) => (
                    <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onClick={() => setSelectedTask(task)} />
                  ))
                ) : (
                  <div className="p-20 text-center text-muted bg-surface/50 rounded-[2rem] border border-dashed border-border">
                    No tasks found matching your filters.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      </div>
    </main>
  );
}
