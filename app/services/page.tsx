import { Camera, Palette, Video, Sparkles, Check, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const services = [
  {
    icon: Camera,
    title: 'Photographie Professionnelle',
    tagline: 'Capturez vos moments les plus précieux',
    description:
      'Services de photographie haut de gamme pour tous vos événements et besoins professionnels.',
    color: 'from-primary-500 to-primary-600',
    features: [
      {
        name: 'Mariages & Cérémonies',
        description: 'Immortalisez votre jour spécial avec élégance',
        price: 'À partir de 250 000 FCFA',
      },
      {
        name: 'Portraits Professionnels',
        description: 'Photos de profil, CV, LinkedIn',
        price: 'À partir de 30 000 FCFA',
      },
      {
        name: 'Événements Corporate',
        description: 'Conférences, séminaires, lancements',
        price: 'À partir de 150 000 FCFA',
      },
      {
        name: 'Photos de Famille',
        description: 'Séances en studio ou en extérieur',
        price: 'À partir de 50 000 FCFA',
      },
      {
        name: 'Shooting Produits',
        description: 'Photos e-commerce et catalogues',
        price: 'À partir de 75 000 FCFA',
      },
      {
        name: 'Photos Immobilières',
        description: 'Valorisez vos biens',
        price: 'À partir de 40 000 FCFA',
      },
    ],
    included: [
      'Consultation préalable',
      'Séance photo professionnelle',
      'Retouches basiques incluses',
      'Galerie privée en ligne',
      'Téléchargements haute résolution',
      'Livraison sous 48-72h',
    ],
  },
  {
    icon: Palette,
    title: 'Infographie & Design',
    tagline: 'Des créations qui marquent les esprits',
    description:
      'Services de design graphique pour tous vos besoins en communication visuelle.',
    color: 'from-accent-DEFAULT to-accent-light',
    features: [
      {
        name: 'Design de Logos',
        description: 'Identité visuelle unique et mémorable',
        price: 'À partir de 50 000 FCFA',
      },
      {
        name: 'Cartes de Visite',
        description: 'Design professionnel et impression',
        price: 'À partir de 15 000 FCFA',
      },
      {
        name: 'Flyers & Affiches',
        description: 'Supports publicitaires impactants',
        price: 'À partir de 20 000 FCFA',
      },
      {
        name: 'Bannières Réseaux Sociaux',
        description: 'Visuels optimisés pour tous les réseaux',
        price: 'À partir de 10 000 FCFA',
      },
      {
        name: 'Retouche Photo Avancée',
        description: 'Perfectionnez vos images',
        price: 'À partir de 5 000 FCFA/photo',
      },
      {
        name: 'Montage Créatif',
        description: 'Compositions artistiques',
        price: 'Sur devis',
      },
    ],
    included: [
      'Brief détaillé',
      '3 propositions de design',
      'Révisions illimitées',
      'Fichiers sources fournis',
      'Formats adaptés (web, print)',
      'Livraison rapide',
    ],
  },
  {
    icon: Video,
    title: 'Vidéo & Montage',
    tagline: 'Racontez votre histoire en mouvement',
    description:
      'Production vidéo professionnelle pour tous types de projets.',
    color: 'from-secondary-500 to-secondary-600',
    features: [
      {
        name: 'Vidéos Événementielles',
        description: 'Mariages, anniversaires, cérémonies',
        price: 'À partir de 200 000 FCFA',
      },
      {
        name: 'Clips Promotionnels',
        description: 'Vidéos marketing percutantes',
        price: 'À partir de 150 000 FCFA',
      },
      {
        name: 'Vidéos Corporate',
        description: 'Présentations d\'entreprise',
        price: 'À partir de 180 000 FCFA',
      },
      {
        name: 'Montage Vidéo',
        description: 'Post-production professionnelle',
        price: 'À partir de 50 000 FCFA',
      },
      {
        name: 'Interviews & Témoignages',
        description: 'Captation et montage',
        price: 'À partir de 75 000 FCFA',
      },
    ],
    included: [
      'Pré-production et storyboard',
      'Tournage professionnel',
      'Montage et étalonnage',
      'Musique et effets sonores',
      'Formats multiples (social, web)',
      'Révisions incluses',
    ],
  },
  {
    icon: Sparkles,
    title: 'Retouches Premium',
    tagline: 'Sublimez vos photos',
    description:
      'Services de retouche photo professionnelle pour des résultats exceptionnels.',
    color: 'from-pink-500 to-purple-600',
    features: [
      {
        name: 'Retouche Beauté',
        description: 'Portraits et mode',
        price: 'À partir de 8 000 FCFA/photo',
      },
      {
        name: 'Correction Couleur',
        description: 'Étalonnage professionnel',
        price: 'À partir de 5 000 FCFA/photo',
      },
      {
        name: 'Détourage Professionnel',
        description: 'Fond transparent ou changement',
        price: 'À partir de 3 000 FCFA/photo',
      },
      {
        name: 'Restauration Photos',
        description: 'Anciennes photos abîmées',
        price: 'À partir de 10 000 FCFA',
      },
      {
        name: 'Montage Créatif',
        description: 'Compositions artistiques',
        price: 'Sur devis',
      },
    ],
    included: [
      'Analyse de l\'image',
      'Retouches non destructives',
      'Haute résolution',
      'Formats multiples',
      'Révisions incluses',
      'Livraison rapide',
    ],
  },
  {
    icon: Camera,
    title: 'Événements Spéciaux',
    tagline: 'Célébrez les moments uniques de la vie',
    description:
      'Services spécialisés pour les événements marquants de votre vie.',
    color: 'from-pink-500 to-rose-600',
    features: [
      {
        name: 'Anniversaires',
        description: 'Fêtez vos années avec style',
        price: 'À partir de 80 000 FCFA',
      },
      {
        name: 'Sortie de nouveau-né',
        description: 'Premiers moments précieux',
        price: 'À partir de 60 000 FCFA',
      },
      {
        name: 'Baptême',
        description: 'Cérémonie religieuse mémorable',
        price: 'À partir de 100 000 FCFA',
      },
    ],
    included: [
      'Préparation personnalisée',
      'Séance photo dédiée',
      'Retouches professionnelles',
      'Galerie privée',
      'Téléchargements HD',
      'Livraison sous 48h',
    ],
  },
];

export const metadata = {
  title: 'Nos Services - VisionFocale | Photographie & Infographie à Lomé',
  description:
    'Découvrez nos services de photographie professionnelle, infographie, vidéo et retouches à Lomé, Togo. Mariages, événements, corporate, portraits et plus.',
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Des solutions créatives complètes pour tous vos besoins en photographie,
            vidéo et design graphique
          </p>
          <Link href="/reservation">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-neutral-100"
              rightIcon={<ArrowRight size={20} />}
            >
              Réserver une séance
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div className="space-y-32">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.title}
                  className={`grid lg:grid-cols-2 gap-12 items-start ${
                    isEven ? '' : 'lg:grid-flow-dense'
                  }`}
                >
                  {/* Service Info */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-6 shadow-lg`}
                    >
                      <Icon size={32} />
                    </div>

                    <h2 className="text-4xl font-bold text-neutral-900 mb-3">
                      {service.title}
                    </h2>
                    <p className="text-xl text-primary-600 font-medium mb-4">
                      {service.tagline}
                    </p>
                    <p className="text-lg text-neutral-600 mb-8">{service.description}</p>

                    {/* Included */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">Inclus :</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.included.map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-neutral-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/reservation">
                      <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />}>
                        Réserver maintenant
                      </Button>
                    </Link>
                  </div>

                  {/* Features Cards */}
                  <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <div className="grid gap-4">
                      {service.features.map((feature) => (
                        <Card key={feature.name} hover>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-neutral-900">{feature.name}</h4>
                              <span className="text-primary-600 font-bold text-sm whitespace-nowrap ml-4">
                                {feature.price}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">{feature.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à donner vie à votre projet ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100"
              >
                Réserver une séance
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


