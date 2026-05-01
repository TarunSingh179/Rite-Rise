'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Loader2, UserCheck, Clock, Users, UserPlus } from 'lucide-react';

interface Connection {
  id: string;
  status: string;
  createdAt: string;
  from: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
  };
  to: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
  };
}

export default function ConnectionsPage() {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const [acceptedRes, pendingRes] = await Promise.all([
        fetch('/api/connections?status=ACCEPTED'),
        fetch('/api/connections?status=PENDING'),
      ]);
      const acceptedData = await acceptedRes.json();
      const pendingData = await pendingRes.json();
      setConnections(acceptedData.connections || []);
      setPendingRequests(pendingData.connections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      });
      if (res.ok) {
        setPendingRequests(pendingRequests.filter(c => c.id !== connectionId));
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  };

  const handleDecline = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPendingRequests(pendingRequests.filter(c => c.id !== connectionId));
      }
    } catch (error) {
      console.error('Error declining connection:', error);
    }
  };

  const getOtherUser = (conn: Connection) => {
    return conn.from.id === session?.user.id ? conn.to : conn.from;
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
      </div>

      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex items-center gap-2 pb-3 px-1 font-medium ${
            activeTab === 'connections'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Connections
          <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {connections.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 pb-3 px-1 font-medium ${
            activeTab === 'pending'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending
          {pendingRequests.length > 0 && (
            <span className="ml-1 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : activeTab === 'pending' ? (
        pendingRequests.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-500">Connection requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((conn) => {
              const otherUser = getOtherUser(conn);
              const isIncoming = conn.to.id === session?.user.id;
              return (
                <div key={conn.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {otherUser.firstName[0]}{otherUser.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Link href={`/profile/${otherUser.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {otherUser.firstName} {otherUser.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">@{otherUser.username} • {otherUser.role}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isIncoming ? 'Wants to connect with you' : 'Pending response'}
                    </p>
                  </div>
                  {isIncoming && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(conn.id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(conn.id)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        connections.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No connections yet</h3>
            <p className="text-gray-500 mb-4">Start building your professional network</p>
            <Link href="/feed" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
              <UserPlus className="w-4 h-4" />
              Discover people
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((conn) => {
              const otherUser = getOtherUser(conn);
              return (
                <Link
                  key={conn.id}
                  href={`/profile/${otherUser.id}`}
                  className="bg-white rounded-xl border p-4 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {otherUser.firstName[0]}{otherUser.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {otherUser.firstName} {otherUser.lastName}
                      </p>
                      <p className="text-sm text-gray-500">@{otherUser.username}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {otherUser.role}
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-xs">
                      Message
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}
    </AppLayout>
  );
}
