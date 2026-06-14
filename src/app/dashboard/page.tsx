"use client";

import * as React from "react";
import {
  Users,
  BookOpen,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CustomerTable } from "@/components/dashboard/customer-table";
import { LessonManager } from "@/components/dashboard/lesson-manager";
import { ClassManager } from "@/components/dashboard/class-manager";

const stats = [
  {
    label: "Tổng học viên",
    value: "24",
    sub: "Đã đăng ký",
    icon: Users,
    color: "#DF6B33",
    bg: "rgba(223, 107, 51, 0.1)",
  },
  {
    label: "Bài học",
    value: "8",
    sub: "Buổi học",
    icon: BookOpen,
    color: "#6366F1",
    bg: "rgba(99, 102, 241, 0.1)",
  },
  {
    label: "Lớp học",
    value: "2",
    sub: "Đang hoạt động",
    icon: CalendarDays,
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
  },
  {
    label: "Tỷ lệ chuyển đổi",
    value: "12%",
    sub: "Đăng ký / lượt xem",
    icon: TrendingUp,
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-text-main">
          Tổng quan Dashboard
        </h1>
        <p className="text-text-sub text-sm mt-1">
          Chào mừng bạn quay trở lại, đây là trang quản lý khóa học.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border bg-bg-card hover:border-primary/30 transition-all duration-300"
          >
            <CardContent className="p-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="font-heading font-bold text-2xl text-text-main">
                {stat.value}
              </p>
              <p className="text-text-sub text-xs mt-0.5">{stat.label}</p>
              <Badge variant="outline" className="mt-2 text-[10px]">
                {stat.sub}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="bg-bg-card border border-border p-1 rounded-xl mb-6">
          <TabsTrigger
            value="customers"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Users className="w-4 h-4 mr-1.5" />
            Học viên
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Bài học
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <CalendarDays className="w-4 h-4 mr-1.5" />
            Lớp học
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomerTable />
        </TabsContent>
        <TabsContent value="lessons">
          <LessonManager />
        </TabsContent>
        <TabsContent value="classes">
          <ClassManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
