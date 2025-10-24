import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import RecentWorks from '@/components/home/RecentWorks';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <RecentWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}


