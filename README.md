# 🌌 Quantum Self AI - Revolutionary Application

An immersive experience to converse with all your quantum versions thanks to hybrid AI with Supabase authentication and automatic translations via Lingo.dev.

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. API Configuration
Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

**Main APIs (Required):**
- **Supabase** (database and auth): https://supabase.com/dashboard
- **Lingo.dev** (automatic translations): https://lingo.dev/dashboard

**Additional APIs:**
- **Gemini AI** (free): https://makersuite.google.com/app/apikey
- **ElevenLabs** (conversational AI): https://elevenlabs.io/app/settings/api-keys
- **Tavus** (avatars): https://tavusapi.com/
- **Stripe** (payments): https://dashboard.stripe.com/apikeys

### 3. Supabase Setup
1. Create a project at https://supabase.com/dashboard
2. Go to Settings > API and copy the URL and anon key
3. Click "Connect to Supabase" in the Bolt interface
4. Migrations will run automatically

### 4. Lingo.dev Setup
1. Create an account at https://lingo.dev/dashboard
2. Create a new project
3. Get your API key and Project ID
4. Add them to your `.env` file

### 5. Launch
```bash
npm run dev
```

The app will be available at: http://localhost:5173

## 🎯 Complete Architecture

### 🔐 Supabase Authentication (Main)
- **Sign up/Sign in**: Secure email + password
- **User profiles**: Complete data with questionnaires and analysis
- **Quantum versions**: Storage of personalized AI personalities
- **Conversations**: Full history with messages and metadata
- **Insights**: Generation and storage of personalized advice
- **Settings**: User preferences and configuration
- **Emotional weather**: Tracking emotional state over time

### 🌍 Automatic Translations Lingo.dev (Main)
- **Real-time translation**: All content automatically translated
- **10+ supported languages**: French, English, Spanish, German, etc.
- **Automatic detection**: Browser language detected
- **DOM observation**: New content translated automatically
- **Smart cache**: Performance optimization
- **Integrated fallback**: Basic translations if API unavailable

### 🧠 Gemini AI with RAG (Additional)
- **Smart conversations**: Contextual and personalized responses
- **RAG (Retrieval-Augmented Generation)**: Integrated Quantum Self AI context
- **Knowledge base**: Info about the app, quantum versions, features
- **Conversation control**: Keeps discussions within Quantum Self AI universe
- **Free**: Free Google AI Studio API

### 🎤 Official ElevenLabs Client (Additional)
- **Official JavaScript client**: `@elevenlabs/elevenlabs-js`
- **Custom voice cloning**: Your unique voice for each quantum version
- **Conversational agents**: AI that understands and responds naturally
- **Real-time audio responses**: Smooth voice conversations
- **Smart fallback**: Switches to Gemini if ElevenLabs unavailable

## 🔧 Supabase Database

### Main Tables
- **profiles**: Extended user profiles with biometric data
- **quantum_versions**: User-customized quantum versions
- **conversations**: Conversation history
- **messages**: Individual messages with metadata
- **insights**: AI-generated insights
- **user_settings**: Settings and preferences
- **emotional_weather**: Emotional state tracking

### Security
- **RLS (Row Level Security)**: Enabled on all tables
- **Access policies**: Each user accesses only their data
- **Secure authentication**: Session and token management
- **Automatic triggers**: Automatic creation of profiles and default data

## 🌍 Multilingual Features

### Supported Languages
- 🇫🇷 French (default)
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇷🇺 Russian
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇨🇳 Chinese

### Automatic Translation
- **Full content**: All texts, buttons, placeholders, etc.
- **Real-time**: Instant translation when changing language
- **Persistence**: Language saved in user profile
- **Optimized**: Cache and batch requests for performance

## 🧪 Testing Guide

### 1. Authentication
- Create an account with email/password
- Test login/logout
- Check session persistence
- Test password reset

### 2. Translations
- Change language with the selector
- Check that all content is translated
- Test on different pages
- Check language saving

### 3. Onboarding
- **Step 1**: Enter your name
- **Step 2**: Upload a photo (simulated Pica analysis)
- **Step 3**: **Record your voice (10 seconds)** - ElevenLabs cloning
- **Step 4**: Answer the psychological questionnaire
- **Step 5**: Select your quantum versions

### 4. Dashboard
- Explore the circular quantum timeline
- Check your emotional weather
- Click on "Conversation of the Day"
- Check stats and insights

### 5. Hybrid AI Chat
- Select a quantum version
- Test conversations with Gemini AI + RAG
- **App questions**: "How does Quantum Self AI work?"
- **Enable/disable audio** with the volume button
- Use suggested questions
- Test voice mode with speech recognition

## 🔐 Authentication and Security

### Auth Features
- **Sign up**: Email + password + name
- **Sign in**: Email + password
- **Reset**: Secure reset email
- **Sessions**: Automatic token management
- **Profiles**: Extended user data
- **Permissions**: RLS for data security

### Route Protection
- **Protected routes**: Dashboard, Chat, Premium, etc.
- **Automatic redirection**: To landing if not logged in
- **Loading state**: Indicators during authentication
- **Error handling**: Clear error messages

## 🌍 Lingo.dev Configuration

### Get API Keys
1. Go to [Lingo.dev Dashboard](https://lingo.dev/dashboard)
2. Create a new project
3. Get your API Key and Project ID
4. Add them to `.env`:
   ```
   VITE_LINGO_API_KEY=your_lingo_api_key_here
   VITE_LINGO_PROJECT_ID=your_lingo_project_id_here
   ```

### Features
- **Automatic translation**: All content translated in real time
- **Language detection**: Browser language detected automatically
- **Smart cache**: Performance optimization
- **DOM observation**: New content translated automatically
- **Fallback**: Basic translations if API unavailable

## 🔧 Troubleshooting

### Common Errors

**1. Supabase Error**
- Check your API keys in `.env`
- Click "Connect to Supabase" in Bolt
- Check that migrations are applied

**2. Lingo.dev Error**
- Check your API key and Project ID
- The app works in fallback mode without Lingo.dev
- Check console logs

**3. Module not found**
```bash
npm install
npm run dev
```

**4. APIs not configured**
- The app works with Supabase + Lingo.dev only
- Other APIs are optional with fallbacks

## 📱 Mobile Testing

The app is responsive and multilingual. Test on:
- Chrome DevTools (F12 > Toggle Device)
- Your phone via local IP
- iOS/Android simulators
- Different languages

## 🎨 Customization

### Database
- Edit migrations in `supabase/migrations/`
- Add new tables as needed
- Customize RLS policies

### Translations
- Add new languages in `LingoService.getSupportedLanguages()`
- Customize fallback translations
- Set default languages

### RAG and AI
- Edit `QUANTUM_SELF_KNOWLEDGE_BASE` in `src/services/gemini.ts`
- Add new app information
- Customize conversation guidelines

## 🚀 Deployment

### Netlify (Recommended)
```bash
npm run build
# Upload the `dist/` folder to Netlify
```

### Environment Variables
Don't forget to add all your API keys to your deployment platform's environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_LINGO_API_KEY`
- `VITE_LINGO_PROJECT_ID`
- And other optional APIs

## 📞 Support

If you have a problem:
1. Check the browser console (F12)
2. Check terminal logs
3. Make sure Supabase is configured
4. Make sure Lingo.dev is configured
5. Test first in simulation mode (without optional APIs)

---

**🌟 Enjoy your quantum conversations with secure authentication and automatic translations!**
