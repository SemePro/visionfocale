# 🧪 Guide de Test - Éditeur Vidéo VisionFocale

## Date : 26 Octobre 2025

---

## 🎯 Objectif

Tester toutes les fonctionnalités de l'éditeur vidéo avec FFmpeg.wasm.

---

## 🚀 Accès

### URL Locale
```
http://localhost:3000/admin/editeur-video
```

### URL Production (Vercel)
```
https://visionfocale.vercel.app/admin/editeur-video
```

---

## ✅ Tests à Effectuer

### 1. Chargement Initial

#### Test 1.1 : Chargement de FFmpeg
- [ ] Ouvrir la page de l'éditeur vidéo
- [ ] Vérifier l'indicateur "Chargement de l'éditeur..." (bleu)
- [ ] Attendre 3-5 secondes
- [ ] Vérifier l'indicateur "Éditeur prêt" (vert)
- [ ] Vérifier le toast "Éditeur vidéo prêt !"

**Résultat attendu :** ✅ FFmpeg se charge et affiche "Éditeur prêt"

---

### 2. Import de Vidéo

#### Test 2.1 : Import MP4
- [ ] Cliquer sur "Importer des Fichiers"
- [ ] Sélectionner une vidéo MP4 courte (30s-2min)
- [ ] Vérifier que la vidéo apparaît dans "Clips Importés"
- [ ] Vérifier que la vidéo est auto-sélectionnée
- [ ] Vérifier que la prévisualisation s'affiche
- [ ] Vérifier le toast "1 fichier(s) importé(s)"
- [ ] Vérifier le toast "Vidéo prête à être éditée !"

**Résultat attendu :** ✅ Vidéo importée et visible dans le lecteur

#### Test 2.2 : Import Autres Formats
- [ ] Tester avec WebM
- [ ] Tester avec MOV
- [ ] Tester avec AVI

**Résultat attendu :** ✅ Tous les formats sont supportés

---

### 3. Lecture Vidéo

#### Test 3.1 : Contrôles de Lecture
- [ ] Cliquer sur le bouton Play (grand bouton central)
- [ ] Vérifier que la vidéo se lit
- [ ] Vérifier l'indicateur "EN LECTURE" (rouge, en haut à droite)
- [ ] Cliquer sur Pause
- [ ] Vérifier que la vidéo se met en pause

**Résultat attendu :** ✅ Lecture/Pause fonctionnent

#### Test 3.2 : Contrôles de Volume
- [ ] Ajuster le volume avec le slider
- [ ] Vérifier que le volume change
- [ ] Cliquer sur le bouton Mute
- [ ] Vérifier que le son est coupé
- [ ] Cliquer à nouveau pour Unmute

**Résultat attendu :** ✅ Volume et Mute fonctionnent

#### Test 3.3 : Timeline
- [ ] Cliquer sur la timeline
- [ ] Vérifier que la vidéo saute à la position cliquée
- [ ] Vérifier que le temps affiché est correct

**Résultat attendu :** ✅ Timeline interactive fonctionne

#### Test 3.4 : Raccourcis Clavier
- [ ] Appuyer sur `Espace` → Play/Pause
- [ ] Appuyer sur `←` → Reculer de 5s
- [ ] Appuyer sur `→` → Avancer de 5s
- [ ] Appuyer sur `M` → Mute/Unmute

**Résultat attendu :** ✅ Tous les raccourcis fonctionnent

---

### 4. Export de Vidéo (PRINCIPAL TEST)

#### Test 4.1 : Export MP4 (1080p)
- [ ] Aller dans l'onglet "Export"
- [ ] Vérifier que le format est "MP4"
- [ ] Vérifier que la qualité est "1080p"
- [ ] Vérifier les informations (Format, Qualité, Durée, Clips)
- [ ] Cliquer sur "Exporter la Vidéo"
- [ ] Vérifier l'overlay de progression
- [ ] Vérifier la barre de progression (0-100%)
- [ ] Attendre la fin du traitement
- [ ] Vérifier que le fichier se télécharge automatiquement
- [ ] Vérifier le toast "Vidéo exportée en mp4 (1080p) !"
- [ ] Ouvrir le fichier téléchargé et vérifier qu'il se lit

**Résultat attendu :** ✅ Export MP4 réussi, vidéo téléchargée et lisible

#### Test 4.2 : Export WebM
- [ ] Changer le format à "WebM"
- [ ] Exporter
- [ ] Vérifier que le fichier .webm se télécharge
- [ ] Vérifier qu'il se lit

**Résultat attendu :** ✅ Export WebM réussi

#### Test 4.3 : Export MOV
- [ ] Changer le format à "MOV"
- [ ] Exporter
- [ ] Vérifier que le fichier .mov se télécharge
- [ ] Vérifier qu'il se lit

**Résultat attendu :** ✅ Export MOV réussi

#### Test 4.4 : Export AVI
- [ ] Changer le format à "AVI"
- [ ] Exporter
- [ ] Vérifier que le fichier .avi se télécharge
- [ ] Vérifier qu'il se lit

**Résultat attendu :** ✅ Export AVI réussi

#### Test 4.5 : Export Différentes Qualités
- [ ] Exporter en 720p
- [ ] Exporter en 480p
- [ ] Comparer les tailles de fichiers (720p < 1080p < 4K)
- [ ] Vérifier que toutes les qualités se lisent

**Résultat attendu :** ✅ Toutes les qualités fonctionnent

---

### 5. Outils de Base

#### Test 5.1 : Découper
- [ ] Sélectionner un clip
- [ ] Positionner la timeline à un moment précis
- [ ] Cliquer sur "Découper"
- [ ] Vérifier que le clip est divisé en deux

**Résultat attendu :** ✅ Découpage fonctionne

#### Test 5.2 : Supprimer
- [ ] Sélectionner un clip
- [ ] Cliquer sur "Supprimer"
- [ ] Vérifier que le clip est supprimé

**Résultat attendu :** ✅ Suppression fonctionne

#### Test 5.3 : Dupliquer
- [ ] Sélectionner un clip
- [ ] Cliquer sur "Dupliquer"
- [ ] Vérifier qu'un nouveau clip apparaît

**Résultat attendu :** ✅ Duplication fonctionne

#### Test 5.4 : Vitesse
- [ ] Sélectionner un clip
- [ ] Cliquer sur "0.5x" (ralenti)
- [ ] Vérifier que la vitesse change
- [ ] Cliquer sur "2x" (rapide)
- [ ] Vérifier que la vitesse change

**Résultat attendu :** ✅ Changement de vitesse fonctionne

---

### 6. Outils Avancés

#### Test 6.1 : Rotation
- [ ] Sélectionner un clip
- [ ] Aller dans l'onglet "Advanced"
- [ ] Cliquer sur "90°"
- [ ] Vérifier que la rotation est appliquée

**Résultat attendu :** ✅ Rotation fonctionne

---

### 7. Tests de Performance

#### Test 7.1 : Vidéo Courte (30s)
- [ ] Importer une vidéo de 30 secondes
- [ ] Exporter en MP4 1080p
- [ ] Noter le temps de traitement

**Résultat attendu :** ✅ Export en ~5-10 secondes

#### Test 7.2 : Vidéo Moyenne (2min)
- [ ] Importer une vidéo de 2 minutes
- [ ] Exporter en MP4 1080p
- [ ] Noter le temps de traitement

**Résultat attendu :** ✅ Export en ~20-40 secondes

#### Test 7.3 : Vidéo Longue (5min)
- [ ] Importer une vidéo de 5 minutes
- [ ] Exporter en MP4 1080p
- [ ] Noter le temps de traitement

**Résultat attendu :** ✅ Export en ~1-2 minutes

---

### 8. Tests d'Erreur

#### Test 8.1 : Export Sans Vidéo
- [ ] Aller dans l'onglet "Export" sans importer de vidéo
- [ ] Vérifier le message "⚠️ Importez une vidéo pour pouvoir l'exporter"
- [ ] Vérifier que le bouton "Exporter" est désactivé

**Résultat attendu :** ✅ Message d'avertissement affiché

#### Test 8.2 : Export Avant Chargement FFmpeg
- [ ] Rafraîchir la page
- [ ] Essayer d'exporter immédiatement (avant que FFmpeg soit chargé)
- [ ] Vérifier le toast "FFmpeg n'est pas encore chargé. Veuillez patienter..."

**Résultat attendu :** ✅ Message d'erreur approprié

---

### 9. Tests de Compatibilité

#### Test 9.1 : Navigateurs Desktop
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (si disponible)

**Résultat attendu :** ✅ Fonctionne sur tous les navigateurs modernes

#### Test 9.2 : Navigateurs Mobile
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

**Résultat attendu :** ⚠️ Peut être lent sur mobile

---

## 📊 Résumé des Tests

### Tests Critiques (OBLIGATOIRES)
1. ✅ Chargement de FFmpeg
2. ✅ Import de vidéo MP4
3. ✅ Lecture vidéo
4. ✅ Export MP4 1080p
5. ✅ Téléchargement du fichier exporté

### Tests Importants
6. ✅ Export autres formats (WebM, MOV, AVI)
7. ✅ Export autres qualités (720p, 480p)
8. ✅ Contrôles de lecture (volume, timeline)
9. ✅ Raccourcis clavier

### Tests Optionnels
10. ⏳ Outils de base (découper, supprimer, dupliquer)
11. ⏳ Outils avancés (rotation, recadrage)
12. ⏳ Tests de performance
13. ⏳ Tests de compatibilité

---

## 🐛 Rapport de Bugs

Si vous rencontrez des problèmes :

### Format du Rapport
```
**Navigateur :** Chrome 120
**Système :** macOS 14.1
**Vidéo testée :** test.mp4 (1min30, 50MB)
**Action :** Export MP4 1080p
**Erreur :** "Erreur lors de l'export de la vidéo"
**Console :** [Copier les logs de la console]
```

### Logs Importants
Ouvrir la console du navigateur (F12) et chercher :
- `[FFmpeg]` - Logs de FFmpeg
- `Setting preview URL:` - Import de vidéo
- `Erreur lors de` - Messages d'erreur

---

## ✅ Validation Finale

### Critères de Succès
- [x] FFmpeg se charge en moins de 10 secondes
- [ ] Import de vidéo fonctionne (MP4 minimum)
- [ ] Lecture vidéo fonctionne (play/pause)
- [ ] Export MP4 fonctionne
- [ ] Fichier exporté se télécharge
- [ ] Fichier exporté est lisible
- [ ] Barre de progression s'affiche
- [ ] Pas d'erreurs console critiques

### Si Tous les Tests Passent
✅ **L'éditeur vidéo est prêt pour la production !**

### Si Certains Tests Échouent
⚠️ **Identifier et corriger les problèmes avant déploiement**

---

## 📝 Notes de Test

### Test 1 (Date : _______)
**Testeur :** ___________
**Navigateur :** ___________
**Résultat :** ✅ / ⚠️ / ❌

**Commentaires :**
```
[Vos notes ici]
```

---

## 🎉 Conclusion

Une fois tous les tests critiques validés, l'éditeur vidéo est **prêt pour la production** !

**Prochaines étapes :**
1. ✅ Valider tous les tests critiques
2. ✅ Corriger les bugs identifiés
3. ✅ Déployer sur Vercel
4. ✅ Tester en production
5. ✅ Collecter les retours utilisateurs

---

**Bon test ! 🚀**


