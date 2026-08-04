// import axios from "axios";

// // Create an Axios instance with a base URL
// const api = axios.create({
//   baseURL: "https://e-commerce-api-3wara.vercel.app/",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   withCredentials: true, // ✅ السماح بإرسال الكوكيز
// });

// // Add an interceptor to the Axios instance
// api.interceptors.request.use(
//   (config) => {
//     // Get the user's token from local storage
//     let token = localStorage.getItem("userToken")

//     if (token) {
//      const cleanToken = token.replace(/['"]+/g, '').trim();// Remove quotes from the token
//       config.headers.Authorization = `Bearer ${cleanToken}`; // Set the Authorization header with the token
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // Products.jsx (Featured Products section) imports this named export.
// // It was missing after the merge — added here to match how CategorySection
// // already reads the same /products endpoint (data.products array).
// export async function getProducts() {
//   const { data } = await api.get("/products");
//   return data.products || [];
// }

// export default api




// //////////////////////////////////////////////////////////


import axios from "axios";

// إنشاء نسخة Axios مع الـ Base URL
const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// إضافة الـ Interceptor لإضافة التوكن تلقائياً
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (token) {
      const cleanToken = token.replace(/['"]+/g, "").trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
      config.headers.token = cleanToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// تصدير الـ api كـ default
export default api;

// تصدير دوال الـ Products
export async function getProducts() {
  const { data } = await api.get("/products");
  return data.products || [];
}

// تصدير دوال الـ Orders
export const getMyOrders = () => api.get("/orders/my");
export const getMyOrderById = (id) => api.get(`/orders/my/${id}`);
export const cancelMyOrder = (id) => api.patch(`/orders/my/${id}/cancel`);