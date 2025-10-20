"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Era } from "@/types/entities";
import { ArrowRight } from "lucide-react";

export default function EraListPage() {
  const [eras, setEras] = useState<Era[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEras = async () => {
      try {
        const { data } = await api.get<Era[]>("/era");
        console.log("📜 [ERA API RESPONSE]:", data);
        setEras(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách Era:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEras();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-amber-800 font-medium">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-16">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-amber-900 mb-12">
          Các thời kỳ lịch sử Việt Nam
        </h1>

        {/* Nếu không có dữ liệu */}
        {eras.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Hiện chưa có dữ liệu thời kỳ nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eras.map((era) => (
              <div
                key={era.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-amber-100 hover:border-amber-300"
              >
                {/* Thông tin thời kỳ */}
                <div className="mb-4">
                  <span className="inline-block text-sm text-amber-700 font-medium bg-amber-100 px-3 py-1 rounded-full">
                    {era.yearStart} – {era.yearEnd}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {era.name}
                </h3>

                <p className="text-gray-700 text-base mb-6 line-clamp-3 leading-relaxed">
                  {era.description || "Không có mô tả cho thời kỳ này."}
                </p>

                <Link
                  href={`/era/${era.id}`}
                  className="inline-flex items-center text-amber-700 font-medium hover:text-amber-500 transition-all"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
