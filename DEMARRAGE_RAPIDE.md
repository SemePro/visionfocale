# 🚀 Démarrage Rapide - VisionFocale

## ⚡ Installation en 5 minutes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'environnement

Créer `.env.local` à la racine du projet:

```env
# MongoDB (local ou Atlas)
MONGODB_URI=mongodb://localhost:27017/visionfocale

# NextAuth
NEXTAUTH_SECRET=votre-secret-change-moi
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (obligatoire pour photos)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# SMS (optionnel pour dev, obligatoire pour prod)
SMS_API_KEY=votre-sms-key
SMS_PROVIDER=africas_talking

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=VisionFocale
```

### 3. Lancer MongoDB

**Option A - MongoDB local:**
```bash
mongod
```

**Option B - MongoDB Atlas (cloud):**
Utiliser directement l'URI Atlas dans `.env.local`

### 4. Lancer le projet

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) 🎉

---

## 📂 Structure du projet (simplifié)

```
visionfocale/
├── app/                    # Pages Next.js
│   ├── page.tsx           # ✅ Page d'accueil (complète)
│   ├── api/               # ✅ API Routes (partielles)
│   ├── galerie/           # ⏳ À créer
│   ├── services/          # ⏳ À créer
│   ├── contact/           # ⏳ À créer
│   ├── reservation/       # ⏳ À créer
│   ├── client/            # ⏳ Galeries privées (à créer)
│   └── admin/             # ⏳ Interface admin (à créer)
├── components/            # ✅ Composants UI (complets)
├── lib/                   # ✅ Utilitaires (complets)
├── models/                # ✅ Modèles MongoDB (complets)
└── public/                # Assets statiques
```

---

## ✅ Ce qui fonctionne déjà

### Page d'accueil complète
- ✅ Hero section avec animations
- ✅ Services
- ✅ Travaux récents
- ✅ Témoignages
- ✅ Call to action
- ✅ Navbar responsive
- ✅ Footer avec liens

### Système backend
- ✅ MongoDB configuré avec 8 modèles
- ✅ Cloudinary avec watermarking automatique
- ✅ SMS (OTP) avec Africa's Talking/Twilio
- ✅ WhatsApp intégration
- ✅ API Routes de base (galeries, auth, upload, etc.)

### Composants UI
- ✅ Button, Card, Input, Textarea, Badge, Modal, Loader
- ✅ Tous avec variantes et états
- ✅ Design moderne avec palette violette

---

## 🔄 Prochaines étapes recommandées

### Option 1: Compléter les pages client (Recommandé)
Créer les pages manquantes pour avoir un site complet:

1. **Page Galerie** (`app/galerie/page.tsx`)
   - Afficher les travaux publics
   - Filtres par catégorie
   - Lightbox pour voir en grand

2. **Page Services** (`app/services/page.tsx`)
   - Détails de chaque service
   - Tarifs (optionnel)
   - CTA réservation

3. **Page Contact** (`app/contact/page.tsx`)
   - Formulaire de contact
   - Carte avec localisation
   - Coordonnées

4. **Page Réservation** (`app/reservation/page.tsx`)
   - Formulaire multi-étapes
   - Sélection service + date
   - Confirmation

### Option 2: Galeries clients privées (Fonctionnalité core)
Implémenter le système de galeries privées:

1. **Page galerie privée** (`app/client/[shareLink]/page.tsx`)
2. **Authentification SMS** (composant PhoneAuth)
3. **Affichage photos** avec watermark
4. **Système de téléchargement** avec limites
5. **Likes et favoris**

### Option 3: Interface d'administration
Créer l'admin pour gérer tout:

1. **Dashboard** avec statistiques
2. **Gestion galeries clients**
3. **Gestion clients**
4. **Calendrier réservations**
5. **Paramètres système**

---

## 📖 Documentation disponible

### Pour développer:
- `README.md` - Vue d'ensemble du projet
- `GUIDE_DEVELOPPEMENT.md` - Guide complet avec exemples
- `PROJET_STATUS.md` - Status détaillé de ce qui est fait/à faire

### Fichiers de référence:
- `lib/utils.ts` - Fonctions utilitaires
- `lib/cloudinary.ts` - Gestion photos et watermarking
- `lib/sms.ts` - Envoi SMS (OTP)
- `lib/whatsapp.ts` - Intégration WhatsApp
- `models/` - Tous les modèles MongoDB

---

## 🎨 Design

### Palette de couleurs
```css
/* Violet principal */
primary-500: #8B3FBF
primary-600: #7B2FB2
primary-700: #6A1FA5

/* Violet foncé */
secondary-500: #3D1F5C
secondary-600: #2E1644

/* Accents */
accent: #C08FE8
accent-light: #D4A5F4
```

### Classes utilitaires Tailwind personnalisées
```tsx
<button className="btn btn-primary">Bouton</button>
<div className="card card-hover">Card</div>
<input className="input" />
<div className="gradient-text">Texte dégradé</div>
<div className="glass">Effet verre</div>
```

---

## 🔧 Commandes utiles

```bash
# Développement
npm run dev              # Lancer en mode dev (port 3000)

# Production
npm run build            # Build pour production
npm run start            # Lancer en production

# Qualité du code
npm run lint             # Linter
npm run type-check       # Vérifier types TypeScript

# Base de données
mongod                   # Lancer MongoDB local
```

---

## 🐛 Problèmes courants

### "Cannot connect to MongoDB"
- Vérifier que MongoDB est lancé: `mongod`
- Ou utiliser MongoDB Atlas (cloud)
- Vérifier `MONGODB_URI` dans `.env.local`

### "Module not found"
```bash
npm install  # Réinstaller les dépendances
rm -rf .next # Supprimer cache Next.js
```

### "Cloudinary errors"
- Vérifier les clés dans `.env.local`
- Créer un compte sur [cloudinary.com](https://cloudinary.com)

### Port 3000 déjà utilisé
```bash
lsof -ti:3000 | xargs kill  # Tuer le process
# ou
npm run dev -- -p 3001      # Utiliser autre port
```

---

## 📱 Test sur mobile

### Sur même réseau WiFi:

1. Trouver votre IP locale:
```bash
ipconfig getifaddr en0  # Mac
# ou
hostname -I             # Linux
```

2. Ouvrir sur téléphone:
```
http://VOTRE-IP:3000
```

---

## 🚀 Déploiement (quand prêt)

### Sur Vercel (recommandé):

1. Push le code sur GitHub
2. Connecter à [vercel.com](https://vercel.com)
3. Importer le repo
4. Ajouter les variables d'environnement
5. Déployer !

### Variables d'environnement production:
- ✅ MONGODB_URI (Atlas)
- ✅ NEXTAUTH_SECRET (générer un nouveau)
- ✅ Clés Cloudinary
- ✅ Clés SMS provider
- ✅ NEXT_PUBLIC_APP_URL (votre domaine)

---

## 💡 Conseils

1. **Commencez simple**: Créer les pages une par une
2. **Testez souvent**: Vérifier chaque fonctionnalité
3. **Mobile d'abord**: Tester sur mobile régulièrement
4. **Consultez les docs**: README, GUIDE_DEVELOPPEMENT, PROJET_STATUS
5. **Exemples**: S'inspirer des composants existants

---

## 📞 Support

### Documentation:
- `README.md` - Documentation générale
- `GUIDE_DEVELOPPEMENT.md` - Guide détaillé
- `PROJET_STATUS.md` - Status du projet

### Ressources externes:
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 🎯 Objectif

Créer une plateforme complète permettant à VisionFocale de:
- ✅ Présenter ses services et travaux
- ⏳ Recevoir des réservations en ligne
- ⏳ Partager des photos avec clients (galeries privées)
- ⏳ Gérer son activité via interface admin

**Le projet a une excellente base ! Continuez étape par étape.** 💪

---

**Bon développement ! 🚀**


