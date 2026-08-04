import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function ViewAll() {
    const { isDarkMode } = useTheme();

    return (
        <Link
            to="/shop"
            className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-nowrap text-sm font-medium transition ${isDarkMode ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
        >
            View All
        </Link>
    );
}