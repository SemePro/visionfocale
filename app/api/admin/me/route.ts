import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Token invalide' }, { status: 401 });
    }

    const user = await AdminUser.findOne({ 
      username: decodedToken.username,
      isActive: true 
    }, { passwordHash: 0 });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Erreur GET /api/admin/me:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
