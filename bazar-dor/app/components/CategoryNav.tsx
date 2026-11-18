"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
      {categories.map(([name, slug, icon]) => {
        const isActive = pathname === `/category/${slug}`;

        return (
          <Link
            key={slug}
            href={`/category/${slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-sm ${
              isActive
                ? "bg-[#285b3c] text-white"
                : "bg-[#f5f4ed] text-[#25372b] hover:bg-[#e9eddf]"
            }`}
          >
            {icon} {name}
          </Link>
        );
      })}
    </nav>
  );
}