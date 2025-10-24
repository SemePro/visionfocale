// Store OTPs temporairement (en production, utiliser Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Fonction utilitaire pour valider l'OTP
export function validateOTP(phoneNumber: string, otp: string): boolean {
  const stored = otpStore.get(phoneNumber);

  if (!stored) {
    return false;
  }

  // Vérifier expiration
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phoneNumber);
    return false;
  }

  // Vérifier OTP
  if (stored.otp !== otp) {
    return false;
  }

  // Supprimer après validation
  otpStore.delete(phoneNumber);
  return true;
}

// Fonction pour stocker un OTP
export function storeOTP(phoneNumber: string, otp: string, expiresAt: number): void {
  otpStore.set(phoneNumber, { otp, expiresAt });
}

// Fonction pour obtenir un OTP stocké
export function getStoredOTP(phoneNumber: string): { otp: string; expiresAt: number } | null {
  return otpStore.get(phoneNumber) || null;
}
