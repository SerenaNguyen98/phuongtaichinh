import {
  Target,
  Wrench,
  Lightbulb,
  Video,
  Users,
  ShieldCheck,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { IconCard } from "@/components/icon-card";

const solutions = [
  {
    icon: Target,
    title: "Giải đề từng bước chi tiết",
    description:
      "8 buổi thực chiến giải đề theo module, hướng dẫn chi tiết từng câu hỏi.",
  },
  {
    icon: Wrench,
    title: "60 câu hỏi luyện tập sau buổi học",
    description:
      "Mỗi buổi học đi kèm bộ câu hỏi thực hành để củng cố kiến thức.",
  },
  {
    icon: Lightbulb,
    title: "Học hiện đại với Flashcard & Mind Map",
    description:
      "Công cụ ghi nhớ nhanh giúp bạn nắm vững kiến thức trọng tâm.",
  },
  {
    icon: Video,
    title: "Video ghi lại toàn bộ buổi học",
    description:
      "Học viên được xem lại video để ôn tập bất cứ lúc nào, không lo bỏ lỡ.",
  },
  {
    icon: Users,
    title: "Cộng đồng học viên & Group Zalo",
    description:
      "Group Zalo hỗ trợ trao đổi, giải đáp thắc mắc sau khóa học.",
  },
  {
    icon: ShieldCheck,
    title: "Cập nhật đề thi mới nhất",
    description:
      "Luôn update xu hướng ra đề mới nhất từ kỳ thi gần nhất.",
  },
];

export function SolutionSection() {
  return (
    <section className="py-16 md:py-20 bg-bg-card/50 border-y border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Giải Pháp Toàn Diện Cho Bạn
            </h2>
            <p className="text-text-sub text-base max-w-2xl mx-auto">
              Khóa học 8 buổi tập trung thực chiến, tập trung giải đề, ôn tập
              đúng trọng tâm giúp bạn tự tin bước vào kỳ thi.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {solutions.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 80}>
              <IconCard
                icon={s.icon}
                title={s.title}
                description={s.description}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
