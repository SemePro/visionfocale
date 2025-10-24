import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret';

// PUT - Mettre à jour un utilisateur admin
export async function PUT(request: NextRequest) {
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

    // Seuls les superadmins peuvent modifier les utilisateurs
    if (decodedToken.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Accès refusé. Seul un superadmin peut modifier les utilisateurs.' }, { status: 403 });
    }

    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ID utilisateur requis' }, { status: 400 });
    }

    const { username, password, role, isActive } = await request.json();

    const user = await AdminUser.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Empêcher la modification du superadmin par défaut
    if (user.username === 'superadmin' && decodedToken.username !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Impossible de modifier le superadmin principal' }, { status: 403 });
    }

    // Mettre à jour les champs
    if (username && username !== user.username) {
      const existingUser = await AdminUser.findOne({ username: username.toLowerCase(), _id: { $ne: userId } });
      if (existingUser) {
        return NextResponse.json({ success: false, error: 'Nom d\'utilisateur déjà existant' }, { status: 409 });
      }
      user.username = username.toLowerCase();
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
      }
      user.passwordHash = bcrypt.hashSync(password, 10);
    }

    if (role && role !== user.role) {
      user.role = role;
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur mis à jour avec succès',
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Erreur PUT /api/admin/users/[id]:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un utilisateur admin
export async function DELETE(request: NextRequest) {
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

    // Seuls les superadmins peuvent supprimer des utilisateurs
    if (decodedToken.role !== 'superadmin') {
      return NextResponse.json({ success: false, error: 'Accès refusé. Seul un superadmin peut supprimer des utilisateurs.' }, { status: 403 });
    }

    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'ID utilisateur requis' }, { status: 400 });
    }

    const user = await AdminUser.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Empêcher la suppression du superadmin principal
    if (user.username === 'superadmin') {
      return NextResponse.json({ success: false, error: 'Impossible de supprimer le superadmin principal' }, { status: 403 });
    }

    // Empêcher l'auto-suppression
    if (user.username === decodedToken.username) {
      return NextResponse.json({ success: false, error: 'Impossible de supprimer votre propre compte' }, { status: 403 });
    }

    await AdminUser.findByIdAndDelete(userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur DELETE /api/admin/users/[id]:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
