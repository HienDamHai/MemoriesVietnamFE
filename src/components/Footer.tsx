import React from "react";
import Link from "next/link";
import ROUTES from "../router/routes";
import "../app/globals.css";

export const Footer = () => {
  return (
    <footer className="bg-amber-900 text-amber-50 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl font-bold mb-1">Memoirs Vietnam</h3>
          <p className="text-sm text-amber-200">
            Hành trình khám phá lịch sử, văn hóa và con người Việt Nam.
          </p>
        </div>
        <div className="text-center text-sm text-amber-300">
          © 2025 Memoirs Vietnam. All rights reserved.
        </div>
        <div>
          <h4 className="font-bold mb-1">Kết nối với chúng tôi</h4>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/sweetalv/" className="hover:text-amber-200">
              Facebook
            </a>
            <a href="https://www.tiktok.com/@khoinguondatviet?" className="hover:text-amber-200">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
