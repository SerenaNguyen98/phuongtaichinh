"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  ChevronUp,
  ChevronDown,
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration?: string;
}

const initialLessons: Lesson[] = [
  {
    id: "1",
    title: "Buổi 1: Giới thiệu tổng quan thị trường chứng khoán",
    description:
      "Tổng quan về thị trường chứng khoán Việt Nam, các loại chứng chỉ, cơ quan quản lý và khung pháp lý.",
    order: 1,
    duration: "90 phút",
  },
  {
    id: "2",
    title: "Buổi 2: Phân tích cơ bản",
    description:
      "Học cách đọc báo cáo tài chính, phân tích chỉ số tài chính, định giá doanh nghiệp.",
    order: 2,
    duration: "90 phút",
  },
  {
    id: "3",
    title: "Buổi 3: Phân tích kỹ thuật",
    description:
      "Các mô hình nến, đường xu hướng, chỉ báo kỹ thuật (RSI, MACD, Bollinger Bands).",
    order: 3,
    duration: "90 phút",
  },
  {
    id: "4",
    title: "Buổi 4: Quản lý danh mục đầu tư",
    description:
      "Nguyên tắc đa dạng hóa, phân bổ tài sản, đo lường rủi ro và lợi nhuận.",
    order: 4,
    duration: "90 phút",
  },
  {
    id: "5",
    title: "Buổi 5: Quy định pháp luật & đạo đức nghề nghiệp",
    description:
      "Các quy định pháp lý liên quan đến chứng khoán, đạo đức hành nghề, xung đột lợi ích.",
    order: 5,
    duration: "90 phút",
  },
  {
    id: "6",
    title: "Buổi 6: Sản phẩm phái sinh",
    description:
      "Chứng chỉ phái sinh, hợp đồng tương lai, quyền chọn, chiến lược giao dịch.",
    order: 6,
    duration: "90 phút",
  },
  {
    id: "7",
    title: "Buổi 7: Thực chiến - Thi thử",
    description:
      "Làm bài thi thử, phân tích case study thực tế, giải đáp thắc mắc.",
    order: 7,
    duration: "120 phút",
  },
  {
    id: "8",
    title: "Buổi 8: Ôn tập và chiến lược thi",
    description:
      "Tổng hợp kiến thức, mẹo thi, chiến lược quản lý thời gian trong phòng thi.",
    order: 8,
    duration: "120 phút",
  },
];

export function LessonManager() {
  const [lessons, setLessons] = React.useState<Lesson[]>(initialLessons);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState<Lesson | null>(null);
  const [form, setForm] = React.useState({ title: "", description: "", duration: "" });
  const [formErrors, setFormErrors] = React.useState({ title: "", description: "" });
  const { toast } = useToast();

  const openAdd = () => {
    setEditingLesson(null);
    setForm({ title: "", description: "", duration: "" });
    setFormErrors({ title: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration || "",
    });
    setFormErrors({ title: "", description: "" });
    setDialogOpen(true);
  };

  const validateForm = () => {
    const errors = { title: "", description: "" };
    if (!form.title.trim()) errors.title = "Tiêu đề bắt buộc";
    if (!form.description.trim()) errors.description = "Mô tả bắt buộc";
    setFormErrors(errors);
    return !errors.title && !errors.description;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingLesson) {
      setLessons((prev) =>
        prev.map((l) =>
          l.id === editingLesson.id
            ? { ...l, title: form.title, description: form.description, duration: form.duration }
            : l
        )
      );
      toast({ title: "Đã cập nhật bài học!" });
    } else {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        title: form.title,
        description: form.description,
        order: lessons.length + 1,
        duration: form.duration || "90 phút",
      };
      setLessons((prev) => [...prev, newLesson]);
      toast({ title: "Đã thêm bài học mới!" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Xóa bài học này?")) return;
    setLessons((prev) => prev.filter((l) => l.id !== id));
    toast({ title: "Đã xóa bài học!" });
  };

  const moveLesson = (id: string, direction: "up" | "down") => {
    setLessons((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated.map((l, i) => ({ ...l, order: i + 1 }));
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-lg text-text-main">
            Quản lý bài học
          </h2>
          <Badge variant="secondary">{lessons.length} bài</Badge>
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary hover:bg-primary-hover text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm bài học
        </Button>
      </div>

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group rounded-xl border border-border bg-bg-card p-4 hover:border-primary/40 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveLesson(lesson.id, "up")}
                  disabled={lesson.order === 1}
                  className="p-0.5 rounded text-text-sub/40 hover:text-text-main transition-colors disabled:opacity-20"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveLesson(lesson.id, "down")}
                  disabled={lesson.order === lessons.length}
                  className="p-0.5 rounded text-text-sub/40 hover:text-text-main transition-colors disabled:opacity-20"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-text-main text-sm leading-snug">
                  {lesson.title}
                </h3>
                <p className="text-text-sub text-xs mt-1 line-clamp-2">
                  {lesson.description}
                </p>
                {lesson.duration && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {lesson.duration}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(lesson)}
                  className="text-text-sub hover:text-primary hover:bg-primary/10"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(lesson.id)}
                  className="text-text-sub hover:text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Sửa bài học" : "Thêm bài học mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="lesson-title" className="text-text-sub text-sm">
                Tiêu đề bài học
              </Label>
              <Input
                id="lesson-title"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  if (formErrors.title) setFormErrors((er) => ({ ...er, title: "" }));
                }}
                placeholder="VD: Buổi 1: Giới thiệu tổng quan..."
                className={cn(
                  "bg-bg border-border text-text-main",
                  formErrors.title && "border-red-500"
                )}
              />
              {formErrors.title && (
                <p className="text-red-400 text-xs">{formErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-desc" className="text-text-sub text-sm">
                Mô tả
              </Label>
              <Textarea
                id="lesson-desc"
                value={form.description}
                onChange={(e) => {
                  setForm((f) => ({ ...f, description: e.target.value }));
                  if (formErrors.description)
                    setFormErrors((er) => ({ ...er, description: "" }));
                }}
                placeholder="Nội dung chi tiết bài học..."
                className={cn(
                  "bg-bg border-border text-text-main min-h-[100px]",
                  formErrors.description && "border-red-500"
                )}
              />
              {formErrors.description && (
                <p className="text-red-400 text-xs">{formErrors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-duration" className="text-text-sub text-sm">
                Thời lượng (tùy chọn)
              </Label>
              <Input
                id="lesson-duration"
                value={form.duration}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration: e.target.value }))
                }
                placeholder="VD: 90 phút"
                className="bg-bg border-border text-text-main"
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
              {editingLesson ? "Lưu thay đổi" : "Thêm bài học"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
