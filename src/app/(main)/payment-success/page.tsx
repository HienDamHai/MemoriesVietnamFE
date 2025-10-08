"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
    const fetchData = async () => {
      const query = params.toString();
      const res = await fetch(
        `https://localhost:7003/api/Payment/vnpay-return?${query}`
      );
      const data = await res.json();
      setResult(data);
    };
    fetchData();
  }, [params]);

  if (!result) return <p>⏳ Đang xử lý thanh toán...</p>;

  return (
    <div className="text-center py-20">
      {result.Success ? (
        <h1 className="text-2xl font-bold text-green-600">✅ {result.Message}</h1>
      ) : (
        <h1 className="text-2xl font-bold text-red-600">❌ {result.Message}</h1>
      )}
      <a
        href="/user/orders"
        className="mt-4 inline-block bg-amber-600 text-white px-4 py-2 rounded-lg"
      >
        Quay lại đơn hàng
      </a>
    </div>
  );
}
