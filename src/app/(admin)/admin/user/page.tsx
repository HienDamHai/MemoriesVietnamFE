"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  verifiedAt?: string | null;
};

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

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 🔹 Lấy tất cả user
  useEffect(() => {
    fetch("https://localhost:7003/api/Users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Xoá user
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá người dùng này không?")) return;

    try {
      const res = await fetch(`https://localhost:7003/api/Users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xoá thất bại");
      alert("Đã xoá người dùng.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi xoá người dùng.");
    }
  };

  // 🔹 Xem đơn hàng của user
  const handleViewOrders = async (user: User) => {
    setSelectedUser(user);
    setLoadingOrders(true);
    try {
      const res = await fetch(`https://localhost:7003/api/Order/user/${user.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoadingOrders(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 animate-pulse">
        Đang tải danh sách người dùng...
      </div>
    );

  return (
    <div className="p-8 text-amber-900">
      <h1 className="text-3xl font-bold mb-6">👥 Quản lý người dùng</h1>

      {/* Bảng danh sách user */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-amber-200 bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-amber-100 text-left">
            <tr>
              <th className="p-3 border-b">Tên</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">SĐT</th>
              <th className="p-3 border-b">Địa chỉ</th>
              <th className="p-3 border-b">Xác thực</th>
              <th className="p-3 border-b text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-amber-50 transition-colors border-b"
              >
                <td className="p-3">{user.name || "Chưa có tên"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone || "—"}</td>
                <td className="p-3">{user.address || "—"}</td>
                <td className="p-3">
                  {user.verifiedAt ? (
                    <span className="text-green-600 font-semibold">Đã xác thực</span>
                  ) : (
                    <span className="text-gray-500 italic">Chưa xác thực</span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleViewOrders(user)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    📦 Xem đơn hàng
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    🗑️ Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal hiển thị đơn hàng */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-amber-900 rounded-xl shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">
              📦 Đơn hàng của {selectedUser.name || selectedUser.email}
            </h2>

            {loadingOrders ? (
              <p className="text-gray-500 animate-pulse">Đang tải đơn hàng...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">Người dùng này chưa có đơn hàng nào.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold">Mã đơn: #{order.id}</p>
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

                    <ul className="text-sm space-y-1 border-t border-gray-100 pt-2">
                      {order.orderItems.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.product?.name} × {item.qty}
                          </span>
                          <span className="font-medium">
                            {(item.price * item.qty).toLocaleString()}đ
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-2 text-right font-bold text-amber-800">
                      Tổng: {order.total.toLocaleString()}đ
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
