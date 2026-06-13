"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/scroll-reveal";

const faqs = [
  {
    question: "Khóa học này phù hợp với đối tượng nào?",
    answer:
      "Khóa học phù hợp với người đang chuẩn bị thi Chứng chỉ Hành nghề Quản lý Quỹ, nhân viên chứng khoán, sinh viên tài chính - ngân hàng hoặc bất kỳ ai muốn hệ thống hóa kiến thức đầu tư, phân tích tài chính và quản lý danh mục theo đúng cấu trúc đề thi thực tế.",
  },
  {
    question:
      "Tôi chưa có nền tảng về chứng khoán có tham gia được không?",
    answer:
      "Có. Chương trình được thiết kế từ kiến thức nền tảng như tổng quan thị trường, kỹ thuật khớp lệnh, phân tích báo cáo tài chính đến các chuyên đề nâng cao như định giá doanh nghiệp, trái phiếu, phái sinh và quản lý danh mục đầu tư.",
  },
  {
    question:
      "Khóa học có bám sát cấu trúc đề thi Quản Lý Quỹ hiện nay không?",
    answer:
      "Có. Nội dung được xây dựng dựa trên các giáo trình chính thức của Ủy ban Chứng khoán Nhà nước và tập trung vào những chuyên đề thường xuất hiện trong đề thi như định giá, trái phiếu, quản trị rủi ro, luật chứng khoán và các dạng bài tập tính toán trọng điểm.",
  },
  {
    question: "Khóa học có thực hành giải đề không?",
    answer:
      "Có. Từ Buổi 1 đến Buổi 8, học viên sẽ được giải đề tổng hợp, luyện các bộ đề mẫu và chữa chi tiết những lỗi sai phổ biến để nâng cao khả năng xử lý câu hỏi trong thời gian giới hạn của kỳ thi.",
  },
  {
    question: "Nếu bỏ lỡ một buổi học thì có thể xem lại không?",
    answer:
      "Có. Học viên sẽ được cung cấp tài liệu học tập và quyền xem lại nội dung đã học (nếu chương trình có ghi hình), giúp dễ dàng ôn tập hoặc bổ sung kiến thức khi không thể tham gia trực tiếp một buổi học.",
  },
  {
    question: "Khóa học có tài liệu hỗ trợ gì?",
    answer:
      "Bên cạnh bài giảng và bộ đề luyện tập, học viên còn được cung cấp Flashcard ghi nhớ nhanh và Mind Map tổng hợp kiến thức trọng tâm, giúp ôn tập hiệu quả và tăng khả năng ghi nhớ trước kỳ thi Quản Lý Quỹ.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20 bg-bg-card/50 border-y border-border">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Câu Hỏi Thường Gặp
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-bg-card border border-border rounded-xl px-5 md:px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left py-5 md:py-6 text-sm md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 md:pb-6 text-sm text-text-sub leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
