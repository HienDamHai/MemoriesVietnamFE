"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api"; // ✅ import axios instance của bạn

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p>⏳ Đang tải thông tin thanh toán...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const params = useSearchParams();
  const [result, setResult] = useState<{ Success: boolean; Message: string }>();

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        const query = params.toString();
        // ✅ Gọi API qua Axios instance
        const res = await api.get(`/Payment/vnpay-return?${query}`);
        setResult(res.data);
      } catch (error: any) {
        console.error("❌ Lỗi khi gọi API VNPay:", error);
        setResult({
          Success: false,
          Message:
            error.response?.data?.Message ||
            "Đã xảy ra lỗi khi xử lý thanh toán.",
        });
      }
    };

    if (params.toString()) fetchPaymentResult();
  }, [params]);

  if (!result)
    return <p className="text-center py-20">⏳ Đang xử lý thanh toán...</p>;

  return (
    <div className="text-center py-20">
      {result.Success ? (
        <h1 className="text-2xl font-bold text-green-600">✅ {result.Message}</h1>
      ) : (
        <h1 className="text-2xl font-bold text-red-600">❌ {result.Message}</h1>
      )}

      <a
        href="/user/orders"
        className="mt-4 inline-block bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
      >
        Quay lại đơn hàng
      </a>
    </div>
  );
}
