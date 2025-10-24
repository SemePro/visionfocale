# 🔧 Configuration du Workflow GitHub Actions

## Problème de Permissions

Le fichier `.github/workflows/deploy.yml` n'a pas pu être poussé automatiquement en raison des permissions GitHub. Voici comment l'ajouter manuellement :

## Solution : Ajouter le Workflow Manuellement

### 1. Aller sur GitHub.com
1. Naviguez vers votre dépôt : [https://github.com/SemePro/visionfocale](https://github.com/SemePro/visionfocale)
2. Cliquez sur l'onglet **"Actions"**
3. Cliquez sur **"New workflow"** ou **"Set up a workflow yourself"**

### 2. Créer le fichier de workflow
1. Nommez le fichier : `deploy.yml`
2. Copiez et collez le contenu suivant :

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      env:
        NODE_ENV: production
        
    - name: Run tests (if available)
      run: npm test --if-present
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### 3. Configurer les Secrets Vercel
Dans les paramètres de votre dépôt GitHub :

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez ces secrets :
   - `VERCEL_TOKEN` : Votre token Vercel
   - `VERCEL_ORG_ID` : Votre organisation Vercel ID
   - `VERCEL_PROJECT_ID` : Votre projet Vercel ID

### 4. Obtenir les IDs Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Lier le projet
vercel link

# Les IDs seront affichés dans le fichier .vercel/project.json
```

## Alternative : Déploiement Manuel

Si vous préférez déployer manuellement :

1. **Connecter le dépôt à Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Importez le dépôt GitHub
   - Configurez les variables d'environnement
   - Déployez !

2. **Suivre le guide complet** :
   - Consultez `DEPLOYMENT_GUIDE.md` pour les instructions détaillées

## ✅ Statut Actuel

- ✅ Code source poussé sur GitHub
- ✅ Dépôt public disponible
- ✅ Documentation complète incluse
- ⏳ Workflow GitHub Actions (à ajouter manuellement)
- ⏳ Déploiement Vercel (à configurer)

Le projet VisionFocale est maintenant disponible sur GitHub et prêt pour le déploiement !
