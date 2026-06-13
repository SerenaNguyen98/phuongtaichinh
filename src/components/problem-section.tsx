import { Clock, Brain, AlertTriangle, FileQuestion } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { IconCard } from "@/components/icon-card";

const problems = [
  {
    icon: Clock,
    title: "Quá nhiều kiến thức",
    description:
      "Giáo trình dày, nhiều chủ đề khiến bạn hoang mang không biết bắt đầu từ đâu.",
  },
  {
    icon: Brain,
    title: "Học nhiều nhưng chưa đúng trọng tâm",
    description:
      "Cảm giác nhồi nhét kiến thức mà không biết phần nào thực sự quan trọng trong đề thi.",
  },
  {
    icon: AlertTriangle,
    title: "Chưa biết bắt đầu từ đâu",
    description:
      "Áp lực kỳ thi gần kề mà bạn vẫn không có lộ trình ôn tập rõ ràng.",
  },
  {
    icon: FileQuestion,
    title: "Thi thử không hiệu quả",
    description:
      "Làm đề nhưng không biết mình sai ở đâu, không có ai chữa bài và giải thích.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Bạn đang gặp những vấn đề nào?
            </h2>
            <p className="text-text-sub text-base max-w-xl mx-auto">
              Đừng để những rào cản này ngăn bạn chinh phục chứng chỉ hành
              nghề chứng khoán
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {problems.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 80}>
              <IconCard icon={p.icon} title={p.title} description={p.description} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
