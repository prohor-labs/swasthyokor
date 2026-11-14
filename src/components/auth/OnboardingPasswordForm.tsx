"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import {
  setupUserPasswordAction,
  skipOnboardingAction,
} from "@/lib/actions/auth";

interface OnboardingPasswordFormProps {
  userEmail: string;
  callbackUrl: string;
}

export function OnboardingPasswordForm({
  userEmail,
  callbackUrl,
}: OnboardingPasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSkipping, startSkipping] = useTransition();

  const handleSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await setupUserPasswordAction(formData);
      if (res.success) {
        router.push(callbackUrl);
      } else {
        setError(res.error || "পাসওয়ার্ড সেট করতে সমস্যা হয়েছে।");
      }
    });
  };

  const handleSkip = () => {
    setError(null);
    startSkipping(async () => {
      await skipOnboardingAction();
      router.push(callbackUrl);
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-card border border-border rounded-2xl shadow-sm flex flex-col gap-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative size-14 overflow-hidden flex items-center justify-center">
          <Image
            src="/icon.png"
            alt="স্বাস্থ্যকর"
            width={56}
            height={56}
            className="size-full object-contain"
            priority
          />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
            <ShieldCheck className="size-4" />
            অ্যাকাউন্ট নিরাপত্তা (ঐচ্ছিক)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            একটি পাসওয়ার্ড সেট করুন
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            <span className="font-medium text-foreground">{userEmail}</span> অ্যাকাউন্টে একটি পাসওয়ার্ড সেট করলে আপনি পরবর্তীতে গুগল ছাড়াও সরাসরি ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertDescription className="text-center text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSetPassword} className="flex flex-col gap-4">
        <FieldGroup className="gap-3">
          <Field>
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground/90 block mb-1"
            >
              নতুন পাসওয়ার্ড
            </label>
            <PasswordInput
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
              className="w-full rounded-xl px-4 py-5 text-sm bg-background border-border"
            />
          </Field>

          <Field>
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-foreground/90 block mb-1"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
              className="w-full rounded-xl px-4 py-5 text-sm bg-background border-border"
            />
          </Field>
        </FieldGroup>

        <div className="flex flex-col gap-2.5 pt-2">
          <SubmitButton
            isPending={isPending}
            pendingText="সংরক্ষণ করা হচ্ছে..."
            className="w-full rounded-xl py-6 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            পাসওয়ার্ড সংরক্ষণ করুন
          </SubmitButton>

          <Button
            type="button"
            variant="ghost"
            disabled={isPending || isSkipping}
            onClick={handleSkip}
            className="w-full rounded-xl py-5 text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{isSkipping ? "এগিয়ে যাওয়া হচ্ছে..." : "এখন নয়, পরে করব"}</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
