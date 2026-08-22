"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/schemas/auth.schema";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setSubmittedEmail(data.email);
    // Security-preserving simulated/connected reset trigger
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <AuthLayout
      heading={isSuccess ? "Check your email" : "Forgot password?"}
      subheading={
        isSuccess
          ? `We've sent password reset instructions to ${submittedEmail}`
          : "Enter your email address and we'll help you get back to your journey."
      }
      heroImage="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=85"
    >
      {isSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Reset link sent.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              If an account exists with that email address, you will receive a secure password reset link shortly.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#7C2D12] hover:bg-[#9A3412] text-white font-bold text-sm shadow-md shadow-orange-950/20 transition-all hover:scale-101 active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Log In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#7C2D12] hover:bg-[#9A3412] text-white font-bold text-sm shadow-md shadow-orange-950/20 transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                "Sending reset link..."
              ) : (
                <>
                  Send Reset Link <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
            Remember your credentials?{" "}
            <Link
              href="/login"
              className="font-bold text-[#7C2D12] hover:underline"
            >
              Back to Log In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
