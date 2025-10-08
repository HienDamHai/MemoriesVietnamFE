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
        const res = await api.get<Era[]>("/era");
        setEras(res.data);
      } catch (err) {
        console.error("Lỗi khi tải Era:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEras();
  }, []);

  if (loading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-amber-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-center mb-12">
          Các thời kỳ lịch sử Việt Nam
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eras.map((era) => (
            <div
              key={era.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={"/img/default-era.jpg"}
                  alt={era.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <span className="text-sm text-amber-700 font-medium">
                  {era.yearStart} – {era.yearEnd}
                </span>
                <h3 className="text-2xl font-serif font-bold mt-2">{era.name}</h3>
                <p className="text-gray-600 mt-2 mb-4 line-clamp-3">{era.description}</p>
                <Link
                  href={`/era/${era.id}`}
                  className="text-amber-700 flex items-center font-medium hover:text-amber-500 transition-colors"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="ml-1 w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
