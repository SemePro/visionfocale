'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Play, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

const heroSlides = [
  {
    title: 'Capturez l\'instant',
    subtitle: 'Créez l\'émotion',
    description: 'Studio professionnel de photographie et infographie à Lomé',
    image: '/images/hero/wedding.jpg',
    cta: 'Découvrir nos services',
    ctaLink: '/services',
  },
  {
    title: 'Vos moments précieux',
    subtitle: 'Immortalisés avec passion',
    description: 'Mariages, portraits, événements et bien plus encore',
    image: '/images/hero/portrait.jpg',
    cta: 'Réserver une séance',
    ctaLink: '/reservation',
  },
  {
    title: 'Créativité & Excellence',
    subtitle: 'Design graphique moderne',
    description: 'Logos, flyers, retouches et montages professionnels',
    image: '/images/hero/design.jpg',
    cta: 'Voir la galerie',
    ctaLink: '/galerie',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary-600 via-primary-600 to-secondary-700">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 animate-float">
            <Camera size={40} />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {slide.title}
            <br />
            <span className="text-accent-light">{slide.subtitle}</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={slide.ctaLink}>
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100"
                rightIcon={<ArrowRight size={20} />}
              >
                {slide.cta}
              </Button>
            </Link>
            <Link href="/galerie">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                leftIcon={<Play size={20} />}
              >
                Voir nos travaux
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {[
              { value: '500+', label: 'Événements' },
              { value: '1000+', label: 'Clients satisfaits' },
              { value: '50K+', label: 'Photos capturées' },
              { value: '5★', label: 'Note moyenne' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce-soft">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}


