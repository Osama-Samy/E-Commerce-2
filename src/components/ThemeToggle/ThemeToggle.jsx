import { IoMoon } from "react-icons/io5";
import { FaSun } from "react-icons/fa6";
import useTheme from "../../customHook/useTheme.jsx";

function ThemeToggle() {
  // dark mode or light mode by localstorage :
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="fixed top-4 right-4 z-50 p-2 min-[500px]:p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all duration-300"
    >
      {isDarkMode ? (
        <FaSun
          className="text-yellow-400 hover:text-yellow-300 transition-colors min-[500px]:w-6 min-[500px]:h-6"
          style={{ filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))" }}
        />
      ) : (
        <IoMoon
          className="text-sky-500 hover:text-sky-400 transition-colors min-[500px]:w-6 min-[500px]:h-6"
          style={{ filter: "drop-shadow(0 0 8px rgba(100, 116, 139, 0.3))" }}
        />
      )}
    </button>
  );
}

export default ThemeToggle;
