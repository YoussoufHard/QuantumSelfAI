import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Landing Page
      "hero.title": "Talk to all the",
      "hero.subtitle": "versions of you",
      "hero.description": "Discover advice from your future self, regain motivation from your past, and explore your parallel lives with the most advanced AI.",
      "hero.cta": "Start now",
      "nav.features": "Features",
      "nav.demo": "Demo",
      "nav.start": "Start",
      "nav.pricing": "Pricing",
      
      // Features
      "features.title": "Five versions, infinite possibilities",
      "features.subtitle": "Each version of you has its own advice, perspectives and wisdom to share.",
      "features.past": "Your Motivated Past",
      "features.present": "Your Optimized Present", 
      "features.future": "Your Wise Future",
      "features.success": "Your Parallel Success",
      "features.zen": "Your Parallel Zen",
      
      // Dashboard
      "dashboard.welcome": "Hi {{name}}! 👋",
      "dashboard.subtitle": "Your quantum versions are waiting. Who do you want to talk to today?",
      "dashboard.dailyConversation": "💬 Daily Conversation",
      "dashboard.insights": "Latest Insights",
      "dashboard.goals": "Monthly Goals",
      "dashboard.quantumTimeline": "Quantum Timeline",
      "dashboard.emotionalWeather": "Emotional Weather",
      
      // Chat
      "chat.selectVersion": "Choose your quantum version",
      "chat.placeholder": "Write your message...",
      "chat.suggestions": "Suggested questions",
      "chat.backToDashboard": "Back to dashboard",
      "chat.videoMode": "Video Mode",
      "chat.chatMode": "Chat Mode",
      "chat.geminiConnected": "Gemini Connected",
      "chat.geminiOffline": "Gemini Offline",
      "chat.testGemini": "Test Gemini",
      "chat.aiThinking": "AI is thinking...",
      "chat.voiceResponsesEnabled": "Voice responses enabled",
      "chat.geminiRagActive": "Gemini AI with RAG active",
      "chat.simulationMode": "Simulation mode",
      "chat.tavusVideoAvailable": "Tavus video mode available",
      
      // Onboarding
      "onboarding.step": "Step {{current}} of {{total}}",
      "onboarding.welcome": "Welcome to the quantum era!",
      "onboarding.namePrompt": "Let's start by getting to know each other. What should we call you?",
      "onboarding.namePlaceholder": "Your first name...",
      "onboarding.picaAnalysis": "Advanced Pica AI Analysis",
      "onboarding.picaDescription": "Upload a photo for complete biometric analysis and Tavus avatar creation",
      "onboarding.voiceCloning": "ElevenLabs Voice Cloning",
      "onboarding.voiceDescription": "Record 10 seconds of your voice to create ultra-personalized voice responses",
      "onboarding.psychProfile": "In-depth psychological profile",
      "onboarding.quantumGeneration": "Quantum Generation",
      "onboarding.selectVersions": "Select your 3-5 favorite quantum versions to start",
      "onboarding.previous": "Previous",
      "onboarding.next": "Next",
      "onboarding.enterQuantumUniverse": "Enter the quantum universe",
      "onboarding.skipMinimal": "Skip (minimal answers)",
      "onboarding.autoComplete": "Auto-complete all",
      "onboarding.sufficientToContinue": "Sufficient to continue!",
      
      // Auth
      "auth.title": "Start Your Journey with Quantum Self AI",
      "auth.subtitle": "Enter your email to unlock your quantum potential",
      "auth.emailLabel": "Your Email Address",
      "auth.emailPlaceholder": "example@yourmail.com",
      "auth.submit": "Start Now",
      "auth.invalidEmail": "Please enter a valid email",
      "auth.alreadyRegistered": "Welcome back!",
      "auth.success": "Registration successful! Start your adventure!",
      "auth.error": "An error occurred. Please try again.",
      "auth.terms": "By continuing, you agree to our",
      "auth.termsLink": "Terms of Use",
      "auth.and": "and our",
      "auth.privacyLink": "Privacy Policy",
      
      // Premium
      "premium.title": "Level up",
      "premium.subtitle": "Access all your quantum versions, unlimited conversations, and revolutionary AI insights to transform your life.",
      "premium.monthly": "Monthly",
      "premium.yearly": "Yearly",
      "premium.free": "Free",
      "premium.forever": "Forever",
      "premium.popular": "Most Popular",
      "premium.chooseThisPlan": "Choose this plan",
      "premium.select": "Select",
      "premium.testimonials": "What our users say",
      "premium.readyToUnlock": "Ready to unlock your quantum potential?",
      "premium.joinThousands": "Join thousands of users transforming their lives through conversations with their quantum versions.",
      "premium.startNow": "Start now",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.share": "Share",
      "common.download": "Download",
      "common.upload": "Upload",
      "common.record": "Record",
      "common.play": "Play",
      "common.pause": "Pause",
      "common.stop": "Stop",
      "common.retry": "Retry",
      "common.skip": "Skip",
      
      // Quantum Versions
      "versions.youngSelf": "You at 16",
      "versions.presentSelf": "You at 30", 
      "versions.wiseSelf": "You at 60",
      "versions.successSelf": "Your Parallel Success",
      "versions.zenSelf": "Your Parallel Zen",
      "versions.youngDescription": "Full of energy and dreams",
      "versions.presentDescription": "Optimized and balanced present",
      "versions.wiseDescription": "Wise and experienced",
      "versions.successDescription": "Who achieved all dreams",
      "versions.zenDescription": "Perfectly balanced and serene",
      
      // Questions
      "questions.howDoesItWork": "How does Quantum Self AI work?",
      "questions.tellMeAboutVersions": "Can you tell me about other quantum versions?",
      "questions.whatFeatures": "What are the app's features?",
      "questions.howVoiceCloning": "How does voice cloning work?",
      "questions.handleStress": "How to handle daily stress?",
      "questions.careerAdvice": "What advice for my career?",
      "questions.maintainMotivation": "How to maintain motivation?",
      "questions.whatWouldYouDo": "What would you do in my place?",
      "questions.greatestLearning": "What's your greatest learning?",
      
      // Status Messages
      "status.geminiConnected": "Gemini AI Connected",
      "status.geminiDisconnected": "Gemini AI Disconnected",
      "status.elevenLabsActive": "ElevenLabs AI",
      "status.tavusAvailable": "Tavus Avatar",
      "status.simulationMode": "Simulation Mode",
      "status.voiceCloned": "Voice cloned successfully!",
      "status.analysisComplete": "Analysis complete!",
      "status.generationInProgress": "Generation in progress...",
      
      // Errors
      "errors.connectionFailed": "Connection failed",
      "errors.apiKeyMissing": "API key missing",
      "errors.generationError": "Generation error",
      "errors.uploadError": "Upload error",
      "errors.recordingError": "Recording error",
      "errors.playbackError": "Playback error",
      
      // Footer
      "footer.allRightsReserved": "All rights reserved.",
      "footer.exploreQuantumPossibilities": "Explore all your quantum possibilities.",
      "footer.builtWith": "Built with"
    }
  },
  fr: {
    translation: {
      // Landing Page
      "hero.title": "Parle avec toutes les",
      "hero.subtitle": "versions de toi",
      "hero.description": "Découvre les conseils de ton futur toi, retrouve la motivation de ton passé, et explore tes vies parallèles avec l'IA la plus avancée.",
      "hero.cta": "Commencer maintenant",
      "nav.features": "Fonctionnalités",
      "nav.demo": "Démo",
      "nav.start": "Commencer",
      "nav.pricing": "Tarifs",
      
      // Features
      "features.title": "Cinq versions, infinies possibilités",
      "features.subtitle": "Chaque version de toi a ses propres conseils, perspectives et sagesse à partager.",
      "features.past": "Ton Passé Motivé",
      "features.present": "Ton Présent Optimisé",
      "features.future": "Ton Futur Sage",
      "features.success": "Ton Parallèle Réussite",
      "features.zen": "Ton Parallèle Zen",
      
      // Dashboard
      "dashboard.welcome": "Salut {{name}} ! 👋",
      "dashboard.subtitle": "Tes versions quantiques t'attendent. Avec qui veux-tu parler aujourd'hui ?",
      "dashboard.dailyConversation": "💬 Conversation du Jour",
      "dashboard.insights": "Derniers Insights",
      "dashboard.goals": "Objectifs du mois",
      "dashboard.quantumTimeline": "Timeline Quantique",
      "dashboard.emotionalWeather": "Météo Émotionnelle",
      
      // Chat
      "chat.selectVersion": "Choisis ta version quantique",
      "chat.placeholder": "Écris ton message...",
      "chat.suggestions": "Questions suggérées",
      "chat.backToDashboard": "Retour au dashboard",
      "chat.videoMode": "Mode Vidéo",
      "chat.chatMode": "Mode Chat",
      "chat.geminiConnected": "Gemini Connecté",
      "chat.geminiOffline": "Gemini Hors ligne",
      "chat.testGemini": "Test Gemini",
      "chat.aiThinking": "L'IA réfléchit...",
      "chat.voiceResponsesEnabled": "Réponses vocales activées",
      "chat.geminiRagActive": "IA Gemini avec RAG activée",
      "chat.simulationMode": "Mode simulation",
      "chat.tavusVideoAvailable": "Mode vidéo Tavus disponible",
      
      // Onboarding
      "onboarding.step": "Étape {{current}} sur {{total}}",
      "onboarding.welcome": "Bienvenue dans l'ère quantique !",
      "onboarding.namePrompt": "Commençons par faire connaissance. Comment veux-tu qu'on t'appelle ?",
      "onboarding.namePlaceholder": "Ton prénom...",
      "onboarding.picaAnalysis": "Analyse Pica AI Avancée",
      "onboarding.picaDescription": "Upload une photo pour une analyse biométrique complète et la création de tes avatars Tavus",
      "onboarding.voiceCloning": "Clonage Vocal ElevenLabs",
      "onboarding.voiceDescription": "Enregistre 10 secondes de ta voix pour créer des réponses vocales ultra-personnalisées",
      "onboarding.psychProfile": "Profil psychologique approfondi",
      "onboarding.quantumGeneration": "Génération Quantique",
      "onboarding.selectVersions": "Sélectionne tes 3-5 versions quantiques préférées pour commencer",
      "onboarding.previous": "Précédent",
      "onboarding.next": "Suivant",
      "onboarding.enterQuantumUniverse": "Entrer dans l'univers quantique",
      "onboarding.skipMinimal": "Passer (réponses minimales)",
      "onboarding.autoComplete": "Auto-compléter tout",
      "onboarding.sufficientToContinue": "Suffisant pour continuer !",
      
      // Auth
      "auth.title": "Débutez votre voyage avec Quantum Self AI",
      "auth.subtitle": "Entrez votre email pour découvrir votre potentiel quantique",
      "auth.emailLabel": "Votre adresse email",
      "auth.emailPlaceholder": "exemple@votreemail.com",
      "auth.submit": "Démarrer maintenant",
      "auth.invalidEmail": "Veuillez entrer un email valide",
      "auth.alreadyRegistered": "Bienvenue de retour !",
      "auth.success": "Inscription réussie ! Commencez votre aventure !",
      "auth.error": "Une erreur s'est produite. Veuillez réessayer.",
      "auth.terms": "En continuant, vous acceptez nos",
      "auth.termsLink": "Conditions d'utilisation",
      "auth.and": "et notre",
      "auth.privacyLink": "Politique de confidentialité",
      
      // Premium
      "premium.title": "Passe au niveau supérieur",
      "premium.subtitle": "Accède à toutes tes versions quantiques, conversations illimitées, et des insights IA révolutionnaires pour transformer ta vie.",
      "premium.monthly": "Mensuel",
      "premium.yearly": "Annuel",
      "premium.free": "Gratuit",
      "premium.forever": "Pour toujours",
      "premium.popular": "Plus populaire",
      "premium.chooseThisPlan": "Choisir ce plan",
      "premium.select": "Sélectionner",
      "premium.testimonials": "Ce que disent nos utilisateurs",
      "premium.readyToUnlock": "Prêt à débloquer ton potentiel quantique ?",
      "premium.joinThousands": "Rejoins des milliers d'utilisateurs qui transforment leur vie grâce aux conversations avec leurs versions quantiques.",
      "premium.startNow": "Commencer maintenant",
      
      // Common
      "common.loading": "Chargement...",
      "common.error": "Erreur",
      "common.success": "Succès",
      "common.cancel": "Annuler",
      "common.confirm": "Confirmer",
      "common.save": "Sauvegarder",
      "common.delete": "Supprimer",
      "common.edit": "Modifier",
      "common.share": "Partager",
      "common.download": "Télécharger",
      "common.upload": "Uploader",
      "common.record": "Enregistrer",
      "common.play": "Lire",
      "common.pause": "Pause",
      "common.stop": "Arrêter",
      "common.retry": "Réessayer",
      "common.skip": "Passer",
      
      // Quantum Versions
      "versions.youngSelf": "Toi à 16 ans",
      "versions.presentSelf": "Toi à 30 ans",
      "versions.wiseSelf": "Toi à 60 ans",
      "versions.successSelf": "Ton Parallèle Réussite",
      "versions.zenSelf": "Ton Parallèle Zen",
      "versions.youngDescription": "Plein d'énergie et de rêves",
      "versions.presentDescription": "Présent optimisé et équilibré",
      "versions.wiseDescription": "Sage et expérimenté",
      "versions.successDescription": "Qui a réalisé tous ses rêves",
      "versions.zenDescription": "Parfaitement équilibré et serein",
      
      // Questions
      "questions.howDoesItWork": "Comment fonctionne Quantum Self AI ?",
      "questions.tellMeAboutVersions": "Peux-tu me parler des autres versions quantiques ?",
      "questions.whatFeatures": "Quelles sont les fonctionnalités de l'app ?",
      "questions.howVoiceCloning": "Comment le clonage vocal fonctionne ?",
      "questions.handleStress": "Comment gérer le stress au quotidien ?",
      "questions.careerAdvice": "Quels conseils pour ma carrière ?",
      "questions.maintainMotivation": "Comment maintenir la motivation ?",
      "questions.whatWouldYouDo": "Que ferais-tu à ma place ?",
      "questions.greatestLearning": "Quel est ton plus grand apprentissage ?",
      
      // Status Messages
      "status.geminiConnected": "Gemini AI Connecté",
      "status.geminiDisconnected": "Gemini AI Déconnecté",
      "status.elevenLabsActive": "ElevenLabs AI",
      "status.tavusAvailable": "Avatar Tavus",
      "status.simulationMode": "Mode Simulation",
      "status.voiceCloned": "Voix clonée avec succès !",
      "status.analysisComplete": "Analyse terminée !",
      "status.generationInProgress": "Génération en cours...",
      
      // Errors
      "errors.connectionFailed": "Connexion échouée",
      "errors.apiKeyMissing": "Clé API manquante",
      "errors.generationError": "Erreur de génération",
      "errors.uploadError": "Erreur d'upload",
      "errors.recordingError": "Erreur d'enregistrement",
      "errors.playbackError": "Erreur de lecture",
      
      // Footer
      "footer.allRightsReserved": "Tous droits réservés.",
      "footer.exploreQuantumPossibilities": "Explorez toutes vos possibilités quantiques.",
      "footer.builtWith": "Créé avec"
    }
  },
  es: {
    translation: {
      // Landing Page
      "hero.title": "Habla con todas las",
      "hero.subtitle": "versiones de ti",
      "hero.description": "Descubre consejos de tu yo futuro, recupera la motivación de tu pasado y explora tus vidas paralelas con la IA más avanzada.",
      "hero.cta": "Empezar ahora",
      "nav.features": "Características",
      "nav.demo": "Demo",
      "nav.start": "Empezar",
      "nav.pricing": "Precios",
      
      // Features
      "features.title": "Cinco versiones, infinitas posibilidades",
      "features.subtitle": "Cada versión de ti tiene sus propios consejos, perspectivas y sabiduría para compartir.",
      "features.past": "Tu Pasado Motivado",
      "features.present": "Tu Presente Optimizado",
      "features.future": "Tu Futuro Sabio",
      "features.success": "Tu Paralelo Exitoso",
      "features.zen": "Tu Paralelo Zen",
      
      // Dashboard
      "dashboard.welcome": "¡Hola {{name}}! 👋",
      "dashboard.subtitle": "Tus versiones cuánticas te esperan. ¿Con quién quieres hablar hoy?",
      "dashboard.dailyConversation": "💬 Conversación del Día",
      "dashboard.insights": "Últimos Insights",
      "dashboard.goals": "Objetivos del mes",
      "dashboard.quantumTimeline": "Línea de Tiempo Cuántica",
      "dashboard.emotionalWeather": "Clima Emocional",
      
      // Chat
      "chat.selectVersion": "Elige tu versión cuántica",
      "chat.placeholder": "Escribe tu mensaje...",
      "chat.suggestions": "Preguntas sugeridas",
      "chat.backToDashboard": "Volver al dashboard",
      "chat.videoMode": "Modo Video",
      "chat.chatMode": "Modo Chat",
      "chat.geminiConnected": "Gemini Conectado",
      "chat.geminiOffline": "Gemini Desconectado",
      "chat.testGemini": "Test Gemini",
      "chat.aiThinking": "La IA está pensando...",
      "chat.voiceResponsesEnabled": "Respuestas de voz activadas",
      "chat.geminiRagActive": "IA Gemini con RAG activa",
      "chat.simulationMode": "Modo simulación",
      "chat.tavusVideoAvailable": "Modo video Tavus disponible",
      
      // Onboarding
      "onboarding.step": "Paso {{current}} de {{total}}",
      "onboarding.welcome": "¡Bienvenido a la era cuántica!",
      "onboarding.namePrompt": "Empecemos por conocernos. ¿Cómo debemos llamarte?",
      "onboarding.namePlaceholder": "Tu nombre...",
      "onboarding.picaAnalysis": "Análisis Pica AI Avanzado",
      "onboarding.picaDescription": "Sube una foto para un análisis biométrico completo y la creación de avatares Tavus",
      "onboarding.voiceCloning": "Clonación de Voz ElevenLabs",
      "onboarding.voiceDescription": "Graba 10 segundos de tu voz para crear respuestas de voz ultra-personalizadas",
      "onboarding.psychProfile": "Perfil psicológico profundo",
      "onboarding.quantumGeneration": "Generación Cuántica",
      "onboarding.selectVersions": "Selecciona tus 3-5 versiones cuánticas favoritas para empezar",
      "onboarding.previous": "Anterior",
      "onboarding.next": "Siguiente",
      "onboarding.enterQuantumUniverse": "Entrar en el universo cuántico",
      "onboarding.skipMinimal": "Saltar (respuestas mínimas)",
      "onboarding.autoComplete": "Auto-completar todo",
      "onboarding.sufficientToContinue": "¡Suficiente para continuar!",
      
      // Auth
      "auth.title": "Comienza tu viaje con Quantum Self AI",
      "auth.subtitle": "Ingresa tu correo para desbloquear tu potencial cuántico",
      "auth.emailLabel": "Tu dirección de correo",
      "auth.emailPlaceholder": "ejemplo@tucorreo.com",
      "auth.submit": "Empezar ahora",
      "auth.invalidEmail": "Por favor, ingresa un correo válido",
      "auth.alreadyRegistered": "¡Bienvenido de vuelta!",
      "auth.success": "¡Registro exitoso! ¡Comienza tu aventura!",
      "auth.error": "Ocurrió un error. Por favor, intenta de nuevo.",
      "auth.terms": "Al continuar, aceptas nuestros",
      "auth.termsLink": "Términos de uso",
      "auth.and": "y nuestra",
      "auth.privacyLink": "Política de privacidad",
      
      // Premium
      "premium.title": "Sube de nivel",
      "premium.subtitle": "Accede a todas tus versiones cuánticas, conversaciones ilimitadas y conocimientos de IA revolucionarios para transformar tu vida.",
      "premium.monthly": "Mensual",
      "premium.yearly": "Anual",
      "premium.free": "Gratis",
      "premium.forever": "Para siempre",
      "premium.popular": "Más popular",
      "premium.chooseThisPlan": "Elegir este plan",
      "premium.select": "Seleccionar",
      "premium.testimonials": "Lo que dicen nuestros usuarios",
      "premium.readyToUnlock": "¿Listo para desbloquear tu potencial cuántico?",
      "premium.joinThousands": "Únete a miles de usuarios que transforman sus vidas a través de conversaciones con sus versiones cuánticas.",
      "premium.startNow": "Empezar ahora",
      
      // Common
      "common.loading": "Cargando...",
      "common.error": "Error",
      "common.success": "Éxito",
      "common.cancel": "Cancelar",
      "common.confirm": "Confirmar",
      "common.save": "Guardar",
      "common.delete": "Eliminar",
      "common.edit": "Editar",
      "common.share": "Compartir",
      "common.download": "Descargar",
      "common.upload": "Subir",
      "common.record": "Grabar",
      "common.play": "Reproducir",
      "common.pause": "Pausar",
      "common.stop": "Detener",
      "common.retry": "Reintentar",
      "common.skip": "Saltar",
      
      // Quantum Versions
      "versions.youngSelf": "Tú a los 16",
      "versions.presentSelf": "Tú a los 30",
      "versions.wiseSelf": "Tú a los 60",
      "versions.successSelf": "Tu Paralelo Exitoso",
      "versions.zenSelf": "Tu Paralelo Zen",
      "versions.youngDescription": "Lleno de energía y sueños",
      "versions.presentDescription": "Presente optimizado y equilibrado",
      "versions.wiseDescription": "Sabio y experimentado",
      "versions.successDescription": "Que logró todos sus sueños",
      "versions.zenDescription": "Perfectamente equilibrado y sereno",
      
      // Questions
      "questions.howDoesItWork": "¿Cómo funciona Quantum Self AI?",
      "questions.tellMeAboutVersions": "¿Puedes hablarme de otras versiones cuánticas?",
      "questions.whatFeatures": "¿Cuáles son las características de la app?",
      "questions.howVoiceCloning": "¿Cómo funciona la clonación de voz?",
      "questions.handleStress": "¿Cómo manejar el estrés diario?",
      "questions.careerAdvice": "¿Qué consejos para mi carrera?",
      "questions.maintainMotivation": "¿Cómo mantener la motivación?",
      "questions.whatWouldYouDo": "¿Qué harías en mi lugar?",
      "questions.greatestLearning": "¿Cuál es tu mayor aprendizaje?",
      
      // Status Messages
      "status.geminiConnected": "Gemini AI Conectado",
      "status.geminiDisconnected": "Gemini AI Desconectado",
      "status.elevenLabsActive": "ElevenLabs AI",
      "status.tavusAvailable": "Avatar Tavus",
      "status.simulationMode": "Modo Simulación",
      "status.voiceCloned": "¡Voz clonada exitosamente!",
      "status.analysisComplete": "¡Análisis completo!",
      "status.generationInProgress": "Generación en progreso...",
      
      // Errors
      "errors.connectionFailed": "Conexión fallida",
      "errors.apiKeyMissing": "Clave API faltante",
      "errors.generationError": "Error de generación",
      "errors.uploadError": "Error de subida",
      "errors.recordingError": "Error de grabación",
      "errors.playbackError": "Error de reproducción",
      
      // Footer
      "footer.allRightsReserved": "Todos los derechos reservados.",
      "footer.exploreQuantumPossibilities": "Explora todas tus posibilidades cuánticas.",
      "footer.builtWith": "Construido con"
    }
  },
  de: {
    translation: {
      // Landing Page
      "hero.title": "Sprich mit allen",
      "hero.subtitle": "Versionen von dir",
      "hero.description": "Entdecke Ratschläge von deinem zukünftigen Ich, gewinne Motivation aus deiner Vergangenheit zurück und erkunde deine parallelen Leben mit der fortschrittlichsten KI.",
      "hero.cta": "Jetzt starten",
      "nav.features": "Funktionen",
      "nav.demo": "Demo",
      "nav.start": "Starten",
      "nav.pricing": "Preise",
      
      // Features
      "features.title": "Fünf Versionen, unendliche Möglichkeiten",
      "features.subtitle": "Jede Version von dir hat ihre eigenen Ratschläge, Perspektiven und Weisheiten zu teilen.",
      "features.past": "Deine Motivierte Vergangenheit",
      "features.present": "Deine Optimierte Gegenwart",
      "features.future": "Deine Weise Zukunft",
      "features.success": "Dein Paralleler Erfolg",
      "features.zen": "Dein Paralleles Zen",
      
      // Dashboard
      "dashboard.welcome": "Hallo {{name}}! 👋",
      "dashboard.subtitle": "Deine Quantenversionen warten. Mit wem möchtest du heute sprechen?",
      "dashboard.dailyConversation": "💬 Tägliches Gespräch",
      "dashboard.insights": "Neueste Erkenntnisse",
      "dashboard.goals": "Monatsziele",
      "dashboard.quantumTimeline": "Quanten-Zeitlinie",
      "dashboard.emotionalWeather": "Emotionales Wetter",
      
      // Chat
      "chat.selectVersion": "Wähle deine Quantenversion",
      "chat.placeholder": "Schreibe deine Nachricht...",
      "chat.suggestions": "Vorgeschlagene Fragen",
      "chat.backToDashboard": "Zurück zum Dashboard",
      "chat.videoMode": "Video-Modus",
      "chat.chatMode": "Chat-Modus",
      "chat.geminiConnected": "Gemini Verbunden",
      "chat.geminiOffline": "Gemini Offline",
      "chat.testGemini": "Gemini Testen",
      "chat.aiThinking": "KI denkt nach...",
      "chat.voiceResponsesEnabled": "Sprachantworten aktiviert",
      "chat.geminiRagActive": "Gemini KI mit RAG aktiv",
      "chat.simulationMode": "Simulationsmodus",
      "chat.tavusVideoAvailable": "Tavus Video-Modus verfügbar",
      
      // Onboarding
      "onboarding.step": "Schritt {{current}} von {{total}}",
      "onboarding.welcome": "Willkommen in der Quanten-Ära!",
      "onboarding.namePrompt": "Lass uns anfangen, uns kennenzulernen. Wie sollen wir dich nennen?",
      "onboarding.namePlaceholder": "Dein Vorname...",
      "onboarding.picaAnalysis": "Erweiterte Pica KI-Analyse",
      "onboarding.picaDescription": "Lade ein Foto hoch für eine vollständige biometrische Analyse und die Erstellung von Tavus-Avataren",
      "onboarding.voiceCloning": "ElevenLabs Stimmklonierung",
      "onboarding.voiceDescription": "Nimm 10 Sekunden deiner Stimme auf, um ultra-personalisierte Sprachantworten zu erstellen",
      "onboarding.psychProfile": "Tiefgehendes psychologisches Profil",
      "onboarding.quantumGeneration": "Quanten-Generierung",
      "onboarding.selectVersions": "Wähle deine 3-5 bevorzugten Quantenversionen zum Start",
      "onboarding.previous": "Zurück",
      "onboarding.next": "Weiter",
      "onboarding.enterQuantumUniverse": "Betritt das Quantenuniversum",
      "onboarding.skipMinimal": "Überspringen (minimale Antworten)",
      "onboarding.autoComplete": "Alles automatisch ausfüllen",
      "onboarding.sufficientToContinue": "Ausreichend, um fortzufahren!",
      
      // Auth
      "auth.title": "Beginne deine Reise mit Quantum Self AI",
      "auth.subtitle": "Gib deine E-Mail ein, um dein Quantenpotenzial freizuschalten",
      "auth.emailLabel": "Deine E-Mail-Adresse",
      "auth.emailPlaceholder": "beispiel@deinemail.com",
      "auth.submit": "Jetzt starten",
      "auth.invalidEmail": "Bitte gib eine gültige E-Mail ein",
      "auth.alreadyRegistered": "Willkommen zurück!",
      "auth.success": "Registrierung erfolgreich! Starte dein Abenteuer!",
      "auth.error": "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
      "auth.terms": "Indem du fortfährst, stimmst du unseren",
      "auth.termsLink": "Nutzungsbedingungen",
      "auth.and": "und unserer",
      "auth.privacyLink": "Datenschutzrichtlinie",
      
      // Premium
      "premium.title": "Level up",
      "premium.subtitle": "Greife auf alle deine Quantenversionen, unbegrenzte Gespräche und revolutionäre KI-Einblicke zu, um dein Leben zu transformieren.",
      "premium.monthly": "Monatlich",
      "premium.yearly": "Jährlich",
      "premium.free": "Kostenlos",
      "premium.forever": "Für immer",
      "premium.popular": "Am beliebtesten",
      "premium.chooseThisPlan": "Diesen Plan wählen",
      "premium.select": "Auswählen",
      "premium.testimonials": "Was unsere Nutzer sagen",
      "premium.readyToUnlock": "Bereit, dein Quantenpotenzial freizuschalten?",
      "premium.joinThousands": "Schließe dich Tausenden von Nutzern an, die ihr Leben durch Gespräche mit ihren Quantenversionen transformieren.",
      "premium.startNow": "Jetzt starten",
      
      // Common
      "common.loading": "Laden...",
      "common.error": "Fehler",
      "common.success": "Erfolg",
      "common.cancel": "Abbrechen",
      "common.confirm": "Bestätigen",
      "common.save": "Speichern",
      "common.delete": "Löschen",
      "common.edit": "Bearbeiten",
      "common.share": "Teilen",
      "common.download": "Herunterladen",
      "common.upload": "Hochladen",
      "common.record": "Aufnehmen",
      "common.play": "Abspielen",
      "common.pause": "Pausieren",
      "common.stop": "Stoppen",
      "common.retry": "Wiederholen",
      "common.skip": "Überspringen",
      
      // Quantum Versions
      "versions.youngSelf": "Du mit 16",
      "versions.presentSelf": "Du mit 30",
      "versions.wiseSelf": "Du mit 60",
      "versions.successSelf": "Dein Paralleler Erfolg",
      "versions.zenSelf": "Dein Paralleles Zen",
      "versions.youngDescription": "Voller Energie und Träume",
      "versions.presentDescription": "Optimierte und ausgewogene Gegenwart",
      "versions.wiseDescription": "Weise und erfahren",
      "versions.successDescription": "Der alle Träume erreicht hat",
      "versions.zenDescription": "Perfekt ausgewogen und gelassen",
      
      // Questions
      "questions.howDoesItWork": "Wie funktioniert Quantum Self AI?",
      "questions.tellMeAboutVersions": "Kannst du mir von anderen Quantenversionen erzählen?",
      "questions.whatFeatures": "Was sind die Funktionen der App?",
      "questions.howVoiceCloning": "Wie funktioniert die Stimmklonierung?",
      "questions.handleStress": "Wie geht man mit täglichem Stress um?",
      "questions.careerAdvice": "Welche Ratschläge für meine Karriere?",
      "questions.maintainMotivation": "Wie bleibt man motiviert?",
      "questions.whatWouldYouDo": "Was würdest du an meiner Stelle tun?",
      "questions.greatestLearning": "Was ist deine größte Erkenntnis?",
      
      // Status Messages
      "status.geminiConnected": "Gemini KI Verbunden",
      "status.geminiDisconnected": "Gemini KI Getrennt",
      "status.elevenLabsActive": "ElevenLabs KI",
      "status.tavusAvailable": "Tavus Avatar",
      "status.simulationMode": "Simulationsmodus",
      "status.voiceCloned": "Stimme erfolgreich geklont!",
      "status.analysisComplete": "Analyse abgeschlossen!",
      "status.generationInProgress": "Generierung läuft...",
      
      // Errors
      "errors.connectionFailed": "Verbindung fehlgeschlagen",
      "errors.apiKeyMissing": "API-Schlüssel fehlt",
      "errors.generationError": "Generierungsfehler",
      "errors.uploadError": "Upload-Fehler",
      "errors.recordingError": "Aufnahmefehler",
      "errors.playbackError": "Wiedergabefehler",
      
      // Footer
      "footer.allRightsReserved": "Alle Rechte vorbehalten.",
      "footer.exploreQuantumPossibilities": "Entdecke alle deine Quantenmöglichkeiten.",
      "footer.builtWith": "Gebaut mit"
    }
  }
};

// Récupérer la langue sauvegardée ou utiliser la langue du navigateur
const savedLanguage = localStorage.getItem('quantum-language');
const browserLanguage = navigator.language.split('-')[0]; // 'en-US' -> 'en'
const supportedLanguages = ['en', 'fr', 'es', 'de'];

// Déterminer la langue par défaut
let defaultLanguage = 'en'; // Par défaut anglais

if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
  defaultLanguage = savedLanguage;
} else if (supportedLanguages.includes(browserLanguage)) {
  defaultLanguage = browserLanguage;
}

console.log('🌍 Langue détectée:', {
  saved: savedLanguage,
  browser: browserLanguage,
  default: defaultLanguage
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: false // Mettre à true pour debug
  });

export default i18n;