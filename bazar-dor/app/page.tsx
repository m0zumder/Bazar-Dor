import Image from "next/image";
import Link from "next/link";
import { io } from "next/cache";
import { Suspense } from "react";
import AuthNavigation from "@/app/components/AuthNavigation";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: "kg" | "litre" | "dozen" | "piece";
  image: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
};

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const categories = [
  ["চাল", "chal", "🍚"],
  ["ডাল", "dal", "🫘"],
  ["সবজি", "sobji", "🥬"],
  ["মাছ", "mach", "🐟"],
  ["মাংস", "mangsho", "🍗"],
  ["ডিম-দুধ", "dim-dui", "🥚"],
  ["তেল", "tel", "🫙"],
  ["মসলা", "mosla", "🌶️"],
];

const unitNames: Record<Product["unit"], string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const numberFormat = new Intl.NumberFormat("bn-BD");

function money(value: number) {
  return `${numberFormat.format(value)} টাকা`;
}

async function CurrentDate() {
  await io();

  const date = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return <>{date}</>;
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch(API_URL, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য আনা যায়নি");
  }

  return (await response.json()) as Product[];
}

function ProductCard({ product }: { product: Product }) {
  const changeStyle =
    product.change.dir === "up"
      ? "bg-green-50 text-green-700"
      : product.change.dir === "down"
        ? "bg-red-50 text-red-600"
        : "bg-stone-100 text-stone-500";

  const changeText =
    product.change.dir === "up"
      ? `▲ ${numberFormat.format(Math.abs(product.change.pct))}%`
      : product.change.dir === "down"
        ? `▼ ${numberFormat.format(Math.abs(product.change.pct))}%`
        : "— ০.০%";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-5 flex h-24 items-center justify-center rounded-xl bg-[#f6f5ed] text-5xl">
        {product.image}
      </div>

      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-[#25372b]">{product.nameBn}</h3>
          <p className="mt-1 text-sm text-stone-500">
            {unitNames[product.unit]}
          </p>
        </div>

        <span className={`rounded-full px-2.5 py-1 text-xs ${changeStyle}`}>
          {changeText}
        </span>
      </div>

      <div className="border-t border-stone-100 pt-3">
        <p className="text-xs text-stone-500">আজকের দাম</p>
        <p className="mt-1 text-lg font-bold text-[#25372b]">
          {money(product.today)}
        </p>
      </div>
    </Link>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#25372b]">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  let products: Product[] = [];
  let hasError = false;

  try {
    products = await getProducts();
  } catch {
    hasError = true;
  }

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#25372b]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={42}
              height={42}
              priority
            />

            <span>
              <strong className="block text-xl">বাজার দর</strong>
              <span className="text-xs text-stone-500">
                <Suspense fallback="আজকের বাজারদর">
                  <CurrentDate />
                </Suspense>
              </span>
            </span>
          </Link>

          <AuthNavigation />
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4">
          {categories.map(([name, slug, icon]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="shrink-0 rounded-full bg-[#f5f4ed] px-4 py-2 text-sm hover:bg-[#e9eddf]"
            >
              {icon} {name}
            </Link>
          ))}
        </nav>
      </header>

      {products.length > 0 && (
        <div className="overflow-hidden border-b border-[#dce6d7] bg-[#eef4e9] py-3">
          <div className="ticker-track flex w-max gap-8">
            {[...products.slice(0, 12), ...products.slice(0, 12)].map(
              (product, index) => (
                <span
                  key={`${product.id}-${index}`}
                  className="whitespace-nowrap text-sm text-[#405b45]"
                >
                  {product.image} {product.nameBn} · {money(product.today)} ·{" "}
                  {product.change.dir === "up"
                    ? "▲"
                    : product.change.dir === "down"
                      ? "▼"
                      : "—"}{" "}
                  {numberFormat.format(Math.abs(product.change.pct))}%
                </span>
              ),
            )}
          </div>
        </div>
      )}

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-block rounded-full bg-[#eaf1e5] px-4 py-2 text-sm text-[#3e704b]">
            প্রতিদিনের বাজারদর, এক জায়গায়
          </span>

          <h1 className="mt-5 text-4xl leading-tight font-bold md:text-6xl">
            বাজারের সঠিক দাম
            <br />
            জানুন <span className="text-[#4b8155]">সহজেই</span>
          </h1>

          <p className="mt-5 max-w-lg leading-8 text-stone-600">
            চাল, ডাল, মাছ, মাংস আর নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম দেখুন
            এক নজরে।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-7 inline-block rounded-full bg-[#285b3c] px-6 py-3 font-medium text-white hover:bg-[#1e472e]"
          >
            সব পণ্যের দাম দেখুন ↓
          </a>
        </div>

        <div className="flex justify-center">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের পণ্যে ভরা ঝুড়ি"
            width={420}
            height={320}
            priority
            className="h-auto max-h-80 w-full max-w-md object-contain"
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        {hasError ? (
          <div className="rounded-2xl bg-red-50 p-6 text-red-700">
            পণ্যের তথ্য লোড করা যায়নি। পেজটি আবার রিফ্রেশ করে দেখুন।
          </div>
        ) : (
          <>
            <ProductSection
              title="আজ দাম বেড়েছে ▲"
              subtitle="যেসব পণ্যের দাম আজ বেড়েছে"
              products={risers}
            />

            <ProductSection
              title="আজ দাম কমেছে ▼"
              subtitle="যেসব পণ্যের দাম আজ কমেছে"
              products={fallers}
            />

            <section id="সব-পণ্য" className="scroll-mt-6 py-10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">সব পণ্য</h2>
                <p className="mt-1 text-sm text-stone-500">
                  নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-stone-600 sm:flex-row sm:justify-between">
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </main>
  );
}