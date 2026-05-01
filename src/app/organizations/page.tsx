"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Building2, MapPin, Users, BookOpen } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

interface Organization {
  id: string;
  name: string;
  description: string | null;
  type: string;
  location: string | null;
  _count: {
    members: number;
    departments: number;
  };
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, [search]);

  const fetchOrganizations = async () => {
    try {
      const url = search ? `/api/organizations?q=${encodeURIComponent(search)}` : '/api/organizations';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error('Failed to fetch organizations', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Organizations Directory</h1>
            <p className="text-muted-foreground">Find and join universities, colleges, and clubs.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations..."
              className="w-full pl-10 pr-4 py-3 bg-muted/50 border-0 rounded-xl focus:ring-2 focus:ring-primary focus:bg-background outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No organizations found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {organizations.map((org, i) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/organizations/${org.id}`}>
                  <div className="h-full bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {org.name}
                          </h2>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground mt-1">
                            {org.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 mb-6 min-h-[3rem]">
                      {org.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      {org.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate max-w-[100px]">{org.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{org._count.members} Members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{org._count.departments} Depts</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
