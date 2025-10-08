"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const API_BASE = "https://localhost:7003/api";

export default function ProductManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    images: [] as string[],
  });
  const [imageUploading, setImageUploading] = useState(false);

  // ✅ Load category + product
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE}/Category/active`),
          axios.get(`${API_BASE}/Product`),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ✅ Upload ảnh Cloudinary
  const handleUploadImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "o2kexzas"); // ⚠️ Thay bằng preset của bạn
    formData.append("cloud_name", "dpghembhy"); // ⚠️ Thay bằng cloud_name của bạn

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpghembhy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();

    setForm((f) => ({ ...f, images: [...f.images, data.secure_url] }));
    setImageUploading(false);
  };

  // ✅ Tạo / Cập nhật Category
  const handleSaveCategory = async () => {
    try {
      const payload = { name: newCategory };

      console.log("📦 [DEBUG] Category payload gửi đi:", payload);
      if (editingCategory) {
        console.log("🟡 Cập nhật category:", editingCategory.id);
        await axios.put(`${API_BASE}/Category/${editingCategory.id}`, payload);
      } else {
        console.log("🟢 Tạo category mới");
        await axios.post(`${API_BASE}/Category`, payload);
      }

      setNewCategory("");
      setEditingCategory(null);

      const res = await axios.get(`${API_BASE}/Category/active`);
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lưu thể loại:", err);
      alert("Lỗi khi lưu thể loại!");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thể loại này?")) return;
    await axios.delete(`${API_BASE}/Category/${id}`);
    setCategories(categories.filter((c) => c.id !== id));
  };

  // ✅ Tạo / Cập nhật Product
  const handleSaveProduct = async () => {
    try {
      const payload = {
        ...form,
        images: form.images,
      };

      console.log("📦 [DEBUG] Product payload gửi đi:", payload);

      if (form.id) {
        console.log("🟡 Cập nhật sản phẩm:", form.id);
        await axios.put(`${API_BASE}/Product/${form.id}`, payload);
      } else {
        console.log("🟢 Tạo sản phẩm mới");
        await axios.post(`${API_BASE}/Product`, payload);
      }

      const prodRes = await axios.get(`${API_BASE}/Product`);
      setProducts(prodRes.data);

      setForm({
        id: "",
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
        images: [],
      });
    } catch (err) {
      console.error("❌ Lỗi khi lưu sản phẩm:", err);
      alert("Lỗi khi lưu sản phẩm!");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    await axios.delete(`${API_BASE}/Product/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-amber-600">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-8 space-y-10">
      {/* CATEGORY MANAGEMENT */}
      <section>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">
          📚 Quản lý thể loại
        </h2>

        <div className="flex gap-3 mb-4">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Tên thể loại..."
            className="p-2 rounded bg-amber-100 text-amber-900 flex-1"
          />
          <button
            onClick={handleSaveCategory}
            className="bg-amber-600 px-4 py-2 rounded text-white font-semibold"
          >
            {editingCategory ? "Cập nhật" : "Thêm"}
          </button>
          {editingCategory && (
            <button
              onClick={() => {
                setEditingCategory(null);
                setNewCategory("");
              }}
              className="bg-gray-400 px-3 py-2 rounded text-white"
            >
              Hủy
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex justify-between bg-amber-800 p-3 rounded text-white items-center"
            >
              <span>{c.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(c);
                    setNewCategory(c.name);
                  }}
                  className="px-2 py-1 bg-blue-500 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="px-2 py-1 bg-red-500 rounded"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* PRODUCT MANAGEMENT */}
      <section>
        <h2 className="text-2xl font-bold text-amber-300 mb-4">
          🛍️ Quản lý sản phẩm
        </h2>

        <div className="grid grid-cols-2 gap-4 bg-amber-100 p-4 rounded-lg text-amber-900">
          <input
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 rounded border"
          />
          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="p-2 rounded border"
          />
          <textarea
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 rounded border col-span-2"
          />
          <input
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            className="p-2 rounded border"
          />
          <input
            type="number"
            placeholder="Số lượng tồn"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: +e.target.value })}
            className="p-2 rounded border"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="p-2 rounded border col-span-2"
          >
            <option value="">-- Chọn thể loại --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Upload ảnh */}
          <div className="col-span-2 flex flex-wrap gap-3 items-center">
            <input type="file" onChange={handleUploadImage} />
            {imageUploading && <span>Đang tải ảnh...</span>}
            {Array.isArray(form.images) &&
              form.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <Image
                    src={img}
                    alt="preview"
                    width={50}
                    height={50}
                    className="rounded border"
                  />
                </div>
              ))}
          </div>

          <button
            onClick={handleSaveProduct}
            className="col-span-2 bg-amber-700 text-white font-semibold py-2 rounded"
          >
            {form.id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mt-6 grid gap-4">
          {products.map((p) => {
            let imgs: string[] = [];
            try {
              imgs =
                typeof p.images === "string"
                  ? JSON.parse(p.images)
                  : p.images || [];
            } catch {
              imgs = [];
            }

            return (
              <div
                key={p.id}
                className="bg-amber-800 text-white p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  {imgs.length > 0 && (
                    <Image
                      src={imgs[0]}
                      alt={p.name}
                      width={60}
                      height={60}
                      className="rounded-lg border border-amber-300 object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{p.name}</h3>
                    <p className="text-sm text-amber-200">{p.category?.name}</p>
                    <p>{p.price.toLocaleString()}đ</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setForm({
                        ...p,
                        images: imgs, // ✅ Đảm bảo ảnh hiển thị lại đúng trong form
                      })
                    }
                    className="px-3 py-1 bg-blue-500 rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="px-3 py-1 bg-red-500 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
