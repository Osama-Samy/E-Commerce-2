// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/api";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState({
//     items: [],
//     itemCount: 0,
//     subtotal: 0,
//     discountAmount: 0,
//     total: 0,
//     coupon: null,
//   });


//   const getCart = async () => {
//     try {
//       const res = await api.get("/carts");
//       setCart(res.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const updateQuantity = async (productId, quantity) => {
//     if (quantity < 1) return;

//     try {
//       await api.patch("/carts/items", {
//         productId,
//         quantity,
//       });

//       await getCart();

//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const removeItem = async (productId) => {
//     try {
//       await api.delete(`/carts/items/${productId}`);

//       await getCart();

//     } catch (error) {
//       console.log(error);
//     }
//   };


//   const applyCoupon = async (coupon) => {
//     try {
//       await api.post("/carts/coupon", {
//         coupon,
//       });

//       await getCart();

//     } catch (error) {
//       console.log(error);
//     }
//   };


//   useEffect(() => {
//     getCart();
//   }, []);


//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         getCart,
//         updateQuantity,
//         removeItem,
//         applyCoupon,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };


// export const useCart = () => useContext(CartContext);



import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CartContext = createContext();

// Helper function to extract unit price directly from discountPrice or price
export const getItemUnitPrice = (item) => {
  if (!item) return 0;
  const prod = typeof item.product === "object" ? item.product : {};

  const discPrice = Number(item.discountPrice ?? prod.discountPrice);
  if (discPrice && discPrice > 0) {
    return discPrice;
  }

  return Number(item.price ?? prod.price) || 0;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    subtotal: 0,
    discountAmount: 0,
    total: 0,
    coupon: null,
  });

  // Helper function to calculate totals locally
  const calcTotals = (items, discountAmount = 0) => {
    let itemCount = 0;
    let subtotal = 0;
    (items || []).forEach((item) => {
      const price = getItemUnitPrice(item);
      const qty = Number(item.quantity) || 1;
      itemCount += qty;
      subtotal += price * qty;
    });
    const total = Math.max(0, subtotal - (Number(discountAmount) || 0));
    return { itemCount, subtotal, total };
  };

  const getCart = async () => {
    try {
      const res = await api.get("/carts");
      const cartData = res.data?.cart || res.data;
      const items = Array.isArray(cartData.items) ? cartData.items : Array.isArray(res.data.items) ? res.data.items : [];
      
      if (cartData) {
        const totals = calcTotals(items, cartData.discountAmount || res.data.discountAmount || 0);
        setCart({ ...cartData, items, ...totals });
      }
    } catch (error) {
      console.log("Get cart error:", error);
    }
  };

  // Add to Cart with instant optimistic header badge update
  const addToCart = async (productId, quantity = 1) => {
    const qty = Number(quantity) || 1;
    setCart((prev) => ({
      ...prev,
      itemCount: (prev.itemCount || 0) + qty,
    }));

    try {
      await api.post("/carts/items", { productId, quantity: qty });
      await getCart();
    } catch (error) {
      console.log("Add to cart error:", error);
      await getCart();
      throw error;
    }
  };

  // Optimistic UI for updating quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    // 1. Save the current state in case we need to revert
    const prevCart = cart;

    // 2. Update UI and Totals instantly
    setCart((prev) => {
      const items = prev.items.map((it) => {
        const pId = it.product?._id || it.product || it.productId || it._id || it.id;
        return pId === productId ? { ...it, quantity } : it;
      });
      const totals = calcTotals(items, prev.discountAmount);
      return { ...prev, items, ...totals };
    });

    try {
      // 3. Send request to backend
      await api.patch("/carts/items", { productId, quantity });
      // We DO NOT call getCart() here. This prevents the "page reload" effect.
    } catch (error) {
      console.log("Update failed, reverting locally", error);
      // 4. If it fails, revert to the saved state WITHOUT reloading the whole cart
      setCart(prevCart);
    }
  };

  // Optimistic UI for removing item
  const removeItem = async (productId) => {
    // 1. Save the current state
    const prevCart = cart;

    // 2. Remove from UI and recalculate totals instantly
    setCart((prev) => {
      const items = prev.items.filter((it) => {
        const pId = it.product?._id || it.product || it.productId || it._id || it.id;
        return pId !== productId;
      });
      const totals = calcTotals(items, prev.discountAmount);
      return { ...prev, items, ...totals };
    });

    try {
      // 3. Send delete request
      await api.delete(`/carts/items/${productId}`);
    } catch (error) {
      console.log("Remove failed, reverting locally", error);
      // 4. Revert locally if failed
      setCart(prevCart);
    }
  };

  const applyCoupon = async (coupon) => {
    try {
      await api.post("/carts/coupon", { coupon });
      await getCart();
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = async () => {
    // 1. Reset state locally so header badge updates to 0 instantly
    setCart({
      items: [],
      itemCount: 0,
      subtotal: 0,
      discountAmount: 0,
      total: 0,
      coupon: null,
    });

    try {
      await api.delete("/carts/clear");
    } catch (error) {
      try {
        await api.delete("/carts");
      } catch (err) {
        console.log("Clear cart error:", err);
      }
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, getCart, addToCart, updateQuantity, removeItem, applyCoupon, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);