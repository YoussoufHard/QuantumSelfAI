# QuantumSelfAI - Multiversal Chat App 🌌

> *Chat with infinite versions of yourself across time and parallel realities*

[![Demo Video](https://img.shields.io/badge/Demo-Watch%20Video-red)](https://youtube.com/demo)

## 🚀 Overview

QuantumSelfAI is an innovative AI-powered application that allows users to engage in meaningful conversations with different versions of themselves - past, future, and parallel reality selves. Using advanced AI, biometric analysis, and voice cloning technology, the app creates personalized avatars that embody distinct phases and possibilities of your life journey.

### ✨ Key Features

- **🧬 Biometric Analysis**: Upload your photo for facial emotion recognition and 3D avatar morphing
- **🎙️ Voice Cloning**: Record your voice to generate authentic-sounding AI versions using ElevenLabs
- **🧠 Psychological Profiling**: Big Five personality analysis with dynamic radar charts
- **👥 Multiple Quantum Versions**: Chat with 7 distinct versions of yourself:
  - Curious Child
  - Rebellious Teenager  
  - Ambitious Adult
  - Wise 40-year-old
  - Elder Mentor (65)
  - Billionaire Parallel Self
  - Spiritual Parallel Self
- **🎥 AI Video Avatars**: Realistic video conversations powered by Tavus
- **🌍 Multi-language Support**: International accessibility with automatic translation
- **💬 Advanced Chat Modes**: 1-on-1, group council, meditation, and prophecy modes

## 🏗️ Architecture

QuantumSelfAI follows a modular architecture with clear separation of concerns:

```
📦 QuantumSelfAI
├── 🎨 Frontend (React + TypeScript)
│   ├── Components (UI/UX)
│   ├── State Management (Zustand)
│   └── Internationalization (i18next)
├── 🤖 AI Service Layer
│   ├── OpenAI/GPT Integration
│   ├── ElevenLabs Voice Cloning
│   ├── Tavus Video Avatars
│   └── Pica Biometric Analysis
├── 💾 Backend (Supabase)
│   ├── Authentication
│   ├── PostgreSQL Database
│   └── Row Level Security
└── 🔌 External Integrations
    ├── Stripe Payments
    ├── Lingo.dev Translation
    └── IPFS NFT Storage
```

## 🎯 Core Concepts

### Quantum Version Abstraction
Defines how different versions of yourself are conceptualized, stored, and represented in the UI. Each version has unique personality traits, age characteristics, and conversation patterns.

### AI Service Layer
Central hub managing all AI interactions:
- **Conversation Generation**: GPT-powered responses tailored to each quantum version
- **Voice Synthesis**: ElevenLabs integration for personalized voice cloning
- **Video Avatars**: Tavus API for realistic video conversations
- **Biometric Analysis**: Facial recognition and emotion detection

### Data Model
Secure, structured storage of user profiles, quantum versions, conversations, and preferences using Supabase with RLS policies.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- API keys for: OpenAI, ElevenLabs, Tavus, Pica

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YoussoufHard/QuantumSelfAI.git
cd quantumself-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
TAVUS_API_KEY=your_tavus_key
PICA_API_KEY=your_pica_key

# Payment
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Translation
LINGO_API_KEY=your_lingo_key
```

4. **Database Setup**
```bash
npx supabase init
npx supabase start
npx supabase db push
```

5. **Run the application**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 User Journey

### 1. Landing Page
- Immersive 3D hero section with particle animations
- "Start Your Quantum Journey" CTA
- Feature showcase and pricing information

### 2. 7-Step Onboarding Process

**Step 1: Biometric Scan**
- Photo upload and facial analysis
- 3D avatar morphing preview
- Emotion recognition results

**Step 2: Voice Recording** 
- Voice sample collection
- ElevenLabs processing
- Voice clone selection from 5 generated options

**Step 3: Psychological Analysis**
- Big Five personality questionnaire
- Dynamic radar chart visualization  
- Quantum profile suggestions

**Step 4: Version Generation**
- AI-powered creation of 7 distinct personas
- Interactive card-based selection interface
- Personality trait mapping

**Step 5: Avatar Creation**
- Tavus video avatar generation
- 30-second introduction clips
- Gallery preview interface

**Step 6: AR Integration** (Mobile)
- Environmental scanning
- Real-world avatar placement
- Temporal portal animations

**Step 7: Quantum Activation**
- Guided meditation experience
- First multi-version chat session
- NFT badge generation

### 3. Chat Interface
- Real-time video avatars with synchronized voice
- Multiple conversation modes
- Voice input with speech recognition
- Conversation history and insights

### 4. Quantum Dashboard
- 3D temporal wheel navigation
- Daily wisdom widgets
- Auto-generated conversation journals
- Emotional state tracking

## 💰 Monetization

- **Free Tier**: 3 versions, 10 chats/month, 720p avatars
- **Premium Plan**: €99/month - 15 versions, unlimited chats, 4K avatars
- **Enterprise**: Custom pricing for organizations

## 🛠️ Technology Stack

**Frontend:**
- React 18 + TypeScript
- Next.js 14 (App Router)
- Tailwind CSS
- Zustand (State Management)
- React Three Fiber (3D Graphics)
- Framer Motion (Animations)

**Backend:**
- Supabase (Database + Auth)
- PostgreSQL with RLS
- Edge Functions

**AI & Services:**
- OpenAI GPT-4 (Conversation AI)
- ElevenLabs (Voice Cloning)
- Tavus (Video Avatars)
- Pica Labs (Biometric Analysis)
- Lingo.dev (Translation)

**Payments & Storage:**
- Stripe (Subscriptions)
- IPFS (NFT Storage)
- Supabase Storage (Media Files)

**Development:**
- TypeScript
- ESLint + Prettier
- Husky (Git Hooks)
- Jest + Testing Library

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## 📈 Performance

- **Core Web Vitals**: All green scores
- **Lighthouse**: 95+ performance rating
- **Bundle Size**: <500KB initial load
- **API Response**: <2s average for AI generation

## 🔒 Security & Privacy

- End-to-end encryption for sensitive data
- Supabase Row Level Security (RLS)
- GDPR compliant data handling
- User data anonymization options
- Secure API key management

## 🌍 Internationalization

Currently supporting:
- English
- French
- Spanish
- German
- Mandarin Chinese

Translation powered by Lingo.dev with dynamic content adaptation.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built during Bolt Hackathon 2025
- Inspired by quantum physics and multiverse theory
- Special thanks to the open-source community

## 📞 Contact & Support

- **Demo**: [quantumself.ai](https://incredible-lokum-394313.netlify.app/)
- **Email**: ytangara2003@gmail.com
- **Discord**: [Join our community](https://discord.gg/quantumself) - not now available
- **Twitter**: [@QuantumSelfAI](https://twitter.com/QuantumSelfAI) - not now available

---

*"Every conversation with yourself is a step towards understanding the infinite possibilities of who you could become."*

---

**Built with ❤️ using Bolt.new**