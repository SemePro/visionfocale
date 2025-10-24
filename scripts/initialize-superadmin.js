const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Modèle AdminUser (copié du fichier modèle)
const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

async function initializeSuperAdmin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visionfocale');
    console.log('✅ Connexion MongoDB réussie');

    // Vérifier si le superadmin existe déjà
    const existingSuperAdmin = await AdminUser.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Superadmin existe déjà:', existingSuperAdmin.username);
      console.log('Pour changer le mot de passe du superadmin, utilisez le script de changement de mot de passe.');
      return;
    }

    // Créer le superadmin
    const superadminPassword = process.argv[2] || 'superadmin123';
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(superadminPassword, saltRounds);

    const superadmin = new AdminUser({
      username: 'superadmin',
      passwordHash: passwordHash,
      role: 'superadmin',
      isActive: true
    });

    await superadmin.save();

    console.log('\n🎉 Superadmin créé avec succès !');
    console.log('Username: superadmin');
    console.log('Password:', superadminPassword);
    console.log('Role: superadmin');
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');
    console.log('Ce mot de passe ne peut être changé que par le superadmin lui-même.');

  } catch (error) {
    console.error('❌ Erreur lors de la création du superadmin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📝 Déconnexion MongoDB');
  }
}

// Exécuter le script
initializeSuperAdmin();
