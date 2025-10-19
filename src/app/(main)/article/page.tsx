"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

interface Era {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  description?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string;
  yearStart: number;
  yearEnd: number;
  eraId: string;
  era?: Era | null;
  publishedAt?: string;
}

const ArticleListPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get<Article[]>("/Article/published");
        setArticles(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg text-amber-700">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-amber-900 text-center">
          Danh sách bài viết
        </h1>

        {articles.length === 0 ? (
          <p className="text-center text-gray-600">
            Hiện chưa có bài viết nào được xuất bản.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-200 flex flex-col"
              >
                {article.coverUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={
                        article.coverUrl.startsWith("http")
                          ? article.coverUrl
                          : `${article.coverUrl}`
                      }
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-amber-900 mb-2">
                    {article.title}
                  </h2>
                  {article.era && (
                    <p className="text-sm text-amber-700 italic mb-2">
                      {article.era.name} ({article.era.yearStart} →{" "}
                      {article.era.yearEnd})
                    </p>
                  )}
                  <p className="text-gray-700 flex-grow line-clamp-3">
                    {article.content.length > 120
                      ? article.content.slice(0, 120) + "..."
                      : article.content}
                  </p>
                  <div className="mt-3 text-right text-sm text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("vi-VN")
                      : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ArticleListPage;
