"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const API_BASE = "https://localhost:7003/api";

export default function ArticleManager() {
  const [eras, setEras] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null); // ✅ điều khiển xem chi tiết

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    content: "",
    coverUrl: "",
    yearStart: 0,
    yearEnd: 0,
    eraId: "",
    sources: "",
    publishedAt: new Date().toISOString(),
  });

  // ✅ Load Era + Article
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eraRes, artRes] = await Promise.all([
          axios.get(`${API_BASE}/Era`),
          axios.get(`${API_BASE}/Article/published`),
        ]);
        setEras(eraRes.data);
        setArticles(Array.isArray(artRes.data) ? artRes.data : [artRes.data]);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ Upload ảnh (Cloudinary)
  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "o2kexzas"); // preset của bạn
    formData.append("cloud_name", "dpghembhy"); // cloud_name của bạn

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpghembhy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();

    setForm((f) => ({ ...f, coverUrl: data.secure_url }));
    setImageUploading(false);
  };

  // ✅ Tạo hoặc cập nhật bài viết
  const handleSaveArticle = async () => {
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        coverUrl: form.coverUrl,
        yearStart: form.yearStart,
        yearEnd: form.yearEnd,
        eraId: form.eraId,
        sources: form.sources,
        publishedAt: form.publishedAt,
      };

      if (form.id) {
        await axios.put(`${API_BASE}/Article/${form.id}`, payload);
      } else {
        await axios.post(`${API_BASE}/Article`, payload);
      }

      const artRes = await axios.get(`${API_BASE}/Article/published`);
      setArticles(Array.isArray(artRes.data) ? artRes.data : [artRes.data]);

      setForm({
        id: "",
        title: "",
        slug: "",
        content: "",
        coverUrl: "",
        yearStart: 0,
        yearEnd: 0,
        eraId: "",
        sources: "",
        publishedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Lỗi khi lưu bài viết:", err);
      alert("Lỗi khi lưu bài viết!");
    }
  };

  // ✅ Xóa bài viết
  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    await axios.delete(`${API_BASE}/Article/${id}`);
    setArticles(articles.filter((a) => a.id !== id));
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-amber-600">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-8 space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">
          📰 Quản lý bài viết lịch sử
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 bg-amber-100 p-4 rounded-lg text-amber-900">
          <input
            placeholder="Tiêu đề bài viết"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-2 rounded border"
          />
          <input
            placeholder="Slug (đường dẫn)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="p-2 rounded border"
          />
          <textarea
            placeholder="Nội dung bài viết"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="p-2 rounded border col-span-2 min-h-[120px]"
          />
          <input
            type="number"
            placeholder="Năm bắt đầu"
            value={form.yearStart}
            onChange={(e) =>
              setForm({ ...form, yearStart: parseInt(e.target.value) })
            }
            className="p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Năm kết thúc"
            value={form.yearEnd}
            onChange={(e) =>
              setForm({ ...form, yearEnd: parseInt(e.target.value) })
            }
            className="p-2 rounded border"
          />
          <select
            value={form.eraId}
            onChange={(e) => setForm({ ...form, eraId: e.target.value })}
            className="p-2 rounded border col-span-2"
          >
            <option value="">-- Chọn thời kỳ lịch sử --</option>
            {eras.map((era) => (
              <option key={era.id} value={era.id}>
                {era.name} ({era.yearStart} - {era.yearEnd})
              </option>
            ))}
          </select>
          <textarea
            placeholder='Nguồn tham khảo (ví dụ: ["Đại Nam Thực Lục"])'
            value={form.sources}
            onChange={(e) => setForm({ ...form, sources: e.target.value })}
            className="p-2 rounded border col-span-2"
          />

          {/* Upload ảnh */}
          <div className="col-span-2 flex items-center gap-3">
            <input type="file" onChange={handleUploadImage} />
            {imageUploading && <span>Đang tải ảnh...</span>}
            {form.coverUrl && (
              <Image
                src={form.coverUrl}
                alt="cover"
                width={80}
                height={80}
                className="rounded border"
              />
            )}
          </div>

          <button
            onClick={handleSaveArticle}
            className="col-span-2 bg-amber-700 text-white font-semibold py-2 rounded"
          >
            {form.id ? "Cập nhật bài viết" : "Thêm bài viết"}
          </button>
        </div>

        {/* Danh sách bài viết */}
        <div className="mt-6 grid gap-4">
          {articles.map((a) => {
            const isExpanded = expandedId === a.id;
            return (
              <div
                key={a.id}
                className="bg-amber-800 text-white p-4 rounded-lg flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {a.coverUrl && (
                      <Image
                        src={a.coverUrl}
                        alt={a.title}
                        width={80}
                        height={80}
                        className="rounded border border-amber-300 object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold">{a.title}</h3>
                      <p className="text-sm text-amber-200">
                        {a.era?.name || "Không rõ thời kỳ"}
                      </p>
                      <p>
                        {a.yearStart} - {a.yearEnd}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : a.id)}
                      className="px-3 py-1 bg-amber-500 rounded"
                    >
                      {isExpanded ? "Ẩn nội dung" : "Xem nội dung"}
                    </button>
                    <button
                      onClick={() =>
                        setForm({
                          id: a.id,
                          title: a.title,
                          slug: a.slug,
                          content: a.content,
                          coverUrl: a.coverUrl,
                          yearStart: a.yearStart,
                          yearEnd: a.yearEnd,
                          eraId: a.eraId,
                          sources: a.sources,
                          publishedAt: a.publishedAt,
                        })
                      }
                      className="px-3 py-1 bg-blue-500 rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(a.id)}
                      className="px-3 py-1 bg-red-500 rounded"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {/* ✅ Hiển thị nội dung bài viết */}
                {isExpanded && (
                  <div className="bg-amber-700 text-white p-3 rounded mt-2">
                    <h4 className="font-semibold mb-1">📖 Nội dung:</h4>
                    <p className="whitespace-pre-wrap break-words max-w-full">
                      {a.content}
                    </p>

                    {a.sources && (
                      <div className="mt-2 text-sm text-amber-200 break-words">
                        <strong>Nguồn:</strong>{" "}
                        {Array.isArray(JSON.parse(a.sources))
                          ? JSON.parse(a.sources).join(", ")
                          : a.sources}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
