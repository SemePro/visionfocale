# Authentification Admin - VisionFocale

## Configuration

### 1. Générer un mot de passe admin

Pour générer le hash d'un mot de passe admin personnalisé, utilisez la commande suivante :

```bash
npm run generate-admin-password <votre-mot-de-passe>
```

Par exemple, pour le mot de passe `admin123` :

```bash
npm run generate-admin-password admin123
```

### 2. Ajouter le hash dans .env.local

Copiez le hash généré et ajoutez-le dans votre fichier `.env.local` :

```env
ADMIN_PASSWORD_HASH="$2a$10$tY/OXh4.o1QAZc9y86oOVOv9AA8laYZy7mteTBTN/yF3Tv2tihh9S"
```

**Note:** Le hash ci-dessus correspond au mot de passe `admin123` (par défaut pour le développement).

### 3. Redémarrer le serveur

Après avoir ajouté le hash, redémarrez votre serveur de développement :

```bash
npm run dev
```

## Utilisation

### Connexion

1. Accédez à la page de connexion admin : `http://localhost:3000/admin/login`
2. Entrez votre mot de passe (par défaut : `admin123`)
3. Cliquez sur "Se connecter"

### Déconnexion

Cliquez sur le bouton "Déconnexion" dans la sidebar de l'admin (en bas à gauche).

## Sécurité

### En production

⚠️ **Important** : Changez immédiatement le mot de passe par défaut en production !

1. Générez un nouveau mot de passe fort :
```bash
npm run generate-admin-password VotreMotDePasseSecurise2024!
```

2. Ajoutez le hash généré dans vos variables d'environnement de production (Vercel, Netlify, etc.)

3. Ne commitez jamais le fichier `.env.local` dans git !

### Recommandations

- Utilisez un mot de passe d'au moins 12 caractères
- Incluez des majuscules, minuscules, chiffres et caractères spéciaux
- Ne partagez jamais votre mot de passe admin
- Changez régulièrement votre mot de passe
- Ne stockez jamais le mot de passe en clair dans le code

## Fonctionnement technique

### Architecture

Le système d'authentification admin utilise :

1. **JWT (JSON Web Tokens)** pour les sessions
2. **bcryptjs** pour le hashing sécurisé des mots de passe
3. **HTTP-only cookies** pour stocker le token (protection XSS)
4. **Middleware Next.js** pour protéger les routes admin

### Flux d'authentification

1. L'utilisateur entre son mot de passe sur `/admin/login`
2. Le mot de passe est envoyé via POST à `/api/admin/login`
3. Le serveur compare le mot de passe avec le hash stocké
4. Si valide, un token JWT est généré et stocké dans un cookie httpOnly
5. Le middleware vérifie la présence et la validité du token sur chaque requête admin
6. La déconnexion supprime le cookie

### Routes API

- `POST /api/admin/login` - Connexion admin
- `POST /api/admin/logout` - Déconnexion admin
- `GET /api/admin/verify` - Vérifier l'authentification

### Middleware

Le fichier `middleware.ts` protège automatiquement toutes les routes commençant par `/admin` (sauf `/admin/login`).

## Dépannage

### Problème : "Mot de passe incorrect"

- Vérifiez que le hash dans `.env.local` correspond au mot de passe que vous utilisez
- Régénérez le hash avec `npm run generate-admin-password`
- Redémarrez le serveur après avoir modifié `.env.local`

### Problème : Redirection infinie vers /admin/login

- Vérifiez que la variable `ADMIN_PASSWORD_HASH` est bien définie dans `.env.local`
- Vérifiez que le token JWT n'a pas expiré (durée de vie : 24h)
- Supprimez les cookies du navigateur et reconnectez-vous

### Problème : "Cannot find module 'bcryptjs'"

Installez les dépendances :
```bash
npm install
```

## Support

Pour toute question ou problème, contactez l'équipe de développement.

