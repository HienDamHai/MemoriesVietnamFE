"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://localhost:7003/api";

type Era = {
  id?: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  description: string;
};

export default function EraManager() {
  const [eras, setEras] = useState<Era[]>([]);
  const [form, setForm] = useState<Era>({
    name: "",
    yearStart: 0,
    yearEnd: 0,
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load danh sách thời kỳ
  useEffect(() => {
    const fetchEras = async () => {
      try {
        const res = await axios.get(`${API_BASE}/Era/active`);
        setEras(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải thời kỳ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEras();
  }, []);

  // ✅ Lưu (Thêm hoặc Cập nhật)
  const handleSave = async () => {
    try {
      if (!form.name.trim()) return alert("Vui lòng nhập tên thời kỳ");

      const payload = {
        name: form.name,
        yearStart: +form.yearStart,
        yearEnd: +form.yearEnd,
        description: form.description,
      };

      if (editingId) {
        await axios.put(`${API_BASE}/Era/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE}/Era`, payload);
      }

      const res = await axios.get(`${API_BASE}/Era/active`);
      setEras(res.data);

      // reset form
      setForm({ name: "", yearStart: 0, yearEnd: 0, description: "" });
      setEditingId(null);
    } catch (err) {
      console.error("❌ Lỗi khi lưu thời kỳ:", err);
      alert("Không thể lưu thời kỳ!");
    }
  };

  // ✅ Xóa thời kỳ
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thời kỳ này?")) return;
    try {
      await axios.delete(`${API_BASE}/Era/${id}`);
      setEras(eras.filter((e) => e.id !== id));
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center text-amber-600 py-20">
        Đang tải dữ liệu thời kỳ...
      </div>
    );

  return (
    <div className="p-8 text-amber-900">
      <h1 className="text-3xl font-bold text-amber-700 mb-6">
        🏛️ Quản lý các thời kỳ lịch sử
      </h1>

      {/* FORM */}
      <div className="bg-amber-100 p-5 rounded-lg shadow mb-8 grid gap-3">
        <input
          type="text"
          placeholder="Tên thời kỳ (vd: Nhà Nguyễn)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Năm bắt đầu"
            value={form.yearStart}
            onChange={(e) =>
              setForm({ ...form, yearStart: parseInt(e.target.value) })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Năm kết thúc"
            value={form.yearEnd}
            onChange={(e) =>
              setForm({ ...form, yearEnd: parseInt(e.target.value) })
            }
            className="p-2 border rounded"
          />
        </div>
        <textarea
          placeholder="Mô tả thời kỳ..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSave}
          className="bg-amber-700 text-white py-2 rounded font-semibold hover:bg-amber-800 transition"
        >
          {editingId ? "💾 Cập nhật thời kỳ" : "➕ Thêm thời kỳ mới"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", yearStart: 0, yearEnd: 0, description: "" });
            }}
            className="bg-gray-400 text-white py-1 rounded hover:bg-gray-500"
          >
            Hủy chỉnh sửa
          </button>
        )}
      </div>

      {/* DANH SÁCH THỜI KỲ */}
      <div className="space-y-3">
        {eras.map((era) => (
          <div
            key={era.id}
            className="bg-amber-800 text-white p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-bold">{era.name}</h2>
              <p className="text-sm text-amber-200 italic">
                {era.yearStart} – {era.yearEnd}
              </p>
              <p className="text-sm">{era.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setForm({
                    name: era.name,
                    yearStart: era.yearStart,
                    yearEnd: era.yearEnd,
                    description: era.description,
                  });
                  setEditingId(era.id || null);
                }}
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(era.id!)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
