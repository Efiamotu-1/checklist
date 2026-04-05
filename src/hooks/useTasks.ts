import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types/task";
import { toast } from "react-hot-toast";

export function useTasks(userId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log("Fetching tasks for user:", userId);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Fetch tasks error:", error);
        throw error;
      }
      return data as Task[];
    },
    enabled: !!userId,
  });
}

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, due_date, user_id, phase, week, description }: any) => {
      console.log("Adding task for user:", user_id, { title, due_date, phase, week });
      const { data, error } = await supabase
        .from("tasks")
        .insert({ 
          title, 
          due_date, 
          user_id, 
          phase, 
          week, 
          description,
          status: "pending", 
          priority: "medium" 
        })
        .select()
        .single();
      if (error) {
        console.error("Add task error:", error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Task added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["tasks", data.user_id] });
      toast.success("Task added to your mission.");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast.error("Failed to add task.");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates, user_id }: any) => {
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      return { id, user_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.user_id] });
    },
    onError: () => {
      toast.error("Failed to sync changes.");
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, user_id }: any) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { id, user_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.user_id] });
      toast.success("Task removed from mission.");
    },
    onError: () => {
      toast.error("Failed to delete task.");
    },
  });
}
