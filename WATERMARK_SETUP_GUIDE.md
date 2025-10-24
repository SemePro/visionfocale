# 🎨 Guide de Configuration du Watermark

## ❗ Problème Actuel

Les nouvelles galeries n'affichent PAS de watermark car **le logo watermark n'existe pas dans Cloudinary**.

Le code est correct, mais Cloudinary ne peut pas appliquer un watermark qui n'existe pas !

---

## ✅ Solution : Uploader le Logo Watermark

### Étape 1 : Préparer votre Logo

**Format recommandé** :
- Format : **PNG avec transparence** (fond transparent)
- Taille : **500px × 500px** minimum
- Nom suggéré : `logo-watermark.png`
- Le logo doit être simple et lisible même en petit

**Exemple de logo** :
- Texte "VisionFocale" stylisé
- Ou votre logo d'entreprise
- Avec fond transparent pour s'intégrer sur toutes les photos

---

### Étape 2 : Uploader dans Cloudinary

#### Option A : Via l'Interface Web (Recommandé)

1. **Connectez-vous à Cloudinary** :
   ```
   https://cloudinary.com/console/media_library
   ```

2. **Créer le dossier watermarks** :
   - Cliquez sur "Upload" en haut à droite
   - Cliquez sur "More" > "Create folder"
   - Créez : `visionFocale/watermarks`

3. **Uploader le logo** :
   - Naviguez vers `visionFocale/watermarks/`
   - Cliquez sur "Upload"
   - Sélectionnez votre fichier `logo-watermark.png`
   - **IMPORTANT** : Renommez le fichier en `logo-watermark` (sans extension)

4. **Vérifier le Public ID** :
   - Cliquez sur l'image uploadée
   - Vérifiez que le "Public ID" est : `visionFocale/watermarks/logo-watermark`
   - Si différent, notez le Public ID exact

#### Option B : Via API

Si vous avez votre logo localement, utilisez cURL :

```bash
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@/path/to/your/logo.png" \
  -F "public_id=visionFocale/watermarks/logo-watermark" \
  -F "upload_preset=YOUR_PRESET" \
  -F "api_key=YOUR_API_KEY"
```

---

### Étape 3 : Vérifier la Configuration

#### Vérifier que le logo est accessible

Remplacez `YOUR_CLOUD_NAME` par votre cloud name Cloudinary et ouvrez cette URL dans votre navigateur :

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/visionFocale/watermarks/logo-watermark.png
```

**Si vous voyez votre logo** ✅ → C'est bon !  
**Si vous voyez une erreur 404** ❌ → Le logo n'existe pas, retournez à l'Étape 2

---

### Étape 4 : Tester le Watermark

#### A. Créer une Nouvelle Galerie

1. Allez sur `http://localhost:3000/admin/galeries/nouvelle`
2. Remplissez le formulaire
3. Uploadez 1-2 photos de test
4. Créez la galerie

#### B. Vérifier le Watermark

1. Ouvrez le lien client de la galerie
2. Authentifiez-vous avec le numéro de téléphone du client
3. **Les photos devraient maintenant avoir votre logo en watermark !**

#### C. Vérifier dans Cloudinary

1. Allez dans `visionFocale/client_photos/` dans Cloudinary
2. Cliquez sur une photo uploadée
3. Dans "Transformations", vous verrez le watermark appliqué

---

## 🔍 Debugging

### Test 1 : Vérifier que le Logo Existe

**Dans votre navigateur**, ouvrez :
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/visionFocale/watermarks/logo-watermark.png
```

**Résultat attendu** : Vous devez voir votre logo  
**Si erreur 404** : Le logo n'existe pas, retournez à l'Étape 2

---

### Test 2 : Tester l'URL du Watermark

**Uploadez une photo test** dans Cloudinary (n'importe où), notez son Public ID (ex: `test_image`)

**Puis ouvrez cette URL** :
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/l_visionFocale:watermarks:logo-watermark,w_150,g_south_east,x_20,y_20,o_70/test_image.jpg
```

**Résultat attendu** : Vous devez voir la photo avec le watermark appliqué  
**Si le watermark n'apparaît pas** : Le Public ID du watermark est incorrect

---

### Test 3 : Vérifier le Public ID dans le Code

Ouvrez la console browser sur une page de galerie client et exécutez :

```javascript
// Ouvrez la console (F12) et tapez :
console.log(process.env.CLOUDINARY_WATERMARK_PUBLIC_ID)
```

**Résultat attendu** : Devrait afficher `visionFocale/watermarks/logo-watermark` (ou votre Public ID custom)

**Si undefined** : La variable d'environnement n'est pas définie

---

## ⚙️ Configuration Avancée

### Changer la Position du Watermark

Dans `lib/cloudinary.ts`, ligne 13 :

```typescript
export const WATERMARK_CONFIG = {
  publicId: process.env.CLOUDINARY_WATERMARK_PUBLIC_ID || 'visionFocale/watermarks/logo-watermark',
  position: 'south_east', // ← CHANGER ICI
  width: 150,              // Largeur en pixels
  opacity: 70,             // Opacité (0-100)
  margin: { x: 20, y: 20 }, // Marges en pixels
};
```

**Positions disponibles** :
- `south_east` = Coin inférieur droit (par défaut)
- `south_west` = Coin inférieur gauche
- `north_east` = Coin supérieur droit
- `north_west` = Coin supérieur gauche
- `center` = Centré

---

### Ajuster la Taille du Watermark

Modifier `width` dans `WATERMARK_CONFIG` :

```typescript
width: 100,  // Petit watermark
width: 150,  // Moyen (par défaut)
width: 200,  // Grand watermark
```

---

### Ajuster l'Opacité

Modifier `opacity` dans `WATERMARK_CONFIG` :

```typescript
opacity: 30,  // Très discret
opacity: 50,  // Discret
opacity: 70,  // Visible (par défaut)
opacity: 90,  // Très visible
```

---

## 📋 Checklist Complète

Avant de créer une nouvelle galerie, vérifiez :

- [ ] **Logo watermark uploadé dans Cloudinary** à `visionFocale/watermarks/logo-watermark`
- [ ] **Logo visible** sur `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/visionFocale/watermarks/logo-watermark.png`
- [ ] **Public ID correct** : `visionFocale/watermarks/logo-watermark`
- [ ] **Serveur redémarré** si vous avez modifié `.env.local`
- [ ] **Test avec une URL de transformation** fonctionne
- [ ] **Nouvelle galerie créée** (pas une ancienne)

---

## 🎯 Résumé Rapide

### Le Problème
❌ Pas de watermark sur les nouvelles galeries

### La Cause
❌ Le logo watermark n'existe pas dans Cloudinary

### La Solution
1. ✅ Uploader `logo-watermark.png` dans `visionFocale/watermarks/` sur Cloudinary
2. ✅ Vérifier que l'URL `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/visionFocale/watermarks/logo-watermark.png` fonctionne
3. ✅ Créer une NOUVELLE galerie (pas utiliser une ancienne)
4. ✅ Le watermark devrait maintenant apparaître !

---

## 💡 Note Importante

**Les galeries existantes ne seront PAS mises à jour automatiquement.**

Le watermark est appliqué uniquement lors de l'upload. Si une photo a déjà été uploadée sans watermark, vous devez :
- Supprimer l'ancienne galerie
- Créer une nouvelle galerie
- Re-uploader les photos

**Ou** créer un script de migration pour régénérer les URLs watermarkées.

---

## 🚨 Problèmes Courants

### "L'icône d'image cassée apparaît dans le modal"

**Cause** : `watermarkedUrl` pointe vers un logo qui n'existe pas

**Solution** : 
1. Uploader le logo dans Cloudinary (Étape 2)
2. Le modal utilisera maintenant `cleanUrl` en fallback
3. Une fois le logo uploadé, les nouvelles galeries auront le watermark

### "Le watermark ne s'affiche toujours pas"

**Vérifications** :
1. Logo existe dans Cloudinary ?
2. Public ID correct (`visionFocale/watermarks/logo-watermark`) ?
3. Nouvelle galerie créée (pas ancienne) ?
4. Browser cache vidé ?

### "Le watermark est trop grand/petit"

**Solution** : Ajuster `width` dans `WATERMARK_CONFIG` (ligne 14 de `lib/cloudinary.ts`)

### "Le watermark est trop visible/discret"

**Solution** : Ajuster `opacity` dans `WATERMARK_CONFIG` (ligne 15 de `lib/cloudinary.ts`)

---

## 🎉 Une Fois Configuré

Une fois le logo watermark uploadé dans Cloudinary :

✅ **Toutes les nouvelles galeries auront automatiquement le watermark**  
✅ **Le watermark sera visible dans la grille et le modal**  
✅ **Les téléchargements seront sans watermark (cleanUrl)**  
✅ **Le zoom fonctionnera dans le modal de prévisualisation**

**Le système est maintenant complètement fonctionnel ! 🎨✨**


