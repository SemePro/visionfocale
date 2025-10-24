import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

export async function POST(request: NextRequest) {
  try {
    const { username, password, role = 'admin' } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nom d\'utilisateur et mot de passe requis' 
      }, { status: 400 });
    }

    // Connexion à la base de données
    await connectDB();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await AdminUser.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cet utilisateur existe déjà' 
      }, { status: 400 });
    }

    // Hacher le mot de passe
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    // Créer l'utilisateur
    const user = new AdminUser({
      username: username.toLowerCase().trim(),
      passwordHash,
      role,
      isActive: true
    });

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur créé avec succès',
      user: { 
        username: user.username,
        role: user.role 
      }
    });

  } catch (error: any) {
    console.error('Erreur création utilisateur:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur interne du serveur' 
    }, { status: 500 });
  }
}
