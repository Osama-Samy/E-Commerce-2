import { MdOutlinePayment, MdShoppingCartCheckout } from "react-icons/md";
import "./CheckOut.css";
import { toast, ToastContainer } from "react-toastify";
import useTheme from "../../customHook/useTheme.jsx";
import { IoLocationOutline } from "react-icons/io5";
import { RiFileTextLine } from "react-icons/ri";
import { BiErrorCircle, BiSolidShoppingBags } from "react-icons/bi";
import { useEffect, useState } from "react";
import api from "../../api/api.jsx";
import { LuLoaderCircle } from "react-icons/lu";
import { useCart } from "../../context/CartContext";

function CheckOut() {
  const { clearCart: contextClearCart } = useCart();
  const [loadingCart, setLoadingCart] = useState(false);
  const [isErrorCart, setIsErrorCart] = useState(false);
  const [orderItemsCart, setOrderItemsCart] = useState(null);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validates, setValidates] = useState(false);
  const [createOrder, setCreateOrder] = useState({
    fullName: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    paymentMethod: "cash",
    customerNote: "",
  });

  useTheme();

  const fetchItemsOfCart = async () => {
    setLoadingCart(true);
    setIsErrorCart(false);

    try {
      let response = await api.get("carts");
      if (response.data.success) {
        const OrderItems = response.data;
        setTax(Math.round((OrderItems?.subtotal || 0) * 0.14));
        setShipping(OrderItems?.subtotal > 1000 ? 0 : 50);
        setOrderItemsCart(OrderItems);
        console.log(OrderItems);
      }
    } catch (error) {
      setIsErrorCart(true);
      setOrderItemsCart(null);
      setTax(0);
      setShipping(0);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong loading your cart",
      );
      console.error("Error:", error);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchItemsOfCart();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateOrder((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];

    if (!createOrder.fullName.trim()) {
      errors.push("Full name is required");
    } else if (createOrder.fullName.trim().length < 3) {
      errors.push("Full name must be at least 3 characters");
    }

    if (!createOrder.phone.trim()) {
      errors.push("Phone number is required");
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(createOrder.phone.trim())) {
      errors.push("Please enter a valid phone number");
    }

    if (!createOrder.country.trim()) {
      errors.push("Country is required");
    }

    if (!createOrder.city.trim()) {
      errors.push("City is required");
    }

    if (!createOrder.address.trim()) {
      errors.push("Street address is required");
    } else if (createOrder.address.trim().length < 5) {
      errors.push("Address must be at least 5 characters");
    }

    return errors;
  };

  const clearCart = async () => {
    try {
      await contextClearCart();
      toast.info("Cart cleared successfully!");
      setOrderItemsCart(null);
      setTax(0);
      setShipping(50);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to clear cart");
      console.error("clear cart error:", error);
    }
  };

  const handleOrderCart = async (e) => {
    e.preventDefault();
    setValidates(true);

    if (!orderItemsCart?.items?.length) {
      toast.error("Your cart is empty. Add items before placing order.");
      return;
    }

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        shippingAddress: {
          fullName: createOrder.fullName,
          phone: createOrder.phone,
          country: createOrder.country,
          city: createOrder.city,
          address: createOrder.address,
          postalCode: createOrder.postalCode || "N/A",
        },
        paymentMethod: createOrder.paymentMethod,
        customerNote: createOrder.customerNote,
      };

      const response = await api.post("orders", orderData);
      if (response.data.success) {
        toast.info("Order placed successfully!");
        console.log(response.data);
        await contextClearCart();
      }

      setCreateOrder({
        fullName: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        postalCode: "",
        paymentMethod: "cash",
        customerNote: "",
      });
      setOrderItemsCart(null);
      setTax(0);
      setShipping(50);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to place order");
      console.error("Order error:", error);
    } finally {
      setIsSubmitting(false);
      setValidates(false);
    }
  };

  const hasError = (fieldName) => {
    if (!validates) {
      return;
    }
    const value = createOrder[fieldName];
    if (fieldName === "fullName") {
      return !value || value.trim().length < 3;
    }
    if (fieldName === "phone") {
      return !value || !/^[0-9+\-\s()]{8,15}$/.test(value.trim());
    }
    if (fieldName === "country" || fieldName === "city") {
      return !value;
    }
    if (fieldName === "address") {
      return !value || value.trim().length < 5;
    }
    return false;
  };

  return (
    <section className="checkout relative min-h-[100vh] bg-slate-100 dark:bg-slate-950 pt-24 sm:pt-28 pb-20">
      <div className="px-3 min-[450px]:px-6">
        <ToastContainer
          position="top-center"
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />
        <div className="w-full mx-auto animate-fade-in">
          <h2 className="w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent dark:text-slate-200 flex gap-0.5 items-center text-lg min-[450px]:text-3xl font-bold mb-4 min-[450px]:mb-7">
            <MdShoppingCartCheckout className="text-xl min-[450px]:text-3xl text-indigo-500 dark:text-slate-200 font-bold" />
            <span> Checkout</span>
          </h2>

          <form className="w-full" onSubmit={handleOrderCart}>
            <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-4 min-[450px]:gap-8 min-[900px]:gap-5 min-[1200px]:gap-8 ">
              <div className="col-span-1 min-[900px]:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg min-[450px]:rounded-xl border border-gray-100 dark:border-slate-700 px-2 min-[450px]:px-8 py-6 shadow">
                  <h3 className="flex gap-0.5 items-center text-[12px]  min-[450px]:text-xl rounded-sm  min-[450px]:rounded-lg font-bold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent dark:text-slate-200 mb-3 min-[450px]:mb-4">
                    <IoLocationOutline className="text-lg min-[450px]:text-2xl font-extrabold text-indigo-500" />
                    <span>Shipping Address</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-[450px]:gap-4">
                    <div className="flex flex-col gap-0.5 min-[450px]:gap-1">
                      <label className="flex gap-0.5 capitalize items-center text-xs min-[450px]:text-sm font-medium text-slate-500 mb-1 block">
                        Full Name
                        <span className="text-rose-700 mt-1.5 text-md">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full text-[10px] min-[450px]:text-sm rounded-sm min-[450px]:rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:shadow-[0_0_0_0_transparent]! focus:ring-1 focus:ring-indigo-500 border ${
                          hasError("fullName")
                            ? "border-rose-700 dark:border-rose-700"
                            : "border-gray-300 dark:border-slate-600"
                        } px-2 min-[450px]:px-4 py-2  min-[450px]:py-2.5`}
                        name="fullName"
                        value={createOrder.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ahmed Mohamed"
                      />
                      {hasError("fullName") && (
                        <span className="text-rose-700 text-xs capitalize">
                          {!createOrder.fullName
                            ? "Full name is required"
                            : "Full name must be at least 3 characters"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 min-[450px]:gap-1">
                      <label className="flex gap-0.5 items-center capitalize text-xs min-[450px]:text-sm font-medium text-slate-500 mb-1 block">
                        Phone Number
                        <span className="text-rose-700 mt-1.5 text-md">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full text-[10px] min-[450px]:text-sm rounded-sm min-[450px]:rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:shadow-[0_0_0_0_transparent]! focus:ring-1 focus:ring-indigo-500 border ${
                          hasError("phone")
                            ? "border-rose-700 dark:border-rose-700"
                            : "border-gray-300 dark:border-slate-600"
                        } px-2 min-[450px]:px-4 py-2  min-[450px]:py-2.5`}
                        name="phone"
                        value={createOrder.phone}
                        onChange={handleChange}
                        placeholder="05xxxxxxxx"
                      />
                      {hasError("phone") && (
                        <span className="text-rose-700 text-xs capitalize">
                          {!createOrder.phone
                            ? "Phone number is required"
                            : "Please enter a valid phone number"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="flex gap-0.5 items-center capitalize text-sm font-medium text-slate-500 mb-1 block">
                        Country
                        <span className="text-rose-700 mt-1.5 text-md">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full text-[10px] min-[450px]:text-sm rounded-sm min-[450px]:rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:shadow-[0_0_0_0_transparent]! focus:ring-1 focus:ring-indigo-500 border ${
                          hasError("country")
                            ? "border-rose-700 dark:border-rose-700"
                            : "border-gray-300 dark:border-slate-600"
                        } px-2 min-[450px]:px-4 py-2  min-[450px]:py-2.5`}
                        name="country"
                        value={createOrder.country}
                        onChange={handleChange}
                        placeholder="Egypt"
                      />
                      {hasError("country") && (
                        <span className="text-rose-700 text-xs capitalize">
                          Country is required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="flex gap-0.5 items-center capitalize text-xs min-[450px]:text-sm font-medium text-slate-500 mb-1 block">
                        City
                        <span className="text-rose-700 mt-1.5 text-md">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full text-[10px] min-[450px]:text-sm rounded-sm min-[450px]:rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:shadow-[0_0_0_0_transparent]! focus:ring-1 focus:ring-indigo-500 border ${
                          hasError("city")
                            ? "border-rose-700 dark:border-rose-700"
                            : "border-gray-300 dark:border-slate-600"
                        } px-2 min-[450px]:px-4 py-2  min-[450px]:py-2.5`}
                        name="city"
                        value={createOrder.city}
                        onChange={handleChange}
                        placeholder="e.g. Cairo"
                      />
                      {hasError("city") && (
                        <span className="text-rose-700 text-xs capitalize">
                          City is required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                      <label className="flex gap-0.5 items-center capitalize text-xs min-[450px]:text-sm font-medium text-slate-500 mb-1 block">
                        Street Address
                        <span className="text-rose-700 mt-1.5 text-md">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full text-[10px] min-[450px]:text-sm rounded-sm min-[450px]:rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:shadow-[0_0_0_0_transparent]! focus:ring-1 focus:ring-indigo-500 border ${
                          hasError("address")
                            ? "border-rose-700 dark:border-rose-700"
                            : "border-gray-300 dark:border-slate-600"
                        } px-2 min-[450px]:px-4 py-2  min-[450px]:py-2.5`}
                        name="address"
                        value={createOrder.address}
                        onChange={handleChange}
                        placeholder="Street, neighborhood, building number"
                      />
                      {hasError("address") && (
                        <span className="text-rose-700 text-xs capitalize">
                          {!createOrder.address
                            ? "Address is required"
                            : "Address must be at least 5 characters"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="capitalize text-xs min-[450px]:text-sm font-medium text-slate-500 mb-1 block">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="w-full text-[10px] min-[450px]:text-sm rounded-sm min-[450px]:rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:shadow-[0_0_0_0_transparent]! focus:ring-1 focus:ring-indigo-500 border border-gray-300 dark:border-slate-600 px-2 min-[450px]:px-4 py-2  min-[450px]:py-2.5"
                        name="postalCode"
                        value={createOrder.postalCode}
                        onChange={handleChange}
                        placeholder="11511 (optional)"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg min-[450px]:rounded-xl border border-gray-100 dark:border-slate-700 px-2 min-[450px]:px-8 py-4.5 min-[450px]:py-6 shadow">
                  <h3 className="flex gap-0.5 items-center text-[12px]  min-[450px]:text-xl font-bold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent dark:text-slate-200 mb-3.5 min-[450px]:mb-4">
                    <MdOutlinePayment className="text-lg min-[450px]:text-2xl  font-extrabold text-indigo-500" />
                    <span>Payment Method</span>
                  </h3>
                  <div className="bg-indigo-50 dark:bg-slate-800 ring-1 ring-indigo-500 p-5 rounded-lg flex flex-col min-[450px]:flex-row items-center gap-3">
                    <div className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-10 h-10">
                      <MdOutlinePayment className="text-xl min-[450px]:text-2xl font-extrabold text-indigo-500" />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <p className="text-[12px] min-[450px]:text-base font-semibold text-slate-800 dark:text-slate-200 text-center min-[450px]:text-start">
                        Cash on Delivery
                      </p>
                      <p className="text-xs min-[450px]:text-sm text-slate-500 text-center min-[450px]:text-start">
                        Pay in cash when your order arrives
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg min-[450px]:rounded-xl border border-gray-100 dark:border-slate-700 px-2 min-[450px]:px-8 py-4.5 min-[450px]:py-6 shadow">
                  <h3 className="flex gap-0.5 items-center text-[12px]  min-[450px]:text-xl font-bold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent dark:text-slate-200 mb-3.5 min-[450px]:mb-4">
                    <RiFileTextLine className="text-lg min-[450px]:text-2xl font-extrabold text-indigo-500" />
                    <span>Order Notes (Optional)</span>
                  </h3>
                  <textarea
                    name="customerNote"
                    value={createOrder.customerNote}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special instructions for your order..."
                    className="w-full text-[10px] min-[450px]:text-base border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 min-[450px]:px-4 py-1.5 min-[450px]:py-3 text-sm placeholder:text-gray-400"
                  ></textarea>
                </div>
              </div>

              <div className="col-span-1 bg-white dark:bg-slate-800 rounded-lg min-[450px]:rounded-xl border border-gray-100 dark:border-slate-700 px-2 min-[450px]:px-8 py-4.5 min-[450px]:py-6 shadow sticky top-6 h-fit">
                <h3 className="flex gap-0.5 items-center text-[12px]  min-[450px]:text-xl  font-bold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent dark:text-slate-200 mb-3.5 min-[450px]:mb-4">
                  <BiSolidShoppingBags className="text-lg min-[450px]:text-2xl font-extrabold text-indigo-500" />
                  <span>Order Summary</span>
                </h3>

                {loadingCart ? (
                  <div className="w-full flex flex-col justify-center items-center gap-1 min-[450px]:gap-2 py-4 min-[450px]:py-8">
                    <LuLoaderCircle className="text-3xl min-[450px]:text-5xl text-indigo-500 animate-spin" />
                    <span className="capitalize text-sm min-[450px]:text-lg text-slate-500">
                      Loading cart items...
                    </span>
                  </div>
                ) : isErrorCart ? (
                  <div className="w-full flex flex-col justify-center items-center gap-1 min-[450px]:gap-2 py-4 min-[450px]:py-8">
                    <BiErrorCircle className="text-2xl min-[450px]:text-5xl text-rose-700" />
                    <span className="capitalize text-rose-700 text-xs min-[450px]:text-lg">
                      Error fetching products
                    </span>
                    <button
                      onClick={fetchItemsOfCart}
                      className="mt-2 text-xs min-[450px]:text-md text-white cursor-pointer px-1.5 min-[450px]:px-3 py-1.5 min-[450px]:py-2 rounded bg-indigo-500 hover:bg-indigo-600 font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orderItemsCart?.items?.length === 0 ? (
                  <div className="w-full flex flex-col justify-center items-center  gap-1 min-[450px]:gap-2 py-4 min-[450px]:py-8">
                    <BiErrorCircle className="text-2xl min-[450px]:text-5xl text-yellow-500" />
                    <span className="capitalize text-xs min-[450px]:text-lg text-slate-500">
                      Your cart is empty
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-3 max-h-72 min-[450px]:max-h-80 overflow-y-auto">
                      {orderItemsCart?.items.map((item) => (
                        <div
                          key={item._id}
                          className="w-full flex flex-row flex-wrap justify-start items-start gap-1.5 min-[450px]:gap-3 text-[10px] min-[450px]:text-sm border-b border-gray-300 dark:border-slate-700 pb-3 min-[450px]:pb-2"
                        >
                          <img
                            alt={item.name}
                            className="w-8 h-8 min-[450px]:w-10 min-[450px]:h-10 rounded object-cover"
                            src={item.image}
                          />
                          <div className="flex-1 w-max">
                            <p className="text-xs text-nowrap min-[450px]:text-sm text-slate-700 dark:text-slate-300 ">
                              {item.name}
                            </p>
                            <p className="text-xs min-[450px]:text-sm text-slate-400">
                              x{item.quantity}
                            </p>
                          </div>
                          <span className="text-xs min-[450px]:text-[15px] font-semibold text-slate-700 dark:text-slate-200">
                            EGP&nbsp;
                            {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm pt-2">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-xs min-[450px]:text-base  font-semibold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                          Subtotal
                        </span>
                        <span className="text-xs min-[450px]:text-base font-semibold">
                          EGP&nbsp;
                          {orderItemsCart?.subtotal?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-xs min-[450px]:text-base font-semibold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                          Shipping
                        </span>
                        <span className="text-xs min-[450px]:text-base font-semibold">
                          {shipping === 0 ? "Free" : `EGP ${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-xs min-[450px]:text-base font-semibold w-max bg-linear-60 from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                          Tax (14%)
                        </span>
                        <span className="text-xs min-[450px]:text-base font-semibold">
                          EGP&nbsp;{tax.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="text-xs min-[450px]:text-base border-t border-gray-300 dark:border-slate-700 pt-3 flex justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>Total</span>
                        <span className="text-[12px] min-[450px]:text-[15px] w-max bg-linear-60 from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                          EGP&nbsp;
                          {Math.round(
                            (orderItemsCart?.subtotal || 0) + tax + shipping,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`flex items-center justify-center cursor-pointer font-semibold rounded-md min-[450px]:rounded-lg transition-all duration-300 ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                      } text-white px-3 min-[450px]:px-6 py-1.5 min-[450px]:py-3 text-base w-full mt-6 text-xs min-[450px]:text-base`}
                      type="submit"
                      disabled={
                        isSubmitting ||
                        loadingCart ||
                        !orderItemsCart?.items?.length
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <LuLoaderCircle className="animate-spin mr-2 text-md min-[450px]:text-lg" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CheckOut;