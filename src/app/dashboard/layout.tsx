"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Báo cáo đào tạo",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Quản lý học viên",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Quản lý bài học",
    href: "/dashboard/lessons",
    icon: BookOpen,
  },
  {
    label: "Quản lý lớp học",
    href: "/dashboard/classes",
    icon: CalendarDays,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-bg-card border-r border-border flex flex-col transition-all duration-300 z-40",
          sidebarCollapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-heading font-bold text-lg text-text-main whitespace-nowrap">
              Phuongtaichinh
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-text-sub hover:bg-bg hover:text-text-main"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-text-sub group-hover:text-text-main"
                  )}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center w-full p-2 rounded-xl text-text-sub hover:bg-bg hover:text-text-main transition-colors"
            aria-label={sidebarCollapsed ? "Mở rộng sidebar" : "Thu nhỏ sidebar"}
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Back to site */}
        <div className="p-3 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium text-text-sub hover:bg-bg hover:text-text-main transition-colors"
          >
            <ChevronLeft className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Quay lại trang chủ</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
