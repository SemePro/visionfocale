# 🚀 Guide de Déploiement Vercel - VisionFocale

## 📋 Prérequis

- Compte GitHub avec le code source
- Compte Vercel
- Compte MongoDB Atlas
- Compte Cloudinary
- Variables d'environnement préparées

## 🔧 Configuration Vercel

### 1. Connexion GitHub

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New Project"
4. Sélectionnez votre dépôt `visionfocale`

### 2. Configuration du Projet

**Framework Preset**: Next.js
**Root Directory**: `./` (racine)
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`

### 3. Variables d'Environnement

Ajoutez toutes les variables suivantes dans Vercel :

#### 🔐 Variables Requises

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visionfocale?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_WATERMARK_PUBLIC_ID=logo-watermark_u77npi
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Admin
ADMIN_PASSWORD_HASH=$2a$10$LULZF12MImGOCPOuVQF8CemgqUzttG58oSucHyk0uBfUuh6pggCsy

# App Settings
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=contact@visionfocale.tg
NEXT_PUBLIC_CONTACT_PHONE=+228 90 94 09 09
```

#### 📱 Variables Optionnelles

```env
# WhatsApp
WHATSAPP_BUSINESS_NUMBER=+22890940909

# Email
EMAIL_FROM=your-email@gmail.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_CLUSTER=eu
```

### 4. Configuration Domaine

1. Dans Vercel Dashboard → Settings → Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions Vercel

## 🗄️ Configuration MongoDB Atlas

### 1. Créer un Cluster

1. Connectez-vous à [MongoDB Atlas](https://cloud.mongodb.com)
2. Créez un nouveau cluster
3. Choisissez la région la plus proche (Europe pour l'Afrique)

### 2. Configuration Sécurité

1. **Database Access** :
   - Créez un utilisateur avec mot de passe fort
   - Rôle : `Read and write to any database`

2. **Network Access** :
   - Ajoutez `0.0.0.0/0` pour permettre l'accès depuis Vercel
   - Ou restreignez aux IPs Vercel si nécessaire

### 3. Connexion String

```
mongodb+srv://username:password@cluster.mongodb.net/visionfocale?retryWrites=true&w=majority
```

## 🖼️ Configuration Cloudinary

### 1. Créer un Compte

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit
3. Notez vos credentials

### 2. Upload du Watermark

1. Uploadez votre logo dans Cloudinary
2. Notez le `Public ID` généré
3. Configurez les transformations si nécessaire

### 3. Upload Presets (Optionnel)

Créez des presets pour :
- Photos clients (avec watermark)
- Portfolio public (sans watermark)

## 🔐 Génération des Secrets

### NextAuth Secret

```bash
openssl rand -base64 32
```

### Admin Password Hash

```bash
npm run generate-admin-password your-secure-password
```

## 📊 Monitoring et Analytics

### 1. Vercel Analytics

- Activez Vercel Analytics dans le dashboard
- Surveillez les performances et erreurs

### 2. Google Analytics (Optionnel)

- Créez un compte GA4
- Ajoutez le `MEASUREMENT_ID` dans les variables

### 3. Logs

- Surveillez les logs Vercel
- Configurez des alertes pour les erreurs

## 🚀 Déploiement

### 1. Premier Déploiement

1. Cliquez sur "Deploy" dans Vercel
2. Attendez la fin du build
3. Testez toutes les fonctionnalités

### 2. Déploiements Automatiques

- Chaque push sur `main` déclenche un déploiement
- Les branches de développement peuvent être déployées séparément

### 3. Rollback

- Dans Vercel Dashboard → Deployments
- Cliquez sur "Promote to Production" pour revenir à une version antérieure

## ✅ Checklist Post-Déploiement

- [ ] Site accessible sur l'URL de production
- [ ] Connexion admin fonctionne
- [ ] Upload d'images fonctionne
- [ ] Watermark s'affiche correctement
- [ ] Galeries publiques s'affichent
- [ ] Système de réservation fonctionne
- [ ] WhatsApp intégration fonctionne
- [ ] Emails de contact fonctionnent
- [ ] Analytics configurés
- [ ] SSL/HTTPS activé
- [ ] Performance optimisée

## 🔧 Maintenance

### Mises à Jour

1. Modifiez le code localement
2. Testez en local
3. Push vers GitHub
4. Vercel déploie automatiquement

### Sauvegarde

- MongoDB Atlas fait des sauvegardes automatiques
- Cloudinary stocke toutes les images
- Code source sur GitHub

### Monitoring

- Surveillez les logs Vercel
- Vérifiez les métriques de performance
- Surveillez l'utilisation des ressources

## 🆘 Dépannage

### Erreurs Communes

1. **Build Failed** : Vérifiez les variables d'environnement
2. **Database Connection** : Vérifiez l'URI MongoDB
3. **Image Upload** : Vérifiez les credentials Cloudinary
4. **Authentication** : Vérifiez NEXTAUTH_SECRET

### Support

- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Documentation MongoDB : [docs.mongodb.com](https://docs.mongodb.com)
- Documentation Cloudinary : [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

**🎉 Félicitations ! Votre site VisionFocale est maintenant en ligne !**