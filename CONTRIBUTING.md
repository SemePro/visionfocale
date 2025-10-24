# 🤝 Guide de Contribution - VisionFocale

Merci de votre intérêt pour contribuer au projet VisionFocale ! Ce guide vous aidera à comprendre comment contribuer efficacement.

## 📋 Prérequis

- Node.js 18+
- npm 9+
- MongoDB (local ou Atlas)
- Compte Cloudinary
- Git

## 🚀 Configuration du Projet

1. **Fork et Clone**
   ```bash
   git clone https://github.com/votre-username/visionfocale.git
   cd visionfocale
   ```

2. **Installation des dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.example .env.local
   # Éditer .env.local avec vos clés
   ```

4. **Lancement en développement**
   ```bash
   npm run dev
   ```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Production
npm run lint         # Linter
npm run lint:fix     # Corriger automatiquement
npm run type-check   # Vérification TypeScript
npm run format       # Formater le code
npm run clean        # Nettoyer les builds
```

## 📝 Standards de Code

### TypeScript
- Utiliser des types stricts
- Éviter `any` autant que possible
- Documenter les interfaces complexes

### React/Next.js
- Utiliser des composants fonctionnels
- Props typées avec des interfaces
- Hooks personnalisés pour la logique réutilisable

### Styling
- Tailwind CSS pour le styling
- Classes utilitaires préférées
- Composants UI réutilisables dans `/components/ui`

### Structure des Fichiers
```
app/
├── page.tsx              # Pages
├── api/                  # API Routes
└── (group)/              # Groupes de routes

components/
├── ui/                   # Composants UI de base
├── layout/              # Layout (Navbar, Footer)
├── home/                # Composants page d'accueil
├── admin/               # Composants admin
└── shared/              # Composants partagés

lib/                      # Utilitaires et helpers
models/                   # Modèles MongoDB
types/                    # Types TypeScript
```

## 🐛 Signaler un Bug

1. Vérifier que le bug n'existe pas déjà dans les issues
2. Créer une nouvelle issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si applicable
   - Informations sur l'environnement

## ✨ Proposer une Fonctionnalité

1. Créer une issue pour discuter de la fonctionnalité
2. Attendre l'approbation avant de commencer le développement
3. Créer une branche feature : `git checkout -b feature/nom-fonctionnalite`

## 🔄 Processus de Contribution

### 1. Créer une Branche
```bash
git checkout -b feature/nom-fonctionnalite
# ou
git checkout -b fix/nom-bug
```

### 2. Développer
- Faire des commits atomiques et descriptifs
- Tester vos modifications
- Respecter les standards de code

### 3. Tests
```bash
npm run type-check  # Vérifier TypeScript
npm run lint        # Vérifier le linting
npm run build       # Tester le build
```

### 4. Pull Request
- Titre descriptif
- Description détaillée des changements
- Référencer les issues liées
- Captures d'écran si UI modifiée

## 📋 Checklist Pull Request

- [ ] Code testé localement
- [ ] Types TypeScript corrects
- [ ] Pas d'erreurs de linting
- [ ] Build réussi
- [ ] Documentation mise à jour si nécessaire
- [ ] Tests ajoutés si applicable

## 🎨 Guidelines de Design

### Couleurs
- **Primaire** : Violet/Pourpre (#8B3FBF, #7B2FB2, #6A1FA5)
- **Secondaire** : Violet foncé (#3D1F5C, #2E1644)
- **Accents** : Violet clair (#C08FE8, #D4A5F4)

### Principes
- Design minimaliste et moderne
- Mobile-first
- Animations subtiles
- Accessibilité (WCAG 2.1)

## 🔒 Sécurité

- Ne jamais commiter de clés API ou secrets
- Utiliser les variables d'environnement
- Valider toutes les entrées utilisateur
- Tester les cas limites

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Mongoose](https://mongoosejs.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)

## 🤔 Questions ?

- Ouvrir une issue pour les questions générales
- Utiliser les discussions GitHub pour les débats
- Contacter les mainteneurs pour les questions urgentes

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés à VisionFocale.

---

**Merci de contribuer à VisionFocale ! 🎉**

*Capturez l'instant, Créez l'émotion* ✨
