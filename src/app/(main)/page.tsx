"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ROUTES from "../../router/routes";
import {
  Play,
  ArrowRight,
  ShoppingCart,
  Bookmark,
  Heart,
  Share2,
  ListMusic,
} from "lucide-react";
import { Article, Podcast, PodcastEpisode, Product } from "@/types/entities";
import api from "../../lib/api";

export type ProductMapped = Product & {
  image: string;
  priceFormatted: string;
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [podcasts, setPodcasts] = useState<
    (Podcast & { episodes: PodcastEpisode[] })[]
  >([]);
  const [products, setProducts] = useState<ProductMapped[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [articlesRes, podcastsRes, productsRes] = await Promise.all([
          api.get<Article[]>("/Article/published"),
          api.get<(Podcast & { episodes: PodcastEpisode[] })[]>(
            "/podcast/with-episodes"
          ),
          api.get<Product[]>("/Product"),
        ]);

        // 📰 Bài viết
        const mappedArticles: Article[] = articlesRes.data.map((a) => ({
          ...a,
          image: a.coverUrl || "/img/default.jpg",
        }));

        // 🎧 Podcast
        const mappedPodcasts: (Podcast & { episodes: PodcastEpisode[] })[] =
          podcastsRes.data.map((p) => ({
            ...p,
            episodes: (p.episodes ?? [])
              .filter((ep) => !ep.isDeleted)
              .sort((a, b) => a.episodeNumber - b.episodeNumber)
              .slice(0, 3),
          }));

        // 🛍️ Product
        const mappedProducts: ProductMapped[] = productsRes.data.map((p) => {
          let parsedImages: string[] = [];
          try {
            parsedImages = Array.isArray(p.images)
              ? p.images
              : JSON.parse(p.images || "[]");
          } catch {
            parsedImages = [];
          }

          return {
            ...p,
            image: parsedImages[0] || "/img/default.jpg",
            priceFormatted: p.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }),
          };
        });

        setArticles(mappedArticles);
        setPodcasts(mappedPodcasts);
        setProducts(mappedProducts);
      } catch (error) {
        console.error("❌ Lỗi khi fetch API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen font-sans bg-amber-50">
      {/* 🌅 Hero Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-amber-50">
            <h1 className="font-serif text-5xl font-bold mb-4">
              Khám phá lịch sử Việt Nam
            </h1>
            <p className="text-lg mb-6">
              Hành trình tìm hiểu văn hóa, lịch sử và con người Việt Nam qua
              những câu chuyện sinh động.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={ROUTES.ARTICLE}
                className="bg-amber-600 hover:bg-amber-500 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
              >
                Bắt đầu khám phá
              </Link>
              <Link
                href={ROUTES.PODCAST}
                className="bg-transparent border-2 border-amber-50 hover:bg-amber-50 hover:text-amber-900 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
              >
                Xem podcast
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 📰 Articles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Bài viết nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const image = article.coverUrl || "/img/default.jpg";
              const description =
                article.content.length > 120
                  ? article.content.slice(0, 120) + "..."
                  : article.content;
              return (
                <div
                  key={article.id}
                  className="bg-amber-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{description}</p>
                    <Link
                      href={`${ROUTES.ARTICLE}/${article.id}`}
                      className="text-amber-700 flex items-center hover:text-amber-500 transition-colors"
                    >
                      <span>Đọc tiếp</span>
                      <ArrowRight className="ml-1 w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              href={ROUTES.ARTICLE}
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </section>

      {/* 🎧 Podcast Section */}
      <section className="py-16 bg-amber-900 text-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Podcast mới nhất
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {podcasts[0] && (
              <div className="p-6 bg-amber-800 rounded-xl">
                <div className="flex items-center mb-6">
                  <img
                    src={podcasts[0].coverUrl || "/img/default.jpg"}
                    alt="Podcast Cover"
                    className="w-24 h-24 object-cover rounded-lg shadow-lg mr-4"
                  />
                  <div>
                    <h3 className="font-serif text-2xl font-bold">
                      {podcasts[0].title}
                    </h3>
                    <p className="text-amber-300">
                      {podcasts[0].description}
                    </p>
                  </div>
                </div>

                {podcasts[0].episodes[0] && (
                  <div className="bg-amber-950 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2">
                      {podcasts[0].episodes[0].title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <button className="bg-amber-500 hover:bg-amber-400 rounded-full w-12 h-12 flex items-center justify-center transition-colors">
                        <Play className="w-6 h-6 text-white" />
                      </button>
                      <span className="text-amber-300 text-sm">
                        {Math.floor(podcasts[0].episodes[0].duration / 60)}:
                        {(podcasts[0].episodes[0].duration % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button className="flex items-center text-amber-300 hover:text-amber-200 transition-colors">
                    <ListMusic className="w-5 h-5 mr-1" />
                    <span>Xem tất cả tập</span>
                  </button>
                  <div className="flex space-x-2">
                    <Bookmark className="w-5 h-5 text-amber-300 cursor-pointer hover:text-amber-100" />
                    <Heart className="w-5 h-5 text-amber-300 cursor-pointer hover:text-amber-100" />
                    <Share2 className="w-5 h-5 text-amber-300 cursor-pointer hover:text-amber-100" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-2xl font-serif font-bold mb-6">
                Tập podcast gần đây
              </h3>
              <div className="space-y-4">
                {podcasts[0]?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="bg-amber-800/50 p-4 rounded-lg hover:bg-amber-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{ep.title}</h4>
                        <span className="text-amber-300 text-sm">
                          {Math.floor(ep.duration / 60)}:
                          {(ep.duration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <button className="bg-amber-500 hover:bg-amber-400 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                        <Play className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ Products Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Sản phẩm nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded text-sm font-medium">
                    {product.priceFormatted}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-700">
                      {product.priceFormatted}
                    </span>
                    <button className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-full transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href={ROUTES.SHOP}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-6 py-3 rounded-full font-medium transition-colors"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
