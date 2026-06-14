"use client";

import * as React from "react";
import { TrainingAnalytics } from "@/components/dashboard/training-analytics";

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-text-main">
          Báo cáo & Phân tích Đào tạo
        </h1>
        <p className="text-text-sub text-sm mt-1">
          Theo dõi tiến độ học viên, tỷ lệ hoàn thành và xuất báo cáo.
        </p>
      </div>

      <TrainingAnalytics />
    </div>
  );
}
