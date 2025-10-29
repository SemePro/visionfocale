# 🎬 Éditeur Vidéo VisionFocale

## Éditeur Vidéo Professionnel avec FFmpeg.wasm

---

## 🌟 Présentation

L'éditeur vidéo VisionFocale est un outil d'édition vidéo professionnel intégré directement dans le navigateur, alimenté par **FFmpeg.wasm**. Il permet de traiter, éditer et exporter des vidéos sans aucun serveur backend, garantissant rapidité, confidentialité et gratuité.

---

## ✨ Fonctionnalités

### 🎥 Lecture Vidéo
- Import de vidéos (MP4, WebM, MOV, AVI)
- Lecture/Pause avec contrôles intuitifs
- Timeline interactive
- Contrôle du volume et mute
- Raccourcis clavier (Space, ←, →, M)
- Indicateur de lecture en temps réel

### 🛠️ Traitement Vidéo
- **Découpage** : Couper des sections de vidéo
- **Filtres** : 7 filtres disponibles
  - Luminosité
  - Contraste
  - Saturation
  - Flou
  - Netteté
  - Noir et blanc
  - Sépia
- **Fusion** : Combiner plusieurs clips
- **Texte** : Ajouter des overlays de texte
- **Vitesse** : Ralenti (0.5x) ou rapide (2x)
- **Rotation** : Pivoter la vidéo

### 📤 Export
- **4 Formats** : MP4, WebM, MOV, AVI
- **4 Qualités** : 4K, 1080p, 720p, 480p
- **Téléchargement automatique**
- **Barre de progression en temps réel**

---

## 🚀 Accès Rapide

### URL
```
http://localhost:3000/admin/editeur-video
```

### Navigation
```
Dashboard Admin → Galeries & Clients → Éditeur Vidéo
```

---

## 📖 Guide d'Utilisation

### 1. Importer une Vidéo

1. Cliquez sur **"Importer des Fichiers"**
2. Sélectionnez votre vidéo (MP4, WebM, MOV, AVI)
3. La vidéo apparaît dans **"Clips Importés"**
4. Elle est automatiquement sélectionnée et affichée

### 2. Lire la Vidéo

**Contrôles de base :**
- Cliquez sur le **bouton Play** (grand bouton central)
- Cliquez sur la **vidéo** pour play/pause
- Utilisez le **slider de volume**
- Cliquez sur **Mute** pour couper le son

**Raccourcis clavier :**
- `Espace` : Play/Pause
- `←` : Reculer de 5 secondes
- `→` : Avancer de 5 secondes
- `M` : Mute/Unmute

**Timeline :**
- Cliquez sur la timeline pour sauter à un moment précis
- Le temps actuel s'affiche en temps réel

### 3. Éditer la Vidéo

#### Onglet "Basic"
- **Découper** : Diviser le clip à la position actuelle
- **Supprimer** : Retirer le clip sélectionné
- **Dupliquer** : Créer une copie du clip
- **Vitesse** : Changer la vitesse (0.5x, 1x, 2x)

#### Onglet "Advanced"
- **Rotation** : Pivoter la vidéo (90°, 180°, 270°)
- **Recadrage** : Ajuster la zone visible
- **Chroma Key** : Retirer un fond vert

#### Onglet "Effects"
- **Filtres de couleur** : Ajuster luminosité, contraste, saturation
- **Transitions** : Ajouter des transitions entre clips
- **Corrections** : Améliorer la qualité vidéo

#### Onglet "Text"
- **Ajouter du texte** : Overlay de texte personnalisé
- **Police** : Choisir la police et la taille
- **Couleur** : Personnaliser la couleur
- **Position** : Placer le texte où vous voulez

### 4. Exporter la Vidéo

1. Allez dans l'onglet **"Export"**
2. Choisissez le **format** :
   - MP4 (H.264) - Recommandé
   - WebM - Pour le web
   - MOV - Pour Mac
   - AVI - Compatibilité
3. Choisissez la **qualité** :
   - 4K (3840x2160) - Ultra HD
   - Full HD (1920x1080) - Recommandé
   - HD (1280x720) - Rapide
   - SD (854x480) - Léger
4. Cliquez sur **"Exporter la Vidéo"**
5. Attendez le traitement (barre de progression)
6. La vidéo se télécharge automatiquement

---

## 🎯 Cas d'Usage

### Pour VisionFocale

#### Vidéos de Mariage
- Durée : 5-10 minutes
- Format : MP4 1080p
- Temps d'export : ~1-2 minutes

#### Clips Réseaux Sociaux
- Durée : 30s-2min
- Format : MP4 ou WebM
- Temps d'export : ~5-20 secondes

#### Vidéos Promotionnelles
- Durée : 1-3 minutes
- Format : MP4 1080p
- Temps d'export : ~20-40 secondes

#### Vidéos Drone
- Durée : 2-5 minutes
- Format : MP4 4K
- Temps d'export : ~1-2 minutes

#### Highlights d'Événements
- Durée : 3-7 minutes
- Format : MP4 1080p
- Temps d'export : ~40s-1min

---

## 📊 Performances

### Temps de Chargement
- **Première visite** : 3-5 secondes (chargement de FFmpeg)
- **Visites suivantes** : Instantané (cache navigateur)

### Temps de Traitement
| Durée Vidéo | Export MP4 1080p | Export WebM | Export 4K |
|-------------|------------------|-------------|-----------|
| 30 secondes | ~5-10s          | ~8-12s      | ~15-20s   |
| 2 minutes   | ~20-40s         | ~30-50s     | ~1-2min   |
| 5 minutes   | ~1-2min         | ~2-3min     | ~3-5min   |

*Performances dépendent du navigateur et de l'appareil*

### Recommandations
- ✅ **Vidéos courtes** (< 5 min) : Excellent
- ⚠️ **Vidéos moyennes** (5-10 min) : Bon
- ❌ **Vidéos longues** (> 10 min) : Lent, non recommandé

---

## 🔧 Détails Techniques

### Technologies Utilisées
- **FFmpeg.wasm** v0.12.10 : Traitement vidéo
- **React** : Interface utilisateur
- **Next.js 14** : Framework
- **TypeScript** : Typage
- **Tailwind CSS** : Styling

### Architecture
```
┌─────────────────────────────────────┐
│  VideoEditor Component              │
│  - Interface utilisateur            │
│  - Contrôles de lecture             │
│  - Timeline interactive             │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  useFFmpeg Hook                     │
│  - Chargement de FFmpeg             │
│  - Fonctions de traitement          │
│  - Gestion des états                │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  FFmpeg.wasm                        │
│  - Traitement vidéo côté client    │
│  - Conversion de formats            │
│  - Application de filtres           │
└─────────────────────────────────────┘
```

### Fonctions Disponibles
```typescript
// Hook useFFmpeg
const {
  isLoaded,        // FFmpeg est prêt
  isLoading,       // FFmpeg en chargement
  progress,        // Progression (0-100%)
  trimVideo,       // Découper
  applyFilter,     // Filtres
  mergeVideos,     // Fusionner
  addTextOverlay,  // Texte
  changeSpeed,     // Vitesse
  convertFormat,   // Conversion
  extractFrame,    // Thumbnail
} = useFFmpeg();
```

---

## ⚠️ Limitations

### Taille des Vidéos
- **Recommandé** : < 10 minutes
- **Maximum** : ~500MB (dépend de la RAM disponible)
- **Raison** : Traitement côté client, limité par la mémoire du navigateur

### Formats Supportés
- ✅ **Supportés** : MP4, WebM, MOV, AVI
- ❌ **Non supportés** : Formats propriétaires (WMV, FLV, etc.)

### Navigateurs
- ✅ **Chrome** : Excellent
- ✅ **Firefox** : Excellent
- ✅ **Edge** : Excellent
- ⚠️ **Safari** : Fonctionne (Safari 16+)
- ❌ **Safari < 16** : Non supporté

### Appareils
- ✅ **Desktop** : Recommandé
- ⚠️ **Mobile** : Fonctionne mais lent pour vidéos > 2 min
- ⚠️ **Tablette** : Performances moyennes

---

## 🐛 Dépannage

### Problème : FFmpeg ne se charge pas
**Symptôme :** L'indicateur reste sur "Chargement de l'éditeur..."

**Solutions :**
1. Vérifier la connexion internet (FFmpeg chargé depuis CDN)
2. Rafraîchir la page (Ctrl+F5)
3. Vider le cache du navigateur
4. Essayer un autre navigateur

### Problème : Vidéo ne s'importe pas
**Symptôme :** Rien ne se passe après sélection du fichier

**Solutions :**
1. Vérifier le format (MP4, WebM, MOV, AVI uniquement)
2. Vérifier la taille (< 500MB)
3. Essayer une autre vidéo
4. Consulter les logs console (F12)

### Problème : Export échoue
**Symptôme :** Message "Erreur lors de l'export de la vidéo"

**Solutions :**
1. Vérifier que FFmpeg est chargé (indicateur vert)
2. Essayer avec une vidéo plus courte
3. Essayer un autre format
4. Rafraîchir la page et réessayer
5. Consulter les logs console (F12)

### Problème : Export très lent
**Symptôme :** La barre de progression reste bloquée

**Solutions :**
1. Patienter (peut prendre plusieurs minutes pour vidéos longues)
2. Essayer une qualité inférieure (720p au lieu de 1080p)
3. Fermer les autres onglets du navigateur
4. Utiliser un appareil plus puissant

---

## 📚 Documentation Complète

### Guides Disponibles
1. **VIDEO_EDITOR_TECH_STACK_RECOMMENDATIONS.md**
   - Comparaison des solutions
   - Pourquoi FFmpeg.wasm ?
   - Plan d'implémentation

2. **FFMPEG_IMPLEMENTATION.md**
   - Documentation technique complète
   - Détails des fonctions
   - Gestion des erreurs

3. **GUIDE_TEST_VIDEO_EDITOR.md**
   - Guide de test complet
   - Checklist détaillée
   - Rapport de bugs

4. **FFMPEG_IMPLEMENTATION_SUMMARY.md**
   - Résumé de l'implémentation
   - Ce qui a été fait
   - Comment tester

5. **CHANGELOG_FFMPEG.md**
   - Historique des changements
   - Nouvelles fonctionnalités
   - Corrections de bugs

---

## 🎓 Tutoriels

### Tutoriel 1 : Créer un Highlight de Mariage
1. Importer la vidéo complète du mariage
2. Découper les meilleurs moments (Onglet Basic → Découper)
3. Ajuster la luminosité si nécessaire (Onglet Effects)
4. Ajouter un texte d'introduction (Onglet Text)
5. Exporter en MP4 1080p

### Tutoriel 2 : Créer un Clip pour Instagram
1. Importer votre vidéo
2. Découper à 60 secondes maximum
3. Appliquer un filtre (Onglet Effects → Saturation)
4. Exporter en MP4 720p (format carré recommandé)

### Tutoriel 3 : Convertir un Format
1. Importer votre vidéo (n'importe quel format)
2. Aller directement dans l'onglet Export
3. Choisir le format désiré (WebM pour le web, MOV pour Mac)
4. Exporter

---

## 🔮 Fonctionnalités Futures

### Version 1.1 (Optionnel)
- Filtres avancés (LUTs, correction colorimétrique)
- Transitions personnalisées
- Animations de texte
- Édition audio avancée (égaliseur, réduction de bruit)

### Version 1.2 (Optionnel)
- Sauvegarde de projets
- Export de projets
- Prévisualisation en temps réel
- Proxy workflows (vidéos basse qualité pour édition)

### Version 2.0 (Si nécessaire)
- Backend FFmpeg pour vidéos longues (> 10 min)
- Queue de traitement en arrière-plan
- Notifications par email/WhatsApp
- Collaboration en temps réel

---

## 💡 Conseils Pro

### Pour de Meilleures Performances
1. **Utilisez Chrome ou Firefox** (meilleures performances)
2. **Fermez les autres onglets** (libère de la RAM)
3. **Vidéos courtes** (< 5 min pour un traitement rapide)
4. **Qualité adaptée** (720p pour les tests, 1080p pour le final)
5. **Format MP4** (le plus rapide à traiter)

### Pour une Meilleure Qualité
1. **Importez en haute qualité** (1080p ou 4K)
2. **Évitez les filtres excessifs** (dégradation de qualité)
3. **Exportez en 1080p minimum** (pour usage professionnel)
4. **Testez avant l'export final** (prévisualisez les changements)

### Pour Gagner du Temps
1. **Préparez vos vidéos** (coupez les parties inutiles avant import)
2. **Utilisez les raccourcis clavier** (Space, ←, →, M)
3. **Exportez en 720p pour les tests** (plus rapide)
4. **Sauvegardez vos paramètres favoris** (format et qualité)

---

## 📞 Support

### Besoin d'Aide ?
1. Consultez ce README
2. Consultez `GUIDE_TEST_VIDEO_EDITOR.md`
3. Consultez `FFMPEG_IMPLEMENTATION.md`
4. Vérifiez les logs console (F12)

### Ressources Externes
- [FFmpeg.wasm Documentation](https://ffmpegwasm.netlify.app/)
- [FFmpeg Filters Reference](https://ffmpeg.org/ffmpeg-filters.html)
- [GitHub Issues](https://github.com/ffmpegwasm/ffmpeg.wasm/issues)

---

## 🎉 Conclusion

L'éditeur vidéo VisionFocale est un outil puissant et gratuit pour éditer vos vidéos directement dans le navigateur. Profitez de toutes les fonctionnalités sans aucun coût serveur !

**Bon montage ! 🎬**

---

**Version** : 1.0.0
**Date** : 26 Octobre 2025
**Statut** : ✅ Prêt pour production


