import axios from "axios";


const api = axios.create({
  baseURL: "https://e-commerce-api-3wara.vercel.app/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});


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


export default api;


export async function getProducts() {
  const { data } = await api.get("/products");
  return data.products || [];
}


export const getMyOrders = () => api.get("/orders/my");
export const getMyOrderById = (id) => api.get(`/orders/my/${id}`);
export const cancelMyOrder = (id) => api.patch(`/orders/my/${id}/cancel`);