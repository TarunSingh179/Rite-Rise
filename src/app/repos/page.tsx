'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Loader2, Star, GitFork, Code, Plus } from 'lucide-react';

interface Repo {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  visibility: string;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  collaborators: any[];
  _count: { issues: number; releases: number };
}

export default function ReposPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', language: '', visibility: 'PUBLIC' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const res = await fetch('/api/repos');
      const data = await res.json();
      setRepos(data.repos);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          topics: [],
        }),
      });
      if (res.ok) {
        const newRepo = await res.json();
        setRepos([newRepo, ...repos]);
        setShowCreateModal(false);
        setFormData({ name: '', description: '', language: '', visibility: 'PUBLIC' });
      }
    } catch (error) {
      console.error('Error creating repo:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
        {session && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Repo
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : repos.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No repositories yet</h3>
          <p className="text-gray-500">Create your first repository to showcase your projects</p>
        </div>
      ) : (
        <div className="space-y-4">
          {repos.map((repo) => (
            <div key={repo.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/repos/${repo.id}`} className="text-xl font-semibold text-primary-600 hover:text-primary-700">
                    {repo.owner.firstName}&apos;s / {repo.name}
                  </Link>
                  {repo.description && <p className="text-gray-600 mt-1">{repo.description}</p>}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  repo.visibility === 'PUBLIC' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {repo.visibility}
                </span>
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forks}
                </span>
                <span>{repo._count.issues} issues</span>
                {repo.topics.length > 0 && (
                  <div className="flex gap-2">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Repository</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="JavaScript, Python, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
