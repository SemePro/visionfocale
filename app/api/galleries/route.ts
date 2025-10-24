import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import { generateGalleryId, generateShareLink } from '@/lib/utils';

// GET /api/galleries - Liste toutes les galeries
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    // Récupérer les galeries
    const galleries = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Gallery.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: galleries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erreur GET /api/galleries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/galleries - Créer une nouvelle galerie
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      clientInfo,
      settings,
      expiresAt,
      photos = [],
    } = body;

    // Validation
    if (!clientInfo?.name || !clientInfo?.phone || !clientInfo?.eventType) {
      return NextResponse.json(
        { success: false, error: 'Informations client incomplètes' },
        { status: 400 }
      );
    }

    // Générer ID et lien unique
    const galleryId = generateGalleryId();
    const shareLink = generateShareLink();

    // Préparer les photos avec métadonnées
    const photosData = photos.map((photo: any, index: number) => ({
      photoId: photo.photoId,
      originalUrl: photo.originalUrl,
      watermarkedUrl: photo.watermarkedUrl,
      cleanUrl: photo.cleanUrl,
      thumbnail: photo.thumbnail,
      likes: 0,
      isFavorite: false,
      downloads: 0,
      uploadedAt: new Date(),
      order: index,
    }));

    // Créer la galerie
    const gallery = await Gallery.create({
      galleryId,
      clientInfo,
      shareLink,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      settings: {
        downloadLimit: settings?.downloadLimit || 20,
        allowLikes: settings?.allowLikes !== false,
        allowFavorites: settings?.allowFavorites !== false,
        allowShare: settings?.allowShare !== false,
      },
      photos: photosData,
      statistics: {
        views: 0,
        totalDownloads: 0,
        totalLikes: 0,
      },
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      data: gallery,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/galerie-client/${shareLink}`,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur POST /api/galleries:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

