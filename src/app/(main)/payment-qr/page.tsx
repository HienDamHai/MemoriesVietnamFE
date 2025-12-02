"use client";

export default function PaymentQR() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 px-4">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">
        💳 Quét mã để thanh toán
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <img
          src="/img/image.png"
          alt="QR thanh toán"
          className="w-72 h-72 object-contain"
        />
      </div>

      <p className="text-amber-700 mt-4 text-center">
        Vui lòng quét mã QR để chuyển khoản thanh toán.<br />
        Sau khi chuyển khoản, đơn hàng sẽ được xác nhận tự động.
      </p>
    </div>
  );
}
