import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-4 text-[#25372b]">
      <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-6xl font-bold text-[#4b8155]">৪০৪</p>

        <h1 className="mt-5 text-2xl font-bold">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-3 leading-7 text-stone-500">
          এই ঠিকানায় কোনো পেজ বা পণ্য নেই। ঠিকানাটি যাচাই করে আবার চেষ্টা করুন।
        </p>

        <Link
          href="/"
          className="mt-7 inline-block rounded-full bg-[#285b3c] px-6 py-3 font-medium text-white transition hover:bg-[#1e472e]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}