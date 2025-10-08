"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
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

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1); // ✅ số lượng chọn
  const { addToCart } = useCart(); // ✅ dùng context

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7003/api/Product/${productId}`);
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);


  /** ✅ Xử lý thêm sản phẩm vào giỏ */
  const handleAddToCart = () => {
    if (!product) return;
    const firstImage = safeParseImages(product.images)[0];
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      image: firstImage,
    });
  };

  if (loading)
    return (
      <div className="p-20 text-center text-amber-700 text-lg animate-pulse">
        Đang tải sản phẩm...
      </div>
    );

  if (!product)
    return (
      <div className="p-20 text-center text-red-600 text-lg">
        Không tìm thấy sản phẩm.
      </div>
    );

  const images = safeParseImages(product.images);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Hình ảnh sản phẩm */}
        <div className="space-y-4">
          {images.map((img, i) => (
            <Image
              key={i}
              src={img.startsWith("http") ? img : `/uploads/${img}`}
              alt={product.name}
              width={600}
              height={400}
              className="w-full rounded-xl shadow-lg object-cover"
            />
          ))}
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold text-amber-900">{product.name}</h1>
          <p className="mt-3 text-gray-700 leading-relaxed">{product.description}</p>

          <p className="mt-6 text-3xl font-semibold text-amber-800">
            {product.price.toLocaleString()}₫
          </p>

          <p className="mt-2 text-gray-600">
            Tình trạng:{" "}
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">Còn hàng</span>
            ) : (
              <span className="text-red-600 font-medium">Hết hàng</span>
            )}
          </p>

          {/* ✅ chọn số lượng */}
          <div className="mt-6 flex items-center space-x-3">
            <label htmlFor="qty" className="text-gray-700">
              Số lượng:
            </label>
            <input
              id="qty"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))
              }
              className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-center"
            />
          </div>

          {/* Nút thêm vào giỏ */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-6 px-6 py-3 rounded-full text-white text-lg font-semibold transition-colors duration-200 ${
              product.stock > 0
                ? "bg-amber-700 hover:bg-amber-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {added ? "✅ Đã thêm vào giỏ" : "🛒 Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </main>
  );
}

/** An toàn khi parse JSON ảnh */
function safeParseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed)
      ? parsed
      : typeof parsed === "string"
      ? [parsed]
      : [images];
  } catch {
    return [images];
  }
}
