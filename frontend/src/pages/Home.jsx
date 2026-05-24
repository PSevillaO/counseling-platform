import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedCounselors from "../components/home/FeaturedCounselors";
import Testimonials from "../components/home/Testimonials";
import WhyChooseUs from "../components/home/WhyChooseUs";
import BlogSection from "../components/home/BlogSection";
import FaqSection from "../components/home/FaqSection";
import CtaSection from "../components/home/CtaSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturedCounselors />
      <Testimonials />
      <WhyChooseUs />
      <BlogSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
