import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PublicGallery from '@/models/PublicGallery';

// GET /api/public-gallery/[id] - Récupérer une photo spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const photo = await PublicGallery.findById(params.id);

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: photo,
    });
  } catch (error: any) {
    console.error('Erreur GET /api/public-gallery/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/public-gallery/[id] - Mettre à jour une photo
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, category, featured, imageUrl, thumbnail, tags } = body;

    // Validation
    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: 'Titre et catégorie sont obligatoires' },
        { status: 400 }
      );
    }

    const photo = await PublicGallery.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        category,
        featured: featured || false,
        imageUrl,
        thumbnail,
        tags: tags || [],
      },
      { new: true, runValidators: true }
    );

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: photo,
    });
  } catch (error: any) {
    console.error('Erreur PUT /api/public-gallery/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/public-gallery/[id] - Supprimer une photo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const photo = await PublicGallery.findByIdAndDelete(params.id);

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Photo supprimée avec succès',
    });
  } catch (error: any) {
    console.error('Erreur DELETE /api/public-gallery/[id]:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
