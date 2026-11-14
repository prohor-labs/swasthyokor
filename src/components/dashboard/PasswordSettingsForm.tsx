"use client";

import { useState, useTransition } from "react";
import { KeyRound, Check } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { setupUserPasswordAction } from "@/lib/actions/auth";

interface PasswordSettingsFormProps {
  hasExistingPassword: boolean;
}

export function PasswordSettingsForm({
  hasExistingPassword,
}: PasswordSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    startTransition(async () => {
      const res = await setupUserPasswordAction(formData);
      if (res.success) {
        setSuccess(
          hasExistingPassword
            ? "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।"
            : "পাসওয়ার্ড সফলভাবে সংরক্ষণ করা হয়েছে। এখন থেকে আপনি পাসওয়ার্ড দিয়েও লগইন করতে পারবেন।",
        );
        formElement.reset();
      } else {
        setError(res.error || "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে।");
      }
    });
  };

  return (
    <Card className="rounded-2xl border-border bg-card shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-emerald-600" />
          <CardTitle className="text-base font-bold">
            {hasExistingPassword ? "পাসওয়ার্ড পরিবর্তন করুন" : "পাসওয়ার্ড সেট করুন"}
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          {hasExistingPassword
            ? "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নতুন পাসওয়ার্ড দিন।"
            : "গুগল বা ম্যাজিক লিংকের পাশাপাশি সরাসরি ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করার সুবিধার্থে একটি পাসওয়ার্ড সেট করুন।"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Check className="size-4 text-emerald-600" />
            <AlertDescription className="text-xs font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <label
                htmlFor="profile-password"
                className="text-xs font-semibold text-foreground/90 block mb-1"
              >
                নতুন পাসওয়ার্ড
              </label>
              <PasswordInput
                id="profile-password"
                name="password"
                required
                minLength={6}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="rounded-xl h-10 text-sm bg-background"
              />
            </Field>

            <Field>
              <label
                htmlFor="profile-confirmPassword"
                className="text-xs font-semibold text-foreground/90 block mb-1"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <PasswordInput
                id="profile-confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                placeholder="পুনরায় লিখুন"
                className="rounded-xl h-10 text-sm bg-background"
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end pt-1">
            <SubmitButton
              isPending={isPending}
              pendingText="সংরক্ষণ হচ্ছে..."
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 cursor-pointer"
            >
              {hasExistingPassword ? "পাসওয়ার্ড পরিবর্তন করুন" : "পাসওয়ার্ড সেট করুন"}
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
