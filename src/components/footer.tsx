"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export function Footer() {
  const [footerEmail, setFooterEmail] = useState("");
  const { toast } = useToast();

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail.trim()) {
      return;
    }
    if (!validateEmail(footerEmail)) {
      toast({
        title: "Email không hợp lệ",
        description: "Vui lòng kiểm tra lại email.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Đăng ký nhận tin thành công!",
      description: "Bạn sẽ nhận được bộ tài liệu miễn phí qua email.",
      variant: "success",
    });
    setFooterEmail("");
  };

  return (
    <footer className="bg-bg-darker border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-heading font-extrabold text-lg inline-block mb-3"
            >
              <span className="text-primary">Phuong</span>
              <span className="text-white">taichinh</span>
            </Link>
            <p className="text-text-sub text-sm leading-relaxed">
              Luyện thi chứng chỉ hành nghề chứng khoán. Hệ thống kiến thức
              bài bản, tập trung thực chiến.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Liên hệ</h4>
            <div className="space-y-3">
              <a
                href="tel:0907951800"
                className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                0907.951.800
              </a>
              <a
                href="mailto:phuongnt91188@gmail.com"
                className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                phuongnt91188@gmail.com
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="font-heading font-bold text-sm mb-3">
              Nhận bộ tài liệu miễn phí
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm">
                Đăng ký
              </Button>
            </form>
            <p className="text-text-sub text-xs mt-2">
              Nhận giáo trình & flashcard miễn phí qua email.
            </p>
          </div>
        </div>

        <Separator className="mt-10 mb-6" />

        <div className="text-center">
          <p className="text-text-sub text-xs">
            © 2026 Phuongtaichinh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
