/**
 * Service SMS - Redirige vers WhatsApp
 * Note: L'authentification OTP utilise maintenant WhatsApp au lieu de SMS
 */

import { sendOTPWhatsApp, generateOTP as generateOTPWhatsApp } from './whatsapp';

interface SMSOptions {
  to: string;
  message: string;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Générer un code OTP à 6 chiffres (redirige vers WhatsApp)
 */
export function generateOTP(): string {
  return generateOTPWhatsApp();
}

/**
 * Envoyer un SMS via Africa's Talking
 */
async function sendSMSAfricasTalking(options: SMSOptions): Promise<SMSResponse> {
  const { to, message } = options;
  const apiKey = process.env.SMS_API_KEY;
  const username = process.env.SMS_API_USERNAME || 'sandbox';

  if (!apiKey) {
    console.error('❌ SMS_API_KEY non configuré');
    return { success: false, error: 'Configuration SMS manquante' };
  }

  try {
    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey,
      },
      body: new URLSearchParams({
        username,
        to,
        message,
        from: process.env.SMS_SENDER_ID || 'VisionFocale',
      }),
    });

    const data = await response.json();

    if (data.SMSMessageData?.Recipients?.[0]?.status === 'Success') {
      return {
        success: true,
        messageId: data.SMSMessageData.Recipients[0].messageId,
      };
    } else {
      return {
        success: false,
        error: data.SMSMessageData?.Recipients?.[0]?.status || 'Échec envoi SMS',
      };
    }
  } catch (error) {
    console.error('❌ Erreur envoi SMS (Africa\'s Talking):', error);
    return { success: false, error: 'Erreur réseau' };
  }
}

/**
 * Envoyer un SMS via Twilio
 */
async function sendSMSTwilio(options: SMSOptions): Promise<SMSResponse> {
  const { to, message } = options;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('❌ Configuration Twilio manquante');
    return { success: false, error: 'Configuration SMS manquante' };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          To: to,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.sid) {
      return {
        success: true,
        messageId: data.sid,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Échec envoi SMS',
      };
    }
  } catch (error) {
    console.error('❌ Erreur envoi SMS (Twilio):', error);
    return { success: false, error: 'Erreur réseau' };
  }
}

/**
 * Envoyer un SMS (détecte automatiquement le provider)
 */
export async function sendSMS(to: string, message: string): Promise<SMSResponse> {
  const provider = process.env.SMS_PROVIDER || 'africas_talking';

  // Normaliser le numéro de téléphone
  let normalizedNumber = to.replace(/\s+/g, '');
  if (!normalizedNumber.startsWith('+')) {
    // Ajouter le code pays du Togo par défaut
    normalizedNumber = `+228${normalizedNumber}`;
  }

  console.log(`📱 Envoi SMS via ${provider} à ${normalizedNumber}`);

  if (provider === 'twilio') {
    return sendSMSTwilio({ to: normalizedNumber, message });
  } else {
    return sendSMSAfricasTalking({ to: normalizedNumber, message });
  }
}

/**
 * Envoyer un code OTP (via WhatsApp maintenant)
 */
export async function sendOTPSMS(phoneNumber: string, otp: string): Promise<SMSResponse> {
  console.log('📱 Redirection vers WhatsApp pour OTP...');
  const result = await sendOTPWhatsApp(phoneNumber, otp);
  return {
    success: result.success,
    messageId: result.messageId,
    error: result.error,
  };
}

/**
 * Envoyer une notification de galerie prête
 */
export async function sendGalleryReadySMS(
  phoneNumber: string,
  clientName: string,
  galleryLink: string
): Promise<SMSResponse> {
  const message = `Bonjour ${clientName}, vos photos sont prêtes! Accédez à votre galerie: ${galleryLink} - VisionFocale`;
  return sendSMS(phoneNumber, message);
}

/**
 * Envoyer un rappel de rendez-vous
 */
export async function sendBookingReminderSMS(
  phoneNumber: string,
  clientName: string,
  bookingDate: string,
  serviceType: string
): Promise<SMSResponse> {
  const message = `Bonjour ${clientName}, rappel: RDV ${serviceType} le ${bookingDate}. À bientôt! - VisionFocale`;
  return sendSMS(phoneNumber, message);
}

/**
 * Simuler l'envoi d'un SMS en mode développement
 */
export async function sendSMSDev(to: string, message: string): Promise<SMSResponse> {
  console.log('📱 [DEV MODE] SMS simulé:');
  console.log(`   À: ${to}`);
  console.log(`   Message: ${message}`);
  return { success: true, messageId: 'dev-' + Date.now() };
}

