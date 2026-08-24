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
        {/* Hero + editor together fill exactly the viewport height below the
            fixed nav (100vh - the nav's h-16) — flex + justify-center
            distributes any extra room as breathing space between them
            instead of leaving it stranded at the bottom of the screen. */}
        <section className="flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-10 py-8 sm:gap-14">
          <Hero />
          <FormatterApp />
        </section>
        <WhyFormat />
        <HowItWorks />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
