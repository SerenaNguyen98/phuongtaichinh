"use client";

import { CustomerTable } from "@/components/dashboard/customer-table";

export default function CustomersPage() {
  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text-main">
          Quản lý học viên
        </h1>
        <p className="text-text-sub text-sm mt-1">
          Theo dõi danh sách học viên đã đăng ký từ collection customer trên Firestore.
        </p>
      </div>
      <CustomerTable />
    </div>
  );
}
