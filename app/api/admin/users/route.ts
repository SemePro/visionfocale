import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

// GET - Lister tous les utilisateurs admin
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

    // Seuls les superadmins peuvent lister les utilisateurs
    if (decodedToken.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Accès refusé. Seul un superadmin peut gérer les utilisateurs.' }, { status: 403 });
    }

    const users = await AdminUser.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      users: users.map(user => ({
        _id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      }))
    });

  } catch (error) {
    console.error('Erreur GET /api/admin/users:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// POST - Créer un nouvel utilisateur admin
export async function POST(request: NextRequest) {
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

    // Seuls les superadmins peuvent créer des utilisateurs
    if (decodedToken.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Accès refusé. Seul un superadmin peut créer des utilisateurs.' }, { status: 403 });
    }

    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Nom d\'utilisateur et mot de passe requis' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    const existingUser = await AdminUser.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Nom d\'utilisateur déjà existant' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = new AdminUser({
      username: username.toLowerCase(),
      passwordHash,
      role: role || 'admin',
      isActive: true,
    });

    await newUser.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur créé avec succès',
      user: { 
        _id: newUser._id,
        username: newUser.username, 
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur POST /api/admin/users:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
