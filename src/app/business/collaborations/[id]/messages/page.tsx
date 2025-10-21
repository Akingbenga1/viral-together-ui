'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnifiedDashboardLayout from '@/components/Layout/UnifiedDashboardLayout';
import { apiClient } from '@/lib/api';
import { 
  ArrowLeft,
  MessageCircle,
  Send,
  User,
  Bot,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: number;
  promotion_id: number;
  collaboration_id: number | null;
  sender_type: string;
  sender_name: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function CollaborationMessagesPage() {
  const router = useRouter();
  const params = useParams();
  const promotionId = useMemo(() => Number(params?.id), [params]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promotionId || Number.isNaN(promotionId)) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getPromotionMessages(promotionId);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Unable to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [promotionId]);

  const getMessageIcon = (senderType: string) => {
    switch (senderType) {
      case 'system':
        return <Bot className="w-5 h-5 text-cyan-400" />;
      case 'business':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'influencer':
        return <User className="w-5 h-5 text-purple-400" />;
      default:
        return <MessageCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getMessageBgColor = (senderType: string) => {
    switch (senderType) {
      case 'system':
        return 'bg-slate-700/40 border-slate-600/50';
      case 'business':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'influencer':
        return 'bg-purple-500/10 border-purple-500/20';
      default:
        return 'bg-slate-700/30 border-slate-600/30';
    }
  };

  return (
    <UnifiedDashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/business/collaborations')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Collaborations</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Promotion Messages</h1>
              <p className="text-slate-400 text-sm">Promotion #{promotionId}</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-slate-300">Loading messages...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to load</h3>
            <p className="text-slate-300">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-12 text-center">
                <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Messages Yet</h3>
                <p className="text-slate-400">No messages for this promotion.</p>
              </div>
            ) : (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border ${getMessageBgColor(msg.sender_type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getMessageIcon(msg.sender_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{msg.sender_name}</span>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          <p className="text-slate-200 text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}


