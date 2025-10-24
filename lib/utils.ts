import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

/**
 * Utilitaire pour fusionner les classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Générer un ID unique pour les galeries
 */
export function generateGalleryId(): string {
  return nanoid(12);
}

/**
 * Générer un lien de partage unique
 */
export function generateShareLink(): string {
  return nanoid(16);
}

/**
 * Générer un slug à partir d'une chaîne
 */
export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

/**
 * Formater un numéro de téléphone
 */
export function formatPhoneNumber(phone: string): string {
  // Retirer tous les caractères non numériques sauf le +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si le numéro commence par +228 (Togo)
  if (cleaned.startsWith('+228')) {
    const number = cleaned.slice(4);
    return `+228 ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6)}`;
  }
  
  return cleaned;
}

/**
 * Valider un numéro de téléphone togolais
 */
export function validateTogoPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, '');
  // Numéros togolais: 8 chiffres commençant par 9, 7, ou 2
  return /^[972]\d{7}$/.test(cleaned);
}

/**
 * Formater une date en français
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formater une date avec heure
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formater un prix en FCFA
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

/**
 * Calculer le temps écoulé depuis une date
 */
export function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'à l\'instant';
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
  if (seconds < 604800) return `il y a ${Math.floor(seconds / 86400)} j`;
  if (seconds < 2592000) return `il y a ${Math.floor(seconds / 604800)} sem`;
  return formatDate(d);
}

/**
 * Tronquer un texte
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Valider une adresse email
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Générer un OTP sécurisé
 */
export function generateSecureOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/**
 * Obtenir les initiales d'un nom
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Vérifier si une date est expirée
 */
export function isExpired(date: Date | string | undefined): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

/**
 * Calculer le nombre de jours restants
 */
export function daysUntil(date: Date | string): number {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Générer une couleur aléatoire (pour avatars)
 */
export function generateAvatarColor(seed: string): string {
  const colors = [
    '#8B3FBF',
    '#7B2FB2',
    '#6A1FA5',
    '#3D1F5C',
    '#C08FE8',
    '#D4A5F4',
  ];
  const index = seed.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Formatter un nom de fichier (retirer caractères spéciaux)
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
}

/**
 * Obtenir l'extension d'un fichier
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Convertir bytes en format lisible
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copier du texte dans le presse-papier
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erreur copie presse-papier:', error);
    return false;
  }
}


