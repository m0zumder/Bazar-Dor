export default function HomeLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#fbfaf6] text-[#25372b]">
      <header className="border-b border-stone-200 bg-white px-4 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-stone-200" />
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-stone-200" />
              <div className="h-3 w-36 rounded bg-stone-100" />
            </div>
          </div>
          <div className="h-10 w-32 rounded-full bg-stone-100" />
        </div>

        <div className="mx-auto mt-5 flex max-w-6xl gap-2 overflow-hidden">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-10 w-24 shrink-0 rounded-full bg-stone-100" />
          ))}
        </div>
      </header>

      <div className="h-11 bg-[#eef4e9]" />

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="space-y-5">
          <div className="h-9 w-52 rounded-full bg-[#eaf1e5]" />
          <div className="h-28 max-w-lg rounded-2xl bg-stone-200" />
          <div className="h-12 w-48 rounded-full bg-stone-100" />
        </div>
        <div className="mx-auto h-64 w-72 rounded-3xl bg-stone-100" />
      </section>

      <section className="mx-auto max-w-6xl space-y-5 px-4 pb-12">
        <div className="h-8 w-56 rounded bg-stone-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="h-24 rounded-xl bg-stone-100" />
              <div className="mt-5 h-5 w-32 rounded bg-stone-200" />
              <div className="mt-3 h-4 w-24 rounded bg-stone-100" />
              <div className="mt-5 h-6 w-28 rounded bg-stone-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}