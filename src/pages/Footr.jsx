import { FiGlobe, FiMessageCircle, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Orders", path: "/orders" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  return (
    <footer className="dark:bg-slate-900 dark:bg-white-500 text-black dark:text-white ">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-indigo-500 mb-4">ShopWise</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-7 max-w-sm mx-auto sm:mx-0">
              Shop the future, delivered today. Premium products at the best prices with fast delivery across Egypt.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-1 text-gray-600 dark:text-gray-400 justify-items-center">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-indigo-500 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-5">
              Follow Us
            </h3>

            <div className="flex justify-center gap-4">
              <button className="w-11 h-11 rounded-full border border-gray-600 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-500 transition duration-300">
                <FiGlobe size={20} />
              </button>

              <button className="w-11 h-11 rounded-full border border-gray-600 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-500 transition duration-300">
                <FiMessageCircle size={20} />
              </button>

              <button className="w-11 h-11 rounded-full border border-gray-600 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition duration-300">
                <FiHeart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base py-5 px-4">
          © 2026 <span className="text-indigo-500 font-semibold">ShopWise</span>.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}