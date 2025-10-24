import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mot de passe actuel et nouveau mot de passe requis' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'Le nouveau mot de passe doit contenir au moins 6 caractères' 
      }, { status: 400 });
    }

    // Vérifier le token d'authentification
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Non authentifié' 
      }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token invalide' 
      }, { status: 401 });
    }

    // Connexion à la base de données
    await connectDB();

    // Chercher l'utilisateur
    const user = await AdminUser.findOne({ 
      username: decodedToken.username,
      isActive: true 
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      }, { status: 404 });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mot de passe actuel incorrect' 
      }, { status: 401 });
    }

    // Hacher le nouveau mot de passe
    const saltRounds = 10;
    const newPasswordHash = bcrypt.hashSync(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    user.passwordHash = newPasswordHash;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Mot de passe changé avec succès' 
    });

  } catch (error: any) {
    console.error('Erreur changement mot de passe:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}
