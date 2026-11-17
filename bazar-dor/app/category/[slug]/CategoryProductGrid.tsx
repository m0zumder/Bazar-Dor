"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  unit: "kg" | "litre" | "dozen" | "piece";
  image: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
};

type SortOrder = "default" | "low-to-high" | "high-to-low";

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

export default function CategoryProductGrid({
  products,
}: {
  products: Product[];
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortOrder === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortOrder === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortOrder]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500">
          {sortedProducts.length}টি পণ্য
        </p>

        <label className="flex items-center gap-2 text-sm">
          <span>সাজান:</span>
          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as SortOrder)
            }
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-[#25372b] outline-none focus:border-[#4b8155]"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => {
          const changeStyle =
            product.change.dir === "up"
              ? "bg-green-50 text-green-700"
              : product.change.dir === "down"
                ? "bg-red-50 text-red-700"
                : "bg-stone-100 text-stone-500";

          const changeText =
            product.change.dir === "up"
              ? `▲ ${numberFormat.format(Math.abs(product.change.pct))}%`
              : product.change.dir === "down"
                ? `▼ ${numberFormat.format(Math.abs(product.change.pct))}%`
                : "— ০.০%";

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-24 items-center justify-center rounded-xl bg-[#f6f5ed] text-5xl">
                {product.image}
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{product.nameBn}</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {units[product.unit]}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${changeStyle}`}
                >
                  {changeText}
                </span>
              </div>

              <div className="mt-4 border-t border-stone-100 pt-3">
                <p className="text-xs text-stone-500">আজকের দাম</p>
                <p className="mt-1 text-lg font-bold">
                  {taka(product.today)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}