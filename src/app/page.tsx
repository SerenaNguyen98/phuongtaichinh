import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { AudienceSection } from "@/components/audience-section";
import { CourseTimeline } from "@/components/course-timeline";
import { RegisterSection } from "@/components/register-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <AudienceSection />
      <CourseTimeline />
      <RegisterSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
