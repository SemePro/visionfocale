import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PublicGallery from '@/models/PublicGallery';

// GET /api/public-gallery - Liste les photos de la galerie publique
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter: any = {};
    if (category && category !== 'Tous') {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }

    // Récupérer les photos
    const photos = await PublicGallery.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await PublicGallery.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: photos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Erreur GET /api/public-gallery:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/public-gallery - Ajouter une photo à la galerie publique
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, category, imageUrl, thumbnail, featured, tags } = body;

    // Validation
    if (!title || !category || !imageUrl || !thumbnail) {
      return NextResponse.json(
        { success: false, error: 'Informations incomplètes' },
        { status: 400 }
      );
    }

    // Créer la photo
    const photo = await PublicGallery.create({
      title,
      description,
      category,
      imageUrl,
      thumbnail,
      featured: featured || false,
      tags: tags || [],
      likes: 0,
      views: 0,
      order: 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: photo,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur POST /api/public-gallery:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


