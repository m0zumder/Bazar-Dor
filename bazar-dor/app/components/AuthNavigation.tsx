"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/app/lib/auth-client";

export default function AuthNavigation() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সাইন আউট হয়েছে");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন আউট করা যায়নি");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return <div className="h-10 w-28 animate-pulse rounded-full bg-stone-100" />;
  }

  if (!session?.user) {
  return (
    <div className="flex gap-2">
      <Link
        href="/signin"
        className="rounded-full px-4 py-2 text-sm text-[#25372b] hover:bg-stone-100"
      >
        সাইন ইন
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-[#285b3c] px-4 py-2 text-sm text-white hover:bg-[#1e472e]"
      >
        সাইন আপ
      </Link>
    </div>
  );
}

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="max-w-40 truncate rounded-full px-4 py-2 text-sm text-[#25372b] hover:bg-stone-100"
      >
        {session.user.name || "আমার প্রোফাইল"}
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-stone-50 disabled:opacity-60"
      >
        {isSigningOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
      </button>
    </div>
  );
}