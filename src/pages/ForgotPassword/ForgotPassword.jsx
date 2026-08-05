import useTheme from "../../customHook/useTheme.jsx";
import { useState } from "react";
import api from "../../api/api.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import ForgetPasswordImage from "../../assets/lottieFiles/Forgot Password.json";
import KodaLogo from "../../assets/images/KodaLogo2.png";
import { MdOutlineEmail } from "react-icons/md";
import { LuLoaderCircle } from "react-icons/lu";
import {
  AnimatedCircles,
  BorderCircles,
  PulsingCircles,
} from "../../components/AnimatedCircles/AnimatedCircles";

function ForgotPassword() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("you@gmail.com");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      let response = await api.post("auth/forgot-password/send-otp", {
        email: email,
      });

      if (response.data.success) {
        toast.info("Reset code sent to your email!");
        setTimeout(() => {
          navigate(`/reset-password?email=${email}`);
        }, 2500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  return (
    <section className="forgetPassword relative min-h-[100vh] overflow-hidden">
      <div className="mx-auto py-20 min-[500px]:py-24 min-[1024px]:py-30 px-0 min-[500px]:px-8 min-[800px]:px-20 min-[1200px]:px-30">
        <ToastContainer
          position="top-center"
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />
        <div className="absolute top-0 left-0 h-full w-[35%] min-[500px]:w-72 bg-blue-500/30 min-[500px]:bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 h-full w-[35%] min-[500px]:w-72 bg-cyan-500/30 min-[500px]:bg-cyan-500/20 blur-[120px]"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="loginMain flex justify-center items-center mx-auto w-[90%] min-[270px]:w-[80%] min-[500px]:w-[90%] min-[630px]:w-[80%] min-[700px]:w-[75%] min-[800px]:w-[80%] min-[900px]:w-full"
        >
          <div className="w-full shadow-lg shadow-sky-200 dark:shadow-xs dark:shadow-sky-100  grid overflow-hidden rounded-2xl min-[500px]:rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl grid-cols-1 min-[900px]:grid-cols-2">
            <div className="relative ">
              <motion.div
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                className="w-full"
              >
                <div className="w-full px-4 pt-8 pb-4 min-[500px]:px-8 min-[500px]:pt-12 min-[500px]:pb-8 min-[1024px]:py-10 min-[1024px]:px-10">
                  <form onSubmit={handleSubmit}>
                    <motion.div
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      className="mb-8 text-center"
                    >
                      <img
                        src={KodaLogo}
                        alt="Koda Logo"
                        className="mx-auto rounded-lg h-12 min-[350px]:h-14 min-[500px]:h-[70px] min-[750px]:h-[80px] min-[850px]:h-[85px] min-[900px]:h-18 w-auto dark:brightness-90"
                      />
                      <h2 className="mt-2 min-[1024px]:mt-4 text-lg min-[500px]:text-2xl min-[600px]:text-3xl font-bold text-slate-900 dark:text-white">
                        Forgot Password?
                      </h2>
                      <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs min-[500px]:text-[16px]">
                        Enter your email and we'll send you a reset code
                      </p>
                    </motion.div>

                    <motion.div
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
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
                          value={email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="text-xs min-[500px]:text-[16px] w-full rounded-lg min-[500px]:rounded-xl min-[1200px]:rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 min-[500px]:py-3 pl-7 min-[500px]:pl-11 pr-2 min-[500px]:pr-4 text-slate-900 dark:text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.button
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.15 }}
                      disabled={loading}
                      className="cursor-pointer relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md min-[500px]:rounded-lg min-[1200px]:rounded-xl px-2 min-[500px]:px-5 py-1.5 min-[500px]:py-3 text-xs min-[500px]:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 select-none bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-400 hover:shadow-[0_0_28px_rgba(6,182,212,0.35)] dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] w-full rounded-2xl text-base font-semibold"
                      type="submit"
                    >
                      {loading ? (
                        <div className="flex gap-2 items-center justify-center">
                          <LuLoaderCircle className="animate-spin text-lg" />
                          <span>Sending Code...</span>
                        </div>
                      ) : (
                        <span>Send Reset Password</span>
                      )}
                    </motion.button>

                    <motion.div
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.2 }}
                    >
                      <p className="mt-5 mb-2 min-[500px]:mt-8 text-center text-xs min-[500px]:text-sm text-slate-500 dark:text-slate-400">
                        Remember your password?
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="ml-2 text-cyan-500 hover:text-cyan-600 font-semibold transition-colors cursor-pointer text-[11px] min-[500px]:text-sm"
                        >
                          Sign in
                        </button>
                      </p>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>

            <div className="relative hidden min-[900px]:block">
              <motion.div
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                className="w-full h-full"
              >
                <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-400 text-white rounded-tr-2xl    rounded-br-2xl overflow-hidden min-h-[300px] min-[900px]:min-h-[500px] relative">
                  <AnimatedCircles count={8} baseSize={70} />
                  <BorderCircles count={10} />
                  <PulsingCircles count={8} />

                  <motion.div
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    className="relative z-20 w-full h-full flex items-center justify-center p-4"
                  >
                    <Lottie
                      loop
                      animationData={ForgetPasswordImage}
                      play
                      className="w-full h-[100%] min-[1200px]:h-[85%] object-contain"
                    />
                  </motion.div>

                  <div className="absolute bottom-[6%] min-[1200px]:bottom-[3.5%] left-0 right-0 text-center z-20 px-4">
                    <p className="text-white/80 text-xs min-[500px]:text-lg font-medium">
                      Secure password recovery
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ForgotPassword;
