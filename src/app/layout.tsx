// ✅ Đây là ROOT layout thực sự, bắt buộc phải có trong Next.js 13+

export const metadata = {
    title: "Memoirs Vietnam",
    description: "Khám phá lịch sử Việt Nam qua câu chuyện và hình ảnh.",
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="vi">
        <body className="min-h-screen bg-amber-50 font-sans">
          {children}
        </body>
      </html>
    );
  }
  