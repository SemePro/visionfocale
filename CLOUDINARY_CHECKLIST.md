# ✅ Cloudinary - Checklist Rapide

## 📋 À Faire Maintenant dans Cloudinary

### ⏸️ Étape 1 : Upload du Logo (OBLIGATOIRE)

1. **Connectez-vous** : https://cloudinary.com/console
2. **Allez dans** : Media Library
3. **Créez** : Le dossier `visionFocale/watermarks/`
4. **Uploadez** : Votre logo
   - Format : PNG avec transparence (recommandé)
   - Taille : 200x200px minimum
   - Nom : `logo-watermark`
5. **Vérifiez** : Le Public ID doit être `visionFocale/watermarks/logo-watermark`

**⚠️ IMPORTANT** : Sans ce logo, le watermark ne fonctionnera pas !

---

### 🔧 Étape 2 : Créer Upload Preset (Optionnel)

Si vous voulez que Cloudinary applique le watermark automatiquement :

1. **Settings** → **Upload** → **Upload presets**
2. **Add upload preset**
3. **Nom** : `visionfocale_client_photos`
4. **Folder** : `visionFocale/client-galleries`
5. **Transformation** :
   ```
   l_visionFocale:watermarks:logo-watermark,g_south_east,x_20,y_20,w_150,o_70/c_limit,h_2000,w_2000,q_auto:good,f_auto
   ```

**Note** : Cette étape est optionnelle. Le code applique déjà le watermark.

---

## ✅ Ce Qui Est Déjà Fait

- ✅ `.env.local` configuré avec vos credentials
- ✅ Code mis à jour pour utiliser le watermark logo
- ✅ Variables d'environnement ajoutées
- ✅ Documentation créée

---

## 🚀 Après Upload du Logo

1. **Redémarrez le serveur** :
   ```bash
   # Dans le terminal, faites Ctrl+C puis :
   npm run dev
   ```

2. **Testez l'upload** :
   - http://localhost:3000/admin/galeries/nouvelle
   - Uploadez une photo de test
   - Vérifiez que le logo apparaît en bas à droite

3. **Si le watermark n'apparaît pas** :
   - Vérifiez le Public ID du logo dans Cloudinary
   - Assurez-vous qu'il est exactement : `visionFocale/watermarks/logo-watermark`
   - Redémarrez le serveur

---

## 📚 Documentation

- **`CLOUDINARY_SETUP.md`** : Guide détaillé complet
- **`CLOUDINARY_TEST.md`** : Comment tester l'upload
- **`CLOUDINARY_RESUME.md`** : Résumé de la configuration

---

## 🎯 Prêt à Tester ?

Une fois le logo uploadé dans Cloudinary :
1. Redémarrez le serveur
2. Allez sur http://localhost:3000/admin/galeries/nouvelle
3. Uploadez une photo
4. Magie ! 🎉

---

**Questions ? Consultez `CLOUDINARY_SETUP.md` pour plus de détails ! 📸**


