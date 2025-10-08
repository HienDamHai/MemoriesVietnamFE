"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type PodcastEpisode = {
  id: string;
  podcastId: string;
  title: string;
  audioUrl: string;
  duration: number;
  episodeNumber: number;
  articleId: string;
};

type Podcast = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  createdAt: string;
  episodes: PodcastEpisode[];
};

export default function PodcastManager() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", coverUrl: "" });
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    audioUrl: "",
    duration: 0,
    episodeNumber: 1,
  });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  async function fetchPodcasts() {
    try {
      const res = await api.get("/Podcast/with-episodes");
      setPodcasts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // === UPLOAD IMAGE TO CLOUDINARY ===
  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "o2kexzas");
    data.append("cloud_name", "dpghembhy");
    data.append("resource_type", "image");
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dpghembhy/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    setForm({ ...form, coverUrl: result.secure_url });
  }
  

  // === UPLOAD AUDIO TO CLOUDINARY ===
  async function uploadAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "o2kexzas");
    data.append("cloud_name", "dpghembhy");
    data.append("resource_type", "video");
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dpghembhy/video/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    setNewEpisode({ ...newEpisode, audioUrl: result.secure_url });
  }
  

  async function createPodcast() {
    if (!form.title) return alert("Vui lòng nhập tiêu đề");
    await api.post("/Podcast", form);
    setShowForm(false);
    setForm({ title: "", description: "", coverUrl: "" });
    fetchPodcasts();
  }

  async function deletePodcast(id: string) {
    if (confirm("Xóa podcast này?")) {
      await api.delete(`/Podcast/${id}`);
      fetchPodcasts();
    }
  }

  async function addEpisode() {
    if (!selectedPodcast) return;
    const payload = {
      podcastId: selectedPodcast.id,
      title: newEpisode.title,
      audioUrl: newEpisode.audioUrl,
      duration: newEpisode.duration,
      episodeNumber: newEpisode.episodeNumber,
      articleId: "art4",
    };
    await api.post("/PodcastEpisode", payload);
    setNewEpisode({ title: "", audioUrl: "", duration: 0, episodeNumber: 1 });
    fetchPodcasts();
  }

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🎧 Quản lý Podcast</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-amber-700 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Thêm Podcast
      </button>

      {showForm && (
        <div className="bg-amber-100 p-4 rounded mb-4">
          <input
            className="border p-2 w-full mb-2"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={uploadImage} className="mb-2" />
          {form.coverUrl && (
            <img src={form.coverUrl} alt="cover" className="h-32 rounded mb-2" />
          )}
          <button onClick={createPodcast} className="bg-green-700 text-white px-4 py-2 rounded">
            ✅ Lưu
          </button>
        </div>
      )}

      {/* === Danh sách Podcast === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {podcasts.map((p) => (
          <div key={p.id} className="border p-4 rounded bg-white shadow">
            <div className="flex items-center gap-4">
              <img
                src={p.coverUrl}
                alt={p.title}
                className="h-20 w-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-xs text-gray-500">{p.episodes.length} tập</p>
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setSelectedPodcast(p)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                📂 Quản lý tập
              </button>
              <button
                onClick={() => deletePodcast(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === Quản lý tập Podcast === */}
      {selectedPodcast && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-start pt-10 overflow-auto z-50">
          <div className="bg-white rounded p-6 w-[600px] relative">
            <button
              onClick={() => setSelectedPodcast(null)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              🎙️ {selectedPodcast.title} – Quản lý tập
            </h2>

            {/* Danh sách tập */}
            {selectedPodcast.episodes.map((e) => (
              <div key={e.id} className="border p-2 rounded mb-2">
                <p>
                  <strong>{e.episodeNumber}. {e.title}</strong>
                </p>
                <audio controls src={e.audioUrl} className="w-full mt-1" />
              </div>
            ))}

            {/* Form thêm tập */}
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">➕ Thêm tập mới</h3>
              <input
                className="border p-2 w-full mb-2"
                placeholder="Tiêu đề"
                value={newEpisode.title}
                onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
              />
              <input
                className="border p-2 w-full mb-2"
                type="number"
                placeholder="Số tập"
                value={newEpisode.episodeNumber}
                onChange={(e) =>
                  setNewEpisode({ ...newEpisode, episodeNumber: parseInt(e.target.value) })
                }
              />
              <input
                type="file"
                accept="audio/*"
                onChange={uploadAudio}
                className="mb-2"
              />
              {newEpisode.audioUrl && (
                <audio controls src={newEpisode.audioUrl} className="w-full mb-2" />
              )}
              <button
                onClick={addEpisode}
                className="bg-green-700 text-white px-4 py-2 rounded"
              >
                ✅ Lưu tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
