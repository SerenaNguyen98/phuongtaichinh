"use client";

import { CustomerTable } from "@/components/dashboard/customer-table";

export default function CustomersPage() {
  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text-main">
          Quản lý Leads & Học Viên
        </h1>
        <p className="text-text-sub text-sm mt-1">
          Theo dõi và quản lý danh sách leads, chuyển đổi thành học viên khi cần.
        </p>
      </div>
      <CustomerTable />
    </div>
  );
}
