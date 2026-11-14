import { redirect } from "next/navigation";
import { OnboardingPasswordForm } from "@/components/auth";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "পাসওয়ার্ড সেটআপ | স্বাস্থ্যকর",
  description: "আপনার স্বাস্থ্যকর অ্যাকাউন্টে একটি পাসওয়ার্ড সেট করুন।",
};

interface OnboardingPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { callbackUrl = "/dashboard" } = await searchParams;
  const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  return (
    <main className="w-full min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
      <OnboardingPasswordForm
        userEmail={user.email}
        callbackUrl={safeCallbackUrl}
      />
    </main>
  );
}
