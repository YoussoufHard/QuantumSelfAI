import React, { useState } from 'react';
import { X, Mail, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface AuthFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { registerEmail } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/)) {
      toast.error(t('auth.invalidEmail') || 'Veuillez entrer un email valide');
      return;
    }

    setLoading(true);
    try {
      const result = await registerEmail(email);
      toast.success(
        result.exists
          ? t('auth.alreadyRegistered') || 'Bienvenue de retour !'
          : t('auth.success') || 'Inscription réussie ! Commencez votre aventure !'
      );
      onSuccess(email); // Triggers navigation to /onboarding in Landing.tsx
      onClose();
    } catch (error: any) {
      console.error('❌ Erreur enregistrement email:', error.message);
      toast.error(error.message || t('auth.error') || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {t('auth.title') || 'Débutez votre voyage avec Quantum Self AI'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {t('auth.subtitle') || 'Entrez votre email pour découvrir votre potentiel quantique'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.emailLabel') || 'Votre adresse email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder={t('auth.emailPlaceholder') || 'exemple@votreemail.com'}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {t('auth.submit') || 'Démarrer maintenant'}
              </button>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600">
                {t('auth.terms') || 'En continuant, vous acceptez nos'}{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                  {t('auth.termsLink') || 'Conditions d\'utilisation'}
                </a>{' '}
                {t('auth.and') || 'et notre'}{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                  {t('auth.privacyLink') || 'Politique de confidentialité'}
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthForm;