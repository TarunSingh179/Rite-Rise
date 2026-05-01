'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  Code,
  MessageSquare,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { icon: Home, label: 'Feed', href: '/feed' },
  { icon: Users, label: 'Connections', href: '/connections' },
  { icon: Building2, label: 'Organizations', href: '/organizations' },
  { icon: Code, label: 'Repos', href: '/repos' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!session) return null;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b z-50 transition-colors duration-300">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/feed" className="flex items-center space-x-2">
            <img src="/logo.png" alt="RITE Rise Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-foreground hidden md:block">RITE Rise</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, posts, projects..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-background outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/notifications" className="p-2 hover:bg-muted rounded-lg relative transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link href={`/profile/${session.user.id}`} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg lg:hidden transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden border-t bg-background px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-background/50 backdrop-blur-md border-r flex-col p-4 overflow-y-auto transition-colors duration-300">
      <Link href={`/profile/${session.user.id}`} className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg mb-4 transition-colors">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">
            {session.user.firstName?.[0]}{session.user.lastName?.[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">
            {session.user.firstName} {session.user.lastName}
          </p>
          <p className="text-sm text-muted-foreground truncate">@{session.user.username}</p>
        </div>
      </Link>

      <nav className="flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground px-3">
          <p>&copy; 2026 RITE Rise</p>
        </div>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16 min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-background -z-10" />
        <div className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
