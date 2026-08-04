import { useTheme } from '../context/ThemeContext';

export default function PlaceholderPage({ title, taskOwner }) {
    const { isDarkMode } = useTheme();

    return (
        <section className={`flex min-h-[70vh] items-center justify-center px-4 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <div className="text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
                    {title}
                </p>
                <h1 className="text-3xl font-bold sm:text-4xl">{taskOwner} TASK</h1>
                <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    This page is assigned to the team and will be implemented soon.
                </p>
            </div>
        </section>
    );
}