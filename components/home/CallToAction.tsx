import Link from 'next/link';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function CallToAction() {
  return (
    <section className="section bg-gradient-to-br from-secondary-600 via-primary-600 to-secondary-700 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à capturer vos moments précieux ?
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Réservez votre séance photo dès aujourd'hui ou contactez-nous pour discuter de votre
            projet. Notre équipe est à votre écoute !
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/reservation">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-neutral-100"
                leftIcon={<Calendar size={24} />}
                rightIcon={<ArrowRight size={24} />}
              >
                Réserver maintenant
              </Button>
            </Link>
            <WhatsAppButton
              context="inquiry"
              text="Contacter sur WhatsApp"
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">Réservation facile</h3>
              <p className="text-white/80 text-sm">
                Système de réservation en ligne simple et rapide
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">Support réactif</h3>
              <p className="text-white/80 text-sm">
                Réponses rapides par WhatsApp, SMS ou email
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="text-white"
                  fill="none"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Livraison rapide</h3>
              <p className="text-white/80 text-sm">
                Accédez à vos photos dans votre galerie privée sous 48h
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


