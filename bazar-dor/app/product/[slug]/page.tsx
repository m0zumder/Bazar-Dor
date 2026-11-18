import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: "kg" | "litre" | "dozen" | "piece";
  image: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
  markets: Market[];
};

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const units: Record<Product["unit"], string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const numberFormat = new Intl.NumberFormat("bn-BD");

function taka(value: number) {
  return `${numberFormat.format(value)} টাকা`;
}

async function getProduct(slug: string): Promise<Product | undefined> {
  const response = await fetch(API_URL, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  const products = (await response.json()) as Product[];
  return products.find((product) => product.slug === slug);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  redirect("/signin");
}
  const product = await getProduct(slug);

  if (!product || product.markets.length === 0) {
    notFound();
  }

  const lowest = Math.min(...product.markets.map((market) => market.min));
  const highest = Math.max(...product.markets.map((market) => market.max));
  const average = Math.round(
    product.markets.reduce(
      (sum, market) => sum + (market.min + market.max) / 2,
      0,
    ) / product.markets.length,
  );

  const changeText =
    product.change.dir === "up"
      ? `▲ ${numberFormat.format(Math.abs(product.change.pct))}%`
      : product.change.dir === "down"
        ? `▼ ${numberFormat.format(Math.abs(product.change.pct))}%`
        : "— ০.০%";

  const changeStyle =
    product.change.dir === "up"
      ? "bg-green-50 text-green-700"
      : product.change.dir === "down"
        ? "bg-red-50 text-red-700"
        : "bg-stone-100 text-stone-600";

  return (
    <main className="min-h-screen bg-[#fbfaf6] px-4 py-8 text-[#25372b]">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-[#4b8155] hover:underline">
          ← হোম পেজে ফিরুন
        </Link>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f6f5ed] text-5xl">
                {product.image}
              </div>

              <div>
                <h1 className="text-3xl font-bold">{product.nameBn}</h1>
                <p className="mt-2 text-stone-500">{units[product.unit]}</p>
                <span className="mt-3 inline-block rounded-full bg-[#eef4e9] px-3 py-1 text-sm text-[#416b48]">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f7f7f1] p-4">
              <p className="text-sm text-stone-500">আজকের দাম</p>
              <p className="mt-1 text-2xl font-bold">{taka(product.today)}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm ${changeStyle}`}
              >
                {changeText}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "সর্বনিম্ন দাম", price: lowest },
            { label: "গড় দাম", price: average },
            { label: "সর্বোচ্চ দাম", price: highest },
          ].map(({ label, price }) => (
            <div
              key={label}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <p className="text-sm text-stone-500">{label}</p>
              <p className="mt-2 text-xl font-bold">{taka(price)}</p>
              <p className="mt-1 text-xs text-stone-500">
                {units[product.unit]}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
          <p className="mt-2 text-sm text-stone-500">
            বিভিন্ন বাজারে {product.nameBn}-এর দামের পরিসর
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
            {product.markets.map((market, index) => (
              <div
                key={`${market.division}-${market.market}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 last:border-0"
              >
                <div>
                  <p className="font-medium">{market.market}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {market.division}
                  </p>
                </div>

                <p className="font-semibold">
                  {taka(market.min)} – {taka(market.max)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}