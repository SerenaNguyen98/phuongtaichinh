import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";

const sessions = [
  {
    num: 1,
    title: "Buổi 1: Tổng quan & Kỹ thuật Khớp lệnh",
    description:
      "Nội dung trong giáo trình cơ bản và môi giới. Tổng quan thị trường chứng khoán, cách thức khớp lệnh và các loại lệnh phổ biến.",
  },
  {
    num: 2,
    title: "Buổi 2: Phân tích Báo cáo Tài chính",
    description:
      "Giáo trình phân tích báo cáo tài chính. Đọc hiểu, phân tích và đánh giá các chỉ số tài chính quan trọng trong đề thi.",
  },
  {
    num: 3,
    title: "Buổi 3: Định giá Doanh nghiệp & Dự án",
    description:
      "Giáo trình phân tích đầu tư chứng khoán & giáo trình tư vấn tài chính và bảo lãnh phát hành chứng khoán. Các phương pháp định giá doanh nghiệp, DCF, P/E, EV/EBITDA.",
  },
  {
    num: 4,
    title: "Buổi 4: Chứng khoán Nợ (Trái phiếu)",
    description:
      "Giáo trình phân tích đầu tư chứng khoán. Định giá trái phiếu, yield, duration, các loại trái phiếu và rủi ro đi kèm.",
  },
  {
    num: 5,
    title: "Buổi 5: Quản lý Danh mục & Rủi ro, chuyên đề Phái sinh",
    description:
      "Giáo trình phân tích đầu tư chứng khoán & giáo trình quản lý quỹ. HĐTL, Quyền chọn, các bẫy đề lý thuyết và quản trị rủi ro danh mục.",
  },
  {
    num: 6,
    title: "Buổi 6: Giải đề tổng hợp Chuyên môn",
    description:
      "Thực hành giải bộ đề tổng hợp, phân tích các dạng câu hỏi chuyên môn thường gặp trong kỳ thi Quản lý Quỹ.",
  },
  {
    num: 7,
    title: "Buổi 7: Luật Chứng khoán",
    description:
      "Giáo trình Luật. Hệ thống hóa các quy định pháp luật liên quan đến chứng khoán, quyền và nghĩa vụ của nhà đầu tư, quỹ đầu tư.",
  },
  {
    num: 8,
    title: "Buổi 8: Giải đề & Chữa lỗi",
    description:
      "Giải đề full mock exam, chữa chi tiết từng lỗi sai, mẹo xử lý câu hỏi khó, chiến thuật làm bài thi hiệu quả.",
  },
];

export function CourseTimeline() {
  return (
    <section id="course" className="py-16 md:py-20 bg-bg-card/50 border-y border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Chương Trình 8 Buổi
            </h2>
            <p className="text-text-sub text-base max-w-2xl mx-auto">
              8 buổi học thực chiến, hoàn thành bộ đề mẫu — tự tin cho kỳ
              thi Quản Lý Quỹ
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2 hidden md:block" />

          <div className="space-y-5">
            {sessions.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 80}>
                <div className="flex gap-4 md:gap-8 items-start relative">
                  <div
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-full bg-primary",
                      "flex items-center justify-center z-10",
                      "shadow-lg shadow-primary/30"
                    )}
                  >
                    <span className="font-heading font-extrabold text-white text-lg">
                      {s.num}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex-1 bg-bg-card rounded-xl p-4 md:p-5",
                      "border border-border",
                      "hover:-translate-y-1 hover:border-primary",
                      "transition-all duration-300"
                    )}
                  >
                    <h3 className="font-heading font-bold text-base md:text-lg mb-2">
                      {s.title}
                    </h3>
                    <p className="text-text-sub text-sm leading-relaxed">
                      {s.description}
                    </p>
                    <span className="inline-block mt-2 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5">
                      2 tiết
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
