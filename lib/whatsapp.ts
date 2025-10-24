/**
 * Service WhatsApp pour envoi de messages et notifications
 */

interface WhatsAppMessageOptions {
  to: string;
  message: string;
  type?: 'text' | 'template';
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoyer un message WhatsApp via l'API Business
 */
export async function sendWhatsAppMessage(
  options: WhatsAppMessageOptions
): Promise<WhatsAppResponse> {
  const { to, message, type = 'text' } = options;
  const businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  if (!businessNumber || !apiToken) {
    console.error('❌ Configuration WhatsApp manquante');
    // En dev, on simule l'envoi
    if (process.env.NODE_ENV === 'development') {
      return sendWhatsAppDev(to, message);
    }
    return { success: false, error: 'Configuration WhatsApp manquante' };
  }

  try {
    // TODO: Implémenter l'API WhatsApp Business réelle
    // Exemple avec l'API WhatsApp Business Cloud
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${businessNumber}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type,
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.messages?.[0]?.id) {
      return {
        success: true,
        messageId: data.messages[0].id,
      };
    } else {
      return {
        success: false,
        error: data.error?.message || 'Échec envoi WhatsApp',
      };
    }
  } catch (error) {
    console.error('❌ Erreur envoi WhatsApp:', error);
    return { success: false, error: 'Erreur réseau' };
  }
}

/**
 * Générer un lien WhatsApp (ouvre WhatsApp avec message pré-rempli)
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const businessNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '+228XXXXXXXX';
  // Nettoyer le numéro (retirer espaces et caractères spéciaux)
  const cleanNumber = businessNumber.replace(/[^0-9+]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Envoyer une notification de galerie prête via WhatsApp
 */
export async function sendGalleryReadyWhatsApp(
  phoneNumber: string,
  clientName: string,
  galleryLink: string,
  photoCount: number
): Promise<WhatsAppResponse> {
  const message = `Bonjour ${clientName}! 📸

Vos ${photoCount} photos sont maintenant disponibles dans votre galerie privée VisionFocale.

Accédez à vos photos ici:
${galleryLink}

Vous pouvez les consulter, aimer vos préférées et les télécharger.

Merci de votre confiance!
L'équipe VisionFocale ✨`;

  return sendWhatsAppMessage({ to: phoneNumber, message });
}

/**
 * Envoyer une confirmation de réservation via WhatsApp
 */
export async function sendBookingConfirmationWhatsApp(
  phoneNumber: string,
  clientName: string,
  bookingDetails: {
    serviceType: string;
    date: string;
    time: string;
    location?: string;
  }
): Promise<WhatsAppResponse> {
  const { serviceType, date, time, location } = bookingDetails;
  
  let message = `Bonjour ${clientName}! ✅

Votre réservation VisionFocale est confirmée:

📷 Service: ${serviceType}
📅 Date: ${date}
🕐 Heure: ${time}`;

  if (location) {
    message += `\n📍 Lieu: ${location}`;
  }

  message += `

Nous avons hâte de capturer vos moments précieux!

Pour toute question, répondez à ce message.

À bientôt,
VisionFocale 🎬`;

  return sendWhatsAppMessage({ to: phoneNumber, message });
}

/**
 * Envoyer un rappel de rendez-vous via WhatsApp
 */
export async function sendBookingReminderWhatsApp(
  phoneNumber: string,
  clientName: string,
  bookingDetails: {
    serviceType: string;
    date: string;
    time: string;
  }
): Promise<WhatsAppResponse> {
  const { serviceType, date, time } = bookingDetails;
  
  const message = `Bonjour ${clientName}! 📅

Petit rappel: votre séance ${serviceType} est prévue demain.

🕐 ${date} à ${time}

Nous vous attendons avec impatience!

VisionFocale`;

  return sendWhatsAppMessage({ to: phoneNumber, message });
}

/**
 * Générer un message de demande de renseignements
 */
export function generateInquiryMessage(): string {
  return 'Bonjour VisionFocale! J\'aimerais avoir plus d\'informations sur vos services.';
}

/**
 * Générer un message de demande de réservation
 */
export function generateBookingMessage(serviceType: string, date?: string): string {
  let message = `Bonjour VisionFocale! Je souhaite réserver une séance ${serviceType}`;
  if (date) {
    message += ` pour le ${date}`;
  }
  message += '.';
  return message;
}

/**
 * Envoyer un code OTP via WhatsApp
 */
export async function sendOTPWhatsApp(phoneNumber: string, otp: string): Promise<WhatsAppResponse> {
  const message = `🔐 *VisionFocale - Code de Vérification*

Votre code OTP est: *${otp}*

⏱️ Valable 10 minutes.

Ne partagez ce code avec personne.

VisionFocale 📸`;

  return sendWhatsAppMessage({ to: phoneNumber, message });
}

/**
 * Générer un code OTP à 6 chiffres
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Simuler l'envoi WhatsApp en mode développement
 */
export async function sendWhatsAppDev(to: string, message: string): Promise<WhatsAppResponse> {
  console.log('💬 [DEV MODE] WhatsApp simulé:');
  console.log(`   À: ${to}`);
  console.log(`   Message: ${message}`);
  return { success: true, messageId: 'wa-dev-' + Date.now() };
}

