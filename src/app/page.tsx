import Hero from '@/components/Hero';
import FormatterApp from '@/components/FormatterApp';
import WhyFormat from '@/components/WhyFormat';
import HowItWorks from '@/components/HowItWorks';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-surface">
      <main className="pt-16">
        <Hero />
        <FormatterApp />
        <WhyFormat />
        <HowItWorks />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
