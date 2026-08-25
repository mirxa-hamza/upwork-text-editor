import Hero from '@/components/Hero';
import FormatterApp from '@/components/FormatterApp';
import WhyFormat from '@/components/WhyFormat';
import HowItWorks from '@/components/HowItWorks';
import Faq, { FAQS } from '@/components/Faq';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';

// FAQPage structured data, generated directly from the same FAQS array the
// visible accordion renders — so the rich-result markup can never drift out
// of sync with what's actually on the page.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="flex flex-col gap-10 sm:gap-14 pt-20">
        <section className="flex flex-col justify-start h-[calc(100vh-5rem)] gap-2">
          <Hero />
          <FormatterApp />
        </section>
        <WhyFormat />
        <HowItWorks />
        <Faq />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}
