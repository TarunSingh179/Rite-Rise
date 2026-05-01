'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Loader2, MapPin, Link as LinkIcon, Github, Linkedin, Calendar, Building, Edit2, UserPlus, Check } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  department: string | null;
  year: number | null;
  graduationYear: number | null;
  location: string | null;
  website: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  role: string;
  verified: boolean;
  createdAt: string;
  connectionStatus: string;
  _count: {
    posts: number;
    connections: number;
    repos: number;
    events: number;
  };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        const data = await res.json();
        setUser(data.user);
        setConnections(data.connections);
        setPosts(data.posts);
        setRepos(data.repos);
        setSkills(data.skills);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProfile();
  }, [params.id]);

  const handleConnect = async () => {
    if (!session || !user) return;
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setUser({ ...user, connectionStatus: 'PENDING' });
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">User not found</p>
        </div>
      </AppLayout>
    );
  }

  const isOwnProfile = session?.user.id === user.id;

  return (
    <AppLayout>
      <div className="bg-white rounded-xl border overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 bg-white rounded-full p-1">
              <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-2xl">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                {user.verified && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
            </div>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                    Message
                  </button>
                  {user.connectionStatus === 'none' && (
                    <button
                      onClick={handleConnect}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Connect
                    </button>
                  )}
                  {user.connectionStatus === 'PENDING' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Pending
                    </button>
                  )}
                  {user.connectionStatus === 'ACCEPTED' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                      <Check className="w-4 h-4" />
                      Connected
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-gray-700">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            {user.role && (
              <span className="px-2 py-1 bg-primary-50 text-primary-600 rounded-full font-medium">
                {user.role}
              </span>
            )}
            {user.department && (
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {user.department}
              </span>
            )}
            {user.year && (
              <span>Year {user.year}</span>
            )}
            {user.graduationYear && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Class of {user.graduationYear}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {user.website && (
              <Link href={user.website} className="flex items-center gap-1 text-primary-600 hover:text-primary-700">
                <LinkIcon className="w-4 h-4" />
                Website
              </Link>
            )}
            {user.githubUrl && (
              <Link href={user.githubUrl} className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            )}
            {user.linkedinUrl && (
              <Link href={user.linkedinUrl} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Link>
            )}
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t">
            <Link href={`/profile/${user.id}`} className="text-center">
              <p className="font-bold text-gray-900">{user._count.posts}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </Link>
            <button className="text-center">
              <p className="font-bold text-gray-900">{user._count.connections}</p>
              <p className="text-sm text-gray-500">Connections</p>
            </button>
            <Link href="/repos" className="text-center">
              <p className="font-bold text-gray-900">{user._count.repos}</p>
              <p className="text-sm text-gray-500">Repos</p>
            </Link>
            <Link href="/events" className="text-center">
              <p className="font-bold text-gray-900">{user._count.events}</p>
              <p className="text-sm text-gray-500">Events</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex gap-4 border-b mb-4">
            {['posts', 'repos', 'connections', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-medium capitalize ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl border p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-gray-500">
                      <span>{post._count.comments} comments</span>
                      <span>{post._count.reactions} reactions</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                  No posts yet
                </div>
              )}
            </div>
          )}

          {activeTab === 'repos' && (
            <div className="space-y-4">
              {repos.length > 0 ? (
                repos.map((repo) => (
                  <div key={repo.id} className="bg-white rounded-xl border p-4">
                    <Link href={`/repos/${repo.id}`} className="text-lg font-semibold text-primary-600 hover:text-primary-700">
                      {repo.name}
                    </Link>
                    {repo.description && <p className="text-gray-600 mt-1">{repo.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {repo.language && <span>{repo.language}</span>}
                      <span>{repo._count.collaborators} collaborators</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                  No public repos yet
                </div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connections.length > 0 ? (
                connections.map((conn) => {
                  const connectionUser = conn.fromId === user.id ? conn.to : conn.from;
                  return (
                    <Link
                      key={connectionUser.id}
                      href={`/profile/${connectionUser.id}`}
                      className="bg-white rounded-xl border p-4 flex items-center gap-3 hover:border-primary-200 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {connectionUser.firstName[0]}{connectionUser.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {connectionUser.firstName} {connectionUser.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{connectionUser.role}</p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-2 bg-white rounded-xl border p-8 text-center text-gray-500">
                  No connections yet
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white rounded-xl border p-4">
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((userSkill) => (
                    <div key={userSkill.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{userSkill.skill.name}</span>
                      <span className="text-sm text-gray-500">{userSkill.endorsed} endorsements</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No skills added yet</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {connections.length > 0 && (
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Connections</h3>
              <div className="space-y-3">
                {connections.slice(0, 5).map((conn) => {
                  const connectionUser = conn.fromId === user.id ? conn.to : conn.from;
                  return (
                    <Link
                      key={connectionUser.id}
                      href={`/profile/${connectionUser.id}`}
                      className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg -mx-2"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-semibold">
                          {connectionUser.firstName[0]}{connectionUser.lastName[0]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {connectionUser.firstName} {connectionUser.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{connectionUser.role}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
