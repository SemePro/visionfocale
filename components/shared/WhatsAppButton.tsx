'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export interface WhatsAppButtonProps {
  context:
    | 'booking'
    | 'gallery_share'
    | 'inquiry'
    | 'infography'
    | 'service'
    | 'support'
    | 'default';
  bookingInfo?: {
    serviceType?: string;
    date?: string;
  };
  galleryLink?: string;
  serviceType?: string;
  floating?: boolean;
  text?: string;
}

export default function WhatsAppButton({
  context = 'default',
  bookingInfo,
  galleryLink,
  serviceType,
  floating = false,
  text,
}: WhatsAppButtonProps) {
  const generateMessage = (): string => {
    switch (context) {
      case 'booking':
        return `Bonjour VisionFocale! Je souhaite réserver une séance ${
          bookingInfo?.serviceType || 'photo'
        }${bookingInfo?.date ? ` pour le ${bookingInfo.date}` : ''}.`;
      case 'gallery_share':
        return `Bonjour! J'ai reçu le lien de ma galerie photo${
          galleryLink ? `: ${galleryLink}` : ''
        }. J'ai une question à ce sujet.`;
      case 'inquiry':
        return `Bonjour VisionFocale! J'aimerais avoir plus d'informations sur vos services de photographie.`;
      case 'infography':
        return `Bonjour VisionFocale! Je suis intéressé(e) par vos services d'infographie et de design.`;
      case 'service':
        return `Bonjour VisionFocale! J'aimerais en savoir plus sur votre service ${
          serviceType || 'de photographie'
        }.`;
      case 'support':
        return `Bonjour VisionFocale! J'ai besoin d'aide.`;
      default:
        return `Bonjour VisionFocale! Je vous contacte depuis votre site web.`;
    }
  };

  const handleClick = () => {
    const message = generateMessage();
    const whatsappLink = generateWhatsAppLink('+228XXXXXXXX', message);
    window.open(whatsappLink, '_blank');
  };

  if (floating) {
    return (
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 animate-bounce-soft"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <MessageCircle size={20} />
      <span>{text || 'Contacter sur WhatsApp'}</span>
    </button>
  );
}


