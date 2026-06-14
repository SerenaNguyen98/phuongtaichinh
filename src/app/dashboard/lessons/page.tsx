"use client";

import * as React from "react";
import { LessonManager } from "@/components/dashboard/lesson-manager";
import { type Lesson, initialLessons } from "@/components/dashboard/lesson-manager";

export default function LessonsPage() {
  const [lessons, setLessons] = React.useState<Lesson[]>(initialLessons);
  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text-main">
          Quản lý bài học
        </h1>
        <p className="text-text-sub text-sm mt-1">
          Thêm, sửa, xóa và sắp xếp thứ tự các bài học trong khóa học.
        </p>
      </div>
      <LessonManager lessons={lessons} onLessonsChange={setLessons} />
    </div>
  );
}
