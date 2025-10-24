'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah & Paul Mensah',
    role: 'Mariage - Octobre 2024',
    rating: 5,
    text: 'VisionFocale a rendu notre mariage inoubliable ! Les photos sont magnifiques et capturent parfaitement l\'émotion de notre journée. Toute l\'équipe était professionnelle et discrète. Nous recommandons à 200% !',
    avatar: 'SM',
  },
  {
    id: 2,
    name: 'Kofi Adjei',
    role: 'Portrait Corporate',
    rating: 5,
    text: 'Photos professionnelles de très haute qualité pour notre entreprise. Le rendu est exceptionnel et a vraiment valorisé notre image de marque. Service rapide et prix abordable.',
    avatar: 'KA',
  },
  {
    id: 3,
    name: 'Aminata Diallo',
    role: 'Événement d\'entreprise',
    rating: 5,
    text: 'Nous avons fait appel à VisionFocale pour notre lancement de produit. Les photos et la vidéo sont spectaculaires ! Ils ont su capturer l\'ambiance et l\'énergie de notre événement. Bravo !',
    avatar: 'AD',
  },
  {
    id: 4,
    name: 'Jean-Baptiste Koffi',
    role: 'Infographie - Logo & Identité',
    rating: 5,
    text: 'Création de logo et identité visuelle pour mon entreprise. Le résultat dépasse mes attentes ! Design moderne, professionnel et totalement aligné avec ma vision. Merci VisionFocale !',
    avatar: 'JK',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="section bg-gradient-to-br from-primary-50 to-accent-light/20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-primary-600 rounded-full text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-neutral-600">
            Des centaines de clients satisfaits nous font confiance
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <Card glass className="relative overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 opacity-10">
                <Quote size={120} className="text-primary-500" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={`${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-purple flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-600">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft size={24} className="text-primary-500" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-primary-500 w-8' : 'bg-neutral-300'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Témoignage suivant"
            >
              <ChevronRight size={24} className="text-primary-500" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


