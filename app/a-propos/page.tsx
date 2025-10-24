import { Camera, Heart, Users, Award, Target, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Nous aimons ce que nous faisons et cela se voit dans chaque photo.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'La qualité est au cœur de tout ce que nous créons.',
  },
  {
    icon: Users,
    title: 'Écoute',
    description: 'Vos besoins et votre vision sont notre priorité.',
  },
  {
    icon: Target,
    title: 'Précision',
    description: 'Chaque détail compte pour capturer le moment parfait.',
  },
  {
    icon: Zap,
    title: 'Réactivité',
    description: 'Livraison rapide sans compromis sur la qualité.',
  },
  {
    icon: Camera,
    title: 'Innovation',
    description: 'Toujours à la pointe des tendances et technologies.',
  },
];

const stats = [
  { value: '500+', label: 'Événements capturés' },
  { value: '1000+', label: 'Clients satisfaits' },
  { value: '50K+', label: 'Photos créées' },
  { value: '5 ans', label: 'D\'expérience' },
];

export const metadata = {
  title: 'À propos - VisionFocale | Notre Histoire',
  description:
    'Découvrez VisionFocale, studio de photographie et infographie basé à Lomé, Togo. Notre passion : capturer vos moments précieux avec créativité et professionnalisme.',
};

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">À propos de VisionFocale</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Capturez l'instant, créez l'émotion. Notre mission est de transformer vos moments
            en souvenirs inoubliables.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl flex items-center justify-center shadow-xl">
                <Camera size={120} className="text-primary-400" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-6">
                Notre Histoire
              </span>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                Une passion devenue profession
              </h2>
              <div className="space-y-4 text-lg text-neutral-600">
                <p>
                  Fondé en 2019 à Lomé, VisionFocale est né d'une passion commune pour la
                  photographie et le design. Ce qui a commencé comme un hobby entre amis est
                  rapidement devenu un studio professionnel reconnu au Togo.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers d'avoir capturé plus de 500 événements et créé
                  des milliers de souvenirs pour nos clients. De la photographie de mariage à
                  l'infographie d'entreprise, nous mettons notre expertise au service de vos
                  projets.
                </p>
                <p>
                  Notre équipe de photographes et designers passionnés travaille avec du matériel
                  professionnel de dernière génération pour vous garantir des résultats
                  exceptionnels.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/reservation">
                  <Button variant="primary" size="lg">
                    Travaillons ensemble
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
              Nos Valeurs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Ce qui nous anime
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Des valeurs fortes qui guident chacune de nos actions et créations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} hover className="text-center">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-purple rounded-2xl text-white mb-6 shadow-lg">
                      <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                    <p className="text-neutral-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission */}
              <Card className="border-2 border-primary-500">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white mb-6">
                    <Target size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Notre Mission</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Rendre l'art de la photographie et du design accessible à tous, en offrant
                    des services de qualité professionnelle à des prix abordables. Nous croyons
                    que chaque moment mérite d'être capturé et célébré.
                  </p>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="border-2 border-secondary-500">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center text-white mb-6">
                    <Camera size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Notre Vision</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Devenir le studio de référence en Afrique de l'Ouest pour la photographie
                    créative et le design innovant. Nous voulons inspirer et être inspirés par
                    chaque projet que nous entreprenons.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Matériel professionnel',
                description: 'Équipement de pointe pour des résultats exceptionnels',
              },
              {
                title: 'Livraison rapide',
                description: 'Vos photos disponibles sous 48-72h via galerie en ligne',
              },
              {
                title: 'Galeries privées',
                description: 'Accès sécurisé et téléchargements illimités',
              },
              {
                title: 'Prix transparents',
                description: 'Devis clairs sans frais cachés',
              },
              {
                title: 'Équipe expérimentée',
                description: '5 ans d\'expérience et des centaines de projets réussis',
              },
              {
                title: 'Satisfaction garantie',
                description: 'Nous ne sommes satisfaits que si vous l\'êtes',
              },
            ].map((item, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center text-white mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-neutral-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à créer quelque chose d'extraordinaire ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Réservez votre séance photo ou contactez-nous pour discuter de votre projet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation">
              <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                Réserver maintenant
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


