import { notFound } from "next/navigation";
import CategoryProductGrid from "./CategoryProductGrid";
export const instant = false;

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

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetch(
    `${API_URL}/products?category=${encodeURIComponent(slug)}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  const products = (await response.json()) as Product[];

  if (!products.length) {
    notFound();
  }

  const category = products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] px-4 py-10 text-[#25372b]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <span className="text-4xl">{category.categoryIcon}</span>
          <h1 className="mt-3 text-3xl font-bold">
            {category.categoryNameBn}
          </h1>
          <p className="mt-2 text-stone-500">
            এই বিভাগে {products.length}টি পণ্যের বাজারদর
          </p>
        </div>

        <CategoryProductGrid products={products} />
      </div>
    </main>
  );
}