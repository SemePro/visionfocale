import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // 60 secondes pour les images lourdes
});

// Configuration du watermark (logo)
// NOTE: Pour les overlays, on doit utiliser le format avec colons "visionFocale:watermarks:logo"
// C'est différent du format utilisé pour uploader qui utilise des slashes
export const WATERMARK_CONFIG = {
  publicId: process.env.CLOUDINARY_WATERMARK_PUBLIC_ID || 'logo-watermark_vzukbf',
  position: 'center', // Position: center (au milieu)
  width: 400, // Largeur du watermark
  height: 150, // Hauteur du watermark
  opacity: 25, // Opacité plus discrète
  margin: { x: 0, y: 0 }, // Pas de marges pour être exactement au centre
};

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface WatermarkedPhotoUrls {
  originalUrl: string;
  watermarkedUrl: string;
  cleanUrl: string;
  thumbnail: string;
  public_id: string;
}

/**
 * Upload une photo et génère les versions avec et sans watermark
 */
export async function uploadPhotoWithWatermark(
  file: string | Buffer,
  options: {
    folder?: string;
    filename?: string;
    watermarkText?: string;
    watermarkPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
    watermarkOpacity?: number;
    watermarkFontSize?: number;
  } = {}
): Promise<WatermarkedPhotoUrls> {
  const {
    folder = 'visionfocale/client_galleries',
    filename,
    watermarkText = 'Photo by VisionFocale',
    watermarkPosition = 'center', // Default to center for watermark
    watermarkOpacity = 25, // Use the opacity from WATERMARK_CONFIG
    watermarkFontSize = 40,
  } = options;

  try {
    // Convert Buffer to base64 data URI if needed
    let fileToUpload: string;
    if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64');
      fileToUpload = `data:image/jpeg;base64,${base64}`;
    } else {
      fileToUpload = file;
    }

    // Upload de l'image originale (sans watermark permanent)
    const uploadResult: CloudinaryUploadResult = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      public_id: filename,
      resource_type: 'image',
      quality: 'auto:best',
    });

    // Position du watermark selon le choix
    const gravityMap = {
      'bottom-right': 'south_east',
      'bottom-left': 'south_west',
      'top-right': 'north_east',
      'top-left': 'north_west',
      center: 'center',
    };

    const gravity = gravityMap[watermarkPosition] || 'center'; // Default to center

    // URL avec watermark logo (pour affichage dans la galerie)
    const watermarkedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { quality: 'auto' },
        {
          overlay: WATERMARK_CONFIG.publicId,
          width: WATERMARK_CONFIG.width,
          height: WATERMARK_CONFIG.height,
          gravity: gravity,
          x: WATERMARK_CONFIG.margin.x,
          y: WATERMARK_CONFIG.margin.y,
          opacity: watermarkOpacity || WATERMARK_CONFIG.opacity,
          flags: 'layer_apply',
        },
      ],
      secure: true,
    });

    // URL propre (haute qualité, sans watermark pour téléchargement)
    const cleanUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [{ quality: 'auto:best' }],
      secure: true,
    });

    // Thumbnail (petite taille pour previews)
    const thumbnail = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
      ],
      secure: true,
    });

    return {
      originalUrl: uploadResult.secure_url,
      watermarkedUrl,
      cleanUrl,
      thumbnail,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error);
    throw new Error(`Échec de l'upload: ${error}`);
  }
}

/**
 * Upload une photo pour la galerie publique (avec watermark permanent)
 */
export async function uploadPublicPhoto(
  file: string | Buffer,
  options: {
    folder?: string;
    filename?: string;
  } = {}
): Promise<{ url: string; thumbnail: string; public_id: string }> {
  const { folder = 'visionfocale/public_gallery', filename } = options;

  try {
    // Convert Buffer to base64 data URI if needed
    let fileToUpload: string;
    if (Buffer.isBuffer(file)) {
      const base64 = file.toString('base64');
      fileToUpload = `data:image/jpeg;base64,${base64}`;
    } else {
      fileToUpload = file;
    }

    const uploadResult: CloudinaryUploadResult = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      public_id: filename,
      resource_type: 'image',
      quality: 'auto:best',
    });

    // URL avec watermark logo permanent
    const url = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { quality: 'auto' },
        {
          overlay: WATERMARK_CONFIG.publicId,
          width: WATERMARK_CONFIG.width,
          gravity: WATERMARK_CONFIG.position,
          x: WATERMARK_CONFIG.margin.x,
          y: WATERMARK_CONFIG.margin.y,
          opacity: WATERMARK_CONFIG.opacity,
        },
      ],
      secure: true,
    });

    // Thumbnail
    const thumbnail = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { width: 600, height: 600, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' },
      ],
      secure: true,
    });

    return {
      url,
      thumbnail,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error('❌ Erreur upload Cloudinary (public):', error);
    throw new Error(`Échec de l'upload: ${error}`);
  }
}

/**
 * Supprimer une image de Cloudinary
 */
export async function deletePhoto(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('❌ Erreur suppression Cloudinary:', error);
    return false;
  }
}

/**
 * Obtenir les informations d'une image
 */
export async function getPhotoInfo(publicId: string): Promise<any> {
  try {
    return await cloudinary.api.resource(publicId);
  } catch (error) {
    console.error('❌ Erreur récupération info Cloudinary:', error);
    throw error;
  }
}

/**
 * Générer un URL signé temporaire (pour téléchargements sécurisés)
 */
export function generateSignedUrl(publicId: string, expiresIn: number = 3600): string {
  const timestamp = Math.round(Date.now() / 1000) + expiresIn;
  
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    secure: true,
    transformation: [{ quality: 'auto:best' }],
  });
}

export default cloudinary;

