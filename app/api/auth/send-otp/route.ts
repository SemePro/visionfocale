import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, sendOTPSMS } from '@/lib/sms';
import { storeOTP } from '@/lib/otp';

// POST /api/auth/send-otp - Envoyer un code OTP par SMS
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone requis' },
        { status: 400 }
      );
    }

    // Générer OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Stocker OTP
    storeOTP(phoneNumber, otp, expiresAt);

    // Envoyer SMS
    const result = await sendOTPSMS(phoneNumber, otp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Échec envoi SMS' },
        { status: 500 }
      );
    }

    // En mode dev, retourner l'OTP pour tests
    const devOTP = process.env.NODE_ENV === 'development' ? otp : undefined;

    return NextResponse.json({
      success: true,
      message: 'Code OTP envoyé avec succès',
      ...(devOTP && { devOTP }), // Inclure OTP uniquement en dev
    });
  } catch (error: any) {
    console.error('Erreur POST /api/auth/send-otp:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


