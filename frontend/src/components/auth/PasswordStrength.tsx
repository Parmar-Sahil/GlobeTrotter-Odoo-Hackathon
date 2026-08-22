"use client";

import React from "react";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  if (!password) return null;

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: "Weak", level: 1, color: "bg-rose-500", text: "text-rose-600" };
    if (score <= 3) return { label: "Medium", level: 2, color: "bg-amber-500", text: "text-amber-600" };
    return { label: "Strong", level: 3, color: "bg-emerald-500", text: "text-emerald-600" };
  };

  const strength = calculateStrength(password);

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="text-slate-400">Password strength:</span>
        <span className={strength.text}>{strength.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 h-1.5">
        <div className={`rounded-full transition-all duration-300 ${strength.level >= 1 ? strength.color : "bg-slate-200"}`} />
        <div className={`rounded-full transition-all duration-300 ${strength.level >= 2 ? strength.color : "bg-slate-200"}`} />
        <div className={`rounded-full transition-all duration-300 ${strength.level >= 3 ? strength.color : "bg-slate-200"}`} />
      </div>
    </div>
  );
}
