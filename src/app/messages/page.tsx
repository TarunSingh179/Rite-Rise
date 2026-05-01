'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Send, Loader2, MoreVertical, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; firstName: string; lastName: string };
  receiver: { id: string; firstName: string; lastName: string };
}

interface Conversation {
  userId: string;
  name: string;
  lastMessage: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Remove socket-based typing indicators and replace with generic state
  const handleTyping = () => {
    // Disabled for Vercel deployment without Socket.io
  };

  useEffect(() => {
    fetchConversations();
    
    // Poll for conversations every 5 seconds
    const interval = setInterval(() => {
      fetchConversations(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
      setIsTyping(false);

      // Poll for messages every 3 seconds for the active conversation
      const interval = setInterval(() => {
        fetchMessages(selectedUser);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Replaced handleTyping definition is above

  const fetchConversations = async (showLoading = true) => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      if (showLoading) setFetching(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?receiverId=${userId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessageFn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedUser, content: newMessage }),
      });
      if (res.ok) {
        const message = await res.json();
        // Optimistically add message
        setMessages((prev) => [...prev, message]);
        // Also refresh conversations to update last message
        fetchConversations(false);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="bg-white rounded-xl border h-[calc(100vh-8rem)] flex overflow-hidden">
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {fetching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedUser(conv.userId)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b ${
                    selectedUser === conv.userId ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">
                      {conv.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium text-gray-900 text-sm truncate">{conv.name}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-xs">
                        {conversations.find(c => c.userId === selectedUser)?.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      onlineUsers.has(selectedUser) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {conversations.find(c => c.userId === selectedUser)?.name}
                    </p>
                    {isTyping && <p className="text-xs text-gray-500 italic">typing...</p>}
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isOwn = msg.sender.id === session?.user.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessageFn} className="p-4 border-t flex gap-3">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
