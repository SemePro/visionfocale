import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Token manquant'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Token invalide'
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: { role: 'admin' }
    });

  } catch (error: any) {
    console.error('Erreur GET /api/admin/verify:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Token invalide ou expiré'
    });
  }
}