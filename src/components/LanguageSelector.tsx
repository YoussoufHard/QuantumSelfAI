import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' }
  ];

  const changeLanguage = (lng: string) => {
    console.log('🌍 Changement de langue vers:', lng);
    
    // Changer la langue avec i18next
    i18n.changeLanguage(lng);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('quantum-language', lng);
    
    // Fermer le menu
    setIsOpen(false);
    
    console.log('✅ Langue changée vers:', lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Gestion améliorée des clics extérieurs
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = (event: MouseEvent) => {
      // Seulement fermer si c'était un vrai clic (mousedown + mouseup)
      if (isMouseDownRef.current && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      isMouseDownRef.current = false;
    };

    const handleMouseMove = () => {
      // Reset le flag si la souris bouge (ce n'est plus un clic)
      isMouseDownRef.current = false;
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isOpen]);

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('quantum-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log('🔄 Chargement langue sauvegardée:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🖱️ Toggle sélecteur de langue, état actuel:', isOpen);
    setIsOpen(!isOpen);
  };

  const handleLanguageClick = (e: React.MouseEvent, languageCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🖱️ Sélection langue:', languageCode);
    changeLanguage(languageCode);
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button 
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 text-white hover:bg-slate-700/50 transition-all duration-300 border border-slate-600/50 hover:border-slate-500"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:block">
          {currentLanguage.nativeName}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-slate-200/50 z-50"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              <div className="text-xs font-medium text-slate-500 px-3 py-2 border-b border-slate-200/50 mb-1">
                Choose Language / Choisir la langue
              </div>
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  onClick={(e) => handleLanguageClick(e, language.code)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-100/80 transition-colors rounded-lg cursor-pointer ${
                    i18n.language === language.code ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-slate-700'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(148, 163, 184, 0.1)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-slate-500">{language.name}</div>
                  </div>
                  {i18n.language === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            <div className="border-t border-slate-200/50 p-2">
              <div className="text-xs text-slate-400 px-3 py-1 text-center">
                🌍 More languages coming soon
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;