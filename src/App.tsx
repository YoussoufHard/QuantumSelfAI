import React, { useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Clé API Tavus importée depuis .env (VITE_TAVUS_API_KEY)
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;
const TAVUS_API_URL = 'https://api.tavus.io/v2';

const api = axios.create({
  baseURL: TAVUS_API_URL,
  headers: {
    'x-api-key': TAVUS_API_KEY,
    'Content-Type': 'application/json',
  },
});

const REPLICA_ID = 'rf4703150052'; // Utilise ce replica Tavus pour toutes les générations

const App: React.FC = () => {
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [script, setScript] = useState<string>("Salut ! Je suis ton avatar AI créé avec Tavus. Comment puis-je t'aider aujourd'hui ?");
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Générer une conversation Tavus avec le replica existant
  const testAvatar = useCallback(async () => {
    setApiError(null);
    setLoading(true);
    setConversationUrl(null);
    try {
      const response = await api.post('/conversations', {
        replica_id: REPLICA_ID,
        conversation_name: 'TestConversation',
        greeting: script,
        language: 'fr',
        max_call_duration: 300,
      });
      const { meeting_url } = response.data;
      if (meeting_url) {
        setConversationUrl(meeting_url);
        toast.success('Conversation créée ! Cliquez sur le lien pour interagir avec votre avatar.');
      } else {
        setApiError('Aucun lien de conversation retourné.');
        toast.error('Aucun lien de conversation retourné.');
      }
    } catch (error: any) {
      setApiError(error.response?.data?.error || error.message);
      toast.error(`Erreur lors de la création de la conversation: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  }, [script]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Test de l'Avatar Tavus</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Générer une conversation avec ton avatar Tavus</h2>
        <label htmlFor="script" className="block text-sm font-medium mb-1">Texte de l'avatar</label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={4}
          placeholder="Entrez le texte que l'avatar dira..."
        />
        <button
          onClick={testAvatar}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Génération en cours...' : 'Générer la conversation'}
        </button>
        {apiError && (
          <div className="mt-2 text-red-600 text-sm font-semibold">{apiError}</div>
        )}
        {conversationUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Lien de la conversation</h3>
            <a
              href={conversationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Rejoindre la salle pour voir votre avatar
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;