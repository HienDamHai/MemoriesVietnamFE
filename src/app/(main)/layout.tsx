import "@/app/globals.css";
import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "../../components/CartSidebar";

export const metadata = {
  title: "Memoirs Vietnam",
  description: "Website lịch sử Việt Nam cho Gen Z",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col font-sans bg-amber-50" id="webcrumbs">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
