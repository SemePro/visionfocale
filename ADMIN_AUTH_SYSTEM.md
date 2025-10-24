# Système d'Authentification Admin - VisionFocale

## Vue d'ensemble

Le système d'authentification admin de VisionFocale utilise un système à deux niveaux :

- **Superadmin** : Accès complet, peut créer et gérer d'autres administrateurs
- **Admin** : Accès aux fonctionnalités de gestion du site, peut changer son propre mot de passe

## Utilisateurs par défaut

### Superadmin
- **Username** : `superadmin`
- **Password** : `superadmin123`
- **Rôle** : `superadmin`

### Admin (rétrocompatible)
- **Username** : `admin` (par défaut si non spécifié)
- **Password** : `admin123`
- **Rôle** : `admin`

## Comment utiliser

### 1. Connexion

#### Via l'interface web
1. Allez sur `http://localhost:3000/admin/login`
2. Entrez votre nom d'utilisateur et mot de passe
3. Cliquez sur "Se connecter"

#### Via API
```bash
# Connexion avec username et password
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"superadmin123"}'

# Connexion rétrocompatible (utilise 'admin' par défaut)
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

### 2. Changer le mot de passe

1. Connectez-vous en tant qu'admin ou superadmin
2. Allez dans "Paramètres" dans la sidebar
3. Entrez votre mot de passe actuel et le nouveau mot de passe
4. Cliquez sur "Changer le mot de passe"

### 3. Créer de nouveaux utilisateurs

#### Via API (superadmin seulement)
```bash
# Créer un admin
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"username":"nouveau_admin","password":"mot_de_passe","role":"admin"}'

# Créer un superadmin
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"username":"nouveau_superadmin","password":"mot_de_passe","role":"superadmin"}'
```

#### Via script
```bash
# Générer un hash de mot de passe
npm run create-admin

# Utiliser le hash généré pour créer l'utilisateur
```

## Sécurité

### Règles importantes
1. **Le mot de passe superadmin ne peut être changé que par le superadmin lui-même**
2. **Les admins ne peuvent pas changer le mot de passe du superadmin**
3. **Les mots de passe sont hachés avec bcrypt (salt rounds: 10)**
4. **Les tokens JWT expirent après 24 heures**
5. **Les cookies sont httpOnly et sécurisés**

### Permissions par rôle

#### Superadmin
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Peut créer et gérer d'autres administrateurs
- ✅ Peut changer son propre mot de passe
- ✅ Peut changer le mot de passe d'autres utilisateurs

#### Admin
- ✅ Accès aux fonctionnalités de gestion du site
- ✅ Peut changer son propre mot de passe
- ❌ Ne peut pas créer d'autres utilisateurs
- ❌ Ne peut pas changer le mot de passe du superadmin

## Structure de la base de données

### Collection AdminUser
```javascript
{
  username: String,        // Nom d'utilisateur unique
  passwordHash: String,    // Hash bcrypt du mot de passe
  role: String,           // 'superadmin' ou 'admin'
  isActive: Boolean,      // Statut actif/inactif
  lastLogin: Date,        // Dernière connexion
  createdAt: Date,        // Date de création
  updatedAt: Date         // Date de dernière modification
}
```

## API Endpoints

### POST /api/admin/login
Authentifie un utilisateur admin.

**Body:**
```json
{
  "username": "string",  // Optionnel, défaut: "admin"
  "password": "string"   // Requis
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "username": "string",
    "role": "string"
  }
}
```

### POST /api/admin/change-password
Change le mot de passe de l'utilisateur connecté.

**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### POST /api/admin/create-user
Crée un nouvel utilisateur admin (superadmin seulement).

**Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "admin" | "superadmin"
}
```

## Scripts disponibles

```bash
# Initialiser le superadmin par défaut
npm run init-superadmin

# Générer un hash de mot de passe
npm run create-admin

# Générer un hash pour un mot de passe spécifique
npm run create-admin "mon_mot_de_passe"
```

## Migration depuis l'ancien système

L'ancien système (mot de passe uniquement) est toujours supporté pour la rétrocompatibilité :

- Si aucun `username` n'est fourni, `admin` est utilisé par défaut
- Le mot de passe `admin123` fonctionne toujours
- Aucune migration de données n'est nécessaire

## Dépannage

### Problèmes courants

1. **"Identifiants incorrects"**
   - Vérifiez que l'utilisateur existe dans la base de données
   - Vérifiez que le mot de passe est correct
   - Vérifiez que l'utilisateur est actif (`isActive: true`)

2. **"Non authentifié"**
   - Vérifiez que le cookie `admin-token` est présent
   - Vérifiez que le token n'a pas expiré (24h)
   - Vérifiez que le token est valide

3. **"Utilisateur non trouvé"**
   - Créez l'utilisateur via l'API `/api/admin/create-user`
   - Vérifiez que l'utilisateur est actif

### Logs de debug

Pour activer les logs de debug, ajoutez des `console.log` dans les fichiers API :
- `app/api/admin/login/route.ts`
- `app/api/admin/change-password/route.ts`
- `app/api/admin/create-user/route.ts`
