import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login as loginApi, signup as signupApi, logout as logoutApi, getCurrentUser } from "@/services/apiAuth";
import { toast } from "react-hot-toast";

// 1. Hook to get the current user session
export function useUser() {
  const { isLoading, data: user, error } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity, // Keep the user in cache forever until logout
  });

  return { isLoading, user, isAuthenticated: user?.role === "authenticated", error };
}

// 2. Hook to handle Login
export function useLogin() {
  const queryClient = useQueryClient();

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: ({ email, password }: any) => loginApi({ email, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      toast.success("Identity verified. Welcome back.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to sign in.");
    },
  });

  return { login, isLoading };
}

// 3. Hook to handle Signup
export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: ({ email, password }: any) => signupApi({ email, password }),
    onSuccess: () => {
      toast.success("Account created! You can now sign in.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create account.");
    },
  });

  return { signup, isLoading };
}

// 4. Hook to handle Logout
export function useLogout() {
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries(); // Clear all user data from cache
      toast.success("Signed out securely.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to sign out.");
    },
  });

  return { logout, isLoading };
}
