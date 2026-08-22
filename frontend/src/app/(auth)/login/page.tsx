"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { loginSchema, LoginFormData } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      await login({
        email: data.email,
        usernameOrEmail: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please verify your credentials."
      );
    }
  };

  return (
    <AuthLayout
      heading="Welcome back."
      subheading="Continue planning your next journey."
      heroImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=85"
    >
      {serverError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              {...register("email")}
              placeholder="alex@example.com"
              autoComplete="email"
              className={`w-full pl-11 pr-4 py-3 bg-[#FAF7F5] border rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724] transition-all font-medium ${
                errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-600 font-medium pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#F95724] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`w-full pl-11 pr-11 py-3 bg-[#FAF7F5] border rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-[#F95724] transition-all font-medium ${
                errors.password ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-600 font-medium pl-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#7C2D12] hover:bg-[#9A3412] text-white font-bold text-sm shadow-md shadow-orange-950/20 transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
          >
            {isLoggingIn ? (
              "Signing in..."
            ) : (
              <>
                Log In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Social Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 tracking-wider">
            OR LOG IN WITH
          </span>
        </div>
      </div>

      {/* Social Buttons Matching Stitch Design */}
      <div className="space-y-2.5">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.66-.82 1.11-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-1 2.96 1.08.08 2.17-.53 2.83-1.31" />
          </svg>
          Continue with Apple
        </button>
      </div>

      {/* Switch to Signup */}
      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#F95724] hover:underline"
        >
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}
