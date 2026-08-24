import Hero from '@/components/Hero';
import FormatterApp from '@/components/FormatterApp';
import WhyFormat from '@/components/WhyFormat';
import HowItWorks from '@/components/HowItWorks';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="flex flex-col gap-10 py-10 sm:gap-14">
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
