"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export function RegisterSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const { toast } = useToast();

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearError = (field: "name" | "email" | "phone") => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ. Vui lòng kiểm tra lại.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const timestamp = Date.now();
      const leadId = `LEAD-${timestamp}`;
      const customerId = `CUS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Check for duplicate lead by email
      const existingLead = await getDocs(
        query(collection(db, "Lead"), where("email", "==", email.trim()))
      );
      if (!existingLead.empty) {
        toast({
          title: "Email đã được đăng ký!",
          description: "Email này đã nằm trong danh sách tư vấn. Vui lòng chờ đội ngũ liên hệ.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "Lead"), {
        lead_id: leadId,
        customer_id: customerId,
        name: name.trim(),
        email: email.trim(),
        sdt: phone.trim(),
        lead_status: "new",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Đăng ký thành công!",
        description: "Đội ngũ tư vấn sẽ liên hệ trong 24h.",
        variant: "success",
      });

      setName("");
      setEmail("");
      setPhone("");
      setErrors({});
    } catch {
      toast({
        title: "Đăng ký thất bại!",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" className="py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Sẵn Sàng Bắt Đầu Chưa?
            </h2>
            <p className="text-text-sub text-base max-w-xl mx-auto">
              Để lại thông tin, đội ngũ tư vấn sẽ liên hệ trong 24h
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-lg mx-auto">
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullname">
                  Họ và tên <span className="text-primary">*</span>
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  style={
                    errors.name
                      ? ({ borderColor: "#ef4444" } as React.CSSProperties)
                      : undefined
                  }
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reg-email">
                  Email <span className="text-primary">*</span>
                </Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  style={
                    errors.email
                      ? ({ borderColor: "#ef4444" } as React.CSSProperties)
                      : undefined
                  }
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reg-phone">
                  Số điện thoại{" "}
                  <span className="text-text-sub/50">(tùy chọn)</span>
                </Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="0901 234 567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            </form>
          </ScrollReveal>


          <ScrollReveal delay={240}>
            <div className="mt-6 text-center">
              <p className="text-text-sub text-sm mb-2">
                Hotline tư vấn trực tiếp
              </p>
              <a
                href="tel:0907951800"
                className="font-heading font-extrabold text-2xl text-primary hover:text-primary-hover transition-colors"
              >
                📞 0907.951.800
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
