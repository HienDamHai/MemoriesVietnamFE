"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/router/routes";
import api from "@/lib/api"; // 👈 dùng axios đã cấu hình sẵn

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  categoryId: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // ✅ Gọi API bằng axios (dùng baseURL trong lib/api.ts)
        const res = await api.get<Product[]>("/Product");
        setProducts(res.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-lg text-amber-700">Đang tải...</div>
    );

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-amber-900">Sản phẩm</h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-600">Không có sản phẩm nào.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const images = safeParseImages(p.images);
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {images[0] && (
                  <Image
                    src={images[0]}
                    alt={p.name}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col justify-between h-48">
                  <div>
                    <h2 className="font-semibold text-lg text-amber-900">
                      {p.name}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-amber-800">
                      {p.price.toLocaleString()}₫
                    </span>
                    <Link
                      href={`${ROUTES.SHOP}/${p.id}`}
                      className="bg-amber-700 text-white px-3 py-1 rounded-full hover:bg-amber-600 transition"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

// 🔧 Hàm xử lý chuỗi JSON trong "images"
function safeParseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [images];
  } catch {
    return [images];
  }
}
