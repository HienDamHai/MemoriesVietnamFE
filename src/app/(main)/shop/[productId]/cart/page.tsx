"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    const newCart = cart.map((item) =>
      item.productId === id ? { ...item, qty } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.productId !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    router.push("/shop/cart/checkout");
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-amber-900 flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl">shopping_cart</span>
        Giỏ hàng của bạn
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 mt-12">
          <p className="text-lg">🪶 Giỏ hàng của bạn đang trống.</p>
          <button
            onClick={() => router.push("/shop")}
            className="mt-6 bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-amber-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                      <span className="material-symbols-outlined text-4xl">
                        image
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg text-amber-900">{item.name}</p>
                    <p className="text-gray-600">
                      {item.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.productId, parseInt(e.target.value))
                      }
                      className="w-14 text-center border-x focus:outline-none"
                    />
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                    <span className="hidden md:inline">Xóa</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-amber-50 p-6 rounded-2xl shadow-inner flex flex-col md:flex-row justify-between items-center">
            <p className="text-xl font-semibold text-amber-900 mb-4 md:mb-0">
              Tổng cộng:{" "}
              <span className="text-2xl text-amber-700">
                {total.toLocaleString()}đ
              </span>
            </p>
            <button
              onClick={handleCheckout}
              className="bg-amber-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-600 transition-colors"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}
