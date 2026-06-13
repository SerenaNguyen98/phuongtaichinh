"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User, Award } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatCard } from "@/components/stat-card";

const stats = [
  { value: "8", label: "Buổi thực chiến" },
  { value: "60", label: "Câu hỏi luyện tập" },
  { value: "100+", label: "Flashcard - Mindmap" },
];

export function HeroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-base">🔥</span> Khai giảng tháng 7/2026
              </span>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
                Luyện thi{" "}
                <span className="gradient-text">chứng chỉ hành nghề</span>{" "}
                chứng khoán
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="text-text-sub text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Khóa học 8 buổi thực chiến tập trung giải đề, luôn update đề
                thi mới.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="#register"
                  className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[0.98]"
                >
                  Đăng Ký Khóa Học
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-text-sub line-through text-sm">
                  10.000.000đ
                </span>
                <span className="font-heading font-extrabold text-2xl text-white">
                  7.000.000đ
                </span>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                  Giảm 30%
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Visual */}
          <div className="lg:col-span-2 flex justify-center">
            <ScrollReveal delay={160}>
              <div className="relative w-full max-w-sm mx-auto">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, #DF6B33, #F4A261, #DF6B33)",
                    opacity: 0.3,
                    filter: "blur(2px)",
                    transform: "scale(1.1)",
                  }}
                />
                <div
                  className="relative rounded-full overflow-hidden w-full aspect-square border-4"
                  style={{
                    borderColor: "#1F2030",
                    boxShadow: "0 0 60px rgba(223, 107, 51, 0.2)",
                  }}
                >
                  {!imgError ? (
                    <Image
                      src="https://i.ibb.co/d4rKjQyR/avatar.jpg"
                      alt="Giảng viên Phương Tài Chính"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover object-center"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-bg-card flex-col items-center justify-center gap-4 flex">
                      <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                      <p className="text-text-sub text-sm font-medium text-center px-4">
                        Giảng viên
                      </p>
                    </div>
                  )}
                </div>
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-bg-card border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-white">
                    Chứng chỉ hành nghề
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-14 md:mt-16 grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((s) => (
            <ScrollReveal key={s.value} delay={200}>
              <StatCard value={s.value} label={s.label} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
