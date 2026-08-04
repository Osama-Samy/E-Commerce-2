// src/components/LoginForm/LoginForm.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { LuEye, LuEyeOff, LuLoaderCircle } from "react-icons/lu";
import KodaLogo from "../../assets/images/KodaLogo2.png";
import { useState } from "react";

const LoginForm = ({
  loading,
  credentials,
  handleChange,
  handleSubmit,
  toggleMode,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="w-full px-4 pt-8 pb-4 min-[500px]:px-8 min-[500px]:pt-12 min-[500px]:pb-8  min-[1024px]:py-10 min-[1024px]:px-10">
      <form onSubmit={handleSubmit}>
        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mb-8 text-center"
        >
          <img
            src={KodaLogo}
            alt="Koda Logo"
            className="mx-auto rounded-lg h-12 min-[350px]:h-14 min-[500px]:h-[70px] min-[750px]:h-[80px] min-[850px]:h-[85px] min-[900px]:h-18 w-auto dark:brightness-90"
          />
          <h2 className="mt-2 min-[1024px]:mt-4 text-lg min-[500px]:text-2xl min-[600px]:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs min-[500px]:text-[16px]">
            Sign in to your account
          </p>
        </motion.div>

        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.05 }}
          className="mb-5"
        >
          <label className="mb-2 block text-xs min-[500px]:text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <div className="relative">
            <MdOutlineEmail className="absolute left-2.5 min-[500px]:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm min-[500px]:text-xl" />
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="text-xs min-[500px]:text-[16px] w-full rounded-lg min-[500px]:rounded-xl min-[1200px]:rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 min-[500px]:py-3 pl-7 min-[500px]:pl-11 pr-2 min-[500px]:pr-4 text-slate-900 dark:text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
              required
            />
          </div>
        </motion.div>

        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.1 }}
          className="mb-4 min-[500px]:mb-6"
        >
          <label className="mb-2 block text-xs min-[500px]:text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <IoLockClosedOutline className="absolute left-2.5 min-[500px]:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm min-[500px]:text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="text-xs min-[500px]:text-[16px] w-full rounded-lg min-[500px]:rounded-xl min-[1200px]:rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 min-[500px]:py-3 pl-7 min-[500px]:pl-11 pr-2 min-[500px]:pr-4 text-slate-900 dark:text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? (
                <LuEyeOff className="h-4 w-4" />
              ) : (
                <LuEye className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.1 }}
          className="mb-4 min-[500px]:mb-6"
        >
          <div className="text-right">
            <Link
              className="capitalize text-[11px] min-[500px]:text-sm text-cyan-500 hover:text-cyan-600 duration-300 transition"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        </motion.div>

        <motion.button
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.15 }}
          disabled={loading}
          className="cursor-pointer relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md min-[500px]:rounded-lg min-[1200px]:rounded-xl px-2 min-[500px]:px-5 py-1.5 min-[500px]:py-3 text-xs min-[500px]:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 select-none bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-400 hover:shadow-[0_0_28px_rgba(6,182,212,0.35)] dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] w-full rounded-2xl text-base font-semibold"
          type="submit"
        >
          {loading ? (
            <div className="flex gap-2 items-center justify-center">
              <LuLoaderCircle className="animate-spin text-lg" />
              <span>Signing In...</span>
            </div>
          ) : (
            <span>Sign In</span>
          )}
        </motion.button>

        <motion.div
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.2 }}
        >
          <p className="mt-5 mb-2 min-[500px]:mt-8 text-center text-xs min-[500px]:text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?
            <button
              type="button"
              onClick={() => {
                navigate("/register");
                toggleMode();
              }}
              className="ml-2 text-cyan-500 hover:text-cyan-600 font-semibold transition-colors cursor-pointer text-[11px] min-[500px]:text-sm"
            >
              Sign Up
            </button>
          </p>
        </motion.div>
      </form>
    </div>
  );
};

export default LoginForm;
