"use client";

import React, { useEffect, useState } from "react";
import api from "../../../../lib/api";
import ROUTES from "../../../../router/routes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  verifiedAt: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // form chỉnh sửa profile
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // form đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<UserProfile>("/users/me");
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    if (!form.name.trim()) {
      setMessage("Tên không được để trống");
      return;
    }
    if (form.phone && !/^\d{10,11}$/.test(form.phone)) {
      setMessage("Số điện thoại không hợp lệ (10-11 chữ số)");
      return;
    }
    if (form.address.trim().length < 5) {
      setMessage("Địa chỉ quá ngắn");
      return;
    }
  
    try {
      await api.put("/users/me", form);
      setMessage("Cập nhật thông tin thành công!");
      setUser((prev) => (prev ? { ...prev, ...form } : prev));
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setMessage("Cập nhật thất bại!");
    }
  };  

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      setMessage("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
  
    try {
      await api.put("/users/me/password", passwordForm);
      setMessage("Đổi mật khẩu thành công!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      console.error("Lỗi khi đổi mật khẩu:", err);
      if (err.response?.status === 401) {
        setMessage("Bạn không có quyền đổi mật khẩu (Unauthorized)");
      } else if (err.response?.status === 400) {
        setMessage("Mật khẩu hiện tại không đúng");
      } else {
        setMessage("Đổi mật khẩu thất bại!");
      }
    }
  };  

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  if (!user)
    return (
      <div className="text-center py-20">
        Không tìm thấy thông tin người dùng.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-10">
      <div className="container mx-auto px-4 max-w-3xl bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-3xl font-serif font-bold text-amber-900 mb-6">
          Quản lý tài khoản
        </h1>

        {message && (
          <div className="mb-4 text-center text-sm text-blue-600">{message}</div>
        )}

        {/* Thông tin cơ bản */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Tên</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Số điện thoại</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Địa chỉ</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={handleProfileUpdate}
            className="mt-6 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-full transition-colors"
          >
            Lưu thay đổi
          </button>
        </section>

        {/* Đổi mật khẩu */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Mật khẩu mới</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition-colors"
          >
            Đổi mật khẩu
          </button>
        </section>

        <div className="mt-10">
          <Link
            href={ROUTES.HOME}
            className="flex items-center text-amber-700 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
