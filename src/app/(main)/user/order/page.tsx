"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"; // ✅ import Axios client đã cấu hình

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
  switch (status) {
    case 0:
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case 1:
      return "bg-blue-100 text-blue-700 border-blue-300";
    case 2:
      return "bg-purple-100 text-purple-700 border-purple-300";
    case 3:
      return "bg-green-100 text-green-700 border-green-300";
    case 4:
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // ✅ Dùng Axios thay vì fetch
    api
      .get("/Order/me")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePayNow = async (orderId: string) => {
    try {
      setPaying(orderId);
      console.info("[PAY] Requesting payment url for orderId:", orderId);
  
      const res = await api.post(`/Payment/create?orderId=${orderId}`);
      console.group("[PAY] /Payment/create response");
      console.log("status:", res.status);
      console.log("headers:", res.headers);
      console.log("data:", res.data);
      console.groupEnd();
  
      if (!res.data) throw new Error("Không nhận được phản hồi từ server");
      const data = res.data;
  
      // log paymentUrl (nếu có)
      if (data.paymentUrl) {
        console.info("[PAY] Redirecting user to VNPAY URL", data.paymentUrl);
        // optional: open in new tab for debugging
        // window.open(data.paymentUrl, "_blank");
        window.location.href = data.paymentUrl;
      } else {
        alert("Không tìm thấy liên kết thanh toán.");
      }
    } catch (err) {
      console.error("[PAY] Lỗi khi khởi tạo thanh toán:", err);
      alert("Có lỗi khi khởi tạo thanh toán.");
    } finally {
      setPaying(null);
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">📜 Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center bg-amber-50 border border-amber-200 p-8 rounded-lg text-amber-900 shadow-sm">
          <p className="text-lg">Chưa có đơn hàng nào.</p>
          <p className="text-sm text-amber-700 mt-1">
            Hãy ghé cửa hàng để đặt đơn đầu tiên!
          </p>
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
                    Ngày đặt:{" "}
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
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

              <div className="border-t border-gray-100 my-3"></div>

              <ul className="space-y-1 text-gray-700">
                {order.orderItems?.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
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
                    disabled={paying === order.id}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                      paying === order.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {paying === order.id
                      ? "Đang khởi tạo..."
                      : "💳 Thanh toán ngay"}
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
