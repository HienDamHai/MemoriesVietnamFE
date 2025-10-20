"use client";

import { useEffect, useState } from "react";

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
  const [form, setForm] = useState({
    title: "",
    description: "",
    coverUrl: "",
  });
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [newEpisode, setNewEpisode] = useState({
    title: "",
    audioUrl: "",
    duration: 0,
    episodeNumber: 1,
  });
  const [uploading, setUploading] = useState(false);

  const API_BASE =
    "https://memoirsvietnam-faa3hydzbwhbdnhe.southeastasia-01.azurewebsites.net/api";

  // === FETCH DATA ===
  useEffect(() => {
    fetchPodcasts();
  }, []);

  async function fetchPodcasts() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/Podcast/with-episodes`);
      const data = await res.json();
      setPodcasts(data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh sách podcast!");
    } finally {
      setLoading(false);
    }
  }

  // === UPLOAD IMAGE TO CLOUDINARY ===
  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "o2kexzas");
      data.append("cloud_name", "dpghembhy");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpghembhy/image/upload",
        { method: "POST", body: data }
      );
      const result = await res.json();
      setForm((prev) => ({ ...prev, coverUrl: result.secure_url }));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi upload ảnh!");
    } finally {
      setUploading(false);
    }
  }

  // === UPLOAD AUDIO TO CLOUDINARY ===
  async function uploadAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "o2kexzas");
      data.append("cloud_name", "dpghembhy");
      data.append("resource_type", "video");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpghembhy/video/upload",
        { method: "POST", body: data }
      );
      const result = await res.json();
      setNewEpisode((prev) => ({ ...prev, audioUrl: result.secure_url }));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi upload audio!");
    } finally {
      setUploading(false);
    }
  }

  // === CREATE PODCAST ===
  async function createPodcast() {
    if (!form.title) return alert("Vui lòng nhập tiêu đề");
    try {
      const res = await fetch(`${API_BASE}/Podcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Tạo podcast thất bại");
      alert("✅ Đã tạo podcast thành công!");
      setShowForm(false);
      setForm({ title: "", description: "", coverUrl: "" });
      fetchPodcasts();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo podcast!");
    }
  }

  // === DELETE PODCAST ===
  async function deletePodcast(id: string) {
    if (!confirm("Bạn có chắc muốn xoá podcast này không?")) return;
    try {
      const res = await fetch(`${API_BASE}/Podcast/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa podcast thất bại");
      alert("🗑️ Đã xoá podcast!");
      fetchPodcasts();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xoá podcast!");
    }
  }

  // === ADD EPISODE ===
  async function addEpisode() {
    if (!selectedPodcast) return alert("Chưa chọn podcast!");
    if (!newEpisode.title || !newEpisode.audioUrl)
      return alert("Cần tiêu đề và audio!");

    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập!");

    try {
      const payload = {
        podcastId: selectedPodcast.id,
        title: newEpisode.title,
        audioUrl: newEpisode.audioUrl,
        duration: newEpisode.duration || 0,
        episodeNumber: newEpisode.episodeNumber,
        articleId: "97d60a53-9fc7-4c65-b3fb-6413c20ed2aa",
      };

      const res = await fetch(`${API_BASE}/PodcastEpisode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi khi thêm tập");

      alert("✅ Đã thêm tập mới!");
      setNewEpisode({ title: "", audioUrl: "", duration: 0, episodeNumber: 1 });
      fetchPodcasts();

      // cập nhật podcast hiện tại
      const updated = await fetch(`${API_BASE}/Podcast/${selectedPodcast.id}`);
      setSelectedPodcast(await updated.json());
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi thêm tập!");
    }
  }

  // === UI ===
  if (loading)
    return (
      <div className="text-center py-10 text-gray-600 animate-pulse">
        Đang tải podcast...
      </div>
    );

    
  return (
    <div className="p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-amber-900">
        🎧 Quản lý Podcast
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded mb-4 transition"
      >
        ➕ Thêm Podcast
      </button>

      {/* === FORM TẠO PODCAST === */}
      {showForm && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded mb-4">
          <input
            className="border p-2 w-full mb-2 rounded"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="border p-2 w-full mb-2 rounded"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="mb-2"
          />
          {uploading && (
            <p className="text-sm text-gray-500 mb-2">Đang upload...</p>
          )}
          {form.coverUrl && (
            <img
              src={form.coverUrl}
              alt="cover"
              className="h-32 rounded mb-2 border"
            />
          )}
          <button
            onClick={createPodcast}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            ✅ Lưu
          </button>
        </div>
      )}

      {/* === DANH SÁCH PODCAST === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {podcasts.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded bg-white shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.coverUrl}
                alt={p.title}
                className="h-20 w-20 object-cover rounded border"
              />
              <div>
                <h3 className="font-semibold text-lg text-amber-900">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-xs text-gray-500">
                  {p.episodes?.length || 0} tập
                </p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setSelectedPodcast(p)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
              >
                📂 Quản lý tập
              </button>
              <button
                onClick={() => deletePodcast(p.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL QUẢN LÝ TẬP === */}
      {selectedPodcast && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-start pt-10 overflow-auto z-50">
          <div className="bg-white rounded-xl p-6 w-[600px] relative shadow-lg">
            <button
              onClick={() => setSelectedPodcast(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-amber-900">
              🎙️ {selectedPodcast.title} – Quản lý tập
            </h2>

            {selectedPodcast.episodes?.map((e) => (
              <div key={e.id} className="border p-2 rounded mb-2">
                <p className="font-medium text-amber-800">
                  {e.episodeNumber}. {e.title}
                </p>
                <audio controls src={e.audioUrl} className="w-full mt-1" />
              </div>
            ))}

            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2 text-amber-900">
                ➕ Thêm tập mới
              </h3>
              <input
                className="border p-2 w-full mb-2 rounded"
                placeholder="Tiêu đề"
                value={newEpisode.title}
                onChange={(e) =>
                  setNewEpisode({ ...newEpisode, title: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2 rounded"
                type="number"
                placeholder="Số tập"
                value={newEpisode.episodeNumber}
                onChange={(e) =>
                  setNewEpisode({
                    ...newEpisode,
                    episodeNumber: parseInt(e.target.value),
                  })
                }
              />
              <input
                type="file"
                accept="audio/*"
                onChange={uploadAudio}
                className="mb-2"
              />
              {uploading && (
                <p className="text-sm text-gray-500 mb-2">Đang upload...</p>
              )}
              {newEpisode.audioUrl && (
                <audio
                  controls
                  src={newEpisode.audioUrl}
                  className="w-full mb-2"
                />
              )}
              <button
                onClick={addEpisode}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
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
