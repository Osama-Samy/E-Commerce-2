import { Link } from "react-router-dom";


export default function CategoryCard({ title, icon: Icon, color, count, slug }) {
  return (
    <Link
      to={`/shop?category=${slug}`}
      className="
        group relative flex flex-col items-center justify-center
        overflow-hidden rounded-2xl
        border border-slate-200 dark:border-slate-700/60
        bg-white dark:bg-slate-900
        p-8 text-center
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        hover:border-slate-300 dark:hover:border-slate-600
        dark:hover:shadow-none
      "
    >
      {/* soft color glow on hover — tinted per category, very subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(180deg, ${color}14, transparent 70%)` }}
      />

      {/* icon */}
      <div
        className="
          relative mb-4 flex h-14 w-14 items-center justify-center
          rounded-2xl bg-slate-100 dark:bg-white/5
          transition-transform duration-300 group-hover:scale-105
        "
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>

      {/* title */}
      <h3 className="relative text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      {/* count */}
      <p className="relative mt-1 text-sm text-slate-400 dark:text-slate-500">
        {count} {count === 1 ? "Product" : "Products"}
      </p>
    </Link>
  );
}