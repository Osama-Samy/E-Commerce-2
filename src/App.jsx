import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HandleLottie from "./components/HandleLottie/HandleLottie";
import { ThemeProvider } from "./context/ThemeContext"; // استيراد الـ Provider
import { AllProductProvider } from "./context/AllProductContext";
import Layout from "./Layout/Layout";

// استيراد الصفحات
const Login = lazy(() => import("./pages/Login/Login"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const VerifyOTP = lazy(() => import("./pages/VerfiyOTP/VerifyOTP"));
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/CheckOut/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const WhishList = lazy(() => import("./pages/WhishList"));

const Loadable = (Component) => (props) => (
  <Suspense fallback={<HandleLottie state="secondary" />}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  // المسارات المنفصلة (بدون Layout الثيم)
  {
    path: "/login",
    element: Loadable(Login)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/register",
    element: Loadable(Login)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/forgot-password",
    element: Loadable(ForgotPassword)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/verify-otp",
    element: Loadable(VerifyOTP)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/reset-password",
    element: Loadable(ResetPassword)(),
    errorElement: <HandleLottie state="error" />,
  },

  // المسارات التي تستخدم الـ Layout المعتمد على الثيم
  {
    element: <Layout />,
    errorElement: <HandleLottie state="error" />,
    children: [
      { path: "/", element: Loadable(Home)() },
      { path: "/shop", element: Loadable(Shop)() },
      { path: "/product-details", element: Loadable(ProductDetails)() },
      { path: "/cart", element: Loadable(Cart)() },
      { path: "/checkout", element: Loadable(Checkout)() },
      { path: "/profile", element: Loadable(Profile)() },
      { path: "/orders", element: Loadable(Orders)() },
      { path: "/orders/:id", element: Loadable(OrderDetails)() },
      { path: "/wishlist", element: Loadable(WhishList)() },
    ],
  },
  { path: "*", element: <HandleLottie state="error" /> },
]);

function App() {
  // التغليف بالـ Provider هنا يضمن أن كل ما بداخل الـ Router (والـ Layout) يرى الـ Context
  return (
    <ThemeProvider>
      <AllProductProvider>
        <RouterProvider router={router} />
      </AllProductProvider>
    </ThemeProvider>
  );
}

export default App;
