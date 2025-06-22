import React, { useState } from 'react';
import toast from 'react-hot-toast';

// À adapter selon où tu stockes la clé/API
const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;
const TAVUS_API_URL = 'https://tavusapi.com/v2';

interface TavusVideoChatProps {
  replicaId: string;
  personaId: string;
  conversationName: string;
  onClose: () => void;
  className?: string;
}

const TavusVideoChat: React.FC<TavusVideoChatProps> = ({
  replicaId,
  personaId,
  conversationName,
  onClose,
  className = ''
}) => {
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const createConversation = async () => {
    setApiError(null);
    setLoading(true);
    setConversationUrl(null);
    try {
      const response = await fetch(`${TAVUS_API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
        body: JSON.stringify({
          replica_id: replicaId,
          conversation_name: conversationName,
          persona_id: personaId
        }),
      });
      const data = await response.json();
      if (data.conversation_url) {
        setConversationUrl(data.conversation_url);
        toast.success('Conversation vidéo créée !');
      } else {
        setApiError(data.error || 'Aucun lien de conversation retourné.');
        toast.error(data.error || 'Aucun lien de conversation retourné.');
      }
    } catch (error: any) {
      setApiError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden p-8 max-w-lg mx-auto ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl">Vidéo avec l'avatar Tavus</h3>
        <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">✕</button>
      </div>
      <div className="space-y-6">
        {!conversationUrl && (
          <button
            onClick={createConversation}
            className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer la conversation vidéo'}
          </button>
        )}
        {apiError && <div className="text-red-400 text-sm font-semibold">{apiError}</div>}
        {conversationUrl && (
          <div className="text-center">
            <h4 className="text-white text-lg font-medium mb-2">Lien de la salle vidéo</h4>
            <a
              href={conversationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline text-lg"
            >
              Rejoindre la salle Tavus
            </a>
            <p className="text-slate-400 text-sm mt-2">Clique sur le lien pour démarrer la conversation vidéo avec ton avatar Tavus.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavusVideoChat;