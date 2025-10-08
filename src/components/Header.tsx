"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../app/(main)/context/CartContext";
import ROUTES from "../router/routes";

export const Header = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();
  const { toggleCart, cart } = useCart();

  // 🧩 Giải mã token để lấy email
  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email =
          payload[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] || "Người dùng";
        setUserName(email);
      } catch {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  };

  useEffect(() => {
    loadUserFromToken();
    const handleStorageChange = () => loadUserFromToken();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName(null);
  };

  // 📜 Xem đơn hàng của tôi
  const handleViewOrders = () => {
    const token = localStorage.getItem("token");
    if (!token) router.push(ROUTES.LOGIN);
    else router.push(ROUTES.ORDERS);
  };

  return (
    <header className="sticky top-0 z-10 bg-amber-900 text-amber-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Tên */}
        <div className="flex items-center space-x-2">
          <h1
            className="font-serif text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            Memoirs Vietnam
          </h1>
        </div>

        {/* Thanh điều hướng */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href={ROUTES.HOME} className="hover:text-amber-200 transition-colors duration-200">
            Trang chủ
          </Link>
          <Link href={ROUTES.ERA} className="hover:text-amber-200 transition-colors duration-200">
            Lịch sử
          </Link>
          <Link href={ROUTES.ARTICLE} className="hover:text-amber-200 transition-colors duration-200">
            Bài viết
          </Link>
          <Link href={ROUTES.PODCAST} className="hover:text-amber-200 transition-colors duration-200">
            Podcast
          </Link>
          <Link href={ROUTES.SHOP} className="hover:text-amber-200 transition-colors duration-200">
            Shop
          </Link>
        </nav>

        {/* Khu vực tài khoản & giỏ hàng */}
        <div className="flex items-center space-x-4">
          {/* 🧺 Giỏ hàng (local) */}
          <button
            onClick={toggleCart}
            className="relative flex items-center justify-center rounded-full p-2 hover:bg-amber-800 transition-colors"
            title="Mở giỏ hàng"
          >
            <Image
              src="/cart.png"
              alt="Giỏ hàng"
              width={28}
              height={28}
              className="object-contain"
            />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>

          {/* 📜 Đơn hàng của tôi */}
          <button
            onClick={handleViewOrders}
            className="relative flex items-center justify-center rounded-full p-2 hover:bg-amber-800 transition-colors"
            title="Xem đơn hàng của tôi"
          >
            <Image
              src="/order.png" // 👉 đặt thêm /public/order.png
              alt="Đơn hàng"
              width={26}
              height={26}
              className="object-contain"
            />
          </button>

          {/* Người dùng */}
          {userName ? (
            <>
              <Link
                href={ROUTES.PROFILE}
                className="hidden md:block font-medium hover:underline"
              >
                {userName}
              </Link>
              <button
                onClick={handleLogout}
                className="hidden md:block bg-red-600 hover:bg-red-500 px-4 py-2 rounded-full transition-colors duration-200"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className="hidden md:block bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-full transition-colors duration-200"
            >
              Đăng nhập
            </Link>
          )}

          {/* Nút menu mobile */}
          <button className="md:hidden rounded-full p-2 hover:bg-amber-800 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
