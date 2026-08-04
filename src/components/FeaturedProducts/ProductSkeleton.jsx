export default function ProductSkeleton({ isDarkMode, count = 4 }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`animate-pulse rounded-3xl p-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
                >
                    <div className={`mb-4 h-48 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    <div className={`mb-2 h-4 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    <div className={`h-4 w-2/3 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>
            ))}
        </div>
    );
}