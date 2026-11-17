export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] px-4 py-8">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-5 w-36 rounded bg-stone-200" />

        <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-8">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-stone-200" />
            <div className="space-y-3">
              <div className="h-8 w-52 rounded bg-stone-200" />
              <div className="h-4 w-28 rounded bg-stone-200" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="h-4 w-24 rounded bg-stone-200" />
              <div className="mt-5 h-6 w-32 rounded bg-stone-200" />
            </div>
          ))}
        </div>

        <div className="mt-10 h-8 w-64 rounded bg-stone-200" />
        <div className="mt-5 h-20 rounded-2xl bg-stone-200" />
      </div>
    </main>
  );
}