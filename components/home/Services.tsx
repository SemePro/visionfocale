import { Camera, Palette, Video, Sparkles, Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

const services = [
  {
    icon: Camera,
    title: 'Photographie',
    description: 'Mariages, portraits, événements, corporate. Capturez vos moments les plus précieux.',
    features: ['Mariages & cérémonies', 'Portraits professionnels', 'Événements', 'Photos corporate'],
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Radio,
    title: 'Services Drone',
    description: 'Prises de vues aériennes spectaculaires pour vos terrains, événements et projets.',
    features: ['Photos aériennes HD', 'Vidéos drone 4K', 'Survol de terrains', 'Vues panoramiques'],
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Video,
    title: 'Vidéo',
    description: 'Clips promotionnels, vidéos événementielles et montages professionnels.',
    features: ['Vidéos événementielles', 'Clips promotionnels', 'Vidéos corporate', 'Montage vidéo'],
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    icon: Palette,
    title: 'Infographie',
    description: 'Design graphique moderne et créatif pour tous vos besoins visuels.',
    features: ['Design de logos', 'Flyers & affiches', 'Cartes de visite', 'Retouche photo'],
    color: 'from-accent-DEFAULT to-accent-light',
  },
  {
    icon: Sparkles,
    title: 'Retouches Pro',
    description: 'Sublimez vos photos avec nos retouches professionnelles.',
    features: ['Correction couleur', 'Retouche beauté', 'Montage créatif', 'Restauration photos'],
    color: 'from-pink-500 to-purple-600',
  },
];

export default function Services() {
  return (
    <section className="section bg-neutral-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
            Nos Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Une expertise complète à votre service
          </h2>
          <p className="text-lg text-neutral-600">
            De la photographie professionnelle à l'infographie créative, nous transformons vos idées
            en réalité visuelle.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                hover
                className="group relative overflow-hidden h-full"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <CardContent className="p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <Icon className="text-white" size={28} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{service.title}</h3>
                  <p className="text-neutral-600 mb-6 flex-grow">{service.description}</p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Link */}
                  <Link
                    href="/services"
                    className="text-primary-500 font-medium text-sm hover:text-primary-600 transition-colors inline-flex items-center gap-2 group/link"
                  >
                    En savoir plus
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

