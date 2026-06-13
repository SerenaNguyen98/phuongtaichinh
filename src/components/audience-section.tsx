import { GraduationCap, Briefcase, Palette, Scale } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AudienceItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

function AudienceItem({ icon: Icon, title, description, delay }: AudienceItemProps) {
  return (
    <ScrollReveal delay={delay}>
      <div
        className={cn(
          "bg-bg-card rounded-xl p-6 md:p-7",
          "border border-border",
          "hover:-translate-y-1 hover:border-primary",
          "transition-all duration-300",
          "flex gap-4 items-start"
        )}
      >
        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-base mb-2">{title}</h3>
          <p className="text-text-sub text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

const audiences = [
  {
    icon: GraduationCap,
    title: "Người muốn nâng cấp sự nghiệp",
    description:
      "Anh/chị muốn nâng cấp sự nghiệp hành nghề trong lĩnh vực tài chính, sở hữu chứng chỉ hành nghề để mở rộng phạm vi công việc.",
  },
  {
    icon: Briefcase,
    title: "Người đi làm trong ngành chứng khoán",
    description:
      "Người đi làm lâu năm trong ngành muốn có chứng chỉ hành nghề nộp cho công ty, thể hiện năng lực chuyên môn.",
  },
  {
    icon: Palette,
    title: "Sinh viên mới ra trường",
    description:
      "Sinh viên mới ra trường muốn có thêm chứng chỉ, mở rộng cơ hội cho sự nghiệp trong lĩnh vực tài chính - chứng khoán.",
  },
  {
    icon: Scale,
    title: "Người chuẩn bị thi Quản Lý Quỹ",
    description:
      "Người đang chuẩn bị thi chứng chỉ hành nghề Quản lý Quỹ, cần hệ thống hóa kiến thức đúng trọng tâm.",
  },
];

export function AudienceSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Khóa Học Dành Cho Ai?
            </h2>
            <p className="text-text-sub text-base max-w-xl mx-auto">
              Dù bạn ở giai đoạn nào, khóa học này đều phù hợp để bạn chinh
              phục chứng chỉ hành nghề.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {audiences.map((a, i) => (
            <AudienceItem
              key={a.title}
              icon={a.icon}
              title={a.title}
              description={a.description}
              delay={i * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
