import { NextRequest, NextResponse } from 'next/server';
import { validateOTP } from '@/lib/otp';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

// POST /api/auth/verify-otp - Vérifier un code OTP
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp, galleryId } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, error: 'Numéro et code OTP requis' },
        { status: 400 }
      );
    }

    // Valider OTP
    const isValid = validateOTP(phoneNumber, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Code OTP invalide ou expiré' },
        { status: 401 }
      );
    }

    // Générer token JWT pour accès à la galerie
    const token = jwt.sign(
      {
        phoneNumber,
        galleryId,
        verifiedAt: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token valide 7 jours
    );

    return NextResponse.json({
      success: true,
      message: 'Vérification réussie',
      token,
    });
  } catch (error: any) {
    console.error('Erreur POST /api/auth/verify-otp:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


