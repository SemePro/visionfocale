# 🔐 Configuration des Variables d'Environnement

## 📋 Étape 1 : Créer le fichier .env.local

Exécutez cette commande dans le terminal :

```bash
cat > .env.local << 'EOL'
# ==============================================
# 🔐 VARIABLES D'ENVIRONNEMENT - VisionFocale
# ==============================================

# ----------------------------------------------
# 📊 MongoDB Database (REQUIS)
# ----------------------------------------------
MONGODB_URI=mongodb://localhost:27017/visionfocale

# ----------------------------------------------
# 🖼️ Cloudinary (Stockage Photos) - REQUIS
# ----------------------------------------------
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_WATERMARK_URL=visionfocale/watermark

# ----------------------------------------------
# 📱 SMS / OTP (Twilio)
# ----------------------------------------------
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_PROVIDER=twilio

# ----------------------------------------------
# 💬 WhatsApp Business API (Optionnel)
# ----------------------------------------------
WHATSAPP_BUSINESS_PHONE_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_BUSINESS_NUMBER=+22890123456

# ----------------------------------------------
# 🔐 NextAuth.js (Authentication)
# ----------------------------------------------
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# ----------------------------------------------
# 🌐 Application Settings
# ----------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=contact@visionfocale.tg
NEXT_PUBLIC_CONTACT_PHONE=+228 90 12 34 56

# ----------------------------------------------
# 💰 Payment (Optionnel)
# ----------------------------------------------
FEDAPAY_PUBLIC_KEY=your_fedapay_public_key
FEDAPAY_SECRET_KEY=your_fedapay_secret_key

# ----------------------------------------------
# 📊 Analytics (Optionnel)
# ----------------------------------------------
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ----------------------------------------------
# 🚀 Pusher (Optionnel)
# ----------------------------------------------
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_CLUSTER=eu

# ----------------------------------------------
# 📧 Email (Optionnel)
# ----------------------------------------------
EMAIL_FROM=noreply@visionfocale.tg
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=your_resend_api_key
EOL
```

## 🚀 Étape 2 : Configuration Minimale pour Tester

Pour tester rapidement, vous n'avez besoin que de **3 variables** :

### Option A : MongoDB Local (Recommandé pour débuter)

```bash
# 1. Installer MongoDB localement
brew tap mongodb/brew
brew install mongodb-community

# 2. Démarrer MongoDB
brew services start mongodb-community

# 3. Le MONGODB_URI par défaut fonctionnera
# mongodb://localhost:27017/visionfocale
```

### Option B : MongoDB Atlas (Cloud gratuit)

1. Allez sur https://mongodb.com/cloud/atlas
2. Créez un compte gratuit
3. Créez un cluster (Free tier)
4. Cliquez "Connect" → "Connect your application"
5. Copiez l'URI et remplacez `<password>` par votre mot de passe
6. Mettez à jour `MONGODB_URI` dans `.env.local`

### Cloudinary (Requis pour l'upload de photos)

1. Allez sur https://cloudinary.com (compte gratuit)
2. Créez un compte
3. Dashboard → Account Details
4. Copiez :
   - Cloud Name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

### NextAuth Secret (Requis)

Générez une clé secrète :

```bash
openssl rand -base64 32
```

Copiez le résultat dans `NEXTAUTH_SECRET`

## 📝 Étape 3 : Configuration Complète (Plus tard)

Une fois l'app fonctionnelle, configurez :

### SMS / OTP

**Option 1 : Twilio** (Recommandé, fonctionne partout)
- https://www.twilio.com/try-twilio
- Compte d'essai : $15 de crédit gratuit
- Peut envoyer des SMS au Togo

**Option 2 : Africa's Talking** (Spécialisé Afrique)
- https://africastalking.com
- Sandbox gratuit pour tests
- Meilleurs tarifs pour l'Afrique

### WhatsApp Business API

- https://developers.facebook.com/docs/whatsapp
- Nécessite un Business Manager Facebook
- Alternative : https://waapi.app (plus simple)

### Paiement Mobile Money

**FedaPay** (Recommandé pour le Togo)
- https://fedapay.com
- Supporte TMoney, Flooz, Mobile Money
- Compte test gratuit

## 🧪 Étape 4 : Tester l'Application

```bash
# Redémarrer le serveur pour charger les variables
npm run dev
```

### Vérifier que tout fonctionne :

1. ✅ **Homepage** : http://localhost:3000
   - Doit charger sans erreur

2. ✅ **Admin** : http://localhost:3000/admin
   - Dashboard doit s'afficher

3. ✅ **API Galleries** : http://localhost:3000/api/galleries
   - Doit retourner `[]` (liste vide) au lieu d'une erreur MongoDB

## 🔍 Debugging

### Erreur : "MONGODB_URI not defined"

```bash
# Vérifiez que le fichier existe
ls -la .env.local

# Vérifiez le contenu
cat .env.local | grep MONGODB_URI

# Redémarrez le serveur
# Ctrl+C puis npm run dev
```

### Erreur : "Cloudinary credentials"

```bash
# Vérifiez que les 3 variables sont définies
cat .env.local | grep CLOUDINARY
```

### L'upload ne fonctionne pas

- Vérifiez vos credentials Cloudinary
- Allez sur https://cloudinary.com/console
- Copiez exactement Cloud Name, API Key, API Secret

## 📊 Variables par Priorité

### 🔴 CRITIQUE (Requis immédiatement)
```env
MONGODB_URI=mongodb://localhost:27017/visionfocale
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXTAUTH_SECRET=xxx
```

### 🟡 IMPORTANT (Pour fonctionnalités complètes)
```env
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=xxx
```

### 🟢 OPTIONNEL (Nice to have)
```env
WHATSAPP_BUSINESS_PHONE_ID=xxx
FEDAPAY_PUBLIC_KEY=xxx
NEXT_PUBLIC_GA_MEASUREMENT_ID=xxx
```

## 🎯 Configuration Rapide (5 minutes)

Si vous voulez tester MAINTENANT :

```bash
# 1. Créer .env.local avec MongoDB local uniquement
echo "MONGODB_URI=mongodb://localhost:27017/visionfocale" > .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# 2. Installer et démarrer MongoDB (Mac)
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# 3. Redémarrer Next.js
npm run dev
```

Les pages client fonctionneront ! Pour l'upload et les galeries, ajoutez Cloudinary plus tard.

## 📚 Ressources

- **MongoDB Atlas** : https://www.mongodb.com/docs/atlas/getting-started/
- **Cloudinary** : https://cloudinary.com/documentation/node_integration
- **Twilio** : https://www.twilio.com/docs/sms/quickstart/node
- **Africa's Talking** : https://developers.africastalking.com/docs/sms/overview
- **FedaPay** : https://docs.fedapay.com

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que `.env.local` existe
2. Redémarrez le serveur après modification
3. Vérifiez les logs dans le terminal
4. Testez une variable à la fois

---

**Dernière mise à jour** : 20 octobre 2024


