# ✅ Configuration WhatsApp Only (Sans Twilio)

## 🎯 Changements à faire dans votre `.env.local`

### ❌ À SUPPRIMER (Variables Twilio - Non utilisées)

Vous pouvez supprimer ou commenter ces lignes dans `.env.local` :

```env
# TWILIO_ACCOUNT_SID=xxx
# TWILIO_AUTH_TOKEN=xxx
# TWILIO_PHONE_NUMBER=xxx
# SMS_PROVIDER=twilio

# AFRICASTALKING_USERNAME=xxx
# AFRICASTALKING_API_KEY=xxx
# AFRICASTALKING_SHORTCODE=xxx
```

---

### ✅ À GARDER/AJOUTER (Variables WhatsApp - Nécessaires)

Assurez-vous d'avoir ces lignes dans `.env.local` :

```env
# ----------------------------------------------
# 💬 WhatsApp Business (REQUIS pour OTP)
# ----------------------------------------------
WHATSAPP_BUSINESS_NUMBER=+22890123456
WHATSAPP_API_TOKEN=your_whatsapp_api_token

# Si vous utilisez WhatsApp Cloud API officiel
WHATSAPP_BUSINESS_PHONE_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

---

## 📱 Comment Obtenir WhatsApp API

### Option 1 : WhatsApp Business API (Officiel - Gratuit mais complexe)

**Étapes :**

1. **Créer un Business Manager Facebook**
   - Allez sur : https://business.facebook.com
   - Créez un compte business

2. **Ajouter WhatsApp Business**
   - Business Settings → Accounts → WhatsApp Accounts
   - Cliquez "Add"
   - Suivez les étapes

3. **Obtenir les credentials**
   - Phone Number ID : Dans WhatsApp Manager
   - Access Token : Dans Business Settings → System Users → Generate Token
   - Verify Token : Créez votre propre string (ex: `visionfocale_verify_123`)

4. **Configuration dans `.env.local`**
   ```env
   WHATSAPP_BUSINESS_NUMBER=+22890123456
   WHATSAPP_BUSINESS_PHONE_ID=123456789012345
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxx
   WHATSAPP_VERIFY_TOKEN=visionfocale_verify_123
   ```

**Prix :** Gratuit (1000 conversations/mois)

---

### Option 2 : WAAPI.app (Recommandé - Plus Simple)

**Étapes :**

1. **Créer un compte**
   - Allez sur : https://waapi.app
   - Créez un compte

2. **Connecter WhatsApp**
   - Dashboard → Add Instance
   - Scannez le QR code avec votre WhatsApp

3. **Obtenir l'API Key**
   - Dashboard → API Key
   - Copiez votre API Key

4. **Configuration dans `.env.local`**
   ```env
   WHATSAPP_BUSINESS_NUMBER=+22890123456
   WHATSAPP_API_TOKEN=your_waapi_token_here
   ```

**Prix :** Gratuit jusqu'à 1000 messages/mois

---

### Option 3 : Twilio WhatsApp API (Alternative)

**Étapes :**

1. **Créer compte Twilio**
   - https://www.twilio.com/try-twilio
   - $15 crédit gratuit

2. **Activer WhatsApp Sandbox**
   - Console Twilio → Messaging → Try it out → Send a WhatsApp message
   - Envoyez "join [code]" au numéro Twilio

3. **Configuration dans `.env.local`**
   ```env
   WHATSAPP_BUSINESS_NUMBER=+14155238886
   WHATSAPP_API_TOKEN=your_twilio_auth_token
   ```

**Prix :** $0.005/message (très bon marché)

---

## 🎯 Résumé Configuration Minimale

### Pour tester MAINTENANT (sans vrai WhatsApp) :

**Ne changez rien !** Le code fonctionne en mode DEV sans WhatsApp configuré.

Vous verrez dans le terminal :
```
💬 [DEV MODE] WhatsApp simulé:
   À: +228XXXXXXXX
   Message: 🔐 VisionFocale - Code de Vérification...
```

---

### Pour PRODUCTION (avec vrai WhatsApp) :

**Choisissez une des 3 options ci-dessus** et configurez les variables correspondantes.

Je recommande **WAAPI.app** car :
- ✅ Configuration en 5 minutes
- ✅ Pas besoin de Business Manager Facebook
- ✅ 1000 messages gratuits/mois
- ✅ Interface simple

---

## 📝 Variables Obligatoires par Priorité

### 🔴 Minimum pour tester (Aujourd'hui)

```env
MONGODB_URI=mongodb://localhost:27017/visionfocale
NEXTAUTH_SECRET=(généré avec openssl)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

→ Le site fonctionne ! WhatsApp en mode DEV

---

### 🟡 Pour galeries clients en production

Ajoutez **une des options WhatsApp** ci-dessus.

---

## 🔧 Ce Qui a Changé dans le Code

✅ **Modifié automatiquement :**

1. `lib/whatsapp.ts` - Ajout fonction `sendOTPWhatsApp()`
2. `lib/sms.ts` - Redirige maintenant vers WhatsApp pour OTP
3. Code compatible backward (fonctionne en DEV sans config)

❌ **Rien à faire de votre côté** - Le code est déjà prêt !

---

## 🚀 Test Rapide

### Sans WhatsApp configuré :

```bash
# Lancez l'app
npm run dev

# Ouvrez : http://localhost:3001
# Tout fonctionne, les OTP sont simulés dans le terminal
```

### Avec WhatsApp configuré :

Les codes OTP seront envoyés par WhatsApp au lieu de console.log !

---

## 💡 Recommandation

**Ne configurez pas WhatsApp maintenant** si vous voulez juste tester le site.

**Configurez WhatsApp** quand vous êtes prêt à :
- Tester les galeries clients
- Envoyer des vrais codes OTP
- Notifier les clients

---

## 🆘 Questions Fréquentes

### Q: Je dois obligatoirement configurer WhatsApp ?

**R:** Non ! Le site fonctionne en mode DEV sans WhatsApp. Les codes OTP s'affichent dans le terminal.

### Q: Quelle option WhatsApp choisir ?

**R:** 
- **WAAPI.app** : Le plus simple
- **Officiel Facebook** : Gratuit mais complexe
- **Twilio WhatsApp** : Payant mais très fiable

### Q: Combien ça coûte ?

**R:**
- WAAPI.app : Gratuit (1000 msg/mois)
- Facebook : Gratuit (1000 conversations/mois)
- Twilio : $0.005/message

### Q: Puis-je utiliser mon WhatsApp personnel ?

**R:** Oui avec WAAPI.app ! Mais recommandé d'avoir un numéro business séparé.

---

## ✅ Checklist

Pour TESTER :
- [ ] MongoDB démarré
- [ ] Cloudinary configuré
- [ ] NextAuth secret généré
- [ ] Site accessible sur localhost:3001

Pour PRODUCTION :
- [ ] Option WhatsApp choisie
- [ ] Variables WhatsApp configurées
- [ ] Test d'envoi OTP réussi

---

**Prochaine étape** : Testez d'abord sans WhatsApp. Configurez-le quand vous êtes prêt ! 🚀


