# Système d'Authentification Admin - VisionFocale

## 📋 Vue d'ensemble

Le système d'authentification admin de VisionFocale utilise une approche simple et sécurisée basée sur un **mot de passe unique** (sans nom d'utilisateur), parfait pour une application mono-administrateur.

## 🔐 Architecture de sécurité

### Composants principaux

1. **Hashing bcrypt** : Les mots de passe sont hashés avec bcrypt (salt rounds: 10)
2. **JWT Tokens** : Authentification stateless avec tokens JWT
3. **HTTP-only Cookies** : Protection contre les attaques XSS
4. **Middleware Next.js** : Protection automatique des routes admin
5. **Validation côté serveur** : Toute la logique d'authentification est côté serveur

### Flux d'authentification

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. POST /api/admin/login { password }
       ▼
┌─────────────────────────────────┐
│     API Login Route             │
│  - Vérifie le mot de passe      │
│  - Compare avec bcrypt          │
│  - Génère token JWT             │
│  - Set cookie httpOnly          │
└──────┬──────────────────────────┘
       │
       │ 2. Cookie avec JWT
       ▼
┌─────────────┐
│   Client    │
│  Redirigé   │
│  vers /admin│
└──────┬──────┘
       │
       │ 3. GET /admin
       ▼
┌─────────────────────────────────┐
│        Middleware               │
│  - Vérifie présence cookie      │
│  - Valide JWT                   │
│  - Vérifie expiration           │
└──────┬──────────────────────────┘
       │
       │ 4. Accès autorisé
       ▼
┌─────────────┐
│   Admin     │
│  Dashboard  │
└─────────────┘
```

## 📁 Fichiers créés

### Routes API

1. **`app/api/admin/login/route.ts`**
   - Gère la connexion admin
   - Vérifie le mot de passe
   - Génère et stocke le token JWT

2. **`app/api/admin/logout/route.ts`**
   - Gère la déconnexion
   - Supprime le cookie de session

3. **`app/api/admin/verify/route.ts`**
   - Vérifie l'état d'authentification
   - Utile pour les vérifications côté client

### Pages

4. **`app/admin/login/page.tsx`**
   - Page de connexion admin
   - Interface utilisateur moderne et responsive
   - Formulaire avec validation

### Middleware

5. **`middleware.ts`**
   - Protège toutes les routes `/admin/*`
   - Exclut `/admin/login`
   - Vérifie automatiquement le token JWT

### Composants

6. **`components/admin/Sidebar.tsx`** (modifié)
   - Ajout du bouton de déconnexion
   - Gestion de l'état de déconnexion
   - Animation de chargement

### Scripts

7. **`scripts/generate-admin-password.js`**
   - Génère le hash bcrypt d'un mot de passe
   - Usage: `npm run generate-admin-password <mot-de-passe>`

### Documentation

8. **`ADMIN_AUTH.md`**
   - Guide d'utilisation complet
   - Instructions de configuration
   - Dépannage

## 🚀 Installation et configuration

### 1. Générer le mot de passe

```bash
npm run generate-admin-password VotreMotDePasse123
```

### 2. Configurer .env.local

Ajoutez le hash généré dans `.env.local` :

```env
# Admin Authentication
ADMIN_PASSWORD_HASH="$2a$10$tY/OXh4.o1QAZc9y86oOVOv9AA8laYZy7mteTBTN/yF3Tv2tihh9S"
```

### 3. Démarrer le serveur

```bash
npm run dev
```

### 4. Accéder à l'admin

Ouvrez `http://localhost:3000/admin/login` et connectez-vous avec votre mot de passe.

## 🔒 Sécurité

### Bonnes pratiques implémentées

✅ **Hashing bcrypt** : Mot de passe jamais stocké en clair
✅ **HTTP-only cookies** : Protection contre XSS
✅ **SameSite cookie** : Protection contre CSRF
✅ **JWT avec expiration** : Tokens valides 24h seulement
✅ **Validation côté serveur** : Pas de logique sensible côté client
✅ **Middleware automatique** : Protection de toutes les routes admin
✅ **Secure flag en production** : Cookies uniquement via HTTPS

### Recommandations

⚠️ **En production** :
- Changez le mot de passe par défaut
- Utilisez un mot de passe fort (12+ caractères)
- Activez HTTPS obligatoirement
- Ajoutez le rate limiting sur `/api/admin/login`
- Considérez l'ajout de 2FA pour plus de sécurité

## 🧪 Tests manuels

### Test de connexion

1. Allez sur `http://localhost:3000/admin/login`
2. Entrez le mot de passe : `admin123`
3. Vérifiez la redirection vers `/admin`
4. Vérifiez que le dashboard s'affiche

### Test de protection

1. Déconnectez-vous
2. Essayez d'accéder à `http://localhost:3000/admin`
3. Vérifiez la redirection vers `/admin/login`

### Test de déconnexion

1. Connectez-vous
2. Cliquez sur "Déconnexion" dans la sidebar
3. Vérifiez la redirection vers `/admin/login`
4. Essayez d'accéder à `/admin`, vérifiez le blocage

### Test d'expiration

1. Connectez-vous
2. Modifiez manuellement l'expiration du JWT à 1 seconde
3. Attendez 2 secondes
4. Rafraîchissez la page
5. Vérifiez la redirection vers `/admin/login`

## 🐛 Dépannage

### Problème : Redirection infinie

**Cause** : Token JWT invalide ou manquant
**Solution** :
```bash
# Supprimez les cookies du navigateur
# OU
# Vérifiez que NEXTAUTH_SECRET est défini dans .env.local
# OU
# Vérifiez que ADMIN_PASSWORD_HASH est défini
```

### Problème : "Mot de passe incorrect"

**Cause** : Hash ne correspond pas
**Solution** :
```bash
# Régénérez le hash
npm run generate-admin-password admin123
# Copiez le hash dans .env.local
# Redémarrez le serveur
```

### Problème : Middleware ne protège pas les routes

**Cause** : Configuration du middleware incorrecte
**Solution** :
```bash
# Vérifiez que middleware.ts est à la racine du projet
# Vérifiez la configuration matcher
# Redémarrez le serveur
```

## 📊 Variables d'environnement

```env
# Obligatoires
NEXTAUTH_SECRET=your-secret-key-here          # Clé pour signer les JWT
ADMIN_PASSWORD_HASH=bcrypt-hash-here          # Hash du mot de passe admin

# Optionnelles
NODE_ENV=development                           # Mode de développement
```

## 🔄 Évolutions futures

### À court terme
- [ ] Rate limiting sur `/api/admin/login`
- [ ] Logs des tentatives de connexion
- [ ] IP whitelist (optionnel)

### À moyen terme
- [ ] 2FA (Two-Factor Authentication)
- [ ] Sessions multiples avec gestion
- [ ] Historique des connexions
- [ ] Notification par email lors de connexion

### À long terme
- [ ] Multi-utilisateurs avec rôles
- [ ] SSO (Single Sign-On)
- [ ] Biométrie pour mobile
- [ ] API Key pour intégrations tierces

## 📝 Notes techniques

### Durée de vie du token
- **Développement** : 24 heures
- **Production recommandée** : 8 heures avec refresh token

### Algorithme JWT
- **Type** : HS256 (HMAC with SHA-256)
- **Payload** : `{ role: 'admin', isAuthenticated: true, timestamp }`

### Configuration des cookies
```typescript
{
  httpOnly: true,              // Inaccessible par JavaScript
  secure: NODE_ENV === 'production',  // HTTPS uniquement en prod
  sameSite: 'lax',            // Protection CSRF
  maxAge: 60 * 60 * 24,       // 24 heures
  path: '/',                  // Disponible sur tout le site
}
```

## 🎯 Conclusion

Le système d'authentification admin de VisionFocale est :
- ✅ **Simple** : Pas de complexité inutile
- ✅ **Sécurisé** : Bonnes pratiques modernes
- ✅ **Maintenable** : Code clair et documenté
- ✅ **Évolutif** : Prêt pour de futures améliorations

Pour toute question ou problème, consultez `ADMIN_AUTH.md` ou contactez l'équipe de développement.

