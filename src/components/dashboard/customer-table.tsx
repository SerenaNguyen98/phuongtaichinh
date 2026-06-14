"use client";

import * as React from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Mail, Phone, Trash2, RefreshCw, Search, X, GraduationCap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
const STATUS_OPTIONS = [
  { value: "new", label: "Mới" },
  { value: "consulting", label: "Đang Tư Vấn" },
  { value: "student", label: "Học Viên" },
];

const DEFAULT_COURSE_ID = "COURSE-DEFAULT";

interface Lead {
  id: string;
  lead_id: string;
  customer_id: string;
  name: string;
  email: string;
  sdt: string;
  lead_status: string;
  createdAt?: string;
}

interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  sdt: string;
  lead_id: string;
  account_id: string;
  course_id: string;
  createdAt?: string;
}

export function CustomerTable() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"leads" | "students">("leads");
  const { toast } = useToast();

  const filteredLeads = leads.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.sdt || "").includes(q) ||
      (c.lead_id || "").toLowerCase().includes(q)
    );
  });

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.sdt || "").includes(q) ||
      (s.student_id || "").toLowerCase().includes(q)
    );
  });

  React.useEffect(() => {
    const unsubLeads = onSnapshot(
      query(collection(db, "Lead"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];
        setLeads(data);
      },
      (error) => {
        console.error("Firestore Lead error:", error);
        toast({
          title: "Lỗi kết nối",
          description: "Không thể tải danh sách leads.",
          variant: "destructive",
        });
      }
    );

    let studentMap: Record<string, string> = {};

    const unsubStudent = onSnapshot(collection(db, "Student"), (studentSnap) => {
      const m: Record<string, string> = {};
      studentSnap.docs.forEach((d) => {
        const s = d.data() as { student_id: string; sdt?: string };
        if (s.student_id) m[s.student_id] = s.sdt ?? "";
      });
      studentMap = m;
    });

    const unsubStudentsAccount = onSnapshot(
      query(collection(db, "Account"), where("type", "==", "student")),
      (accountSnap) => {
        const data = accountSnap.docs
          .map((doc) => {
            const d = doc.data() as Omit<Student, "id">;
            const sdt = d.student_id ? (studentMap[d.student_id] ?? "") : "";
            return { id: doc.id, ...d, sdt } as Student;
          })
          .sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ta = (a.createdAt as any)?.toMillis?.() ?? (typeof a.createdAt === "number" ? a.createdAt : 0);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tb = (b.createdAt as any)?.toMillis?.() ?? (typeof b.createdAt === "number" ? b.createdAt : 0);
            return tb - ta;
          });
        setStudents(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Account error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubLeads();
      unsubStudentsAccount();
      unsubStudent();
    };
  }, [toast]);

  const convertLeadToStudent = async (lead: Lead) => {
    try {
      const timestamp = Date.now();
      const studentId = `STU-${timestamp}`;
      const accountId = `ACC-${timestamp}`;
      const defaultPassword = "12345678";

      // Check if Account already exists for this lead_id (primary check — Account has name + email)
      const existingAccountSnap = await getDocs(
        query(collection(db, "Account"), where("lead_id", "==", lead.lead_id))
      );
      if (!existingAccountSnap.empty) {
        const existingAccount = existingAccountSnap.docs[0].data();
        await updateDoc(doc(db, "Lead", lead.id), { lead_status: "student" });
        toast({
          title: "Học viên đã được tạo trước đó",
          description: `Học viên "${existingAccount.name}" đã có tài khoản với email ${existingAccount.email}.`,
          variant: "destructive",
        });
        return;
      }

      // Fallback: check Student collection
      const existingStudentSnap = await getDocs(
        query(collection(db, "Student"), where("lead_id", "==", lead.lead_id))
      );
      if (!existingStudentSnap.empty) {
        const existingStudent = existingStudentSnap.docs[0].data();
        await updateDoc(doc(db, "Lead", lead.id), { lead_status: "student" });
        toast({
          title: "Học viên đã được tạo trước đó",
          description: `Học viên "${existingStudent.name}" đã có tài khoản với email ${existingStudent.email}.`,
          variant: "destructive",
        });
        return;
      }

      await addDoc(collection(db, "Account"), {
        account_id: accountId,
        email: lead.email,
        name: lead.name,
        student_id: studentId,
        type: "student",
        password: defaultPassword,
        lead_id: lead.lead_id,
        course_id: DEFAULT_COURSE_ID,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "Student"), {
        student_id: studentId,
        lead_id: lead.lead_id,
        name: lead.name,
        email: lead.email,
        sdt: lead.sdt || "",
        course_id: DEFAULT_COURSE_ID,
        account_id: accountId,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "Lead", lead.id), {
        lead_status: "student",
      });

      toast({
        title: "Chuyển đổi thành công!",
        description: `Đã tạo tài khoản cho ${lead.name}. Mật khẩu mặc định: ${defaultPassword}`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Lỗi chuyển đổi",
        description: "Không thể chuyển lead thành học viên. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    if (newStatus === "student") {
      await convertLeadToStudent(lead);
    } else {
      try {
        await updateDoc(doc(db, "Lead", lead.id), {
          lead_status: newStatus,
        });
        toast({ title: "Đã cập nhật trạng thái!" });
      } catch {
        toast({
          title: "Lỗi cập nhật",
          description: "Không thể cập nhật trạng thái.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lead này?")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "Lead", id));
      toast({ title: "Đã xóa lead thành công!" });
    } catch {
      toast({ title: "Lỗi xóa", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Xóa học viên ${student.name}? Thao tác này cũng xóa tài khoản.`)) return;
    setDeletingId(student.id);
    try {
      if (student.account_id) {
        const accountSnap = await import("firebase/firestore").then(({ query, where, getDocs }) =>
          getDocs(query(collection(db, "Account"), where("account_id", "==", student.account_id)))
        );
        for (const d of accountSnap.docs) {
          await deleteDoc(doc(db, "Account", d.id));
        }
      }
      const studentSnap = await import("firebase/firestore").then(({ query, where, getDocs }) =>
        getDocs(query(collection(db, "Student"), where("student_id", "==", student.student_id)))
      );
      for (const d of studentSnap.docs) {
        await deleteDoc(doc(db, "Student", d.id));
      }
      toast({ title: "Đã xóa học viên!" });
    } catch {
      toast({ title: "Lỗi xóa", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setLeads([]);
    setStudents([]);
    setTimeout(() => setLoading(false), 500);
  };

  if (loading && leads.length === 0 && students.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-sub text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const renderLeads = () => (
    <>
      {filteredLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-text-sub/50" />
          </div>
          <p className="text-text-sub text-sm">
            {leads.length === 0 ? "Chưa có lead nào." : "Không tìm thấy lead phù hợp."}
          </p>
          {search && (
            <button onClick={() => setSearch("")} className="text-primary hover:underline text-xs mt-1">
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Lead ID</TableHead>
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
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead, index) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-text-sub/60">{index + 1}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {lead.lead_id || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-text-sub">
                    <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                      {lead.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-text-sub">{lead.sdt || "—"}</TableCell>
                  <TableCell>
                    <StatusSelect
                      value={lead.lead_status || "new"}
                      onChange={(v) => handleStatusChange(lead, v)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={deletingId === lead.id}
                      className={cn(
                        "text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors",
                        deletingId === lead.id && "opacity-50"
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
    </>
  );

  const renderStudents = () => (
    <>
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-text-sub/50" />
          </div>
          <p className="text-text-sub text-sm">
            {students.length === 0 ? "Chưa có học viên nào." : "Không tìm thấy học viên phù hợp."}
          </p>
          {search && (
            <button onClick={() => setSearch("")} className="text-primary hover:underline text-xs mt-1">
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Student ID</TableHead>
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
                <TableHead>Account ID</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="text-text-sub/60">{index + 1}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                      {student.student_id || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-text-sub">
                    <a href={`mailto:${student.email}`} className="hover:text-primary transition-colors">
                      {student.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-text-sub">{student.sdt || "—"}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {student.account_id || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-text-sub bg-bg px-2 py-0.5 rounded">
                      {student.course_id || DEFAULT_COURSE_ID}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStudent(student)}
                      disabled={deletingId === student.id}
                      className={cn(
                        "text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors",
                        deletingId === student.id && "opacity-50"
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
    </>
  );

  return (
    <div className="space-y-4">
      {/* Search + Refresh — only show for leads/students tabs */}
      {(activeTab === "leads" || activeTab === "students") && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-lg text-text-main">
              {activeTab === "leads" ? "Danh sách Leads" : "Danh sách Học Viên"}
            </h2>
            <Badge variant="secondary">
              {activeTab === "leads" ? filteredLeads.length : filteredStudents.length} /{" "}
              {activeTab === "leads" ? leads.length : students.length} người
            </Badge>
          </div>
          <div className="flex items-center gap-2">
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
      )}

      {/* 4 Tabs */}
      <div className="flex gap-1 bg-bg-card rounded-xl p-1 w-fit">
        <button
          onClick={() => { setActiveTab("leads"); setSearch(""); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all",
            activeTab === "leads"
              ? "bg-primary text-white"
              : "text-text-sub hover:bg-bg hover:text-text-main"
          )}
        >
          <User className="w-4 h-4" />
          Lead
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            activeTab === "leads" ? "bg-white/20" : "bg-bg"
          )}>
            {leads.length}
          </span>
        </button>
        <button
          onClick={() => { setActiveTab("students"); setSearch(""); }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all",
            activeTab === "students"
              ? "bg-primary text-white"
              : "text-text-sub hover:bg-bg hover:text-text-main"
          )}
        >
          <GraduationCap className="w-4 h-4" />
          Học Viên
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            activeTab === "students" ? "bg-white/20" : "bg-bg"
          )}>
            {students.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "leads" && renderLeads()}
      {activeTab === "students" && renderStudents()}
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[160px] text-xs [&>span]:capitalize [&>span]:text-current">
        <SelectValue placeholder="Chọn trạng thái" className="capitalize" />
      </SelectTrigger>
      <SelectContent className="[&_[role=option]]:capitalize">
        {STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="capitalize">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
