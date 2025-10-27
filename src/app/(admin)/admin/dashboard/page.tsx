"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------- TYPES ---------- */
type OrderItem = {
  id: string;
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

/* ---------- MAIN COMPONENT ---------- */
export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  /* ✅ Fetch data */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get("/Order"),
          api.get("/Product").catch(() => ({ data: [] })),
          api.get("/User").catch(() => ({ data: [] })),
        ]);

        const orders = ordersRes.data;
        setOrders(orders);

        // Tính toán thống kê
        const totalRevenue = orders
          .filter((o: any) => o.status === 3)
          .reduce((sum: number, o: any) => sum + o.total, 0);

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: usersRes.data.length,
          totalProducts: productsRes.data.length,
        });

        // Biểu đồ doanh thu theo ngày
        const grouped = orders.reduce((acc: any, o: any) => {
          const date = new Date(o.createdAt).toLocaleDateString("vi-VN");
          acc[date] = (acc[date] || 0) + o.total;
          return acc;
        }, {});
        const chart = Object.keys(grouped).map((key) => ({
          date: key,
          revenue: grouped[key],
        }));
        setChartData(chart);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ✅ Cập nhật trạng thái đơn hàng */
  const handleUpdateStatus = async (orderId: string, currentStatus: number) => {
    let nextStatus: number | null = null;
    if (currentStatus === 1) nextStatus = 2;
    else if (currentStatus === 2) nextStatus = 3;
    else return;

    try {
      setUpdating(orderId);
      const res = await api.put(`/Order/status/${orderId}`, {
        orderId,
        status: nextStatus,
      });
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
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Đang tải dữ liệu Dashboard...
      </div>
    );

  // ✅ Lọc đơn hàng Paid hoặc Shipped
  const filteredOrders = orders.filter((o) => o.status === 1 || o.status === 2);

  /* ---------- JSX ---------- */
  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <h1 className="text-3xl font-bold text-amber-900">
        📊 Bảng điều khiển quản trị
      </h1>

      {/* ---------- CARDS ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng doanh thu", value: `${stats.totalRevenue.toLocaleString()}đ` },
          { label: "Tổng đơn hàng", value: stats.totalOrders },
          { label: "Người dùng", value: stats.totalUsers },
          { label: "Sản phẩm", value: stats.totalProducts },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-gray-100 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-amber-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ---------- BIỂU ĐỒ ---------- */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-amber-900 mb-4">
          📈 Doanh thu theo ngày
        </h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500">Chưa có dữ liệu doanh thu.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ---------- QUẢN LÝ ĐƠN HÀNG ---------- */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-amber-900">
          📋 Quản lý đơn hàng (Paid / Shipped)
        </h2>

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

                <ul className="space-y-1 text-gray-700 border-t border-gray-100 pt-3">
                  {order.orderItems?.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {item.product?.name || "Không rõ"} × {item.qty}
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
                    onClick={() =>
                      handleUpdateStatus(order.id, order.status)
                    }
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
    </div>
  );
}
