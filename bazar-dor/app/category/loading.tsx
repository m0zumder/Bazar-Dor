export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] px-4 py-10">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-10 w-10 rounded-full bg-stone-200" />
        <div className="mt-4 h-8 w-48 rounded bg-stone-200" />
        <div className="mt-3 h-4 w-64 rounded bg-stone-200" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="h-24 rounded-xl bg-stone-200" />
              <div className="mt-5 h-5 w-32 rounded bg-stone-200" />
              <div className="mt-3 h-4 w-24 rounded bg-stone-200" />
              <div className="mt-5 h-6 w-28 rounded bg-stone-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}