import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LingoService } from '../services/lingo';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const { updateProfile, profile } = useAuth();

  const supportedLanguages = LingoService.getSupportedLanguages();

  useEffect(() => {
    // Charger la langue depuis le profil utilisateur ou le localStorage
    const savedLanguage = profile?.language || localStorage.getItem('quantum-language') || LingoService.detectBrowserLanguage();
    setCurrentLanguage(savedLanguage);
  }, [profile]);

  useEffect(() => {
    // Initialiser Lingo.dev au montage
    LingoService.initializeProject();
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setIsTranslating(true);
    setIsOpen(false);

    try {
      // Mettre à jour la langue dans le profil utilisateur
      if (profile) {
        await updateProfile({ language: languageCode });
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('quantum-language', languageCode);

      // Activer la traduction automatique avec Lingo.dev
      await LingoService.enableAutoTranslation(languageCode);

      setCurrentLanguage(languageCode);
      
      const languageName = LingoService.getLanguageName(languageCode);
      toast.success(`🌍 Interface traduite en ${languageName}`);
    } catch (error) {
      console.error('Erreur changement de langue:', error);
      toast.error('❌ Erreur lors du changement de langue');
    } finally {
      setIsTranslating(false);
    }
  };

  const getCurrentLanguageData = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  const currentLang = getCurrentLanguageData();

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium hidden sm:block">
          {currentLang.nativeName}
        </span>
        {isTranslating ? (
          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 z-50 overflow-hidden"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-200/50 mb-1">
                🌍 Traduction automatique Lingo.dev
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {supportedLanguages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100/80 transition-colors rounded-lg cursor-pointer ${
                      currentLanguage === language.code 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'text-gray-700'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500">{language.name}</div>
                    </div>
                    {currentLanguage === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-blue-500"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                    {!language.enabled && (
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Bientôt
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200/50 p-3 bg-gray-50/50">
              <div className="text-xs text-gray-500 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Globe className="w-3 h-3" />
                  <span>Powered by Lingo.dev</span>
                </div>
                <div>Traduction automatique en temps réel</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;