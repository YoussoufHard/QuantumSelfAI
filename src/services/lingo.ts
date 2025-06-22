import toast from 'react-hot-toast';
import * as Sentry from '@sentry/react';

/**
 * Interface pour la configuration Lingo.dev
 */
export interface LingoConfig {
  apiKey: string;
  projectId: string;
  baseUrl: string;
}

/**
 * Interface pour une traduction
 */
export interface Translation {
  key: string;
  value: string;
  language: string;
  context?: string;
}

/**
 * Interface pour les langues supportées
 */
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
}

/**
 * Service pour l'intégration avec Lingo.dev
 */
export class LingoService {
  private static readonly API_KEY = import.meta.env.VITE_LINGO_API_KEY;
  private static readonly PROJECT_ID = import.meta.env.VITE_LINGO_PROJECT_ID;
  private static readonly BASE_URL = 'https://api.lingo.dev/v1';
  private static cache = new Map<string, Translation>();
  private static requestQueue: Promise<any> = Promise.resolve();

  /**
   * Vérifie si l'API est configurée
   */
  private static isConfigured(): boolean {
    if (!this.API_KEY || !this.PROJECT_ID) {
      console.warn('❌ Lingo.dev API non configurée');
      return false;
    }
    return true;
  }

  /**
   * File les requêtes API pour éviter les problèmes de concurrence
   */
  private static async queueRequest<T>(fn: () => Promise<T>): Promise<T> {
    this.requestQueue = this.requestQueue.then(() => fn());
    return this.requestQueue;
  }

  /**
   * Effectue une requête à l'API Lingo.dev
   */
  private static async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Lingo.dev API non configurée');
    }

    const url = `${this.BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
      'X-Project-ID': this.PROJECT_ID,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Lingo API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Initialise le projet avec les langues supportées
   */
  static async initializeProject(): Promise<void> {
    return this.queueRequest(async () => {
      try {
        if (!this.isConfigured()) {
          console.warn('🌍 Mode simulation - Lingo.dev non configuré');
          return;
        }

        // Créer ou mettre à jour les langues supportées
        const languages = this.getSupportedLanguages();
        
        for (const language of languages) {
          if (language.enabled) {
            await this.makeRequest('/languages', {
              method: 'POST',
              body: JSON.stringify({
                code: language.code,
                name: language.name,
                native_name: language.nativeName,
                enabled: true,
              }),
            });
          }
        }

        console.log('✅ Projet Lingo.dev initialisé');
        toast.success('🌍 Traductions automatiques activées');
      } catch (error: any) {
        console.error('❌ Erreur initialisation Lingo:', error);
        Sentry.captureException(error);
        // Ne pas afficher d'erreur à l'utilisateur, continuer en mode fallback
      }
    });
  }

  /**
   * Traduit automatiquement un texte
   */
  static async translateText(
    text: string, 
    targetLanguage: string, 
    sourceLanguage: string = 'fr',
    context?: string
  ): Promise<string> {
    return this.queueRequest(async () => {
      try {
        if (!text?.trim()) return text;
        
        // Vérifier le cache
        const cacheKey = `${text}-${sourceLanguage}-${targetLanguage}`;
        if (this.cache.has(cacheKey)) {
          return this.cache.get(cacheKey)!.value;
        }

        if (!this.isConfigured()) {
          // Mode fallback avec traductions basiques
          return this.getFallbackTranslation(text, targetLanguage);
        }

        const response = await this.makeRequest('/translate', {
          method: 'POST',
          body: JSON.stringify({
            text,
            source_language: sourceLanguage,
            target_language: targetLanguage,
            context,
            preserve_formatting: true,
            use_ai: true,
          }),
        });

        const translation = response.translated_text || text;
        
        // Mettre en cache
        this.cache.set(cacheKey, {
          key: cacheKey,
          value: translation,
          language: targetLanguage,
          context,
        });

        return translation;
      } catch (error: any) {
        console.warn('⚠️ Erreur traduction Lingo:', error);
        Sentry.captureException(error);
        return this.getFallbackTranslation(text, targetLanguage);
      }
    });
  }

  /**
   * Traduit automatiquement tout le contenu d'une page
   */
  static async translatePageContent(targetLanguage: string): Promise<void> {
    return this.queueRequest(async () => {
      try {
        if (!this.isConfigured()) {
          console.warn('🌍 Mode simulation - Traduction de page');
          return;
        }

        // Sélectionner tous les éléments de texte
        const textElements = document.querySelectorAll(
          'h1, h2, h3, h4, h5, h6, p, span, div, button, a, label, input[placeholder], textarea[placeholder]'
        );

        const translations: Array<{ element: Element; originalText: string; translatedText: string }> = [];

        // Collecter tous les textes à traduire
        const textsToTranslate: Array<{ text: string; element: Element; attribute?: string }> = [];

        textElements.forEach(element => {
          // Texte du contenu
          if (element.textContent?.trim() && !element.querySelector('*')) {
            textsToTranslate.push({
              text: element.textContent.trim(),
              element,
            });
          }

          // Attributs placeholder
          const placeholder = element.getAttribute('placeholder');
          if (placeholder?.trim()) {
            textsToTranslate.push({
              text: placeholder.trim(),
              element,
              attribute: 'placeholder',
            });
          }

          // Attributs title
          const title = element.getAttribute('title');
          if (title?.trim()) {
            textsToTranslate.push({
              text: title.trim(),
              element,
              attribute: 'title',
            });
          }

          // Attributs aria-label
          const ariaLabel = element.getAttribute('aria-label');
          if (ariaLabel?.trim()) {
            textsToTranslate.push({
              text: ariaLabel.trim(),
              element,
              attribute: 'aria-label',
            });
          }
        });

        // Traduire par lots pour optimiser les performances
        const batchSize = 10;
        for (let i = 0; i < textsToTranslate.length; i += batchSize) {
          const batch = textsToTranslate.slice(i, i + batchSize);
          
          const batchTranslations = await Promise.all(
            batch.map(async ({ text, element, attribute }) => {
              const translatedText = await this.translateText(text, targetLanguage);
              return { element, attribute, originalText: text, translatedText };
            })
          );

          // Appliquer les traductions
          batchTranslations.forEach(({ element, attribute, translatedText }) => {
            if (attribute) {
              element.setAttribute(attribute, translatedText);
            } else {
              element.textContent = translatedText;
            }
          });

          // Petite pause pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`✅ Page traduite en ${targetLanguage}`);
        toast.success(`🌍 Page traduite en ${this.getLanguageName(targetLanguage)}`);
      } catch (error: any) {
        console.error('❌ Erreur traduction de page:', error);
        Sentry.captureException(error);
        toast.error('❌ Erreur lors de la traduction automatique');
      }
    });
  }

  /**
   * Synchronise les traductions avec le projet Lingo.dev
   */
  static async syncTranslations(): Promise<void> {
    return this.queueRequest(async () => {
      try {
        if (!this.isConfigured()) {
          console.warn('🌍 Mode simulation - Sync traductions');
          return;
        }

        // Envoyer toutes les traductions en cache vers Lingo.dev
        const translations = Array.from(this.cache.values());
        
        if (translations.length === 0) {
          console.log('Aucune traduction à synchroniser');
          return;
        }

        await this.makeRequest('/translations/batch', {
          method: 'POST',
          body: JSON.stringify({
            translations: translations.map(t => ({
              key: t.key,
              value: t.value,
              language: t.language,
              context: t.context,
            })),
          }),
        });

        console.log(`✅ ${translations.length} traductions synchronisées`);
        toast.success(`🌍 ${translations.length} traductions synchronisées`);
      } catch (error: any) {
        console.error('❌ Erreur sync traductions:', error);
        Sentry.captureException(error);
        toast.error('❌ Erreur lors de la synchronisation');
      }
    });
  }

  /**
   * Récupère les langues supportées
   */
  static getSupportedLanguages(): SupportedLanguage[] {
    return [
      { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', enabled: true },
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', enabled: true },
      { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', enabled: true },
      { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', enabled: true },
      { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', enabled: true },
      { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇵🇹', enabled: true },
      { code: 'ru', name: 'Русский', nativeName: 'Русский', flag: '🇷🇺', enabled: true },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', enabled: true },
      { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', enabled: true },
      { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', enabled: true },
    ];
  }

  /**
   * Obtient le nom d'une langue par son code
   */
  static getLanguageName(code: string): string {
    const language = this.getSupportedLanguages().find(l => l.code === code);
    return language?.nativeName || code;
  }

  /**
   * Traductions de fallback pour les cas où l'API n'est pas disponible
   */
  private static getFallbackTranslation(text: string, targetLanguage: string): string {
    const fallbackTranslations: Record<string, Record<string, string>> = {
      en: {
        'Salut': 'Hello',
        'Bonjour': 'Good morning',
        'Bonsoir': 'Good evening',
        'Merci': 'Thank you',
        'Au revoir': 'Goodbye',
        'Oui': 'Yes',
        'Non': 'No',
        'Commencer': 'Start',
        'Continuer': 'Continue',
        'Suivant': 'Next',
        'Précédent': 'Previous',
        'Terminer': 'Finish',
        'Annuler': 'Cancel',
        'Confirmer': 'Confirm',
        'Sauvegarder': 'Save',
        'Charger': 'Load',
        'Erreur': 'Error',
        'Succès': 'Success',
        'Attention': 'Warning',
        'Information': 'Information',
      },
      es: {
        'Salut': 'Hola',
        'Bonjour': 'Buenos días',
        'Bonsoir': 'Buenas noches',
        'Merci': 'Gracias',
        'Au revoir': 'Adiós',
        'Oui': 'Sí',
        'Non': 'No',
        'Commencer': 'Empezar',
        'Continuer': 'Continuar',
        'Suivant': 'Siguiente',
        'Précédent': 'Anterior',
        'Terminer': 'Terminar',
        'Annuler': 'Cancelar',
        'Confirmer': 'Confirmar',
        'Sauvegarder': 'Guardar',
        'Charger': 'Cargar',
        'Erreur': 'Error',
        'Succès': 'Éxito',
        'Attention': 'Atención',
        'Information': 'Información',
      },
      de: {
        'Salut': 'Hallo',
        'Bonjour': 'Guten Morgen',
        'Bonsoir': 'Guten Abend',
        'Merci': 'Danke',
        'Au revoir': 'Auf Wiedersehen',
        'Oui': 'Ja',
        'Non': 'Nein',
        'Commencer': 'Beginnen',
        'Continuer': 'Fortsetzen',
        'Suivant': 'Weiter',
        'Précédent': 'Zurück',
        'Terminer': 'Beenden',
        'Annuler': 'Abbrechen',
        'Confirmer': 'Bestätigen',
        'Sauvegarder': 'Speichern',
        'Charger': 'Laden',
        'Erreur': 'Fehler',
        'Succès': 'Erfolg',
        'Attention': 'Achtung',
        'Information': 'Information',
      },
    };

    const translations = fallbackTranslations[targetLanguage];
    return translations?.[text] || text;
  }

  /**
   * Détecte automatiquement la langue du navigateur
   */
  static detectBrowserLanguage(): string {
    const browserLang = navigator.language.split('-')[0];
    const supportedCodes = this.getSupportedLanguages().map(l => l.code);
    return supportedCodes.includes(browserLang) ? browserLang : 'fr';
  }

  /**
   * Applique la traduction automatique à toute l'application
   */
  static async enableAutoTranslation(targetLanguage: string): Promise<void> {
    try {
      // Initialiser le projet si nécessaire
      await this.initializeProject();

      // Traduire le contenu actuel
      await this.translatePageContent(targetLanguage);

      // Observer les changements DOM pour traduire le nouveau contenu
      this.observeContentChanges(targetLanguage);

      console.log(`✅ Traduction automatique activée pour ${targetLanguage}`);
    } catch (error: any) {
      console.error('❌ Erreur activation traduction auto:', error);
      Sentry.captureException(error);
    }
  }

  /**
   * Observe les changements DOM pour traduire automatiquement le nouveau contenu
   */
  private static observeContentChanges(targetLanguage: string): void {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(async (mutations) => {
      const addedNodes: Node[] = [];
      
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            addedNodes.push(node);
          }
        });
      });

      if (addedNodes.length > 0) {
        // Attendre un peu pour que le contenu soit stable
        setTimeout(async () => {
          for (const node of addedNodes) {
            if (node instanceof Element) {
              await this.translateElement(node, targetLanguage);
            }
          }
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Stocker l'observer pour pouvoir l'arrêter plus tard
    (window as any).__lingoObserver = observer;
  }

  /**
   * Traduit un élément DOM spécifique
   */
  private static async translateElement(element: Element, targetLanguage: string): Promise<void> {
    try {
      // Traduire le texte de l'élément
      if (element.textContent?.trim() && !element.querySelector('*')) {
        const originalText = element.textContent.trim();
        const translatedText = await this.translateText(originalText, targetLanguage);
        element.textContent = translatedText;
      }

      // Traduire les attributs
      const attributesToTranslate = ['placeholder', 'title', 'aria-label'];
      for (const attr of attributesToTranslate) {
        const value = element.getAttribute(attr);
        if (value?.trim()) {
          const translatedValue = await this.translateText(value.trim(), targetLanguage);
          element.setAttribute(attr, translatedValue);
        }
      }

      // Traduire les éléments enfants
      const children = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label');
      for (const child of children) {
        if (child.textContent?.trim() && !child.querySelector('*')) {
          const originalText = child.textContent.trim();
          const translatedText = await this.translateText(originalText, targetLanguage);
          child.textContent = translatedText;
        }
      }
    } catch (error: any) {
      console.warn('⚠️ Erreur traduction élément:', error);
    }
  }

  /**
   * Désactive la traduction automatique
   */
  static disableAutoTranslation(): void {
    const observer = (window as any).__lingoObserver;
    if (observer) {
      observer.disconnect();
      delete (window as any).__lingoObserver;
    }
    console.log('🌍 Traduction automatique désactivée');
  }
}