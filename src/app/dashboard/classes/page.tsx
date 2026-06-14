"use client";

import { ClassManager } from "@/components/dashboard/class-manager";

export default function ClassesPage() {
  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text-main">
          Quản lý lớp học
        </h1>
        <p className="text-text-sub text-sm mt-1">
          Xem lịch học trực quan dạng calendar và quản lý thông tin các buổi học.
        </p>
      </div>
      <ClassManager />
    </div>
  );
}
