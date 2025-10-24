import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PublicGallery from '@/models/PublicGallery';

// PUT /api/public-gallery/[id]/like - Incrémenter les likes d'une photo
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const photo = await PublicGallery.findById(id);
    
    if (!photo) {
      return NextResponse.json({ success: false, error: 'Photo non trouvée' }, { status: 404 });
    }

    // Incrémenter les likes
    photo.likes += 1;
    await photo.save();

    return NextResponse.json({ 
      success: true, 
      data: { likes: photo.likes } 
    });
  } catch (error: any) {
    console.error('Erreur PUT /api/public-gallery/[id]/like:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
