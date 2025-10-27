"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  description?: string | null;
  coverUrl?: string | null;
  episodes?: Episode[] | null;
};

export default function PodcastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPodcast = async () => {
      try {
        const { data } = await api.get<Podcast>(`/Podcast/${id}`);
        setPodcast(data ?? null);
      } catch (err) {
        console.error("Lỗi khi tải podcast:", err);
        setPodcast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  // ✅ Tạo URL audio đầy đủ nếu backend chỉ trả về path tương đối
  const buildAudioUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;

    const base = api.defaults.baseURL?.replace(/\/api\/?$/, "") ?? "";
    return base + (url.startsWith("/") ? url : "/" + url);
  };

  const handlePlayEpisode = (ep: Episode) => {
    const src = buildAudioUrl(ep.audioUrl);
    setCurrentEpisode(ep);
    setAudioSrc(src);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => console.log("Autoplay bị chặn!"));
      }
    }, 50);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">Đang tải chi tiết podcast...</div>
    );
  }

  if (!podcast) {
    return (
      <div className="py-20 text-center">
        Không tìm thấy podcast.{" "}
        <button
          onClick={() => router.back()}
          className="ml-2 underline text-amber-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const episodes = Array.isArray(podcast.episodes) ? podcast.episodes : [];

  return (
    <div className="min-h-screen bg-amber-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href={ROUTES.PODCAST}
          className="text-amber-700 hover:text-amber-500 inline-block mb-6"
        >
          ← Quay lại danh sách podcast
        </Link>

        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <div className="w-full md:w-56 h-56 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={podcast.coverUrl || "/img/default.jpg"}
              alt={podcast.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/img/default.jpg";
              }}
            />
          </div>

          <div>
            <h1 className="text-3xl font-serif font-bold">{podcast.title}</h1>
            <p className="text-gray-700 mt-2">{podcast.description ?? ""}</p>
            <div className="mt-4 text-sm text-gray-500">
              {episodes.length} tập
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Danh sách tập</h2>

        {episodes.length === 0 ? (
          <p className="text-gray-600 italic">Chưa có tập nào.</p>
        ) : (
          <div className="space-y-3">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    Tập {ep.episodeNumber}: {ep.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.floor(ep.duration / 60)} phút{" "}
                    {ep.duration % 60 ? `${ep.duration % 60}s` : ""}
                  </div>
                </div>
                <button
                  onClick={() => handlePlayEpisode(ep)}
                  className={`px-3 py-2 rounded-full ${
                    currentEpisode?.id === ep.id
                      ? "bg-amber-700"
                      : "bg-amber-600 hover:bg-amber-500"
                  } text-white`}
                >
                  {currentEpisode?.id === ep.id ? "Đang phát" : "Phát"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-900 text-white p-3 shadow-lg">
        <div className="container mx-auto px-4 max-w-4xl flex items-center gap-4">
          <div className="flex-1 truncate">
            {currentEpisode ? (
              <>
                <strong>{podcast.title} — </strong>
                <span>{currentEpisode.title}</span>
              </>
            ) : (
              <div className="text-amber-200">Chưa có tập nào đang phát</div>
            )}
          </div>

          <div className="w-80">
            {audioSrc?.includes("player.cloudinary.com") ? (
              <iframe
                src={audioSrc}
                allow="autoplay"
                className="w-full h-24 border-0 rounded-md"
              ></iframe>
            ) : (
              <audio
                ref={audioRef}
                controls
                src={audioSrc ?? undefined}
                className="w-full"
              >
                Trình duyệt của bạn không hỗ trợ thẻ audio.
              </audio>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
