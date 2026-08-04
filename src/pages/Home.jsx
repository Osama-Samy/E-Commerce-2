import Products from '../components/FeaturedProducts/Products';

import CategorySection from "../components/home/CategorySection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import NewsletterSection from "../components/home/NewsletterSection";
import HeroSection from "../components/home/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <Products />
      <HowItWorksSection />
      <NewsletterSection />
    </>
  );
  
}