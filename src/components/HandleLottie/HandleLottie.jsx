import Lottie from "react-lottie-player";
import "./HandleLottie.css";
import ErrorPageLoader from "../../assets/lottieFiles/errorLoader.json";
import { useNavigate } from "react-router-dom";
import useTheme from "../../customHook/useTheme.jsx";
function HandleLottie({ state }) {
  // dark mode or light mode by localstorage :
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  return (
    <div className=" handleLottie flex flex-col gap-2 justify-center items-center min-h-[100vh] bg-white text-slate-800 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-2 sm:px-3 md:px-4  lg:px-5">
        {state == "secondary" ? (
          <>
            <div className="relative flex flex-col items-center  ">
              <div className="relative h-16 w-16 min-[500px]:h-24 min-[500px]:w-24">
                <div className="absolute inset-0  rounded-full border-2  min-[500px]:border-4 border-slate-200 dark:border-slate-800 animate-spin  "></div>
                <div className="absolute inset-2 rounded-full border-2 min-[500px]:border-4 border-transparent border-t-cyan-500 border-r-cyan-500  animate-spin"></div>
                <div className="absolute inset-5 min-[500px]:inset-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 scale-infinite "></div>
              </div>
              <h2 className="mt-5 min-[500px]:mt-8 text-md min-[500px]:text-xl min-[500px]:text-2xl font-bold text-slate-900 dark:text-white">
                Loading Session
              </h2>
              <p className="mt-2 text-xs min-[500px]:text-sm text-slate-500 dark:text-slate-400">
                Verifying authentication...
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <div className="h-3 w-3 rounded-full bg-cyan-500 dot-1"></div>
                <div className="h-3 w-3 rounded-full bg-cyan-500 dot-2"></div>
                <div className="h-3 w-3 rounded-full bg-cyan-500 dot-3"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Lottie
              loop
              animationData={ErrorPageLoader}
              play
              className="w-[100%] min-[300px]:w-[70%]  min-[500px]:w-[50%]  min-[800px]:w-[45%]  min-[1024px]:w-[35%] mx-auto "
            />
            <p
              onClick={() => navigate("/")}
              className="text-cyan-500 capitalize  text-xs min-[230px]:text-sm min-[270px]:text-md min-[350px]:text-lg  min-[600px]:text-xl min-[900px]:text-2xl cursor-pointer text-center mx-auto"
            >
              what about going back to safity?
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default HandleLottie;
