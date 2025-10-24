import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

// Hash du mot de passe admin par défaut (admin123) - pour compatibilité
const DEFAULT_ADMIN_PASSWORD_HASH = '$2a$10$LULZF12MImGOCPOuVQF8CemgqUzttG58oSucHyk0uBfUuh6pggCsy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Support rétrocompatible : si pas de username, utiliser 'admin' par défaut
    const loginUsername = username || 'admin';

    if (!password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mot de passe requis' 
      }, { status: 400 });
    }

    // Connexion à la base de données
    await connectDB();

    // Chercher l'utilisateur dans la base de données
    const user = await AdminUser.findOne({ 
      username: loginUsername.toLowerCase().trim(),
      isActive: true 
    });

    let isValidPassword = false;
    let userRole = 'admin';

    if (user) {
      // Utilisateur trouvé dans la base de données
      isValidPassword = bcrypt.compareSync(password, user.passwordHash);
      userRole = user.role;
      
      // Mettre à jour la dernière connexion
      if (isValidPassword) {
        user.lastLogin = new Date();
        await user.save();
      }
    } else {
      // Fallback vers le système par défaut pour compatibilité
      if (loginUsername.toLowerCase() === 'admin' && password === 'admin123') {
        isValidPassword = bcrypt.compareSync(password, DEFAULT_ADMIN_PASSWORD_HASH);
        userRole = 'admin';
      }
    }

    if (!isValidPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Identifiants incorrects' 
      }, { status: 401 });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        username: loginUsername.toLowerCase(),
        role: userRole,
        isAuthenticated: true,
        timestamp: Date.now()
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Créer la réponse avec le cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Connexion réussie',
      user: { 
        username: loginUsername.toLowerCase(),
        role: userRole 
      }
    });

    // Définir le cookie httpOnly
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Erreur POST /api/admin/login:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}