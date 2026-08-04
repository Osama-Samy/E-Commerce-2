
export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}