import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Khóa Luyện Thi Chứng Chỉ Hành Nghề Chứng Khoán | Phuongtaichinh",
  description:
    "Khóa học thực chiến 8 buổi luyện thi chứng chỉ hành nghề chứng khoán (Quản Lý Quỹ). Đăng ký ngay để nhận tư vấn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
