# Configuration Cloudinary pour VisionFocale

## 📁 Structure des Dossiers

Dans votre compte Cloudinary, créez cette structure :

```
visionFocale/
├── watermarks/          # Votre logo/watermark à appliquer
├── client-galleries/    # Photos clients (privées)
├── public-portfolio/    # Portfolio public
└── temp-uploads/        # Uploads temporaires
```

---

## 🔧 Étape 1 : Upload le Watermark/Logo

1. **Connectez-vous à Cloudinary** : https://cloudinary.com/console
2. **Allez dans Media Library**
3. **Créez un dossier** `visionFocale/watermarks/`
4. **Uploadez votre logo** :
   - Nom suggéré : `logo-watermark.png`
   - Format recommandé : PNG avec transparence
   - Taille recommandée : 200x200px ou plus

### 📍 Public ID du watermark
Une fois uploadé, notez le **Public ID**, par exemple :
```
visionFocale/watermarks/logo-watermark
```

---

## 🎨 Étape 2 : Créer un Upload Preset avec Watermark Automatique

### Dans Cloudinary Console :

1. **Allez dans Settings** → **Upload** → **Upload presets**
2. **Cliquez sur "Add upload preset"**
3. **Configurez comme suit** :

#### Configuration Basique
- **Preset name** : `visionfocale_client_photos`
- **Signing Mode** : `Signed` (pour plus de sécurité)
- **Folder** : `visionFocale/client-galleries`
- **Use filename** : ✅ Cocher
- **Unique filename** : ✅ Cocher

#### Transformations (Eager transformations)
Ajoutez cette transformation pour appliquer automatiquement le watermark :

```
l_visionFocale:watermarks:logo-watermark,g_south_east,x_20,y_20,w_150,o_70/c_limit,h_2000,w_2000,q_auto:good,f_auto
```

**Explication** :
- `l_visionFocale:watermarks:logo-watermark` : Overlay du logo
- `g_south_east` : Position en bas à droite
- `x_20,y_20` : Marges de 20px
- `w_150` : Largeur du watermark 150px
- `o_70` : Opacité 70%
- `c_limit,h_2000,w_2000` : Limite la taille à 2000x2000
- `q_auto:good` : Qualité automatique optimisée
- `f_auto` : Format automatique (WebP pour navigateurs compatibles)

---

## 🖼️ Étape 3 : Créer un Preset pour Portfolio Public (Sans Watermark)

1. **Créez un autre preset** : `visionfocale_public_portfolio`
2. **Configuration** :
   - **Folder** : `visionFocale/public-portfolio`
   - **Pas de watermark** (ou watermark discret)
   - **Transformation** :
     ```
     c_limit,h_1500,w_1500,q_auto:best,f_auto
     ```

---

## ⚙️ Étape 4 : Obtenir vos Credentials

1. **Allez dans Dashboard** → **Settings** → **Account**
2. **Notez ces informations** :

```
Cloud Name: votre_cloud_name
API Key: votre_api_key
API Secret: votre_api_secret
```

---

## 🔐 Étape 5 : Configurer `.env.local`

Ajoutez ces variables dans votre `.env.local` :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Upload Presets
CLOUDINARY_UPLOAD_PRESET_CLIENT=visionfocale_client_photos
CLOUDINARY_UPLOAD_PRESET_PUBLIC=visionfocale_public_portfolio

# Watermark Public ID
CLOUDINARY_WATERMARK_PUBLIC_ID=visionFocale/watermarks/logo-watermark
```

---

## 🎯 Étape 6 : Mettre à Jour le Code

Votre fichier `lib/cloudinary.ts` utilise déjà ces configurations. Assurez-vous que ces fonctions sont bien présentes :

### Configuration Watermark par défaut
```typescript
export const WATERMARK_CONFIG = {
  publicId: process.env.CLOUDINARY_WATERMARK_PUBLIC_ID || 'visionFocale/watermarks/logo-watermark',
  position: 'south_east', // Position: south_east, north_east, south_west, north_west, center
  width: 150, // Largeur du watermark en pixels
  opacity: 70, // Opacité (0-100)
  margin: { x: 20, y: 20 }, // Marges en pixels
};
```

---

## 📸 Étape 7 : Exemples d'URLs Transformées

### Photo Client avec Watermark
```
https://res.cloudinary.com/votre_cloud_name/image/upload/
l_visionFocale:watermarks:logo-watermark,g_south_east,x_20,y_20,w_150,o_70/
visionFocale/client-galleries/photo123.jpg
```

### Thumbnail sans Watermark
```
https://res.cloudinary.com/votre_cloud_name/image/upload/
c_fill,w_300,h_300,q_auto/
visionFocale/client-galleries/photo123.jpg
```

### Photo Portfolio Publique
```
https://res.cloudinary.com/votre_cloud_name/image/upload/
c_limit,h_1500,w_1500,q_auto:best/
visionFocale/public-portfolio/best-work-001.jpg
```

---

## 🔒 Étape 8 : Sécurité Avancée (Optionnel)

### Activer Signed URLs
Pour empêcher l'accès direct non autorisé :

1. **Settings** → **Security** → **Strict transformations** : ✅
2. **Allowed fetch domains** : Limitez aux domaines autorisés

### Configurer l'expiration des liens
```typescript
// Dans votre code
const url = cloudinary.url(publicId, {
  sign_url: true,
  type: 'authenticated',
  expires_at: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24h
});
```

---

## 🧪 Étape 9 : Tester l'Upload

### Test Rapide
1. Allez sur votre admin : `/admin/galeries/nouvelle`
2. Uploadez une photo
3. Vérifiez dans Cloudinary Media Library :
   - La photo doit être dans `visionFocale/client-galleries/`
   - Le watermark doit être appliqué automatiquement

---

## 📊 Bonnes Pratiques

### Organisation des Dossiers
```
visionFocale/
├── watermarks/
│   └── logo-watermark.png
├── client-galleries/
│   ├── 2025/
│   │   ├── mariage-sarah-paul/
│   │   └── portrait-kofi/
│   └── 2024/
├── public-portfolio/
│   ├── mariages/
│   ├── corporate/
│   └── famille/
└── temp-uploads/
```

### Nommage des Photos
Format suggéré : `{event-type}-{client-name}-{date}-{number}`
Exemple : `mariage-sarah-paul-20251025-001.jpg`

---

## 🎨 Personnalisation du Watermark

### Position
- `north` : Haut centre
- `south` : Bas centre
- `east` : Milieu droite
- `west` : Milieu gauche
- `north_east` : Haut droite
- `north_west` : Haut gauche
- `south_east` : Bas droite (par défaut)
- `south_west` : Bas gauche
- `center` : Centre

### Tailles Recommandées
- **Petit** : w_100
- **Moyen** : w_150 (par défaut)
- **Grand** : w_200

### Opacité
- **Discret** : o_50
- **Normal** : o_70 (par défaut)
- **Visible** : o_90

---

## 🔍 Dépannage

### Le watermark n'apparaît pas ?
1. Vérifiez le Public ID du watermark dans Cloudinary
2. Assurez-vous que `CLOUDINARY_WATERMARK_PUBLIC_ID` est correct dans `.env.local`
3. Vérifiez que le preset d'upload inclut la transformation

### Les images sont trop grandes ?
Ajustez la transformation dans le preset :
```
c_limit,h_1500,w_1500,q_auto:good
```

### Erreur d'authentification ?
Vérifiez que `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET` sont corrects.

---

## 📞 Support Cloudinary

- Documentation : https://cloudinary.com/documentation
- Support : https://support.cloudinary.com
- Transformations : https://cloudinary.com/documentation/image_transformations

---

## ✅ Checklist Finale

- [ ] Dossier `visionFocale` créé
- [ ] Logo watermark uploadé dans `visionFocale/watermarks/`
- [ ] Upload preset `visionfocale_client_photos` créé
- [ ] Upload preset `visionfocale_public_portfolio` créé
- [ ] Variables d'environnement configurées dans `.env.local`
- [ ] Test d'upload effectué depuis l'admin
- [ ] Watermark visible sur les photos uploadées
- [ ] URLs des photos accessibles

---

**Votre configuration Cloudinary est prête ! 🎉**


