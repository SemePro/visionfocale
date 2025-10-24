import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

// GET /api/settings - Récupérer les paramètres système
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const settings = await Settings.getSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error('Erreur GET /api/settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Mettre à jour les paramètres système
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Récupérer les paramètres actuels
    let settings = await Settings.findOne();

    if (!settings) {
      // Créer les paramètres s'ils n'existent pas
      settings = await Settings.create(body);
    } else {
      // Mettre à jour
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Paramètres mis à jour avec succès',
    });
  } catch (error: any) {
    console.error('Erreur PUT /api/settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


