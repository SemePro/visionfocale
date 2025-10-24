const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123'; // Mot de passe par défaut si aucun fourni
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erreur lors du hachage du mot de passe:', err);
    return;
  }
  
  console.log('\n=== Hash du mot de passe ===');
  console.log('Mot de passe:', password);
  console.log('Hash:', hash);
  console.log('\nPour créer un utilisateur admin, utilisez :');
  console.log(`curl -X POST http://localhost:3000/api/admin/create-user \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"username":"nom_utilisateur","password":"${password}","role":"admin"}'`);
  console.log('\nPour créer un superadmin, utilisez :');
  console.log(`curl -X POST http://localhost:3000/api/admin/create-user \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"username":"nom_utilisateur","password":"${password}","role":"superadmin"}'`);
});
