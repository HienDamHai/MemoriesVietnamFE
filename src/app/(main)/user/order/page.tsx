"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type OrderItem = {
  id: number;
  product?: { name: string };
  qty: number;
  price: number;
};

type Order = {
  id: string;
  createdAt: string;
  total: number;
  status: number;
  orderItems: OrderItem[];
};

const OrderStatus: Record<number, string> = {
  0: "Chờ xử lý",
  1: "Đã thanh toán",
  2: "Đang giao",
  3: "Hoàn thành",
  4: "Đã hủy",
};

const getStatusColor = (status: number) => {
  const colors: Record<number, string> = {
    0: "bg-yellow-100 text-yellow-700 border-yellow-300",
    1: "bg-blue-100 text-blue-700 border-blue-300",
    2: "bg-purple-100 text-purple-700 border-purple-300",
    3: "bg-green-100 text-green-700 border-green-300",
    4: "bg-red-100 text-red-700 border-red-300",
  };
  return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/Order/me")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Lỗi khi tải đơn hàng:", err))
      .finally(() => setLoading(false));
  }, []);

  const handlePayNow = async (orderId: string) => {
    try {
      setPaying(orderId);

      const payload = {
        orderId,
        status: "Completed",
      };

      await api.put(`/Order/status/${orderId}`, payload);

      window.location.href = "/payment-qr?orderId=" + orderId;
    } catch (err) {
      console.error("[PAY] Lỗi khi cập nhật trạng thái đơn:", err);
      alert("Không thể cập nhật thanh toán. Vui lòng thử lại!");
    } finally {
      setPaying(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">Đang tải đơn hàng...</p>
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">📜 Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center bg-amber-50 border border-amber-200 p-8 rounded-lg text-amber-900 shadow-sm">
          <p className="text-lg">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-lg text-amber-900">
                    Mã đơn: #{order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {OrderStatus[order.status] || "Không xác định"}
                </span>
              </div>

              <ul className="space-y-1 text-gray-700 border-t border-gray-100 pt-3">
                {order.orderItems?.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} × {item.qty}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.qty).toLocaleString()}đ
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                {order.status === 0 && (
                  <button
                    onClick={() => handlePayNow(order.id)}
                    disabled={!!paying}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                      paying === order.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {paying === order.id ? "Đang xử lý..." : "💳 Thanh toán ngay"}
                  </button>
                )}

                <p className="text-lg font-bold text-amber-800">
                  Tổng: {order.total.toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
