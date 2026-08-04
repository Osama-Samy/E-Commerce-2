import useTheme from "../../customHook/useTheme.jsx";
import "./login.css";
import { useState } from "react";
import api from "../../api/api.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "react-lottie-player";
import LoginImage from "../../assets/lottieFiles/Green Login.json";
import RegisterImage from "../../assets/lottieFiles/sign in hover.json";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import {
  AnimatedCircles,
  BorderCircles,
  PulsingCircles,
} from "../../components/AnimatedCircles/AnimatedCircles";

function Login() {
  // dark mode or light mode by localstorage :
   useTheme();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(isLoginPage);
  const [credentials, setCredentials] = useState({
    email: "customer@gmail.com",
    password: "customer1212",
    username: "john doe",
    phone: "+201234567890",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // sign in
        let response = await api.post("auth/login", {
          email: credentials.email,
          password: credentials.password,
        });

        if (response.data.success) {
          const payload = response.data;
          const token =
            payload.token ||
            payload.data?.token ||
            payload.user?.token ||
            payload.customer?.token ||
            payload.accessToken ||
            payload.data?.accessToken ||
            payload.data?.user?.token;

          if (token) {
            localStorage.setItem("userToken", String(token));
          }

          const user =
            payload.user ||
            payload.customer ||
            payload.data?.user ||
            payload.data?.customer ||
            null;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }

          toast.info("Logged In Successfully");
          setTimeout(() => {
            navigate("/");
          }, 2500);
        }
      }  else {
        const registrationData = {
          email: credentials.email,
          password: credentials.password,
          username: credentials.username,
          phone: credentials.phone,
          timestamp: Date.now(), // لإضافة صلاحية زمنية
        };
        // sign up
        let response = await api.post("auth/register/send-otp", {
          email: credentials.email,
          password: credentials.password,
          username: credentials.username,
          phone: credentials.phone,
        });

        if (response.data.success) {
          const customer = response.data;
          console.log(customer);
          localStorage.setItem(
            "registrationData",
            JSON.stringify(registrationData),
          );
          toast.info("OTP Sent Successfully");
          setTimeout(() => {
            setIsLogin(true);
            navigate(`/verify-otp?email=${registrationData.email}`);
          }, 2500);
        }
      }
    } catch (error) {
      if (isLogin) {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Please check your credentials.",
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);

    // move of signin to signup
    if (!newIsLogin) {
      setCredentials({
        email: credentials.email,
        password: credentials.password,
        username: "john doe",
        phone: "+201234567890",
      });
    } else {
      // move of signup to signin
      setCredentials({
        email: credentials.email,
        password: credentials.password,
      });
    }
  };

  const slideVariants = {
    initial: (isLogin) => ({
      x: isLogin ? -60 : 60,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: (isLogin) => ({
      x: isLogin ? 60 : -60,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  const imageVariants = {
    initial: { scale: 0.7, opacity: 0, rotate: -5 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      scale: 0.7,
      opacity: 0,
      rotate: 5,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="login relative min-h-[100vh]">
      <div className="mx-auto py-20 min-[500px]:py-24 min-[1024px]:py-30 px-0 min-[500px]:px-8 min-[800px]:px-20 min-[1200px]:px-30">
        <ToastContainer
          position="top-center"
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />

        <div className="">
          <div className="absolute top-0 left-0 h-full w-[35%] min-[500px]:w-72 bg-blue-500/30 min-[500px]:bg-blue-500/20 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 h-full w-[35%] min-[500px]:w-72 bg-cyan-500/30 min-[500px]:bg-cyan-500/20 blur-[120px]"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="loginMain flex justify-center items-center mx-auto w-[90%] min-[270px]:w-[80%] min-[500px]:w-[90%] min-[630px]:w-[80%] min-[700px]:w-[75%] min-[800px]:w-[80%]  min-[900px]:w-full"
          >
            <div className="w-full shadow-lg shadow-sky-200 dark:shadow-xs dark:shadow-sky-100 grid overflow-hidden rounded-2xl min-[500px]:rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl  grid-cols-1 min-[900px]:grid-cols-2">
              {/* left part*/}
              <div className="order-1 lg:order-1 relative">
                <AnimatePresence mode="wait" custom={isLogin}>
                  {isLogin ? (
                    <motion.div
                      key="login-form"
                      custom={isLogin}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full"
                    >
                      <LoginForm
                        loading={loading}
                        credentials={credentials}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        toggleMode={toggleMode}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-image"
                      custom={isLogin}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full h-full hidden min-[900px]:block"
                    >
                      <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br  from-cyan-400 via-blue-600 to-cyan-400 rounded-bl-2xl rounded-tl-2xl overflow-hidden min-h-[500px]">
                        <AnimatedCircles count={6} baseSize={60} />
                        <BorderCircles count={8} />
                        <PulsingCircles count={6} />

                        <motion.div
                          variants={imageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="relative z-20 w-full h-full "
                        >
                          <Lottie
                            loop
                            animationData={RegisterImage}
                            play
                            className="w-full h-full object-contain"
                          />
                        </motion.div>
                        <div className="absolute bottom-30 left-0 right-0 text-center z-20 px-4">
                          <p className="text-white/80 text-xs min-[500px]:text-lg font-medium">
                            Join us and start your journey
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* right part */}
              <div className="order-2 lg:order-2 relative">
                <AnimatePresence mode="wait" custom={isLogin}>
                  {isLogin ? (
                    <motion.div
                      key="login-image"
                      custom={isLogin}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full h-full hidden min-[900px]:block"
                    >
                      <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-400 text-white rounded-br-2xl rounded-tr-2xl overflow-hidden min-h-[500px]">
                        <AnimatedCircles count={8} baseSize={70} />
                        <BorderCircles count={10} />
                        <PulsingCircles count={8} />

                        <motion.div
                          variants={imageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="relative z-20 w-full h-full"
                        >
                          <Lottie
                            loop
                            animationData={LoginImage}
                            play
                            className="w-full h-[100%] min-[1200px]:h-[85%] object-contain"
                          />
                        </motion.div>
                        <div className="absolute bottom-10 left-0 right-0 text-center z-20 px-4">
                          <p className="text-white/80 text-xs min-[500px]:text-lg font-medium">
                            Welcome back! Sign in to continue
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-form"
                      custom={isLogin}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full"
                    >
                      <RegisterForm
                        loading={loading}
                        credentials={credentials}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        toggleMode={toggleMode}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Login;
