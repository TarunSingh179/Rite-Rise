'use client';

import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2, Bell, UserPlus, MessageSquare, Heart, ThumbsUp, Briefcase, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  actor: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'connection': return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'like': return <ThumbsUp className="w-5 h-5 text-red-500" />;
      case 'comment': return <Heart className="w-5 h-5 text-purple-500" />;
      case 'job': return <Briefcase className="w-5 h-5 text-orange-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-indigo-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start gap-4 ${
                !notif.read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.content}</p>
                <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
