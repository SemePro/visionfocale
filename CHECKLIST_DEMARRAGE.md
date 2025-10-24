# ✅ Checklist Démarrage VisionFocale

## 🎯 3 Étapes pour Tester en 5 Minutes

### ☑️ Étape 1 : MongoDB Local

```bash
# Installer MongoDB (Mac)
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb-community
```

✅ **Déjà configuré** : `MONGODB_URI=mongodb://localhost:27017/visionfocale`

---

### ☑️ Étape 2 : Cloudinary

1. Allez sur https://cloudinary.com
2. Créez un compte gratuit
3. Dashboard → **Account Details**
4. Copiez les 3 valeurs

**Éditez `.env.local` :**

```bash
nano .env.local
```

**Remplacez ces 3 lignes :**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name_ici
CLOUDINARY_API_KEY=votre_api_key_ici
CLOUDINARY_API_SECRET=votre_api_secret_ici
```

---

### ☑️ Étape 3 : NextAuth Secret

```bash
# Générer une clé secrète
openssl rand -base64 32
```

**Copiez le résultat et mettez-le dans `.env.local` :**

```env
NEXTAUTH_SECRET=le_resultat_ici
```

---

## 🚀 Lancer l'Application

```bash
# Redémarrer le serveur (important!)
npm run dev
```

## ✅ Vérifications

1. http://localhost:3000 → Homepage avec logo
2. http://localhost:3000/admin → Dashboard admin
3. http://localhost:3000/api/galleries → `[]` (pas d'erreur)

---

## 📝 Résumé Rapide

| Variable | Obligatoire | Où l'obtenir |
|----------|-------------|--------------|
| `MONGODB_URI` | ✅ Oui | MongoDB local ou Atlas |
| `CLOUDINARY_*` (3) | ✅ Oui | cloudinary.com/console |
| `NEXTAUTH_SECRET` | ✅ Oui | `openssl rand -base64 32` |
| `TWILIO_*` | ⚠️ Plus tard | twilio.com (pour SMS) |
| `WHATSAPP_*` | ⚠️ Optionnel | business.facebook.com |

---

## 🎉 Vous êtes prêt quand :

- [ ] MongoDB tourne (`brew services list`)
- [ ] 3 variables Cloudinary remplies dans `.env.local`
- [ ] `NEXTAUTH_SECRET` généré et ajouté
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Aucune erreur dans le terminal

---

**Documentation complète** : Voir `SETUP_ENV.md` et `DEMARRAGE_RAPIDE_ENV.md`


