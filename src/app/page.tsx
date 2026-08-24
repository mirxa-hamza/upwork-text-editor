import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import WhyFormat from '@/components/WhyFormat';
import HowItWorks from '@/components/HowItWorks';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-surface">
      <NavBar />
      <main className="pt-16">
        <Hero />
        <WhyFormat />
        <HowItWorks />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
