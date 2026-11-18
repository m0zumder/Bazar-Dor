"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/app/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    if (name.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await authClient.updateUser({ name });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      toast.success("নাম আপডেট হয়েছে");
      router.replace("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "একটি সমস্যা হয়েছে",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fbfaf6]">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#dce9dc]" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fbfaf6] p-6">
        <section className="rounded-3xl border border-stone-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#25372b]">
            আগে সাইন ইন করুন
          </h1>
          <Link
            href="/signin"
            className="mt-5 inline-flex rounded-full bg-[#285b3c] px-6 py-3 text-white"
          >
            সাইন ইন
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f6f0] px-4 py-10 text-[#25372b]">
      <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
        <Link
          href="/profile"
          className="text-sm font-medium text-[#285b3c] hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <h1 className="mt-7 text-3xl font-bold">প্রোফাইল আপডেট</h1>
        <p className="mt-2 text-stone-500">
          আপনার account-এর নাম পরিবর্তন করুন।
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">নাম</span>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={80}
              defaultValue={session.user.name || ""}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#4b8155]"
              placeholder="আপনার নাম লিখুন"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full bg-[#285b3c] px-5 py-3 font-medium text-white hover:bg-[#1e472e] disabled:opacity-60"
          >
            {isSaving ? "আপডেট হচ্ছে…" : "তথ্য আপডেট করুন"}
          </button>
        </form>
      </section>
    </main>
  );
}