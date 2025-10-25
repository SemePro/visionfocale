# 📸 VisionFocale - Studio Photographie & Infographie

Site web moderne et professionnel pour **VisionFocale**, studio de photographie et infographie basé à Lomé, Togo-

## 🎯 Vue d'ensemble

VisionFocale est une plateforme complète offrant:
- **Portfolio public** des travaux du studio
- **Galeries privées clients** avec authentification SMS
- **Système de réservation** en ligne
- **Interface d'administration** complète
- **Watermarking automatique** via Cloudinary
- **Gestion intelligente des téléchargements**
- **Intégration WhatsApp** pour communication directe

## 🚀 Stack Technologique

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: NextAuth.js
- **Stockage photos**: Cloudinary (avec watermarking)
- **SMS**: Africa's Talking / Twilio
- **Notifications**: Temps réel
- **Déploiement**: Vercel

## 📦 Installation

### Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- Compte Cloudinary
- (Optionnel) Compte Africa's Talking ou Twilio pour SMS

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-repo/visionfocale.git
cd visionfocale
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/visionfocale

# NextAuth
NEXTAUTH_SECRET=votre-secret-key
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# SMS (Africa's Talking ou Twilio)
SMS_API_KEY=votre-sms-api-key
SMS_API_USERNAME=votre-username
SMS_SENDER_ID=VisionFocale
SMS_PROVIDER=africas_talking

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=VisionFocale
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎨 Structure du Projet

```
visionfocale/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── galerie/           # Galerie publique
│   ├── services/          # Page services
│   ├── reservation/       # Système de réservation
│   ├── client/            # Galeries privées clients
│   └── admin/             # Interface d'administration
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── layout/           # Layout (Navbar, Footer)
│   ├── home/             # Composants page d'accueil
│   ├── admin/            # Composants admin
│   └── shared/           # Composants partagés
├── lib/                   # Utilitaires et helpers
│   ├── mongodb.ts        # Connexion MongoDB
│   ├── cloudinary.ts     # Gestion Cloudinary & watermarks
│   ├── sms.ts            # Service SMS (OTP)
│   ├── whatsapp.ts       # Intégration WhatsApp
│   └── utils.ts          # Fonctions utilitaires
├── models/                # Modèles MongoDB (Mongoose)
│   ├── Gallery.ts        # Galeries clients
│   ├── ClientAccess.ts   # Accès et téléchargements
│   ├── Booking.ts        # Réservations
│   ├── PublicGallery.ts  # Galerie publique
│   ├── Settings.ts       # Paramètres système
│   ├── AdminUser.ts      # Utilisateurs admin
│   ├── Invoice.ts        # Facturation
│   └── ActivityLog.ts    # Logs d'activité
├── types/                 # Types TypeScript
├── public/                # Assets statiques
└── .env.local            # Variables d'environnement
```

## 🌟 Fonctionnalités Principales

### 1. Galeries Clients Privées

- **Lien unique** généré pour chaque client
- **Authentification SMS** avec code OTP
- **Watermark automatique** sur toutes les photos (via Cloudinary)
- **Gestion des limites de téléchargements** configurables
- **Système intelligent**: même numéro = mêmes téléchargements
- Likes et favoris sur les photos
- Partage WhatsApp

### 2. Interface d'Administration

**Dashboard complet** avec:
- Statistiques et KPIs en temps réel
- Gestion des galeries clients
- Gestion des clients et historiques
- Calendrier des réservations
- Gestion financière et facturation
- Analytics et rapports
- Paramètres système
- Logs d'activité

### 3. Système de Réservation

- Formulaire multi-étapes élégant
- Sélection de service et date
- Confirmation automatique par SMS/Email
- Intégration calendrier admin
- Option réservation WhatsApp

### 4. Watermarking Automatique

Chaque photo uploadée génère 3 versions:
- **Version watermarkée**: pour affichage dans la galerie
- **Version propre**: pour téléchargement (haute qualité)
- **Thumbnail**: pour previews rapides

Configuration personnalisable:
- Texte du watermark
- Position (coins, centre)
- Opacité
- Taille de police

## 📱 Intégration WhatsApp

Boutons WhatsApp contextuels sur:
- Page d'accueil (demandes d'info)
- Services (devis)
- Galeries clients (support)
- Réservations (alternative)
- Contact (support direct)

## 🔐 Sécurité

- Authentification SMS par OTP
- Liens de galerie avec tokens sécurisés
- Rate limiting sur envoi SMS
- Logs des téléchargements avec IP
- Expiration optionnelle des liens
- Permissions granulaires admin

## 🎨 Design

**Palette de couleurs** (inspirée du logo):
- **Primaire**: Violet/Pourpre (#8B3FBF, #7B2FB2, #6A1FA5)
- **Secondaire**: Violet foncé (#3D1F5C, #2E1644)
- **Accents**: Violet clair (#C08FE8, #D4A5F4)
- **Neutre**: Blanc, gris clair, gris foncé

**Principes de design**:
- Minimaliste et moderne
- Mobile-first
- Animations subtiles (Framer Motion)
- Effets glassmorphism
- Gradients violets
- Inspiré de: Unsplash, Behance, Instagram, Notion, Linear

## 🚢 Déploiement

### Déploiement sur Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez !

```bash
npm run build
```

### Variables d'environnement de production

Assurez-vous de configurer toutes les variables dans Vercel:
- MONGODB_URI (MongoDB Atlas)
- NEXTAUTH_SECRET
- Clés Cloudinary
- Clés SMS provider
- WhatsApp Business API

## 📚 Scripts Disponibles

```bash
npm run dev          # Lancer en développement
npm run build        # Build de production
npm run start        # Lancer en production
npm run lint         # Linter le code
npm run type-check   # Vérifier les types TypeScript
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Copyright © 2025 VisionFocale. Tous droits réservés.

## 📞 Contact

- **Email**: contact@visionfocale.com
- **Téléphone**: +228 XX XX XX XX
- **Adresse**: Lomé, Agoê Sogbossito, Togo
- **WhatsApp**: +228 XX XX XX XX

---

**Fait avec ❤️ par VisionFocale**

*Capturez l'instant, Créez l'émotion* ✨


