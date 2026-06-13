"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#documents", label: "Tài Liệu Free" },
  { href: "#course", label: "Khóa học" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(9,10,20,0.95)] backdrop-blur-xl border-b border-border"
          : "bg-[rgba(9,10,20,0.6)] backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-extrabold text-xl tracking-tight">
          <span className="text-primary">Phuong</span>
          <span className="text-white">taichinh</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-sub hover:text-white transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-text-sub hover:text-white transition-colors text-sm font-medium px-3"
          >
            Đăng nhập
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-bg-card border-t border-border">
          <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-sub hover:text-white transition-colors text-sm font-medium py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-text-sub hover:text-white transition-colors text-sm font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
