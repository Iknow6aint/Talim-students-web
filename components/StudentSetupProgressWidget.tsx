"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, Sparkles, X } from "lucide-react";
import {
  STUDENT_ONBOARDING_STEPS,
  useStudentOnboarding,
} from "@/contexts/OnboardingContext";

export default function StudentSetupProgressWidget() {
  const router = useRouter();
  const {
    phase1Completed,
    setupDismissed,
    dismissSetup,
    isFullyComplete,
    isStepComplete,
    completedCount,
    totalCount,
    progressPercent,
    isHydrated,
  } = useStudentOnboarding();

  // Don't render until context has hydrated from localStorage
  if (!isHydrated) return null;

  // Dismissed after completion — hide entirely
  if (isFullyComplete && setupDismissed) return null;

  // Phase 1 not yet done — prompt to start
  if (!phase1Completed) {
    return (
      <div className="rounded-xl bg-[#003366] p-4 text-white border border-[#002244]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Complete your student setup</p>
            <p className="text-xs text-white/70 mt-1">
              Confirm your profile details to get the most out of Talim.
            </p>
          </div>
          <button
            onClick={() => router.push("/onboarding")}
            className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#003366] hover:bg-gray-50 transition-colors"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  // All done — show dismissible success banner
  if (isFullyComplete) {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Student setup complete
              </p>
              <p className="text-xs text-gray-500 mt-1">
                You've completed all the required onboarding tasks. Welcome to
                Talim!
              </p>
            </div>
          </div>
          <button
            onClick={dismissSetup}
            className="rounded-md p-1 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // In progress — show progress bar + remaining steps
  const phase2Steps = STUDENT_ONBOARDING_STEPS.filter((s) => s.phase === 2);
  const remainingSteps = phase2Steps
    .filter((s) => !isStepComplete(s.id))
    .slice(0, 3);

  return (
    <div className="rounded-xl border border-[#F0F0F0] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#EAF2FB] text-[#003366] flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#030E18]">
              Student setup checklist
            </p>
            <p className="text-xs text-[#6F6F6F] mt-1">
              {completedCount} of {totalCount} steps complete
            </p>
          </div>
        </div>
        <span className="text-sm font-bold text-[#003366] shrink-0">
          {progressPercent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-[#F0F0F0] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#003366] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Remaining steps */}
      <div className="mt-4 space-y-2">
        {remainingSteps.map((step) => (
          <div key={step.id} className="flex items-center gap-2 text-sm">
            <Circle className="h-4 w-4 text-[#A0A0A0] shrink-0" />
            <span className="text-[#4B5563] truncate">{step.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/onboarding/setup")}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002244] transition-colors"
      >
        Continue setup <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
