# Configuration Admin VisionFocale

## Hash du mot de passe admin123

Ajoutez cette ligne dans votre fichier `.env.local` :

```env
ADMIN_PASSWORD_HASH="$2a$10$mGK.beHPfKNTCAREgjfaP.ufYPgdnNe7UQTM.v5sWDY9krzDiApPq"
```

## Instructions

1. **Créez le fichier `.env.local`** à la racine du projet
2. **Copiez le hash ci-dessus** dans le fichier
3. **Redémarrez le serveur** : `npm run dev`
4. **Accédez à** : `http://localhost:3000/admin/login`
5. **Connectez-vous avec** : `admin123`

## Sécurité

⚠️ **Important** :
- Ne commitez jamais le fichier `.env.local`
- Changez le mot de passe en production
- Utilisez un mot de passe fort (12+ caractères)

## Génération d'un nouveau mot de passe

```bash
npm run generate-admin-password VotreNouveauMotDePasse
```

## Test de l'authentification

1. Allez sur `http://localhost:3000/admin/login`
2. Entrez `admin123`
3. Vous devriez être redirigé vers `/admin`
4. Testez la déconnexion dans la sidebar
