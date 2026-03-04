import Image from "next/image";
import Link from "next/link";
import { CATALOG_TEMPLATES } from "@/lib/catalog-templates";


const CATEGORIES = [
  { label: "All Designs", icon: "grid_view" },
  { label: "Wedding", icon: "favorite" },
  { label: "Corporate", icon: "business_center" },
];

export default function CatalogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row max-w-[1600px] mx-auto w-full">

        {/* ── Sidebar Filter ── */}
        <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-slate-100 dark:border-slate-700 bg-background-light dark:bg-background-dark p-6 md:flex">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Filters</h3>
            <button className="text-xs font-semibold text-primary hover:underline">Reset All</button>
          </div>

          {/* Orientation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Orientation</h4>
            <div className="flex gap-2">
              <button className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-600 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50">
                <span className="material-symbols-outlined text-slate-500">crop_portrait</span>
                <span className="text-xs font-medium">Portrait</span>
              </button>
              <button className="flex-1 flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-600 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-slate-50 dark:bg-slate-900">
                <span className="material-symbols-outlined text-slate-500">crop_landscape</span>
                <span className="text-xs font-medium">Landscape</span>
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price Range</h4>
            <div className="space-y-2">
              {["Free", "Premium (Rp 100rb - Rp 200rb)", "Designer (Rp 200rb+)"].map((label, i) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked={i === 1} type="checkbox" className="size-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Style</h4>
            <div className="space-y-2">
              {["Minimalist", "Floral", "Typographic"].map((label) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="size-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mb-8 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Find your perfect invitation
              </h1>
              <p className="text-slate-500 dark:text-slate-400">Thousands of designs for every occasion.</p>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <input
                type="text"
                className="w-full rounded-xl border-none bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Search for 'Wedding', 'Summer Party', 'Gala'..."
              />
            </div>

            {/* Category pills */}
            <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {CATEGORIES.map(({ label, icon }, i) => (
                <button
                  key={label}
                  className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all ${
                    i === 0
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort bar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-900 dark:text-white font-bold">{CATALOG_TEMPLATES.length}</span> designs
            </p>
            <select className="rounded-lg border-none bg-transparent py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-900 dark:text-white focus:ring-0 cursor-pointer">
              <option>Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {CATALOG_TEMPLATES.map(({ id, title, category, price, badge, badgeColor, src }) => {
              const checkoutParams = new URLSearchParams({ templateId: id, title, price, category, img: src });
              return (
                <div key={id} className="group flex flex-col gap-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-sm transition-all group-hover:shadow-md">
                    <Image src={src} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                    {badge && (
                      <div className={`absolute right-3 top-3 rounded-md backdrop-blur px-2 py-1 text-xs font-bold shadow-sm ${badgeColor}`}>
                        {badge}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/50 opacity-0 transition-opacity group-hover:opacity-100 p-4">
                      <Link
                        href={`/catalog/preview/${id}`}
                        className="w-full rounded-lg bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg hover:bg-white transition-colors text-center"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/catalog/checkout?${checkoutParams.toString()}`}
                        className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-bold text-slate-900 shadow-lg hover:bg-primary/80 transition-colors text-center"
                      >
                        Gunakan Template
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <span className="text-sm font-semibold text-slate-500">{price}</span>
                    </div>
                    <p className="text-xs text-slate-500">{category}</p>
                    <Link
                      href={`/catalog/checkout?${checkoutParams.toString()}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">shopping_cart</span>
                      Beli Template
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
