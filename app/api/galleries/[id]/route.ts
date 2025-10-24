import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

// GET /api/galleries/[id] - Récupérer une galerie spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const gallery = await Gallery.findById(params.id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    console.error(`Erreur GET /api/galleries/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/galleries/[id] - Mettre à jour une galerie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const gallery = await Gallery.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    console.error(`Erreur PUT /api/galleries/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/galleries/[id] - Supprimer une galerie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const gallery = await Gallery.findByIdAndDelete(params.id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Galerie non trouvée' },
        { status: 404 }
      );
    }

    // TODO: Supprimer les photos de Cloudinary

    return NextResponse.json({
      success: true,
      message: 'Galerie supprimée avec succès',
    });
  } catch (error: any) {
    console.error(`Erreur DELETE /api/galleries/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


