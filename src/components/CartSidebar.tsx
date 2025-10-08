"use client";

import { useCart } from "../app/(main)/context/CartContext";
import Image from "next/image";

function CartSidebar() {
  const { cart, removeFromCart, placeOrder, isOpen, toggleCart } = useCart();
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">🛒 Giỏ hàng</h2>
        <button onClick={toggleCart} className="text-gray-500 hover:text-gray-800">
          ✕
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-3">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Chưa có sản phẩm</p>
        ) : (
          cart.map((item) => (
            <div key={item.productId} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.qty} × {item.price.toLocaleString()}₫
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <p className="font-semibold text-lg">
          Tổng: <span className="text-amber-800">{total.toLocaleString()}₫</span>
        </p>
        <button
          onClick={placeOrder}
          disabled={cart.length === 0}
          className="w-full mt-3 bg-amber-700 hover:bg-amber-600 text-white font-medium py-2 rounded-lg transition"
        >
          🧾 Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default CartSidebar;
