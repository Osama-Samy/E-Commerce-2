import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiX,
  FiMenu,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { useAllProduct } from "../context/AllProductContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const { cart } = useCart();
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { wishlistCount } = useAllProduct();

  // Dark Mode State with LocalStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      const isLoginString = localStorage.getItem("isLogin");
      const usernameString =
        localStorage.getItem("username") ||
        localStorage.getItem("name") ||
        localStorage.getItem("userName");

      if (token) {
        let loginStatus = true;
        let username = "";

        if (isLoginString) {
          try {
            loginStatus = JSON.parse(isLoginString);
          } catch {
            loginStatus = true;
          }
        }

        if (usernameString) {
          try {
            username = usernameString.startsWith('"')
              ? JSON.parse(usernameString)
              : usernameString;
          } catch {
            username = usernameString;
          }
        }

        setIsLogin(loginStatus && !!token);
        setName(username || "User");
      } else {
        setIsLogin(false);
        setName("");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLogin(false);
      setName("");
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const handleStorageChange = (e) => {
      if (
        e.key === "userToken" ||
        e.key === "token" ||
        e.key === "isLogin" ||
        e.key === "username" ||
        e.key === "name"
      ) {
        checkLoginStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync Dark Mode with DOM and LocalStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (openSearch) searchInputRef.current?.focus();
  }, [openSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (openSearch && !searchWrapperRef.current?.contains(e.target)) {
        setOpenSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openSearch]);

  const handleProfileClick = () => {
    if (isLogin) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  return (
    <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl bg-white/95 dark:bg-[#070B1A]/95 backdrop-blur-md rounded-2xl lg:rounded-full shadow-lg dark:shadow-2xl border border-gray-200/80 dark:border-white/10 transition-all duration-300">
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base sm:text-lg md:text-xl shadow-md">
            <FiShoppingCart />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg md:text-xl leading-tight">
              ShopWise
            </h2>
            <p className="hidden sm:block text-slate-400 text-xs">
              Premium Shopping
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative pb-1 text-base xl:text-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                } after:absolute after:left-0 after:-bottom-1 after:h-[2.5px] after:w-full after:bg-indigo-500 after:rounded-full after:transition-transform after:duration-300 after:ease-in-out after:origin-left ${
                  isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Side Icons & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          {/* Search Box */}
          <div
            ref={searchWrapperRef}
            className={`flex items-center h-9 sm:h-10 md:h-11 rounded-full bg-gray-100 dark:bg-[#111827] transition-all duration-300 ease-in-out border border-gray-200 dark:border-slate-800 shrink-0 ${
              openSearch ? "w-[160px] sm:w-[240px] md:w-[280px] px-2.5 sm:px-3" : "w-9 sm:w-10 md:w-11"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenSearch((v) => !v)}
              aria-label={openSearch ? "Close search" : "Open search"}
              className="flex items-center justify-center cursor-pointer w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <FiSearch className="text-base sm:text-lg" />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className={`bg-transparent border-0 outline-none ring-0 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-gray-400 min-w-0 transition-opacity duration-200 ease-in-out ${
                openSearch ? "opacity-100 w-full ml-1" : "opacity-0 w-0 pointer-events-none"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/shop?search=${encodeURIComponent(e.target.value.trim())}`);
                  setOpenSearch(false);
                }
              }}
            />

            {openSearch && (
              <button
                type="button"
                onClick={() => setOpenSearch(false)}
                aria-label="Clear search"
                className="shrink-0 text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 cursor-pointer rounded-full bg-gray-100 dark:bg-[#111827] text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1f2937] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shrink-0"
          >
            {darkMode ? <FiMoon className="text-base sm:text-lg" /> : <FiSun className="text-base sm:text-lg text-amber-500" />}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-100 dark:bg-[#111827] text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1f2937] hover:text-pink-500 dark:hover:text-pink-400 transition-all shrink-0"
          >
            <FiHeart className="text-base sm:text-lg" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gray-100 dark:bg-[#111827] text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1f2937] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shrink-0"
          >
            <FiShoppingCart className="text-base sm:text-lg" />
            {cart.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm">
                {cart.itemCount > 99 ? "99+" : cart.itemCount}
              </span>
            )}
          </Link>

          {/* Profile / Login Button - Desktop & Tablet */}
          {isLogin ? (
            <button
              onClick={handleProfileClick}
              className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-[#111827] text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all hover:bg-gray-200 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm shrink-0"
            >
              <FaRegUser className="text-xs sm:text-sm" />
              <span className="max-w-[100px] truncate">{name || "User"}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden lg:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shrink-0"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-[#111827] text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-all shrink-0"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Collapse Box */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 dark:border-slate-800/80 rounded-b-2xl bg-white/95 dark:bg-[#070B1A]/95 ${
          menuOpen ? "max-h-[500px] opacity-100 py-4 px-4 sm:px-6" : "max-h-0 opacity-0 py-0 px-4 sm:px-6 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Profile / Login Action */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          {isLogin ? (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md"
            >
              <FaRegUser className="text-sm" />
              <span>{name || "My Account"}</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}