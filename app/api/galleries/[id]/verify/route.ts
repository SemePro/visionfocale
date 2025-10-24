import { NextRequest, NextResponse } from 'next/server';
import Gallery from '@/models/Gallery';
import connectDB from '@/lib/mongodb';

// POST /api/galleries/[id]/verify - Verify phone number and grant access
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { phone } = await request.json();
    const galleryLink = params.id; // This is the shareLink, not the _id

    // Validation
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

    // Check if gallery is active
    if (gallery.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Cette galerie n\'est plus accessible' },
        { status: 403 }
      );
    }

    // Check if gallery has expired
    if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Cette galerie a expiré' },
        { status: 403 }
      );
    }

    // Normalize phone numbers for comparison (remove spaces, dashes, etc.)
    const normalizePhone = (p: string) => p.replace(/[\s\-\(\)]/g, '');
    const inputPhone = normalizePhone(phone);
    const clientPhone = normalizePhone(gallery.clientInfo.phone);

    // Verify phone number matches
    if (inputPhone !== clientPhone && !inputPhone.endsWith(clientPhone) && !clientPhone.endsWith(inputPhone)) {
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone incorrect' },
        { status: 401 }
      );
    }

    // Increment view count
    gallery.statistics.views = (gallery.statistics.views || 0) + 1;
    await gallery.save();

    // Return gallery data
    return NextResponse.json({
      success: true,
      data: {
        galleryId: gallery.galleryId,
        shareLink: gallery.shareLink,
        clientInfo: gallery.clientInfo,
        photos: gallery.photos,
        settings: gallery.settings,
        statistics: gallery.statistics,
        expiresAt: gallery.expiresAt,
        photoCount: gallery.photos?.length || 0,
        clientName: gallery.clientInfo.name,
        eventType: gallery.clientInfo.eventType,
        eventDate: gallery.clientInfo.eventDate,
        downloadLimit: gallery.settings.downloadLimit,
      },
    });
  } catch (error: any) {
    console.error('Erreur POST /api/galleries/[id]/verify:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


