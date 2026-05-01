'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Send, Image, Link2, Hash, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  title: string | null;
  type: string;
  tags: string[];
  images: string[];
  createdAt: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
    department: string | null;
  };
  comments: { id: string }[];
  reactions: { id: string; type: string }[];
  repo: { id: string; name: string } | null;
}

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      const res = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      const data = await res.json();
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setFetchingPosts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'POST', tags: [] }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        setContent('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {session && (
            <div className="bg-white rounded-xl border p-4">
              <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold">
                      {session.user.firstName?.[0]}{session.user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share something with your network..."
                      className="w-full border-0 focus:ring-0 resize-none min-h-[80px] text-gray-900 placeholder:text-gray-400"
                      rows={3}
                    />
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <button type="button" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                          <Image className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                          <Link2 className="w-5 h-5" />
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                          <Hash className="w-5 h-5" />
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {fetchingPosts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <p className="text-gray-500">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Link href={`/profile/${post.author.id}`} className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-semibold">
                      {post.author.firstName[0]}{post.author.lastName[0]}
                    </span>
                  </Link>
                  <div className="flex-1">
                    <Link href={`/profile/${post.author.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                      {post.author.firstName} {post.author.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      @{post.author.username} {post.author.department && `• ${post.author.department}`} • {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {post.author.role}
                  </span>
                </div>

                {post.title && <h3 className="font-semibold text-lg mb-2">{post.title}</h3>}
                <p className="text-gray-800 whitespace-pre-wrap mb-3">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-600 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-6 pt-3 border-t">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">{post.reactions.length}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm">{post.comments.length}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {hasMore && !fetchingPosts && (
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchPosts(nextPage);
              }}
              className="w-full bg-white border rounded-xl p-3 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
            >
              Load more posts
            </button>
          )}
        </div>

        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trending Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['#hackathon', '#research', '#internship', '#webdev', '#ai', '#opensource'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Suggested Connections</h3>
            <div className="space-y-3">
              {[
                { name: 'Alex Johnson', role: 'Student', dept: 'Computer Science' },
                { name: 'Dr. Sarah Lee', role: 'Professor', dept: 'Mathematics' },
                { name: 'Mike Chen', role: 'Student', dept: 'Design' },
              ].map((person) => (
                <div key={person.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">{person.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.role} • {person.dept}</p>
                  </div>
                  <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {[
                { title: 'Tech Talk: AI in Education', date: 'Tomorrow, 3 PM' },
                { title: 'Hackathon 2026', date: 'Next Week' },
              ].map((event) => (
                <div key={event.title} className="p-2 hover:bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
