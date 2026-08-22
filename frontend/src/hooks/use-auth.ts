"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth.service";
import { userService, UpdateProfileDto } from "@/lib/services/user.service";
import { useState, useEffect } from "react";
import { User } from "@/types";

export function useAuth() {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasToken = isClient ? !!authService.getToken() : false;

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      queryClient.setQueryData(["auth", "me"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const logout = () => {
    authService.logout();
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.invalidateQueries({ queryKey: ["trips"] });
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  const currentUser: User | null =
    user || (isClient ? authService.getCurrentUser() : null);

  return {
    user: currentUser,
    isAuthenticated: !!currentUser || hasToken,
    isLoading: hasToken && isLoading,
    isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
    logout,
    refetch,
  };
}
