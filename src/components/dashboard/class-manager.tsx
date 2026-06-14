"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ClassSession {
  id: string;
  title: string;
  date: string;
  time: string;
  teacher: string;
  description: string;
  color: string;
}

const mockClasses: ClassSession[] = [
  { id: "1", title: "Buổi 1: Giới thiệu tổng quan", date: "2026-07-05", time: "19:00 - 21:00", teacher: "Nguyễn Văn A", description: "Tổng quan thị trường chứng khoán Việt Nam và các loại chứng chỉ.", color: "#DF6B33" },
  { id: "2", title: "Buổi 2: Phân tích cơ bản", date: "2026-07-08", time: "19:00 - 21:00", teacher: "Nguyễn Văn A", description: "Đọc báo cáo tài chính, phân tích chỉ số, định giá doanh nghiệp.", color: "#6366F1" },
  { id: "3", title: "Buổi 3: Phân tích kỹ thuật", date: "2026-07-12", time: "19:00 - 21:00", teacher: "Trần Thị B", description: "Mô hình nến, đường xu hướng, RSI, MACD, Bollinger Bands.", color: "#10B981" },
  { id: "4", title: "Buổi 4: Quản lý danh mục đầu tư", date: "2026-07-15", time: "19:00 - 21:00", teacher: "Trần Thị B", description: "Đa dạng hóa, phân bổ tài sản, đo lường rủi ro và lợi nhuận.", color: "#F59E0B" },
  { id: "5", title: "Buổi 5: Quy định pháp luật", date: "2026-07-19", time: "19:00 - 21:00", teacher: "Lê Văn C", description: "Quy định pháp lý chứng khoán, đạo đức hành nghề.", color: "#EC4899" },
  { id: "6", title: "Buổi 6: Sản phẩm phái sinh", date: "2026-07-22", time: "19:00 - 21:00", teacher: "Lê Văn C", description: "Chứng chỉ phái sinh, hợp đồng tương lai, quyền chọn.", color: "#8B5CF6" },
  { id: "7", title: "Buổi 7: Thực chiến - Thi thử", date: "2026-07-26", time: "14:00 - 16:00", teacher: "Nguyễn Văn A", description: "Làm bài thi thử, phân tích case study thực tế.", color: "#EF4444" },
  { id: "8", title: "Buổi 8: Ôn tập và chiến lược thi", date: "2026-07-29", time: "14:00 - 16:00", teacher: "Nguyễn Văn A", description: "Tổng hợp kiến thức, mẹo thi, chiến lược quản lý thời gian.", color: "#14B8A6" },
];

const COLORS = [
  "#DF6B33", "#6366F1", "#10B981", "#F59E0B",
  "#EC4899", "#8B5CF6", "#EF4444", "#14B8A6",
];

const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_VI = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

export function ClassManager() {
  const [classes, setClasses] = React.useState<ClassSession[]>(mockClasses);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<ClassSession | null>(null);
  const [currentDate, setCurrentDate] = React.useState(new Date(2026, 6, 1));
  const [view, setView] = React.useState<"calendar" | "list">("calendar");
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    date: "",
    time: "",
    teacher: "",
    description: "",
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const { toast } = useToast();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getClassesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return classes.filter((c) => c.date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [y, m, day] = dateStr.split("-");
    return `${day}/${m}/${y}`;
  };

  const openAdd = () => {
    setEditingClass(null);
    setForm({ title: "", date: "", time: "19:00 - 21:00", teacher: "", description: "" });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (cls: ClassSession) => {
    setEditingClass(cls);
    setForm({
      title: cls.title,
      date: cls.date,
      time: cls.time,
      teacher: cls.teacher,
      description: cls.description || "",
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Tiêu đề bắt buộc";
    if (!form.date) errors.date = "Ngày bắt buộc";
    if (!form.time.trim()) errors.time = "Giờ bắt buộc";
    if (!form.teacher.trim()) errors.teacher = "Giảng viên bắt buộc";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const colorIdx = editingClass
      ? COLORS.indexOf(editingClass.color)
      : classes.length % COLORS.length;
    const color = COLORS[Math.max(0, colorIdx)];

    if (editingClass) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === editingClass.id ? { ...c, ...form, color } : c
        )
      );
      toast({ title: "Đã cập nhật lớp học!" });
    } else {
      const newClass: ClassSession = {
        id: Date.now().toString(),
        ...form,
        color,
      };
      setClasses((prev) => [...prev, newClass]);
      toast({ title: "Đã thêm lớp học mới!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Xóa lớp học này?")) return;
    setClasses((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Đã xóa lớp học!" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-lg text-text-main">
            Quản lý lớp học
          </h2>
          <Badge variant="secondary">{classes.length} buổi</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("calendar")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                view === "calendar"
                  ? "bg-primary text-white"
                  : "bg-bg-card text-text-sub hover:bg-bg"
              )}
            >
              Lịch
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                view === "list"
                  ? "bg-primary text-white"
                  : "bg-bg-card text-text-sub hover:bg-bg"
              )}
            >
              Danh sách
            </button>
          </div>
          <Button
            onClick={openAdd}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Thêm lớp
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <button onClick={prevMonth} className="p-2 rounded-lg text-text-sub hover:text-text-main hover:bg-bg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-text-main">
              {MONTHS_VI[month]} {year}
            </h3>
            <button onClick={nextMonth} className="p-2 rounded-lg text-text-sub hover:text-text-main hover:bg-bg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS_EN.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-heading font-semibold text-text-sub uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayClasses = day ? getClassesForDay(day) : [];
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[110px] border-b border-r border-border p-1.5 align-top",
                    !day && "bg-bg-darker/30"
                  )}
                >
                  {day && (
                    <>
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mb-1",
                          isToday ? "bg-primary text-white font-bold" : "text-text-sub"
                        )}
                      >
                        {day}
                      </div>
                      {dayClasses.map((cls) => (
                        <div
                          key={cls.id}
                          onClick={() => openEdit(cls)}
                          className="group cursor-pointer rounded-md px-1.5 py-1 mb-0.5 text-xs hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: cls.color + "22", borderLeft: `2px solid ${cls.color}` }}
                        >
                          <p className="font-semibold leading-tight truncate" style={{ color: cls.color }}>
                            {cls.time.split(" - ")[0]} {cls.title.split(":")[0]}
                          </p>
                          <p className="text-text-sub/70 text-[10px] truncate">
                            {cls.teacher}
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-card">
                  <th className="px-4 py-3 text-left font-heading font-semibold text-text-sub text-sm">#</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold text-text-sub text-sm">Bài học</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold text-text-sub text-sm">Ngày</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold text-text-sub text-sm">Giờ</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold text-text-sub text-sm">Giảng viên</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold text-text-sub text-sm">Mô tả</th>
                  <th className="px-4 py-3 text-right font-heading font-semibold text-text-sub text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {classes
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((cls, idx) => (
                    <tr key={cls.id} className="border-b border-border hover:bg-bg-card/50 transition-colors">
                      <td className="px-4 py-3 text-text-sub/60">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                          <span className="font-medium text-text-main text-xs">{cls.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-sub">{formatDisplayDate(cls.date)}</td>
                      <td className="px-4 py-3 text-text-sub">{cls.time}</td>
                      <td className="px-4 py-3 text-text-sub">{cls.teacher}</td>
                      <td className="px-4 py-3 text-text-sub text-xs max-w-[200px] truncate">{cls.description}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(cls)} className="text-text-sub hover:text-primary hover:bg-primary/10">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.id)} className="text-text-sub hover:text-red-400 hover:bg-red-400/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Sửa lớp học" : "Thêm lớp học mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Tiêu đề */}
            <div className="space-y-2">
              <Label className="text-text-sub text-sm">Tiêu đề bài học</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  if (formErrors.title) setFormErrors((er) => ({ ...er, title: "" }));
                }}
                placeholder="VD: Buổi 1: Giới thiệu tổng quan..."
                className={cn("bg-bg border-border text-text-main", formErrors.title && "border-red-500")}
              />
              {formErrors.title && <p className="text-red-400 text-xs">{formErrors.title}</p>}
            </div>

            {/* Ngày + Giờ */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-sub text-sm">Ngày học</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center justify-between w-full h-10 px-4 py-2 rounded-lg border text-sm font-body",
                        "bg-bg-card border-border text-text-main transition-colors",
                        "hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg",
                        formErrors.date && "border-red-500",
                        !form.date && "text-text-sub/50"
                      )}
                    >
                      <span>{form.date ? formatDisplayDate(form.date) : "Chọn ngày..."}</span>
                      <CalendarIcon className="w-4 h-4 text-text-sub flex-shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 w-auto">
                    <Calendar
                      selected={form.date ? new Date(form.date + "T00:00:00") : undefined}
                      onChange={(d) => {
                        setForm((f) => ({ ...f, date: formatDate(d) }));
                        if (formErrors.date) setFormErrors((er) => ({ ...er, date: "" }));
                        setDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.date && <p className="text-red-400 text-xs">{formErrors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-text-sub text-sm">Giờ học</Label>
                <Input
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  placeholder="19:00 - 21:00"
                  className="bg-bg border-border text-text-main"
                />
              </div>
            </div>

            {/* Giảng viên */}
            <div className="space-y-2">
              <Label className="text-text-sub text-sm">Giảng viên</Label>
              <Input
                value={form.teacher}
                onChange={(e) => {
                  setForm((f) => ({ ...f, teacher: e.target.value }));
                  if (formErrors.teacher) setFormErrors((er) => ({ ...er, teacher: "" }));
                }}
                placeholder="Tên giảng viên"
                className={cn("bg-bg border-border text-text-main", formErrors.teacher && "border-red-500")}
              />
              {formErrors.teacher && <p className="text-red-400 text-xs">{formErrors.teacher}</p>}
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label className="text-text-sub text-sm">Mô tả</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả nội dung buổi học..."
                className="bg-bg border-border text-text-main min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border text-text-sub hover:bg-bg hover:text-text-main"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              {editingClass ? "Lưu thay đổi" : "Thêm lớp học"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
