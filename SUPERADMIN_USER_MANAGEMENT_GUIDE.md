# 🔐 Guide de Gestion des Utilisateurs Superadmin

## Vue d'ensemble

Le système de gestion des utilisateurs permet au superadmin de créer, modifier, bloquer/débloquer et supprimer les comptes administrateurs.

## Accès

- **URL** : `http://localhost:3000/admin/utilisateurs`
- **Accès** : Uniquement pour les superadmins
- **Authentification** : Requiert une connexion avec un compte superadmin

## Fonctionnalités

### 1. 📋 Liste des Utilisateurs

La page affiche tous les utilisateurs administrateurs avec :
- Nom d'utilisateur
- Rôle (admin/superadmin)
- Statut (actif/inactif)
- Dernière connexion
- Date de création
- Actions disponibles

### 2. ➕ Créer un Nouvel Utilisateur

**Bouton** : "Nouvel Utilisateur" (en haut à droite)

**Champs requis** :
- **Nom d'utilisateur** : Minimum 3 caractères
- **Mot de passe** : Minimum 6 caractères
- **Rôle** : Admin ou Superadmin

**Validation** :
- Le nom d'utilisateur doit être unique
- Le mot de passe doit respecter les critères de sécurité

### 3. ✏️ Modifier un Utilisateur

**Action** : Cliquer sur l'icône "Modifier" (crayon) dans la ligne de l'utilisateur

**Champs modifiables** :
- Nom d'utilisateur
- Mot de passe (optionnel - laisser vide pour ne pas changer)
- Rôle

**Restrictions** :
- Impossible de modifier le superadmin principal
- Le nom d'utilisateur doit rester unique

### 4. 🔒 Bloquer/Débloquer un Utilisateur

**Action** : Cliquer sur l'icône "Bloquer/Débloquer" dans la ligne de l'utilisateur

**Fonctionnement** :
- **Actif** → **Inactif** : L'utilisateur ne peut plus se connecter
- **Inactif** → **Actif** : L'utilisateur peut à nouveau se connecter

**Indicateurs visuels** :
- 🟢 Point vert = Utilisateur actif
- 🔴 Point rouge = Utilisateur inactif

### 5. 🗑️ Supprimer un Utilisateur

**Action** : Cliquer sur l'icône "Supprimer" (poubelle) dans la ligne de l'utilisateur

**Confirmation** : Une boîte de dialogue demande confirmation

**Restrictions** :
- Impossible de supprimer le superadmin principal
- Impossible de supprimer son propre compte
- Action irréversible

## Sécurité

### 🔐 Protection des Rôles

- **Superadmin** : Accès complet à toutes les fonctionnalités
- **Admin** : Accès refusé à la gestion des utilisateurs
- **Vérification** : Le rôle est vérifié côté serveur pour chaque action

### 🛡️ Mesures de Sécurité

1. **Authentification JWT** : Chaque requête vérifie le token
2. **Vérification des rôles** : Seuls les superadmins peuvent gérer les utilisateurs
3. **Protection du superadmin principal** : Impossible de modifier/supprimer le compte superadmin principal
4. **Auto-protection** : Impossible de supprimer son propre compte
5. **Validation des données** : Tous les champs sont validés côté serveur

## Interface Utilisateur

### 🎨 Design

- **Style** : Interface moderne et intuitive
- **Responsive** : Compatible mobile et desktop
- **Couleurs** : 
  - 🟢 Vert pour les utilisateurs actifs
  - 🔴 Rouge pour les utilisateurs inactifs
  - 🟣 Violet pour les superadmins
  - 🔵 Bleu pour les admins

### 📱 Fonctionnalités UX

- **Modales** : Formulaires dans des modales pour une meilleure UX
- **Feedback** : Messages de succès/erreur avec toast notifications
- **Confirmation** : Demandes de confirmation pour les actions destructives
- **Chargement** : Indicateurs de chargement pendant les opérations

## API Endpoints

### 🔌 Endpoints Disponibles

- `GET /api/admin/users` - Lister tous les utilisateurs
- `POST /api/admin/users` - Créer un nouvel utilisateur
- `PUT /api/admin/users/[id]` - Modifier un utilisateur
- `DELETE /api/admin/users/[id]` - Supprimer un utilisateur
- `GET /api/admin/me` - Récupérer les informations de l'utilisateur connecté

### 📝 Exemples d'utilisation

```bash
# Lister les utilisateurs
curl -X GET http://localhost:3000/api/admin/users \
  -H "Cookie: admin-token=YOUR_TOKEN"

# Créer un utilisateur
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-token=YOUR_TOKEN" \
  -d '{"username":"newadmin","password":"password123","role":"admin"}'

# Modifier un utilisateur
curl -X PUT http://localhost:3000/api/admin/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-token=YOUR_TOKEN" \
  -d '{"username":"updatedadmin","role":"admin","isActive":false}'

# Supprimer un utilisateur
curl -X DELETE http://localhost:3000/api/admin/users/USER_ID \
  -H "Cookie: admin-token=YOUR_TOKEN"
```

## 🚨 Bonnes Pratiques

1. **Création d'utilisateurs** : Utilisez des mots de passe forts
2. **Gestion des rôles** : Attribuez le rôle superadmin avec parcimonie
3. **Surveillance** : Vérifiez régulièrement la liste des utilisateurs
4. **Sauvegarde** : Assurez-vous d'avoir toujours au moins un superadmin actif
5. **Audit** : Les actions sont loggées pour traçabilité

## 🔧 Dépannage

### Problèmes Courants

1. **"Accès refusé"** : Vérifiez que vous êtes connecté en tant que superadmin
2. **"Utilisateur non trouvé"** : L'utilisateur a peut-être été supprimé
3. **"Nom d'utilisateur déjà existant"** : Choisissez un autre nom d'utilisateur
4. **"Impossible de modifier le superadmin principal"** : Comportement normal de sécurité

### Support

En cas de problème, vérifiez :
- La connexion à la base de données
- La validité du token JWT
- Les logs du serveur
- Les permissions de l'utilisateur connecté
