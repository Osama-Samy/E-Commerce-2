import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiTruck,
  FiAward,
  FiHeadphones,
} from "react-icons/fi";

import phone from "../../imges/phone.jfif";
import watch from "../../imges/watch.jfif";
import airpods from "../../imges/airpods.jfif";
import phoneCase from "../../imges/case.jfif";

export default function HeroSection() {
  const products = [
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      price: "$999",
      oldPrice: "$1099",
      image: phone,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Apple Watch Ultra 2",
      price: "$799",
      oldPrice: "$899",
      image: watch,
      badge: "New",
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: "$249",
      oldPrice: "$299",
      image: airpods,
      badge: "Hot",
    },
    {
      id: 4,
      name: "Phone Case",
      price: "$49",
      oldPrice: "$69",
      image: phoneCase,
      badge: "Sale",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section
        className="
        relative
        pt-20
        min-h-[calc(100vh-80px)]
        overflow-hidden
        flex
        flex-col
        lg:flex-row
        items-center
        justify-center
        gap-5
        px-6
        md:px-10
        lg:px-16
        bg-gradient-to-r
        from-indigo-50
        via-white
        to-purple-50
        dark:from-black
        dark:via-gray-900
        dark:to-indigo-950
        animate-gradient
      "
      >
        {/* Animated Background */}

        <div className=" absolute inset-0 -z-10 overflow-hidden">

          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-400/30 blur-3xl animate-blob"></div>

          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-pink-400/30 blur-3xl animate-blob animation-delay-2000"></div>

          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-cyan-400/30 blur-3xl animate-blob animation-delay-4000"></div>

        </div>

        {/* Left */}

        <div className=" md:mt-15 ml-5 w-full lg:w-1/2 text-center lg:text-left dark:text-white">

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight">

            Shop the future,
            <br />
            delivered today

          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">

            Discover premium products at unbeatable prices.

          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">

            <Link to="/shop">

              <button className="group flex items-center gap-2 rounded-full border-2 border-indigo-600 px-6 py-3 text-indigo-600 transition hover:bg-indigo-600 hover:text-white">

                <span className="relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform group-hover:after:scale-x-100">

                  Shop Now

                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  className="h-4 w-4 transition group-hover:translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>

              </button>

            </Link>

            <a
              href="#categories"
              className="rounded-full bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
            >
              View Categories
            </a>

          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10 text-sm sm:text-base text-gray-600 dark:text-gray-300">

            <div className="flex items-center gap-2 hover:text-indigo-600 transition">
              <FiTruck size={20} />
              <span>Free Shipping</span>
            </div>

            <div className="flex items-center gap-2 hover:text-indigo-600 transition">
              <FiAward size={20} />
              <span>Quality Guarantee</span>
            </div>

            <div className="flex items-center gap-2 hover:text-indigo-600 transition">
              <FiHeadphones size={20} />
              <span>24/7 Support</span>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="w-full lg:w-1/2 flex justify-center">

          <div className="relative flex flex-col items-center">

            <span className="absolute top-15 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-xs sm:text-sm font-semibold z-10">
              {products[current].badge}
            </span>

            <div
              className="
              mt-6
              w-[260px]
              h-[260px]
              sm:w-[320px]
              sm:h-[320px]
              md:w-[380px]
              md:h-[380px]
              lg:w-[410px]
              lg:h-[410px]
              rounded-full
              // bg-gradient-to-br
              // from-white
              // via-indigo-50
              // to-purple-100
              // dark:from-gray-900
              // dark:via-gray-800
              // dark:to-indigo-900
              // shadow-2xl
              // flex
              // items-center
              // justify-center
            "
            >

              <img
                src={products[current].image}
                alt={products[current].name}
                className="
                w-[100px]
                h-[100px]
                sm:w-[260px]
                sm:h-[260px]
                md:w-[260px]
                md:h-[260px]
                lg:w-[300px]
                lg:h-[300px]
                object-contain
                transition-all
                duration-700
                hover:scale-105
              "
              />
<img src="" alt="" />
            </div>

            <h2 className="mt-4 text-1xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 dark:text-white">
              {products[current].name}
            </h2>

            <div className="flex items-center gap-3 mt-2">

              <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                {products[current].price}
              </span>

              <del className="text-lg text-gray-400">
                {products[current].oldPrice}
              </del>

            </div>

            <div className="flex gap-3 mt-3 pb-4">

              {products.map((_, index) => (

                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-300 rounded-full ${current === index
                      ? "w-8 h-3 bg-indigo-600"
                      : "w-3 h-3 bg-gray-300 hover:bg-indigo-400"
                    }`}
                />

              ))}

            </div>

          </div>

        </div>

      </section>

    </>
  );
}