"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/app/lib/auth-client";

type AuthMode = "signin" | "signup";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (error) {
          toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
          return;
        }

        toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।");
        router.push("/signin");
        return;
      }

      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "একটি সমস্যা হয়েছে",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocial(provider: "google" | "github") {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Social login করা যায়নি");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Social login করা যায়নি",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-4 py-10 text-[#25372b]">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
        <Link href="/" className="text-sm text-[#4b8155] hover:underline">
          ← বাজার দরে ফিরে যান
        </Link>

        <div className="mt-7">
          <p className="text-sm font-medium text-[#4b8155]">বাজার দর</p>
          <h1 className="mt-2 text-3xl font-bold">
            {isSignup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "আপনার অ্যাকাউন্টে সাইন ইন"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            {isSignup
              ? "বাজারদর দেখতে আপনার তথ্য দিয়ে নিবন্ধন করুন।"
              : "আপনার ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {isSignup && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">নাম</span>
              <input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#4b8155]"
                placeholder="আপনার নাম"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">ইমেইল</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#4b8155]"
              placeholder="name@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">পাসওয়ার্ড</span>
            <input
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-[#4b8155]"
              placeholder="কমপক্ষে ৮ অক্ষর"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#285b3c] px-5 py-3 font-medium text-white transition hover:bg-[#1e472e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "অপেক্ষা করুন..."
              : isSignup
                ? "সাইন আপ"
                : "সাইন ইন"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          অথবা
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocial("google")}
            className="rounded-xl border border-stone-300 px-3 py-3 text-sm hover:bg-stone-50"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocial("github")}
            className="rounded-xl border border-stone-300 px-3 py-3 text-sm hover:bg-stone-50"
          >
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-stone-600">
          {isSignup ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "নতুন এখানে?"}{" "}
          <Link
            href={isSignup ? "/signin" : "/signup"}
            className="font-semibold text-[#3e704b] hover:underline"
          >
            {isSignup ? "সাইন ইন" : "সাইন আপ"}
          </Link>
        </p>
      </section>
    </main>
  );
}