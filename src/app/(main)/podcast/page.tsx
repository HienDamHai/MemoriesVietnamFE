"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ROUTES from "@/router/routes";
import api from "@/lib/api";

type Episode = {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  episodeNumber: number;
};

type Podcast = {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string | null;
  createdAt?: string;
  episodes?: Episode[] | null;
};

export default function PodcastListPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const { data } = await api.get<Podcast[]>("/Podcast/with-episodes");
        setPodcasts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách podcast:", err);
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  if (loading) {
    return <div className="py-20 text-center">Đang tải danh sách podcast...</div>;
  }

  return (
    <main className="min-h-screen bg-amber-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-center mb-12">
          Podcast
        </h1>

        {podcasts.length === 0 ? (
          <p className="text-center text-gray-600">Hiện chưa có podcast nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {podcasts.map((p) => (
              <Link
                key={p.id}
                href={`${ROUTES.PODCAST}/${p.id}`}
                className="block bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="w-full h-48 bg-gray-100">
                  <img
                    src={p.coverUrl || "/img/default.jpg"}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/default.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-amber-900">
                    {p.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                    {p.description ?? ""}
                  </p>
                  <div className="mt-3 text-sm text-gray-500">
                    {p.episodes ? `${p.episodes.length} tập` : "Chưa có tập"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
