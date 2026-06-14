"use client";

import * as React from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  Filter,
  Download,
  ChevronRight,
  GraduationCap,
  CheckCircle,
  XCircle,
  PlayCircle,
  Search,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeRange = "week" | "month" | "quarter" | "year" | "custom";
type StudentStatus = "studying" | "completed" | "not_started";

interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  sdt: string;
  course_id: string;
  createdAt?: string;
  completed_lessons?: string[];
  test_scores?: Record<string, number>;
  total_study_time?: number;
  certificates?: string[];
}

interface Course {
  id: string;
  course_id: string;
  name: string;
  total_lessons: number;
}

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  week: "Tuần này",
  month: "Tháng này",
  quarter: "Quý này",
  year: "Năm nay",
  custom: "Tùy chỉnh",
};

const STATUS_COLORS: Record<StudentStatus, { bg: string; text: string; border: string }> = {
  studying: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  completed: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  not_started: { bg: "bg-gray-500/15", text: "text-gray-400", border: "border-gray-500/30" },
};

const STATUS_LABELS: Record<StudentStatus, string> = {
  studying: "Đang học",
  completed: "Đã xong",
  not_started: "Chưa bắt đầu",
};

export function TrainingAnalytics() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = React.useState<TimeRange>("month");
  const [customStart, setCustomStart] = React.useState("");
  const [customEnd, setCustomEnd] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"overview" | "course" | "student">("overview");
  const [selectedCourse, setSelectedCourse] = React.useState<string>("all");
  const [selectedStudent, setSelectedStudent] = React.useState<string>("all");
  const [studentSearch, setStudentSearch] = React.useState("");
  const { toast } = useToast();

  // Load data from Firestore
  React.useEffect(() => {
    const unsubStudents = onSnapshot(
      query(collection(db, "Student"), orderBy("createdAt", "desc")),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Student[];
        setStudents(data);
      },
      () => {
        setLoading(false);
        toast({ title: "Lỗi kết nối dữ liệu học viên", variant: "destructive" });
      }
    );

    const unsubCourses = onSnapshot(
      query(collection(db, "Course")),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Course[];
        setCourses(data.length ? data : [{ id: "COURSE-DEFAULT", course_id: "COURSE-DEFAULT", name: "Khóa Luyện Thi Chứng Chỉ", total_lessons: 8 }]);
        setLoading(false);
      },
      () => {
        setCourses([{ id: "COURSE-DEFAULT", course_id: "COURSE-DEFAULT", name: "Khóa Luyện Thi Chứng Chỉ", total_lessons: 8 }]);
        setLoading(false);
      }
    );

    return () => {
      unsubStudents();
      unsubCourses();
    };
  }, [toast]);

  // Filter data by time range
  const getFilteredStudents = React.useCallback(() => {
    if (timeRange === "custom" && (customStart || customEnd)) {
      const start = customStart ? new Date(customStart).getTime() : 0;
      const end = customEnd ? new Date(customEnd).getTime() : Date.now();
      return students.filter((s) => {
        const created = s.createdAt ? new Date(s.createdAt).getTime() : 0;
        return created >= start && created <= end;
      });
    }
    if (timeRange === "custom") return students;

    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return students;
    }

    return students.filter((s) => {
      const created = s.createdAt ? new Date(s.createdAt).getTime() : 0;
      return created >= startDate.getTime();
    });
  }, [students, timeRange, customStart, customEnd]);

  const filteredStudents = getFilteredStudents();

  // Compute stats
  const totalRegistered = filteredStudents.length;
  const totalLessons = courses.reduce((sum, c) => sum + c.total_lessons, 8);

  const getStudentStatus = (student: Student): StudentStatus => {
    const completed = student.completed_lessons?.length || 0;
    if (completed === 0) return "not_started";
    if (completed >= 8) return "completed";
    return "studying";
  };

  const statusCounts = {
    studying: filteredStudents.filter((s) => getStudentStatus(s) === "studying").length,
    completed: filteredStudents.filter((s) => getStudentStatus(s) === "completed").length,
    not_started: filteredStudents.filter((s) => getStudentStatus(s) === "not_started").length,
  };

  const completionRate =
    totalRegistered > 0
      ? Math.round((statusCounts.completed / totalRegistered) * 100)
      : 0;

  const activeCourses = new Set(
    filteredStudents
      .filter((s) => getStudentStatus(s) !== "not_started")
      .map((s) => s.course_id)
  ).size;

  // Avg test score
  const allScores: number[] = [];
  filteredStudents.forEach((s) => {
    if (s.test_scores) {
      Object.values(s.test_scores).forEach((score) => allScores.push(score));
    }
  });
  const avgTestScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  // Avg study time
  const studyTimes = filteredStudents
    .map((s) => s.total_study_time || 0)
    .filter((t) => t > 0);
  const avgStudyTime = studyTimes.length > 0
    ? Math.round(studyTimes.reduce((a, b) => a + b, 0) / studyTimes.length)
    : 0;

  // Per-course stats
  const getCourseStats = (courseId: string) => {
    const courseStudents = filteredStudents.filter((s) => s.course_id === courseId);
    const total = courseStudents.length;
    const counts = {
      studying: courseStudents.filter((s) => getStudentStatus(s) === "studying").length,
      completed: courseStudents.filter((s) => getStudentStatus(s) === "completed").length,
      not_started: courseStudents.filter((s) => getStudentStatus(s) === "not_started").length,
    };
    const rate = total > 0 ? Math.round((counts.completed / total) * 100) : 0;

    const scores: number[] = [];
    courseStudents.forEach((s) => {
      if (s.test_scores) Object.values(s.test_scores).forEach((sc) => scores.push(sc));
    });
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const times = courseStudents.map((s) => s.total_study_time || 0).filter((t) => t > 0);
    const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

    return { total, counts, rate, avgScore, avgTime };
  };

  // Student journey
  const filteredByCourse = selectedCourse !== "all"
    ? filteredStudents.filter((s) => s.course_id === selectedCourse)
    : filteredStudents;

  const studentFiltered = studentSearch
    ? filteredByCourse.filter(
        (s) =>
          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
          (s.student_id || "").toLowerCase().includes(studentSearch.toLowerCase())
      )
    : filteredByCourse;

  const handleExportExcel = () => {
    let csv = "";
    if (activeTab === "overview") {
      csv = `Báo cáo Tổng quan Đào tạo\n,,\nTổng học viên đăng ký,${totalRegistered}\nKhóa đang mở,${activeCourses}\nTỷ lệ hoàn thành,${completionRate}%\nĐiểm KT trung bình,${avgTestScore}\nThời gian học TB (phút),${avgStudyTime}\n`;
      csv += `\nPhân bổ trạng thái\n,,\nĐang học,${statusCounts.studying}\nĐã xong,${statusCounts.completed}\nChưa bắt đầu,${statusCounts.not_started}\n`;
    } else if (activeTab === "course") {
      csv = `Báo cáo theo Khóa học\n,,\n`;
      courses.forEach((c) => {
        const stats = getCourseStats(c.course_id);
        csv += `Khóa,${c.name}\n`;
        csv += `Tổng ĐK,${stats.total}\n`;
        csv += `Đang học,${stats.counts.studying}\n`;
        csv += `Đã xong,${stats.counts.completed}\n`;
        csv += `Chưa bắt đầu,${stats.counts.not_started}\n`;
        csv += `TLHT,${stats.rate}%\n`;
        csv += `Điểm TB,${stats.avgScore}\n`;
        csv += `TG học TB (phút),${stats.avgTime}\n\n`;
      });
    } else {
      csv = `Báo cáo theo Học viên\n,,\n`;
      studentFiltered.forEach((s) => {
        const status = getStudentStatus(s);
        csv += `ID,${s.student_id}\n`;
        csv += `Họ tên,${s.name}\n`;
        csv += `Email,${s.email}\n`;
        csv += `SĐT,${s.sdt || ""}\n`;
        csv += `Trạng thái,${STATUS_LABELS[status]}\n`;
        csv += `Bài hoàn thành,${s.completed_lessons?.length || 0}\n`;
        csv += `Điểm TB,${Object.values(s.test_scores || {}).length ? Math.round(Object.values(s.test_scores || {}).reduce((a: number, b: number) => a + b, 0) / Object.values(s.test_scores || {}).length) : 0}\n`;
        csv += `TG học (phút),${s.total_study_time || 0}\n`;
        csv += `Chứng chỉ,${s.certificates?.join(", ") || "—"}\n\n`;
      });
    }

    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bao-cao-dao-tao-${activeTab}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Đã xuất file CSV!" });
  };

  const handleExportPDF = () => {
    toast({
      title: "Xuất PDF",
      description: "Tính năng xuất PDF đang được phát triển. Vui lòng sử dụng Excel.",
    });
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-sub text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview" as const, label: "Tổng quan", icon: BarChart3 },
    { key: "course" as const, label: "Theo khóa học", icon: BookOpen },
    { key: "student" as const, label: "Theo học viên", icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-bg-card rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all",
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "text-text-sub hover:bg-bg hover:text-text-main"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-sub" />
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="h-9 w-[160px] text-sm bg-bg-card border-border text-text-main">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {TIME_RANGE_LABELS[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {timeRange === "custom" && (
            <>
              <Input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-9 w-[150px] text-sm bg-bg-card border-border text-text-main"
              />
              <span className="text-text-sub text-sm">—</span>
              <Input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-9 w-[150px] text-sm bg-bg-card border-border text-text-main"
              />
            </>
          )}

          {/* Export Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="h-9 text-sm border-border text-text-sub hover:bg-bg hover:text-text-main gap-1.5"
          >
            <Download className="w-4 h-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="h-9 text-sm border-border text-text-sub hover:bg-bg hover:text-text-main gap-1.5"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* === OVERVIEW TAB === */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              label="Tổng học viên"
              value={totalRegistered}
              sub="Đã đăng ký"
              icon={Users}
              color="#DF6B33"
              bg="rgba(223, 107, 51, 0.1)"
            />
            <SummaryCard
              label="Khóa đang mở"
              value={activeCourses}
              sub={`${courses.length} khóa`}
              icon={BookOpen}
              color="#6366F1"
              bg="rgba(99, 102, 241, 0.1)"
            />
            <SummaryCard
              label="TL hoàn thành TB"
              value={`${completionRate}%`}
              sub={`${statusCounts.completed}/${totalRegistered} đã xong`}
              icon={TrendingUp}
              color="#10B981"
              bg="rgba(16, 185, 129, 0.1)"
            />
            <SummaryCard
              label="Điểm KT trung bình"
              value={avgTestScore > 0 ? `${avgTestScore}` : "—"}
              sub={`${allScores.length} bài đã chấm`}
              icon={Award}
              color="#F59E0B"
              bg="rgba(245, 158, 11, 0.1)"
            />
          </div>

          {/* Status Distribution */}
          <Card className="border-border bg-bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading font-bold text-text-main text-base">
                Phân bổ trạng thái học viên
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["studying", "completed", "not_started"] as StudentStatus[]).map((status) => {
                const count = statusCounts[status];
                const pct = totalRegistered > 0 ? Math.round((count / totalRegistered) * 100) : 0;
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", STATUS_COLORS[status].text.replace("text-", "bg-"))} />
                        <span className="text-sm font-medium text-text-main">{STATUS_LABELS[status]}</span>
                        <Badge variant="secondary" className="text-xs">{count}</Badge>
                      </div>
                      <span className="text-sm font-bold text-text-sub">{pct}%</span>
                    </div>
                    <div className="h-2 bg-bg rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", STATUS_COLORS[status].text.replace("text-", "bg-"))}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {totalRegistered === 0 && (
                <p className="text-center text-text-sub text-sm py-4">
                  Chưa có dữ liệu học viên trong khoảng thời gian này.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* === COURSE TAB === */}
      {activeTab === "course" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((course) => {
              const stats = getCourseStats(course.course_id);
              return (
                <Card
                  key={course.id}
                  className="border-border bg-bg-card hover:border-primary/40 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {stats.total} HV
                      </Badge>
                    </div>
                    <CardTitle className="font-heading font-bold text-text-main text-base mt-3 leading-snug">
                      {course.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status distribution */}
                    <div className="space-y-2">
                      {(["studying", "completed", "not_started"] as StudentStatus[]).map((status) => {
                        const count = stats.counts[status];
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={status} className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", STATUS_COLORS[status].text.replace("text-", "bg-"))} />
                            <span className="text-xs text-text-sub w-24 flex-shrink-0">{STATUS_LABELS[status]}</span>
                            <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", STATUS_COLORS[status].text.replace("text-", "bg-"))}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-text-sub w-8 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-border pt-3 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="font-heading font-bold text-lg text-primary">{stats.rate}%</p>
                        <p className="text-[10px] text-text-sub mt-0.5">TL hoàn thành</p>
                      </div>
                      <div className="text-center">
                        <p className="font-heading font-bold text-lg text-text-main">{stats.avgScore > 0 ? stats.avgScore : "—"}</p>
                        <p className="text-[10px] text-text-sub mt-0.5">Điểm TB</p>
                      </div>
                      <div className="text-center">
                        <p className="font-heading font-bold text-lg text-text-main">{stats.avgTime > 0 ? stats.avgTime : "—"}</p>
                        <p className="text-[10px] text-text-sub mt-0.5">Phút TB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-text-sub/30 mx-auto mb-4" />
              <p className="text-text-sub text-sm">Chưa có khóa học nào.</p>
            </div>
          )}
        </div>
      )}

      {/* === STUDENT TAB === */}
      {activeTab === "student" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-sub pointer-events-none" />
              <Input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Tìm tên, email, mã học viên..."
                className="pl-9 h-10 bg-bg-card border-border text-text-main text-sm"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="h-10 w-[220px] text-sm bg-bg-card border-border text-text-main">
                <SelectValue placeholder="Chọn khóa học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa học</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.course_id} value={c.course_id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Cards */}
          {studentFiltered.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-12 h-12 text-text-sub/30 mx-auto mb-4" />
              <p className="text-text-sub text-sm">
                {students.length === 0 ? "Chưa có học viên nào." : "Không tìm thấy học viên phù hợp."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {studentFiltered.map((student) => {
                const status = getStudentStatus(student);
                const studentCourse = courses.find((c) => c.course_id === student.course_id);
                const scores = student.test_scores ? Object.values(student.test_scores) : [];
                const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

                return (
                  <Card
                    key={student.id}
                    className="border-border bg-bg-card hover:border-primary/40 transition-all duration-300"
                  >
                    <CardContent className="p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                            <span className="font-heading font-bold text-primary text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading font-semibold text-text-main text-sm truncate">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-text-sub/70 font-mono">
                              {student.student_id}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "text-[10px] shrink-0",
                            STATUS_COLORS[status].bg,
                            STATUS_COLORS[status].text,
                            "border",
                            STATUS_COLORS[status].border
                          )}
                        >
                          {STATUS_LABELS[status]}
                        </Badge>
                      </div>

                      {/* Course */}
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-text-sub/60 flex-shrink-0" />
                        <span className="text-xs text-text-sub truncate">
                          {studentCourse?.name || student.course_id}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                        <div className="text-center">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1">
                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <p className="font-heading font-bold text-sm text-text-main">
                            {student.completed_lessons?.length || 0}
                          </p>
                          <p className="text-[10px] text-text-sub">Bài hoàn thành</p>
                        </div>
                        <div className="text-center">
                          <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-1">
                            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                          </div>
                          <p className="font-heading font-bold text-sm text-text-main">
                            {avgScore > 0 ? avgScore : "—"}
                          </p>
                          <p className="text-[10px] text-text-sub">Điểm TB</p>
                        </div>
                        <div className="text-center">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-1">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <p className="font-heading font-bold text-sm text-text-main">
                            {student.total_study_time || 0}
                          </p>
                          <p className="text-[10px] text-text-sub">Phút học</p>
                        </div>
                      </div>

                      {/* Certificates */}
                      {student.certificates && student.certificates.length > 0 && (
                        <div className="border-t border-border pt-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Award className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                            <span className="text-[11px] text-yellow-400 font-medium">
                              {student.certificates.join(", ")}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
}) {
  return (
    <Card className="border-border bg-bg-card hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: bg }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <p className="font-heading font-bold text-2xl text-text-main">{value}</p>
        <p className="text-text-sub text-xs mt-0.5">{label}</p>
        <Badge variant="outline" className="mt-2 text-[10px]">{sub}</Badge>
      </CardContent>
    </Card>
  );
}
