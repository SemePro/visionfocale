# 🔐 Où Obtenir Chaque Variable d'Environnement

## 📊 1. MongoDB (REQUIS)

### Option A : MongoDB Local (Gratuit - Recommandé pour développement)

```bash
# Installation Mac
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb-community

# Vérifier que ça marche
mongosh
```

**Variable :**
```env
MONGODB_URI=mongodb://localhost:27017/visionfocale
```

✅ **Aucun compte nécessaire !**

---

### Option B : MongoDB Atlas (Cloud gratuit)

1. Allez sur : https://www.mongodb.com/cloud/atlas
2. Créez un compte (gratuit)
3. Cliquez **"Build a Database"** → **M0 Free**
4. Choisissez une région (Europe recommandé)
5. Cliquez **"Create"**
6. **Database Access** :
   - Ajoutez un utilisateur
   - Username : `visionfocale`
   - Password : Générez un mot de passe fort
   - Database User Privileges : Read & Write
7. **Network Access** :
   - Cliquez **"Add IP Address"**
   - Sélectionnez **"Allow Access from Anywhere"** (0.0.0.0/0)
8. **Databases** → **Connect** :
   - Choisissez **"Connect your application"**
   - Copiez l'URI

**Variable :**
```env
MONGODB_URI=mongodb+srv://visionfocale:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/visionfocale?retryWrites=true&w=majority
```

⚠️ Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe que vous avez créé.

---

## 🖼️ 2. Cloudinary (REQUIS pour upload photos)

1. Allez sur : https://cloudinary.com
2. Cliquez **"Sign Up for Free"**
3. Créez un compte (gratuit : 25 crédits/mois, 25 GB stockage)
4. Vérifiez votre email
5. Allez au **Dashboard** : https://cloudinary.com/console
6. Copiez les 3 valeurs :

**Variables :**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

### Upload du Watermark (logo sur les photos)

1. Dans Cloudinary, cliquez **"Media Library"**
2. Cliquez **"Upload"**
3. Uploadez votre logo (le fichier dans `/public/images/logo.jpeg`)
4. Créez un dossier : **"visionfocale"**
5. Renommez le logo en **"watermark"**
6. L'URL sera automatiquement : `visionfocale/watermark`

**Variable :**
```env
CLOUDINARY_WATERMARK_URL=visionfocale/watermark
```

✅ **Gratuit : 25 GB, largement suffisant pour débuter !**

---

## 🔐 3. NextAuth Secret (REQUIS)

Générez une clé secrète aléatoire :

```bash
openssl rand -base64 32
```

**Copiez le résultat :**
```env
NEXTAUTH_SECRET=V7h3F+jK8mN2pQ5tR9wX1cZ4bY6eA3dG0hI8jL1nM4o=
```

✅ **Aucun compte nécessaire !**

---

## 📱 4. SMS / OTP (Pour galeries clients avec code SMS)

### Option A : Twilio (Recommandé - Fonctionne partout)

1. Allez sur : https://www.twilio.com/try-twilio
2. Cliquez **"Sign up"**
3. Vérifiez votre email et téléphone
4. Crédit gratuit : **$15** (environ 150 SMS)
5. **Console** : https://console.twilio.com
6. Copiez :
   - **Account SID**
   - **Auth Token**
7. **Phone Numbers** → **Buy a number** (avec le crédit gratuit)
   - Choisissez un numéro avec SMS capabilities
   - Ou utilisez le numéro de test

**Variables :**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
SMS_PROVIDER=twilio
```

**Tarifs :**
- SMS au Togo : ~$0.10 par SMS
- $15 gratuit = ~150 SMS

✅ **Crédit gratuit : $15 (150 SMS)**

---

### Option B : Africa's Talking (Spécialisé Afrique)

1. Allez sur : https://account.africastalking.com/auth/register
2. Créez un compte
3. Mode **Sandbox** gratuit pour tests
4. **Dashboard** → **Settings** :
   - Copiez **API Key**
   - Username : `sandbox`

**Variables :**
```env
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your_api_key_here
AFRICASTALKING_SHORTCODE=your_shortcode
SMS_PROVIDER=africastalking
```

**Tarifs production :**
- SMS au Togo : ~$0.05 par SMS (moins cher que Twilio)
- Recharge minimum : $10

✅ **Sandbox gratuit pour tests**

---

## 💬 5. WhatsApp Business API (Optionnel)

### Option A : WhatsApp Business Platform (Officiel)

1. Allez sur : https://business.facebook.com
2. Créez un **Business Manager** (gratuit)
3. Ajoutez **WhatsApp Business** à votre compte
4. **Settings** → **WhatsApp** → **API Setup**
5. Obtenez :
   - Phone Number ID
   - Access Token
   - Créez un Verify Token (n'importe quelle chaîne)

**Variables :**
```env
WHATSAPP_BUSINESS_PHONE_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_VERIFY_TOKEN=votre_token_personnel_123
WHATSAPP_BUSINESS_NUMBER=+22890123456
```

⚠️ **Processus complexe, recommandé plus tard.**

---

### Option B : WAAPI.app (Plus simple)

1. Allez sur : https://waapi.app
2. Créez un compte (gratuit : 1000 messages/mois)
3. **Dashboard** → **API Key**
4. Scannez le QR code avec WhatsApp

**Variables :**
```env
WHATSAPP_BUSINESS_PHONE_ID=your_instance_id
WHATSAPP_ACCESS_TOKEN=your_waapi_token
```

✅ **Gratuit : 1000 messages/mois**

---

## 💰 6. Payment Mobile Money (Optionnel)

### FedaPay (Togo, Bénin, Côte d'Ivoire)

1. Allez sur : https://fedapay.com
2. Cliquez **"S'inscrire"**
3. Créez un compte business
4. Soumettez vos documents (peut prendre 1-2 jours)
5. **Dashboard** → **Développeurs** → **Clés API**
6. Mode **Test** gratuit pour développement

**Variables :**
```env
FEDAPAY_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxx
FEDAPAY_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
```

**Tarifs :**
- TMoney : 2% de commission
- Flooz : 2% de commission
- Mobile Money : 2% de commission

✅ **Mode test gratuit**

---

## 📊 7. Google Analytics (Optionnel)

1. Allez sur : https://analytics.google.com
2. Créez un compte (gratuit)
3. Ajoutez une propriété : **VisionFocale**
4. Choisissez **Web**
5. Copiez le **Measurement ID** (format : `G-XXXXXXXXXX`)

**Variable :**
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ABC1234567
```

✅ **Totalement gratuit**

---

## 🚀 8. Pusher (Notifications temps réel - Optionnel)

1. Allez sur : https://dashboard.pusher.com/accounts/sign_up
2. Créez un compte (gratuit : 200K messages/jour)
3. Créez une **App**
4. **App Keys** :
   - Copiez App ID, Key, Secret, Cluster

**Variables :**
```env
NEXT_PUBLIC_PUSHER_APP_KEY=xxxxxxxxxxxxxxxxxxxx
PUSHER_APP_ID=123456
PUSHER_APP_SECRET=xxxxxxxxxxxxxxxxxx
PUSHER_CLUSTER=eu
```

✅ **Gratuit : 200K messages/jour**

---

## 📧 9. Email (Optionnel)

### Option : Resend (Recommandé)

1. Allez sur : https://resend.com
2. Créez un compte (gratuit : 3000 emails/mois)
3. **API Keys** → **Create API Key**
4. Copiez la clé

**Variables :**
```env
EMAIL_FROM=noreply@visionfocale.tg
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

✅ **Gratuit : 3000 emails/mois**

---

## ✅ Résumé par Priorité

### 🔴 CRITIQUE (Pour tester maintenant)

| Service | Compte | Prix | Temps | Variable |
|---------|--------|------|-------|----------|
| **MongoDB** | Optionnel | Gratuit | 5 min | `MONGODB_URI` |
| **Cloudinary** | Oui | Gratuit | 5 min | `CLOUDINARY_*` (3) |
| **NextAuth** | Non | Gratuit | 1 min | `NEXTAUTH_SECRET` |

**Total : ~10 minutes** ⏱️

---

### 🟡 IMPORTANT (Pour fonctionnalités complètes)

| Service | Compte | Prix | Crédits | Variable |
|---------|--------|------|---------|----------|
| **Twilio (SMS)** | Oui | $0.10/SMS | $15 gratuit | `TWILIO_*` (3) |
| **Africa's Talking** | Oui | $0.05/SMS | Sandbox | `AFRICASTALKING_*` |

**Total : ~10 minutes** ⏱️

---

### 🟢 OPTIONNEL (Plus tard)

| Service | Prix | Gratuit | Variable |
|---------|------|---------|----------|
| **WhatsApp** | Gratuit | 1000 msg/mois | `WHATSAPP_*` |
| **FedaPay** | 2% commission | Mode test | `FEDAPAY_*` |
| **Google Analytics** | Gratuit | ∞ | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| **Pusher** | Gratuit | 200K msg/jour | `PUSHER_*` |
| **Resend (Email)** | Gratuit | 3000 emails/mois | `EMAIL_*` |

---

## 🎯 Plan d'Action Recommandé

### Phase 1 : Tester l'app (Aujourd'hui - 15 min)

1. ✅ MongoDB local (5 min)
2. ✅ Cloudinary (5 min)
3. ✅ NextAuth Secret (1 min)

**→ Homepage et Admin fonctionnels !**

---

### Phase 2 : Galeries clients (Dans 1-2 jours)

4. ✅ Twilio ou Africa's Talking (10 min)

**→ Clients peuvent recevoir leur code SMS !**

---

### Phase 3 : Fonctionnalités avancées (Plus tard)

5. ⚪ WhatsApp (optionnel)
6. ⚪ FedaPay (pour paiements)
7. ⚪ Google Analytics (statistiques)
8. ⚪ Pusher (notifications temps réel)

---

## 💡 Conseil

**Ne configurez pas tout en même temps !**

1. Commencez avec MongoDB + Cloudinary + NextAuth
2. Testez l'application
3. Ajoutez Twilio quand vous êtes prêt pour les galeries clients
4. Les autres services peuvent attendre

---

## 🆘 Aide Rapide

### Pour tester MAINTENANT (5 min) :

```bash
# 1. MongoDB local
brew services start mongodb-community

# 2. NextAuth secret
openssl rand -base64 32
# → Copiez dans .env.local

# 3. Créez compte Cloudinary
# → Copiez les 3 valeurs dans .env.local

# 4. Redémarrez
npm run dev
```

---

## 📚 Liens Utiles

- **MongoDB Atlas** : https://www.mongodb.com/cloud/atlas
- **Cloudinary** : https://cloudinary.com/console
- **Twilio** : https://console.twilio.com
- **Africa's Talking** : https://account.africastalking.com
- **FedaPay** : https://fedapay.com
- **Resend** : https://resend.com
- **Pusher** : https://dashboard.pusher.com

---

**Dernière mise à jour** : 20 octobre 2024


