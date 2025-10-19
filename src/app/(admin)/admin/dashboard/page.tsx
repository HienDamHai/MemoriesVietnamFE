"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"; // ✅ Dùng Axios có baseURL + token sẵn

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
  0: "Pending",
  1: "Paid",
  2: "Shipped",
  3: "Completed",
  4: "Cancelled",
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // ✅ Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/Order");
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId: string, currentStatus: number) => {
    let nextStatus: number | null = null;
    if (currentStatus === 1) nextStatus = 2; // Paid → Shipped
    else if (currentStatus === 2) nextStatus = 3; // Shipped → Completed
    else return;

    try {
      setUpdating(orderId);

      const res = await api.put(`/Order/status/${orderId}`, {
        orderId,
        status: nextStatus, // ✅ Gửi kiểu số (enum)
      });

      // Cập nhật danh sách đơn tại client
      const updated = res.data;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái đơn hàng!");
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">
          Đang tải đơn hàng...
        </p>
      </div>
    );

  // ✅ Lọc chỉ hiện Paid hoặc Shipped
  const filteredOrders = orders.filter((o) => o.status === 1 || o.status === 2);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-amber-900">
        📋 Quản lý đơn hàng
      </h1>

      {filteredOrders.length === 0 ? (
        <div className="text-center bg-amber-50 border border-amber-200 p-8 rounded-lg text-amber-900 shadow-sm">
          <p className="text-lg">Không có đơn hàng Paid hoặc Shipped.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
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
                  {OrderStatus[order.status]}
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
                <p className="text-lg font-bold text-amber-800">
                  Tổng: {order.total.toLocaleString()}đ
                </p>

                <button
                  onClick={() => handleUpdateStatus(order.id, order.status)}
                  disabled={updating === order.id}
                  className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                    updating === order.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {updating === order.id
                    ? "Đang cập nhật..."
                    : order.status === 1
                    ? "Chuyển sang Shipped"
                    : "Chuyển sang Completed"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
