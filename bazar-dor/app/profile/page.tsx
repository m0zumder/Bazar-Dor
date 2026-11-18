"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/app/lib/auth-client";

const shortcuts = [
  { icon: "🍚", title: "চাল", href: "/category/chal" },
  { icon: "🫘", title: "ডাল", href: "/category/dal" },
  { icon: "🥬", title: "সবজি", href: "/category/sobji" },
  { icon: "🐟", title: "মাছ", href: "/category/mach" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLinkingGithub, setIsLinkingGithub] = useState(false);

  async function copyEmail() {
    if (!session?.user.email) return;

    try {
      await navigator.clipboard.writeText(session.user.email);
      toast.success("ইমেইল কপি হয়েছে");
    } catch {
      toast.error("ইমেইল কপি করা যায়নি");
    }
  }

  async function handleLinkGithub() {
    setIsLinkingGithub(true);

    try {
      const { error } = await authClient.linkSocial({
        provider: "github",
        callbackURL: "/profile",
      });

      if (error) {
        toast.error(error.message || "GitHub সংযুক্ত করা যায়নি");
        setIsLinkingGithub(false);
      }
    } catch {
      toast.error("GitHub সংযুক্ত করা যায়নি");
      setIsLinkingGithub(false);
    }
  }

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
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f6f0]">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#dce9dc]" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f6f0] p-6">
        <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">🔐</div>
          <h1 className="mt-5 text-2xl font-bold text-[#25372b]">
            আগে সাইন ইন করুন
          </h1>
          <p className="mt-2 text-stone-500">
            আপনার profile দেখতে account-এ সাইন ইন করতে হবে।
          </p>
          <Link
            href="/signin"
            className="mt-6 inline-flex rounded-full bg-[#285b3c] px-6 py-3 font-medium text-white hover:bg-[#1e472e]"
          >
            সাইন ইন
          </Link>
        </section>
      </main>
    );
  }

  const name = session.user.name?.trim() || "ব্যবহারকারী";
  const email = session.user.email || "";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const completion = Math.round(
    (((name !== "ব্যবহারকারী" ? 1 : 0) + (email ? 1 : 0)) / 2) * 100,
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f5f4ed] via-[#fbfaf6] to-[#eaf2e9] px-4 py-8 text-[#25372b] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[#285b3c] hover:underline"
          >
            ← বাজার দর-এ ফিরে যান
          </Link>
          <span className="rounded-full border border-[#dce8dc] bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-[#285b3c]">
            BAZAR DOR · ACCOUNT
          </span>
        </header>

        <section className="relative overflow-hidden rounded-[2rem] bg-[#214d35] p-7 text-white shadow-xl shadow-green-950/10 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-7rem] right-1/3 h-56 w-56 rounded-full bg-[#9bc29b]/20 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-green-100">
                আপনার বাজার দর account
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                স্বাগতম, {name}!
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                আপনার account-এর তথ্য এক জায়গায় দেখুন এবং প্রতিদিনের বাজার দর
                খুঁজে নিন।
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e5efdc] text-xl font-bold text-[#285b3c] shadow-inner">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{name}</p>
                <p className="max-w-52 truncate text-sm text-green-100">
                  {email}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  account সক্রিয়
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#6b756b]">
                  ACCOUNT DETAILS
                </p>
                <h2 className="mt-1 text-2xl font-bold">প্রোফাইলের তথ্য</h2>
              </div>
              <span className="rounded-full bg-[#edf5eb] px-3 py-1.5 text-xs font-semibold text-[#285b3c]">
                {completion}% সম্পূর্ণ
              </span>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#285b3c] to-[#78a579] transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f8f7f2] p-5">
                <p className="text-sm text-stone-500">আপনার নাম</p>
                <p className="mt-2 truncate text-lg font-semibold">{name}</p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f2] p-5">
                <p className="text-sm text-stone-500">ইমেইল ঠিকানা</p>
                <p className="mt-2 truncate text-lg font-semibold">{email}</p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="mt-3 text-sm font-medium text-[#285b3c] hover:underline"
                >
                  ইমেইল কপি করুন
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-stone-300 p-5">
              <p className="font-semibold">প্রোফাইল সম্পূর্ণ করুন</p>
              <p className="mt-1 text-sm text-stone-500">
                আপনার account-এর নাম ও ইমেইল profile-এ দেখানো হচ্ছে।
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/profile/update"
                  className="inline-flex rounded-full bg-[#285b3c] px-5 py-3 font-medium text-white hover:bg-[#1e472e]"
                >
                  তথ্য পরিবর্তন
                </Link>

                <button
                  type="button"
                  onClick={handleLinkGithub}
                  disabled={isLinkingGithub}
                  className="inline-flex rounded-full border border-[#285b3c] px-5 py-3 font-medium text-[#285b3c] hover:bg-[#edf5eb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLinkingGithub
                    ? "GitHub সংযুক্ত হচ্ছে…"
                    : "GitHub account সংযুক্ত করুন"}
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#6b756b]">QUICK LINKS</p>
              <h2 className="mt-1 text-xl font-bold">বাজার ঘুরে দেখুন</h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {shortcuts.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-2xl bg-[#f8f7f2] p-4 transition hover:-translate-y-0.5 hover:bg-[#edf5eb]"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="mt-2 block font-semibold">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs text-stone-500">
                      দাম দেখুন →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="font-bold">Account থেকে বের হবেন?</h2>
              <p className="mt-1 text-sm text-stone-500">
                পরে আবার সাইন ইন করে profile দেখতে পারবেন।
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="mt-4 w-full rounded-full border border-red-200 px-5 py-3 font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                {isSigningOut ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
              </button>
            </section>
          </aside>
        </div>

        <footer className="py-8 text-center text-sm text-stone-500">
          বাজার দর · প্রতিদিনের বাজারদর, এক জায়গায়
        </footer>
      </div>
    </main>
  );
}