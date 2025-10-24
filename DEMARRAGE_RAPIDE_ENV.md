# 🚀 Démarrage Rapide - Configuration Environnement

## ✅ Fichier .env.local Créé !

Le fichier `.env.local` a été créé avec toutes les variables nécessaires.

## 🔴 IMPORTANT : 3 Étapes Obligatoires

### Étape 1 : MongoDB (2 options)

#### Option A : MongoDB Local (Recommandé pour tester)

```bash
# Installation (Mac)
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb-community

# Vérifier que ça fonctionne
mongosh
```

La variable `MONGODB_URI=mongodb://localhost:27017/visionfocale` est déjà configurée !

#### Option B : MongoDB Atlas (Cloud gratuit)

1. Allez sur https://mongodb.com/cloud/atlas
2. Créez un compte gratuit
3. Créez un cluster (M0 Sandbox - FREE)
4. Cliquez **Connect** → **Drivers**
5. Copiez l'URI et modifiez dans `.env.local` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visionfocale?retryWrites=true&w=majority
```

---

### Étape 2 : Cloudinary (Requis pour l'upload)

1. Allez sur https://cloudinary.com
2. Créez un compte gratuit (10 GB gratuit)
3. Dashboard → **Account Details**
4. Copiez les 3 valeurs :

**Dans `.env.local`, remplacez :**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Exemple :**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234
```

---

### Étape 3 : NextAuth Secret

Générez une clé secrète sécurisée :

```bash
openssl rand -base64 32
```

**Copiez le résultat dans `.env.local` :**

```env
NEXTAUTH_SECRET=le_resultat_de_la_commande_ici
```

**Exemple :**
```env
NEXTAUTH_SECRET=V7h3F+jK8mN2pQ5tR9wX1cZ4bY6eA3dG0hI8jL1nM4o=
```

---

## ✅ Tester l'Application

Une fois les 3 étapes ci-dessus complétées :

```bash
# Redémarrer le serveur
npm run dev
```

### Vérifications :

1. ✅ **Homepage** : http://localhost:3000
   - Le logo doit s'afficher
   - Les 5 services doivent apparaître (Photo, Drone, Vidéo, Infographie, Retouches)

2. ✅ **Admin Dashboard** : http://localhost:3000/admin
   - Doit charger sans erreur MongoDB

3. ✅ **Test API** : http://localhost:3000/api/galleries
   - Doit retourner `[]` (liste vide) au lieu d'une erreur

---

## 🟡 Configuration Optionnelle (Plus tard)

### SMS / OTP (Pour galeries clients)

**Twilio** (Recommandé)
1. https://www.twilio.com/try-twilio
2. Compte d'essai : $15 crédit gratuit
3. Console → Account SID, Auth Token, Phone Number
4. Mettre à jour dans `.env.local`

**Africa's Talking** (Alternative)
1. https://africastalking.com
2. Sandbox gratuit
3. Meilleurs tarifs pour l'Afrique

### WhatsApp Business

1. https://business.facebook.com
2. Créer un Business Manager
3. Ajouter WhatsApp Business
4. Obtenir le Phone ID et Access Token

### Payment (FedaPay pour le Togo)

1. https://fedapay.com
2. Créer un compte
3. Mode Test gratuit
4. Dashboard → API Keys

---

## 🐛 Problèmes Courants

### Erreur : "MONGODB_URI not defined"

```bash
# Vérifiez que le fichier existe
cat .env.local | grep MONGODB_URI

# Si vide, ajoutez :
echo "MONGODB_URI=mongodb://localhost:27017/visionfocale" >> .env.local

# Redémarrez le serveur
```

### Erreur : "Failed to connect to MongoDB"

**Si MongoDB local :**
```bash
# Démarrez MongoDB
brew services start mongodb-community

# Vérifiez qu'il tourne
brew services list | grep mongodb
```

**Si MongoDB Atlas :**
- Vérifiez votre URI
- Assurez-vous d'avoir remplacé `<password>`
- Ajoutez votre IP dans Network Access (Atlas)

### Upload ne fonctionne pas

```bash
# Vérifiez vos credentials Cloudinary
cat .env.local | grep CLOUDINARY

# Assurez-vous que les 3 variables sont remplies
# Pas de "your_" devant
```

---

## 📊 Résumé Configuration

### Minimum pour tester (Homepage, Admin) :
```env
✅ MONGODB_URI=mongodb://localhost:27017/visionfocale
✅ NEXTAUTH_SECRET=(généré avec openssl)
```

### Pour uploads de photos :
```env
✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
✅ CLOUDINARY_API_KEY=xxx
✅ CLOUDINARY_API_SECRET=xxx
```

### Pour galeries clients (SMS OTP) :
```env
✅ TWILIO_ACCOUNT_SID=xxx
✅ TWILIO_AUTH_TOKEN=xxx
✅ TWILIO_PHONE_NUMBER=xxx
```

---

## 🎯 Commandes Utiles

```bash
# Voir le contenu de .env.local
cat .env.local

# Éditer .env.local
nano .env.local
# ou
code .env.local

# Vérifier MongoDB local
mongosh

# Vérifier que MongoDB tourne (Mac)
brew services list

# Redémarrer l'app (important après modif .env)
# Ctrl+C puis :
npm run dev

# Générer un nouveau NextAuth secret
openssl rand -base64 32
```

---

## 📝 Checklist Finale

- [ ] MongoDB installé et démarré
- [ ] `MONGODB_URI` configuré dans `.env.local`
- [ ] Compte Cloudinary créé
- [ ] 3 variables Cloudinary configurées
- [ ] `NEXTAUTH_SECRET` généré et configuré
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Homepage charge sans erreur
- [ ] Admin accessible
- [ ] Pas d'erreur MongoDB dans le terminal

---

## 🆘 Besoin d'Aide ?

### Ordre des étapes :

1. **D'abord** : MongoDB + NextAuth Secret
   → Teste : Homepage et Admin doivent charger

2. **Ensuite** : Cloudinary
   → Teste : Upload de photos dans Admin

3. **Plus tard** : Twilio/SMS
   → Teste : Galerie client avec OTP

**Ne configurez pas tout d'un coup !** Testez étape par étape.

---

**Prochaine étape** : Une fois ces 3 variables configurées, tout devrait fonctionner ! 🚀


