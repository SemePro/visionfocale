#!/usr/bin/env node

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Usage: npm run generate-admin-password <mot-de-passe>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌ Le mot de passe doit contenir au moins 8 caractères');
  process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('✅ Hash généré avec succès !');
console.log('');
console.log('🔐 Ajoutez cette ligne dans votre fichier .env.local :');
console.log('');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('');
console.log('⚠️  Ne partagez jamais ce hash et ne le commitez pas dans Git !');
console.log('');
console.log('🚀 Redémarrez votre serveur après avoir ajouté le hash.');