"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "../../../../router/routes";
import api from "@/lib/api"; // ✅ Import Axios client

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Email không hợp lệ";
    if (password.length < 6) newErrors.password = "Mật khẩu ít nhất 6 ký tự";
    if (mode === "register") {
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Mật khẩu không khớp";
      if (!name) newErrors.name = "Họ và tên không được để trống";
      if (phone && !phone.match(/^\d{9,12}$/))
        newErrors.phone = "Số điện thoại không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === "login") {
        // ✅ Dùng Axios thay vì fetch
        const res = await api.post("/Auth/login", { email, password });
        const data = res.data;

        if (data.success) {
          localStorage.setItem("token", data.token);
          window.dispatchEvent(new Event("storage"));

          // 🔍 Lấy role từ response hoặc JWT
          let role = data.user?.role;
          if (!role && data.token) {
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            role =
              payload["role"] ||
              payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          }

          // 🚀 Điều hướng dựa theo role
          if (role === "Admin") {
            router.push("/admin/dashboard");
          } else {
            router.push(ROUTES.HOME);
          }
        } else {
          alert(data.message || "Đăng nhập thất bại");
        }
      } else {
        // ✅ Đăng ký
        const res = await api.post("/Auth/register", {
          email,
          password,
          name,
          phone,
          address,
        });
        const data = res.data;
        if (data.success) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          setMode("login");
        } else {
          alert(data.message || "Đăng ký thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const googleUser = {
      sub: "1234567890",
      email: "test@gmail.com",
      name: "Nguyen Van A",
      access_token: "access_token_from_google",
      refresh_token: "refresh_token_from_google",
      expires_in: 3600,
    };

    const payload = {
      provider: "google",
      providerUserId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      accessToken: googleUser.access_token,
      refreshToken: googleUser.refresh_token,
      expireAt: new Date(Date.now() + googleUser.expires_in * 1000).toISOString(),
    };

    try {
      const res = await api.post("/Auth/oauth-login", payload);
      const data = res.data;
      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push(ROUTES.HOME);
      } else {
        alert(data.message || "Đăng nhập Google thất bại");
      }
    } catch (error) {
      console.error("Lỗi OAuth Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Chuyển đổi tab */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-l-xl font-medium transition ${
              mode === "login"
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setMode("register")}
            className={`px-4 py-2 rounded-r-xl font-medium transition ${
              mode === "register"
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Đăng nhập/đăng ký Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl mb-6 transition-all"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-17.4-1.4-34.2-4.1-50.4H272v95.5h146.9c-6.3 33.7-25.2 62.3-53.7 81.5v67.6h86.6c50.6-46.6 79.7-115.3 79.7-194.2z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c72.6 0 133.6-24 178.1-65.1l-86.6-67.6c-24.1 16.2-54.9 25.7-91.5 25.7-70.3 0-130-47.5-151.2-111.3H32.6v69.9C77.1 497 169.4 544.3 272 544.3z"
            />
            <path
              fill="#FBBC05"
              d="M120.8 325.3c-10.4-31-10.4-64.3 0-95.3V159.9H32.6c-36.1 70.7-36.1 154.5 0 225.2l88.2-59.8z"
            />
            <path
              fill="#EA4335"
              d="M272 107.1c37.5-.6 71.1 13.4 97.6 39.4l73.1-73.1C406.1 24.2 345.1 0 272 0 169.4 0 77.1 47.3 32.6 122.9l88.2 65.2C142 154.6 201.7 107.1 272 107.1z"
            />
          </svg>
          {mode === "login" ? "Đăng nhập" : "Đăng ký"} bằng Google
        </button>

        {/* Form đăng nhập/đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border px-4 py-3 rounded-xl focus:outline-none transition ${
                  errors.name
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-amber-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border px-4 py-3 rounded-xl focus:outline-none transition ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-amber-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              <input
                type="text"
                placeholder="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-amber-300 transition"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border px-4 py-3 rounded-xl focus:outline-none transition ${
              errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-amber-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full border px-4 py-3 rounded-xl focus:outline-none transition ${
              errors.password
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-amber-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          {mode === "register" && (
            <>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border px-4 py-3 rounded-xl focus:outline-none transition ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-amber-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-medium transition-all"
          >
            {loading
              ? "Đang xử lý..."
              : mode === "login"
              ? "Đăng nhập"
              : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          {mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-amber-600 font-medium hover:underline"
          >
            {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}
