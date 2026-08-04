import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../pages/Header";
import Footr from "../pages/Footr";
import { useEffect, useState } from "react";
import "./Layout.css";
import BackToUp from "@uiw/react-back-to-top";
import { FaArrowUp } from "react-icons/fa";
import api from "../api/api.jsx";
import { ToastContainer, toast } from "react-toastify";
import { BiErrorCircle } from "react-icons/bi"; // Import this
import HandleLottie from "../components/HandleLottie/HandleLottie.jsx";
export default function Layout() {
  useTheme();

  const [size, setSize] = useState(50);
  const [iconSize, setIconSize] = useState(24); // Fixed typo: setILogin -> setIsLogin
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleProfile_Login = async () => {
    try {
      setLoading(true);
      setIsError(false);
      const userToken = localStorage.getItem("userToken");

      if (userToken) {
        let response = await api.get("auth/me");
        if (response.data.success) {
          localStorage.setItem(
            "username",
            JSON.stringify(response.data.user.username || "_"),
          );
          localStorage.setItem("isLogin", JSON.stringify(true));
          
          window.dispatchEvent(new Event("storage"));
          
        
        }
      } else {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("username");
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
      }
    } catch (error) {
      setIsError(true);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("username");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      toast.error(error.response?.data?.message || "Failed. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleProfile_Login();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize;
      let newIconSize;

      if (width < 480) {
        newSize = 38;
        newIconSize = 18;
      } else if (width < 768) {
        newSize = 44;
        newIconSize = 20;
      } else if (width < 1024) {
        newSize = 50;
        newIconSize = 24;
      } else {
        newSize = 55;
        newIconSize = 26;
      }

      setSize(newSize);
      setIconSize(newIconSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
      {loading ? (
        <div className="w-full flex flex-col justify-center items-center gap-1 min-[450px]:gap-2 py-4 min-[450px]:py-8">
          <HandleLottie state="secondary" />
        </div>
      ) : isError ? (
        <div className="w-full flex flex-col justify-center items-center gap-1 min-[450px]:gap-2 py-4 min-[450px]:py-8">
          <BiErrorCircle className="text-2xl min-[450px]:text-5xl text-rose-700" />
          <span className="capitalize text-rose-700 text-xs min-[450px]:text-lg">
            Error fetching products
          </span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs min-[450px]:text-md text-white cursor-pointer px-1.5 min-[450px]:px-3 py-1.5 min-[450px]:py-2 rounded bg-indigo-500 hover:bg-indigo-600 font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <header>
            <Header />
          </header>

          <main className="flex-1 pt-20 ">
            <Outlet />
          </main>

          <footer>
            <Footr />
          </footer>

          <BackToUp
            top={200}
            size={size}
            strokeWidth={4}
            className="my-back-to-top z-[30]"
          >
            <FaArrowUp
              style={{
                fontSize: iconSize + "px",
                color: "rgb(77, 54, 240)",
                width: iconSize + "px",
                height: iconSize + "px",
              }}
            />
          </BackToUp>
        </>
      )}
    </>
  );
}
