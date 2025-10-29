# 🐛 Debug - Video Player Not Showing

## Date : 26 Octobre 2025

---

## 🐛 Problème

L'utilisateur signale : "there is no where to play the video. the content area is just black."

### Observation
- ✅ FFmpeg se charge correctement
- ✅ Les vidéos sont importées (2 clips dans la liste)
- ✅ Le blob URL est créé (visible dans Network tab)
- ❌ La zone vidéo affiche un écran noir
- ❌ Pas de bouton play visible

---

## 🔍 Diagnostic

### Éléments Observés dans l'Image
1. **Badge "Éditeur prêt"** ✅
2. **Clips importés : 2** ✅
3. **Blob URLs dans Network** ✅
4. **Zone noire au lieu de la vidéo** ❌

### Cause Probable
Le `<video>` element ne charge pas correctement le src, ou le src n'est pas défini.

---

## ✅ Corrections Appliquées

### 1. Ajout de Logs Console
```typescript
// Import
console.log('[Import] Setting preview URL:', url);
console.log('[Import] File name:', file.name);
console.log('[Import] File type:', file.type);
console.log('[Import] File size:', file.size);

// Video Element
onLoadStart={() => {
  console.log('[Video] Load start, src:', previewUrl);
  setIsVideoLoading(true);
}}

onLoadedMetadata={() => {
  console.log('[Video] Metadata loaded, duration:', videoRef.current?.duration);
  setIsVideoLoading(false);
}}

onError={(e) => {
  console.error('[Video] Error loading video:', e);
  toast.error('Erreur lors du chargement de la vidéo');
}}
```

### 2. Ajout d'Overlay de Debug
```typescript
{/* Debug Info */}
<div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded z-50">
  <div>URL: {previewUrl.substring(0, 50)}...</div>
  <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
  <div>Loading: {isVideoLoading ? 'Yes' : 'No'}</div>
</div>
```

---

## 🧪 Tests à Effectuer

### Test 1 : Vérifier les Logs
1. Ouvrir la console (F12)
2. Importer une vidéo
3. Regarder les logs :
   ```
   [Import] Setting preview URL: blob:http://localhost:3000/...
   [Import] File name: WhatsApp Video...
   [Import] File type: video/mp4
   [Video] Load start, src: blob:...
   [Video] Metadata loaded, duration: 123.45
   ```

### Test 2 : Vérifier l'Overlay Debug
En haut à gauche de la zone vidéo, vous devriez voir :
- URL (blob:http://...)
- Playing: No/Yes
- Loading: No/Yes

### Test 3 : Vérifier l'État
- Si `Loading: Yes` → Spinner affiché
- Si `URL: undefined` → previewUrl n'est pas défini
- Si `URL: blob:...` mais écran noir → Problème avec le blob ou le format

---

## 🔧 Solutions Selon les Résultats

### Scénario 1 : URL est `undefined`
**Symptôme :** Overlay affiche "URL: undefined..."
**Cause :** `previewUrl` n'est pas défini
**Solution :** Vérifier que `handleFileImport` définit bien `previewUrl`

### Scénario 2 : URL existe mais écran noir
**Symptôme :** URL affichée mais pas de vidéo
**Cause :** Blob URL invalide ou vidéo corrompue
**Solution :** 
1. Vérifier dans Network tab si la requête blob retourne 200
2. Essayer une autre vidéo
3. Vérifier le format (MP4 recommandé)

### Scénario 3 : Loading reste à Yes
**Symptôme :** Spinner infini
**Cause :** La vidéo ne charge jamais
**Solution :**
1. Vérifier la console pour les erreurs
2. Vérifier que `onLoadedMetadata` est appelé
3. Essayer une vidéo plus petite

### Scénario 4 : URL corrompue
**Symptôme :** URL commence par autre chose que "blob:"
**Cause :** File object invalide
**Solution :** Vérifier que `URL.createObjectURL(file)` fonctionne

---

## 📊 Informations à Collecter

Si le problème persiste, fournir :

1. **Console Logs** (F12 → Console)
   - Les logs `[Import]`
   - Les logs `[Video]`
   - Les erreurs éventuelles

2. **Overlay Debug** (visible en haut à gauche)
   - L'URL affichée
   - Les valeurs Playing/Loading

3. **Network Tab**
   - Si le blob URL est chargé (200 OK)
   - La taille du fichier
   - Le Content-Type

4. **Info Vidéo**
   - Format de la vidéo (MP4, MOV, etc.)
   - Taille du fichier
   - Durée

---

## 🎯 Actions Immédiates

1. ⏳ Rafraîchir la page
2. ⏳ Réimporter une vidéo
3. ⏳ Observer l'overlay debug (en haut à gauche)
4. ⏳ Ouvrir la console et lire les logs
5. ⏳ Fournir ces informations

---

**Statut :** 🔍 En attente de logs utilisateur pour diagnostic


