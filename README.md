# 🌌 Quantum Self AI - Application Révolutionnaire

Une expérience immersive pour converser avec toutes vos versions quantiques grâce à l'IA hybride avec authentification Supabase et traductions automatiques Lingo.dev.

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration des APIs
Copiez `.env.example` vers `.env` et ajoutez vos clés API :

```bash
cp .env.example .env
```

**APIs Principales (Obligatoires) :**
- **Supabase** (base de données et auth) : https://supabase.com/dashboard
- **Lingo.dev** (traductions automatiques) : https://lingo.dev/dashboard

**APIs Complémentaires :**
- **Gemini AI** (gratuit) : https://makersuite.google.com/app/apikey
- **ElevenLabs** (conversational AI) : https://elevenlabs.io/app/settings/api-keys
- **Tavus** (avatars) : https://tavusapi.com/
- **Stripe** (paiements) : https://dashboard.stripe.com/apikeys

### 3. Configuration Supabase
1. Créez un projet sur https://supabase.com/dashboard
2. Allez dans Settings > API et copiez l'URL et la clé anon
3. Cliquez sur "Connect to Supabase" dans l'interface Bolt
4. Les migrations se lanceront automatiquement

### 4. Configuration Lingo.dev
1. Créez un compte sur https://lingo.dev/dashboard
2. Créez un nouveau projet
3. Obtenez votre API key et Project ID
4. Ajoutez-les dans votre fichier `.env`

### 5. Lancement
```bash
npm run dev
```

L'application sera accessible sur : http://localhost:5173

## 🎯 Architecture Complète

### 🔐 Authentification Supabase (Principal)
- **Inscription/Connexion** : Email + mot de passe sécurisé
- **Profils utilisateurs** : Données complètes avec questionnaires et analyses
- **Versions quantiques** : Stockage des personnalités IA personnalisées
- **Conversations** : Historique complet avec messages et métadonnées
- **Insights** : Génération et stockage des conseils personnalisés
- **Paramètres** : Préférences utilisateur et configuration
- **Météo émotionnelle** : Suivi de l'état émotionnel dans le temps

### 🌍 Traductions Automatiques Lingo.dev (Principal)
- **Traduction en temps réel** : Tout le contenu traduit automatiquement
- **10+ langues supportées** : Français, Anglais, Espagnol, Allemand, etc.
- **Détection automatique** : Langue du navigateur détectée
- **Observation DOM** : Nouveau contenu traduit automatiquement
- **Cache intelligent** : Optimisation des performances
- **Fallback intégré** : Traductions de base si API indisponible

### 🧠 Gemini AI avec RAG (Complémentaire)
- **Conversations intelligentes** : Réponses contextuelles et personnalisées
- **RAG (Retrieval-Augmented Generation)** : Contexte Quantum Self AI intégré
- **Base de connaissances** : Informations sur l'app, versions quantiques, fonctionnalités
- **Contrôle des conversations** : Garde les discussions dans l'univers Quantum Self AI
- **Gratuit** : API Google AI Studio gratuite

### 🎤 ElevenLabs Client Officiel (Complémentaire)
- **Client JavaScript officiel** : `@elevenlabs/elevenlabs-js`
- **Clonage vocal personnalisé** : Votre voix unique pour chaque version quantique
- **Agents conversationnels** : IA qui comprend et répond naturellement
- **Réponses audio en temps réel** : Conversations vocales fluides
- **Fallback intelligent** : Bascule vers Gemini si ElevenLabs indisponible

## 🔧 Base de Données Supabase

### Tables Principales
- **profiles** : Profils utilisateurs étendus avec données biométriques
- **quantum_versions** : Versions quantiques personnalisées par utilisateur
- **conversations** : Historique des conversations
- **messages** : Messages individuels avec métadonnées
- **insights** : Insights générés par l'IA
- **user_settings** : Paramètres et préférences
- **emotional_weather** : Suivi de l'état émotionnel

### Sécurité
- **RLS (Row Level Security)** : Activé sur toutes les tables
- **Politiques d'accès** : Chaque utilisateur accède uniquement à ses données
- **Authentification sécurisée** : Gestion des sessions et tokens
- **Triggers automatiques** : Création automatique des profils et données par défaut

## 🌍 Fonctionnalités Multilingues

### Langues Supportées
- 🇫🇷 Français (par défaut)
- 🇺🇸 English
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇵🇹 Português
- 🇷🇺 Русский
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇨🇳 中文

### Traduction Automatique
- **Contenu complet** : Tous les textes, boutons, placeholders, etc.
- **Temps réel** : Traduction instantanée lors du changement de langue
- **Persistance** : Langue sauvegardée dans le profil utilisateur
- **Optimisée** : Cache et requêtes par lots pour les performances

## 🧪 Guide de Test

### 1. Authentification
- Créez un compte avec email/mot de passe
- Testez la connexion/déconnexion
- Vérifiez la persistance de session
- Testez la réinitialisation de mot de passe

### 2. Traductions
- Changez de langue avec le sélecteur
- Vérifiez que tout le contenu est traduit
- Testez sur différentes pages
- Vérifiez la sauvegarde de la langue

### 3. Onboarding
- **Étape 1** : Entrez votre nom
- **Étape 2** : Uploadez une photo (analyse Pica simulée)
- **Étape 3** : **Enregistrez votre voix (10 secondes)** - Clonage ElevenLabs
- **Étape 4** : Répondez au questionnaire psychologique
- **Étape 5** : Sélectionnez vos versions quantiques

### 4. Dashboard
- Explorez la timeline quantique circulaire
- Consultez votre météo émotionnelle
- Cliquez sur "Conversation du Jour"
- Vérifiez les statistiques et insights

### 5. Chat avec IA Hybride
- Sélectionnez une version quantique
- Testez les conversations avec Gemini AI + RAG
- **Questions sur l'app** : "Comment fonctionne Quantum Self AI ?"
- **Activez/désactivez l'audio** avec le bouton volume
- Utilisez les questions suggérées
- Testez le mode vocal avec reconnaissance vocale

## 🔐 Authentification et Sécurité

### Fonctionnalités d'Auth
- **Inscription** : Email + mot de passe + nom
- **Connexion** : Email + mot de passe
- **Réinitialisation** : Email de reset sécurisé
- **Sessions** : Gestion automatique des tokens
- **Profils** : Données utilisateur étendues
- **Permissions** : RLS pour la sécurité des données

### Protection des Routes
- **Routes protégées** : Dashboard, Chat, Premium, etc.
- **Redirection automatique** : Vers landing si non connecté
- **État de chargement** : Indicateurs pendant l'authentification
- **Gestion d'erreurs** : Messages d'erreur clairs

## 🌍 Configuration Lingo.dev

### Obtenir les Clés API
1. Allez sur [Lingo.dev Dashboard](https://lingo.dev/dashboard)
2. Créez un nouveau projet
3. Obtenez votre API Key et Project ID
4. Ajoutez-les dans `.env` :
   ```
   VITE_LINGO_API_KEY=your_lingo_api_key_here
   VITE_LINGO_PROJECT_ID=your_lingo_project_id_here
   ```

### Fonctionnalités
- **Traduction automatique** : Tout le contenu traduit en temps réel
- **Détection de langue** : Langue du navigateur détectée automatiquement
- **Cache intelligent** : Optimisation des performances
- **Observation DOM** : Nouveau contenu traduit automatiquement
- **Fallback** : Traductions de base si API indisponible

## 🔧 Dépannage

### Erreurs Communes

**1. Erreur Supabase**
- Vérifiez vos clés API dans `.env`
- Cliquez sur "Connect to Supabase" dans Bolt
- Vérifiez que les migrations sont appliquées

**2. Erreur Lingo.dev**
- Vérifiez votre API key et Project ID
- L'app fonctionne en mode fallback sans Lingo.dev
- Vérifiez les logs de la console

**3. Module non trouvé**
```bash
npm install
npm run dev
```

**4. APIs non configurées**
- L'app fonctionne avec Supabase + Lingo.dev uniquement
- Les autres APIs sont optionnelles avec fallbacks

## 📱 Test Mobile

L'application est responsive et multilingue. Testez sur :
- Chrome DevTools (F12 > Toggle Device)
- Votre téléphone via l'IP locale
- Simulateurs iOS/Android
- Différentes langues

## 🎨 Personnalisation

### Base de Données
- Modifiez les migrations dans `supabase/migrations/`
- Ajoutez de nouvelles tables selon vos besoins
- Personnalisez les politiques RLS

### Traductions
- Ajoutez de nouvelles langues dans `LingoService.getSupportedLanguages()`
- Personnalisez les traductions de fallback
- Configurez les langues par défaut

### RAG et IA
- Modifiez `QUANTUM_SELF_KNOWLEDGE_BASE` dans `src/services/gemini.ts`
- Ajoutez de nouvelles informations sur l'app
- Personnalisez les guidelines de conversation

## 🚀 Déploiement

### Netlify (Recommandé)
```bash
npm run build
# Uploadez le dossier `dist/` sur Netlify
```

### Variables d'environnement
N'oubliez pas d'ajouter toutes vos clés API dans les variables d'environnement de votre plateforme de déploiement :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_LINGO_API_KEY`
- `VITE_LINGO_PROJECT_ID`
- Et les autres APIs optionnelles

## 📞 Support

En cas de problème :
1. Vérifiez la console du navigateur (F12)
2. Consultez les logs du terminal
3. Vérifiez que Supabase est configuré
4. Vérifiez que Lingo.dev est configuré
5. Testez d'abord en mode simulation (sans APIs optionnelles)

---

**🌟 Profitez de vos conversations quantiques avec authentification sécurisée et traductions automatiques !**