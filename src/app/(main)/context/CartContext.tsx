"use client";

import React, { createContext, useContext, useState } from "react";
import api from "@/lib/api"; // ✅ Dùng axios instance đã cấu hình

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  toggleCart: () => void;
  placeOrder: () => void;
  isOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Thêm vào giỏ
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  };

  // ✅ Xoá khỏi giỏ
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== id));
  };

  // ✅ Mở / đóng giỏ hàng
  const toggleCart = () => setIsOpen((prev) => !prev);

  // ✅ Gửi đơn hàng bằng axios
  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("⚠️ Bạn cần đăng nhập trước khi đặt hàng!");
      return;
    }

    if (cart.length === 0) {
      alert("🛒 Giỏ hàng trống, không thể đặt hàng.");
      return;
    }

    const payload = {
      payment: "",
      items: cart.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        price: i.price,
      })),
    };

    console.log("📦 Payload gửi lên API:", payload);

    try {
      // ⚙️ Dùng axios instance
      const res = await api.post("/Order", payload);

      console.log("📩 Phản hồi từ API:", res.data);

      alert("✅ Đặt hàng thành công!");
      setCart([]);
      setIsOpen(false);
    } catch (err: any) {
      console.error("❌ Lỗi khi đặt hàng:", err);
      alert(
        `Đặt hàng thất bại! ${
          err.response?.data?.message || "Vui lòng thử lại sau."
        }`
      );
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, toggleCart, placeOrder, isOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
