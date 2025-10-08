"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ROUTES from "@/router/routes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role =
        payload["role"] ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Admin") {
        setIsAuthorized(true);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch {
      router.push(ROUTES.LOGIN);
    }
  }, [router]);

  if (!isAuthorized) {
    return <div className="flex items-center justify-center h-screen">Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="min-h-screen flex bg-amber-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-amber-800">
        <h2 className="text-lg font-bold mb- justify-center">Memories VietNam</h2>
        <nav className="flex flex-col gap-2">
          <Link href={ROUTES.DASHBOARD}>📊 Dashboard</Link>
          <Link href="/admin/user">👤 Quản lý người dùng</Link>
          <Link href="/admin/product">🛍️ Quản lý sản phẩm</Link>
          <Link href="/admin/article">📰 Quản lý bài viết</Link>
          <Link href="/admin/era">🏰 Quản lý thời kỳ</Link>
          <Link href="/admin/podcast">🎧 Quản lý podcast</Link>
          {/* <Link href="/admin/comment">💬 Bình luận</Link> */}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push(ROUTES.LOGIN);
          }}
          className="mt-6 bg-red-600 px-4 py-2 rounded"
        >
          Đăng xuất
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto bg-amber-900">
        {children}
      </main>
    </div>
  );
}
