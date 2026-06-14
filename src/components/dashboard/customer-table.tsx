"use client";

import * as React from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Mail, Phone, Trash2, RefreshCw, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export function CustomerTable() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const { toast } = useToast();

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || "").includes(q)
    );
  });

  React.useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Customer[];
        setCustomers(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
        toast({
          title: "Lỗi kết nối",
          description: "Không thể tải danh sách học viên. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    );

    return () => unsub();
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa học viên này?")) return;

    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "customers", id));
      toast({ title: "Đã xóa học viên thành công!" });
    } catch {
      toast({
        title: "Lỗi xóa",
        description: "Không thể xóa học viên. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[];
      setCustomers(data);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-sub text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-lg text-text-main">
            Danh sách học viên
          </h2>
          <Badge variant="secondary">{filtered.length} / {customers.length} người</Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-sub pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm họ tên, email, SĐT..."
              className="h-9 pl-9 pr-8 rounded-lg border border-border bg-bg-card text-text-main text-sm placeholder:text-text-sub/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors w-64"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-text-sub border-border hover:bg-bg hover:text-text-main h-9"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Làm mới
          </Button>
        </div>
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-text-sub/50" />
          </div>
          <p className="text-text-sub text-sm">
            {customers.length === 0
              ? "Chưa có học viên nào đăng ký."
              : "Không tìm thấy học viên phù hợp."}
          </p>
          {search && (
            <p className="text-text-sub/60 text-xs mt-1">
              Thử từ khóa khác hoặc{" "}
              <button onClick={() => setSearch("")} className="text-primary hover:underline">
                xóa bộ lọc
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Họ tên
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    SĐT
                  </div>
                </TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-text-sub/60">{index + 1}</TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-text-sub">
                    <a
                      href={`mailto:${customer.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {customer.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-text-sub">
                    {customer.phone || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                      disabled={deletingId === customer.id}
                      className={cn(
                        "text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors",
                        deletingId === customer.id && "opacity-50"
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
