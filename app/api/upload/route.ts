import { NextRequest, NextResponse } from 'next/server';
import { uploadPhotoWithWatermark, uploadPublicPhoto } from '@/lib/cloudinary';
import Settings from '@/models/Settings';
import connectDB from '@/lib/mongodb';

// POST /api/upload - Upload une photo sur Cloudinary avec watermark
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'client' ou 'public'
    const galleryId = formData.get('galleryId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Récupérer les paramètres de watermark
    const settings = await Settings.getSettings();
    const watermarkSettings = settings.watermarkSettings;

    let result;

    if (type === 'public') {
      // Upload pour galerie publique avec watermark
      result = await uploadPhotoWithWatermark(buffer, {
        folder: 'visionfocale/public_portfolio',
        filename: `public_${Date.now()}`,
        watermarkText: watermarkSettings.text,
        watermarkPosition: 'center', // Force center position
        watermarkOpacity: watermarkSettings.opacity,
        watermarkFontSize: watermarkSettings.fontSize,
      });

      return NextResponse.json({
        success: true,
        data: {
          originalUrl: result.originalUrl,
          watermarkedUrl: result.watermarkedUrl,
          cleanUrl: result.cleanUrl,
          thumbnail: result.thumbnail,
          publicId: result.public_id,
        },
      });
    } else {
      // Upload pour galerie client
      if (!galleryId) {
        return NextResponse.json(
          { success: false, error: 'ID de galerie requis' },
          { status: 400 }
        );
      }

      result = await uploadPhotoWithWatermark(buffer, {
        folder: `visionfocale/galleries/${galleryId}`,
        filename: `photo_${Date.now()}`,
        watermarkText: watermarkSettings.text,
        watermarkPosition: 'center', // Force center position
        watermarkOpacity: watermarkSettings.opacity,
        watermarkFontSize: watermarkSettings.fontSize,
      });

      return NextResponse.json({
        success: true,
        data: {
          photoId: result.public_id,
          originalUrl: result.originalUrl,
          watermarkedUrl: result.watermarkedUrl,
          cleanUrl: result.cleanUrl,
          thumbnail: result.thumbnail,
          publicId: result.public_id,
        },
      });
    }
  } catch (error: any) {
    console.error('Erreur POST /api/upload:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


