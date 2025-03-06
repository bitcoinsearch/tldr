import Wrapper from "./components/server/wrapper";
import HeroSection from "./components/client/landing-page/hero-section/hero-section";
import FeaturesSection from "./components/client/landing-page/features-section/features-section";
import ExploreSection from "./components/client/landing-page/explore-section/explore-section";
import NewsletterSection from "./components/client/landing-page/newsletter-section/newsletter-section";
import SummariesSection from "./components/client/landing-page/summaries-section/summaries-section";
import Testimonials from "./components/client/landing-page/testimonials/testimonials";


export default async function Home() {
  return (
    <div>
      <Wrapper>
        <HeroSection />
        <FeaturesSection />
        <ExploreSection />
      </Wrapper>
      <NewsletterSection />
      <SummariesSection />
      <Testimonials />
    </div>
  );
}
