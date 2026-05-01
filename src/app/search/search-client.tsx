'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Loader2, Search, Users, FileText, Code, Calendar } from 'lucide-react';

export function SearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  return <SearchPageContent query={query} />;
}

function SearchPageContent({ query }: { query: string }) {
  const router = useRouter();
  const [results, setResults] = useState<any>({ users: [], posts: [], repos: [], events: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query, activeTab]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'users', label: 'People', icon: Users },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'repos', label: 'Repos', icon: Code },
    { id: 'events', label: 'Events', icon: Calendar },
  ];

  return (
    <AppLayout>
      <div className="flex items-center gap-4 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem('q') as HTMLInputElement;
            if (input.value.trim()) {
              router.push(`/search?q=${encodeURIComponent(input.value.trim())}`);
            }
          }}
          className="flex-1 relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            name="q"
            defaultValue={query}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Search people, posts, projects, events..."
          />
        </form>
      </div>

      <div className="flex gap-4 border-b mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-1 font-medium ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {(activeTab === 'all' || activeTab === 'users') && results.users?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">People</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.users.map((user: any) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.id}`}
                    className="bg-white rounded-xl border p-4 flex items-center gap-3 hover:border-primary-200 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">@{user.username} • {user.role}</p>
                      {user.department && <p className="text-xs text-gray-400">{user.department}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'posts') && results.posts?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Posts</h2>
              <div className="space-y-3">
                {results.posts.map((post: any) => (
                  <div key={post.id} className="bg-white rounded-xl border p-4">
                    <Link href={`/profile/${post.author.id}`} className="font-medium text-primary-600">
                      {post.author.firstName} {post.author.lastName}
                    </Link>
                    <p className="text-gray-800 mt-1 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'repos') && results.repos?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Repositories</h2>
              <div className="space-y-3">
                {results.repos.map((repo: any) => (
                  <div key={repo.id} className="bg-white rounded-xl border p-4">
                    <Link href={`/repos/${repo.id}`} className="font-semibold text-primary-600">
                      {repo.name}
                    </Link>
                    {repo.description && <p className="text-gray-600 text-sm mt-1">{repo.description}</p>}
                    <p className="text-xs text-gray-500 mt-1">by {repo.owner.firstName} {repo.owner.lastName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'events') && results.events?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Events</h2>
              <div className="space-y-3">
                {results.events.map((event: any) => (
                  <div key={event.id} className="bg-white rounded-xl border p-4">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.startTime).toLocaleDateString()} • {event.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && (
            <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
              {query ? 'No more results found' : 'Enter a search term to get started'}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
