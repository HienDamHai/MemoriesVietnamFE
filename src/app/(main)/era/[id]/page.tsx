"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Era, Article } from "@/types/entities";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function EraDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [era, setEra] = useState<Era | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEraAndArticles = async () => {
      try {
        const [{ data: eraData }, { data: articleData }] = await Promise.all([
          api.get<Era>(`/era/${id}`),
          api.get<Article[]>("/article/published"),
        ]);

        setEra(eraData);

        // 🔹 Nếu API trả id dạng number, cần ép kiểu cho đúng
        const filteredArticles = articleData.filter(
          (a) => String(a.eraId) === String(id)
        );
        setArticles(filteredArticles);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Era:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEraAndArticles();
  }, [id]);

  if (loading)
    return <div className="text-center py-20 text-lg">Đang tải dữ liệu...</div>;
  if (!era)
    return <div className="text-center py-20 text-lg">Không tìm thấy thời kỳ</div>;

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <Link
          href="/era"
          className="inline-flex items-center text-amber-700 hover:text-amber-500 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Quay lại danh sách</span>
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-2">{era.name}</h1>
        <p className="text-amber-700 font-medium mb-6">
          {era.yearStart} – {era.yearEnd}
        </p>
        <p className="text-gray-700 max-w-3xl mb-12">{era.description}</p>

        <h2 className="text-2xl font-serif font-bold mb-6">
          Các bài viết thuộc thời kỳ này
        </h2>

        {articles.length === 0 ? (
          <p>Chưa có bài viết nào trong thời kỳ này.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a) => (
              <div
                key={a.id}
                className="bg-amber-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={a.coverUrl || "/img/default.jpg"}
                    alt={a.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-2">{a.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {a.content}
                  </p>
                  <Link
                    href={`/article/${a.id}`}
                    className="text-amber-700 flex items-center hover:text-amber-500 transition-colors"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="ml-1 w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
