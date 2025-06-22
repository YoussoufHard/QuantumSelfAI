import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  onSuccess?: (mode: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'signin', onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const { signIn, signUp, resetPassword, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isOpen && !authLoading) {
      toast.success('Déjà connecté !');
      onClose();
    }
  }, [isAuthenticated, isOpen, authLoading, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || authLoading) return;
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
        await signUp(formData.email, formData.password, formData.name);
        toast.success('Inscription réussie !');
        onSuccess?.('signup');
        onClose();
      } else if (mode === 'signin') {
        const { data } = await signIn(formData.email, formData.password);
        if (data?.user) {
          toast.success('Connexion réussie !');
          onSuccess?.('signin');
          onClose();
        } else {
          throw new Error('Aucun utilisateur retourné');
        }
      } else if (mode === 'reset') {
        await resetPassword(formData.email);
        toast.success('Lien de réinitialisation envoyé à votre email !');
        setMode('signin');
      }
    } catch (error: any) {
      console.error('❌ Erreur authentification:', error.message);
      const message = error.message.includes('network')
        ? 'Problème de connexion réseau. Vérifiez votre connexion.'
        : error.message.includes('invalid')
        ? 'Email ou mot de passe incorrect.'
        : error.message || 'Une erreur s\'est produite. Veuillez réessayer.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
                  {mode === 'signin' && 'Connexion'}
                  {mode === 'signup' && 'Inscription'}
                  {mode === 'reset' && 'Réinitialiser le mot de passe'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {mode === 'signin' && 'Connectez-vous à votre compte Quantum Self AI'}
                {mode === 'signup' && 'Créez votre compte pour commencer l\'aventure quantique'}
                {mode === 'reset' && 'Entrez votre email pour recevoir un lien de réinitialisation'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(loading || authLoading) && <Loader className="w-4 h-4 animate-spin" />}
                {mode === 'signin' && 'Se connecter'}
                {mode === 'signup' && 'Créer mon compte'}
                {mode === 'reset' && 'Envoyer le lien'}
              </button>

              {/* Mode Switch */}
              <div className="text-center text-sm text-gray-600 space-y-2">
                {mode === 'signin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                    <div>
                      Pas encore de compte ?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                      >
                        S'inscrire
                      </button>
                    </div>
                  </>
                )}

                {mode === 'signup' && (
                  <div>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Se connecter
                    </button>
                  </div>
                )}

                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Retour à la connexion
                  </button>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="bg-gray-100 px-6 py-3 text-center">
              <p className="text-xs text-gray-500">
                En vous inscrivant, vous acceptez nos{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Conditions d'utilisation
                </a>{' '}
                et notre{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Politique de confidentialité
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;