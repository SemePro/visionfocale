import { NextRequest, NextResponse } from 'next/server';
import Gallery from '@/models/Gallery';
import connectDB from '@/lib/mongodb';

// POST /api/galleries/[id]/track-download - Track photo downloads
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { photoIds, phone } = await request.json();
    const galleryLink = params.id; // This is the shareLink

    // Validation
    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs de photos requis' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Find gallery by shareLink
    const gallery = await Gallery.findOne({ shareLink: galleryLink });

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Galerie introuvable' },
        { status: 404 }
      );
    }

    // Verify phone number matches
    const normalizePhone = (p: string) => p.replace(/[\s\-\(\)]/g, '');
    const inputPhone = normalizePhone(phone);
    const clientPhone = normalizePhone(gallery.clientInfo.phone);

    if (inputPhone !== clientPhone && !inputPhone.endsWith(clientPhone) && !clientPhone.endsWith(inputPhone)) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Check download limit
    const currentDownloads = gallery.statistics.totalDownloads || 0;
    const limit = gallery.settings.downloadLimit || 0;
    
    if (currentDownloads + photoIds.length > limit) {
      return NextResponse.json(
        { success: false, error: 'Limite de téléchargement dépassée' },
        { status: 403 }
      );
    }

    // Update statistics
    gallery.statistics.totalDownloads = currentDownloads + photoIds.length;

    // Update individual photo download counts
    photoIds.forEach((photoId: string) => {
      const photo = gallery.photos.find((p: any) => p.photoId === photoId);
      if (photo) {
        photo.downloads = (photo.downloads || 0) + 1;
      }
    });

    await gallery.save();

    return NextResponse.json({
      success: true,
      data: {
        totalDownloads: gallery.statistics.totalDownloads,
        remainingDownloads: limit - gallery.statistics.totalDownloads,
      },
    });
  } catch (error: any) {
    console.error('Erreur POST /api/galleries/[id]/track-download:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


