"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Vui lòng đăng nhập trước khi đặt hàng!");
      router.push("/login");
      return;
    }

    // 🧩 Giải mã token để lấy userId
    let userId: string | null = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
    } catch {
      alert("❌ Token không hợp lệ, vui lòng đăng nhập lại!");
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }

    const orderData = {
      userId,
      payment: "COD",
      items: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        price: item.price,
      })),
    };

    setLoading(true);
    try {
      const res = await fetch("https://localhost:7003/api/Order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Không thể tạo đơn hàng");

      localStorage.removeItem("cart");

      alert("✅ Đặt hàng thành công!");
      router.push("/user/order");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-amber-900 flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-amber-700">
          credit_card
        </span>
        Xác nhận thanh toán
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 bg-amber-50 py-12 rounded-xl">
          <p className="text-lg mb-4">🪶 Giỏ hàng của bạn đang trống.</p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-amber-800">
            🧾 Chi tiết đơn hàng
          </h2>

          <div className="divide-y divide-gray-200 mb-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between py-3 text-gray-700"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium">
                  {(item.price * item.qty).toLocaleString()}đ
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-semibold text-amber-900 border-t border-gray-300 pt-3">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString()}đ</span>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            className={`mt-8 w-full py-3 rounded-full text-lg font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600 text-white"
            }`}
          >
            {loading ? "⏳ Đang xử lý..." : "✅ Xác nhận đặt hàng"}
          </button>
        </div>
      )}
    </div>
  );
}
