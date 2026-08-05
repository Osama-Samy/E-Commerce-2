import { OTPInput } from "input-otp";
import useTheme from "../../customHook/useTheme.jsx";
import { useEffect, useState } from "react";
import api from "../../api/api.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import VerificationImage2 from "../../assets/lottieFiles/Enter OTP 2.json";
import KodaLogo from "../../assets/images/KodaLogo2.png";
import { LuLoaderCircle } from "react-icons/lu";
import {
  AnimatedCircles,
  BorderCircles,
  PulsingCircles,
} from "../../components/AnimatedCircles/AnimatedCircles";
import { IoArrowBack } from "react-icons/io5";
import "../ResetPassword/ResetPassword.css";
import { useOTPInput } from "../../customHook/useOTPInput.jsx";

function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const { otp, setOtp, Slot } = useOTPInput();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [registrationData, setRegistrationData] = useState(null);
  const [isLoaderCode, setIsLoaderCode] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    try {
      setIsLoaderCode(true);
      const registerdata = {
        username: registrationData.username,
        email: registrationData.email,
        password: registrationData.password,
        phone: registrationData.phone,
      };
      const response = await api.post("auth/register/send-otp", registerdata);

      if (response.data.success) {
        toast.info("New verification code sent!");
        setIsLoaderCode(true);
        setResendCooldown(60);

        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend code. Please try again.",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(emailFromUrl)) {
      toast.error("Invalid email address");
      setTimeout(() => navigate("/register"), 2500);
      return;
    }

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      let response = await api.post("auth/register/verify-otp", {
        email: emailFromUrl,
        otp: otp,
      });

      if (response.data.success) {
        toast.info("registed successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to registed . Please try again.",
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOtp("");
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!emailFromUrl) {
      toast.warning("No email found. Please try again.");
      setTimeout(() => navigate("/register"), 3000);
      return;
    }
    if (!isValidEmail(emailFromUrl)) {
      toast.error("Invalid email address");
      setTimeout(() => navigate("/register"), 3000);
      return;
    }
  }, [emailFromUrl]);

  useEffect(() => {
    const storedData = localStorage.getItem("registrationData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const isExpired = Date.now() - parsedData.timestamp > 5 * 60 * 1000;

        if (isExpired) {
          toast.error("Registration session expired. Please try again.");
          localStorage.removeItem("registrationData");
          setTimeout(() => navigate("/register"), 2000);
          return;
        }
        setRegistrationData(parsedData);
      } catch (error) {
        console.error("Error parsing registration data:", error);
        localStorage.removeItem("registrationData");
      }
    } else {
      toast.warning("No registration data found. Please register first.");
      setTimeout(() => navigate("/register"), 2000);
    }
  }, [navigate, emailFromUrl]);
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
          <div className="w-full shadow-lg shadow-sky-200 dark:shadow-xs dark:shadow-sky-100 grid overflow-hidden rounded-2xl min-[500px]:rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl grid-cols-1 min-[900px]:grid-cols-2">
            <div className="relative">
              <motion.div
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                className="w-full"
              >
                <div className="w-full px-2.5 pt-8 pb-4  min-[250px]:px-4 min-[400px]:px-8 min-[500px]:pt-12 min-[500px]:pb-8 min-[1024px]:py-10 min-[1024px]:px-10">
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
                        Verify Your Email
                      </h2>

                      <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="   absolute left-2 min-[500px]:left-6 top-3 min-[500px]:top-6  p-2 min-[500px]:p-2.5 
                         rounded-full   bg-white/80 dark:bg-slate-800/80   backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900 
                         dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800  hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md  transition-all duration-200  group"
                        aria-label="Go back"
                      >
                        <IoArrowBack className="text-xs min-[500px]:text-2xl group-hover:-translate-x-0.5 transition-transform duration-200" />
                      </button>

                      <p className="mt-2 capitalize text-slate-500 dark:text-slate-400 text-xs min-[500px]:text-[16px]">
                        We sent a 6-digit code to
                      </p>
                      <p className="mt-2 text-center text-slate-600 dark:text-slate-500 text-xs min-[500px]:text-[16px] font-medium">
                        {emailFromUrl}
                      </p>
                    </motion.div>


                    <motion.div
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ delay: 0.15 }}
                      className="mb-5"
                    >
                      <OTPInput
                        maxLength={6}
                        value={otp}
                        onChange={(newValue) => setOtp(newValue)}
                        containerClassName="group flex items-center justify-between gap-2"
                        render={({ slots }) => (
                          <>
                            <div className="flex gap-2">
                              {slots.slice(0, 3).map((slot, idx) => (
                                <Slot key={idx} {...slot} index={idx} />
                              ))}
                            </div>

                            <div className="flex items-center justify-center">
                              <div className="w-2 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                            </div>

                            <div className="flex gap-2">
                              {slots.slice(3).map((slot, idx) => (
                                <Slot
                                  key={idx + 3}
                                  {...slot}
                                  index={idx + 3}
                                  otp={otp}
                                  setOtp={setOtp}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      />
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
                          <span>verify code...</span>
                        </div>
                      ) : (
                        <span>Verify & Create Account</span>
                      )}
                    </motion.button>

                    <motion.div
                      variants={fadeVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.2 }}
                    >
                      <p className="mt-5 mb-2 min-[500px]:mt-8 text-center text-xs min-[500px]:text-sm text-slate-500 dark:text-slate-400">
                        Didn't receive the code?
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={resendCooldown > 0 || isLoaderCode}
                          className="ml-2 text-cyan-500 hover:text-cyan-600 font-semibold transition-colors cursor-pointer text-[11px] min-[500px]:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resendCooldown > 0 ? (
                            `Resend in ${resendCooldown}s`
                          ) : isLoaderCode ? (
                            <div className="flex items-center justify-center gap-0.5">
                              Resend Code is{" "}
                              <LuLoaderCircle className="animate-spin" />
                            </div>
                          ) : (
                            "Resend Code"
                          )}
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
                <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-400 text-white rounded-tr-2xl rounded-br-2xl overflow-hidden min-h-[300px] min-[900px]:min-h-[350px] relative">
                  <AnimatedCircles count={8} baseSize={70} />
                  <BorderCircles count={10} />
                  <PulsingCircles count={8} />

                  <motion.div
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4"
                  >
                    <Lottie
                      loop
                      animationData={VerificationImage2}
                      play
                      className=" w-full h-[100%] min-[1200px]:h-[85%] object-contain"
                    />
                  </motion.div>

                  <div className="absolute bottom-[6%] min-[1200px]:bottom-[3.5%] left-0 right-0 text-center z-20 px-4">
                    <p className="text-white/80 text-xs min-[500px]:text-lg font-medium">
                      Secure Registration
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

export default VerifyOTP;
