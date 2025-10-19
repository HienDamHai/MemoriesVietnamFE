"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import ROUTES from "@/router/routes";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string;
  yearStart: number;
  yearEnd: number;
  eraId: string;
  publishedAt?: string;
  sources?: string | string[];
  era?: {
    id: string;
    name: string;
  };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await api.get<Article>(`/article/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div className="text-center py-20">Đang tải bài viết...</div>;
  if (!article) return <div className="text-center py-20">Không tìm thấy bài viết</div>;

  // ✅ Xử lý an toàn danh sách nguồn
  let sources: string[] = [];
  try {
    if (article.sources) {
      sources = Array.isArray(article.sources)
        ? article.sources
        : JSON.parse(article.sources);
    }
  } catch {
    sources = [];
  }

  return (
    <div className="min-h-screen bg-amber-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href={`${ROUTES.ERA}/${article.eraId}`}
          className="inline-flex items-center text-amber-700 hover:text-amber-500 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Quay lại thời kỳ</span>
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-4">{article.title}</h1>
        <p className="text-amber-700 mb-6">
          {article.yearStart} – {article.yearEnd}
        </p>

        <img
          src={article.coverUrl || "/img/default.jpg"}
          alt={article.title}
          className="w-full h-80 object-cover rounded-xl shadow-md mb-8"
        />

        <div className="prose prose-amber max-w-none">
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">
            {article.content}
          </p>
        </div>

        {sources.length > 0 && (
          <div className="mt-8 border-t border-amber-200 pt-4 text-sm text-gray-600">
            <p className="font-medium">Nguồn tham khảo:</p>
            <ul className="list-disc list-inside">
              {sources.map((src, i) => (
                <li key={i}>{src}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
