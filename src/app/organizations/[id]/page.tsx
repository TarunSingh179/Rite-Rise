"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Building2, MapPin, Users, BookOpen, ExternalLink, ArrowLeft, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | null;
  role: string;
}

interface Member {
  user: User;
  role: string;
}

interface Department {
  id: string;
  name: string;
  description: string | null;
  _count: {
    members: number;
  };
}

interface Organization {
  id: string;
  name: string;
  description: string | null;
  type: string;
  website: string | null;
  location: string | null;
  members: Member[];
  departments: Department[];
  _count: {
    members: number;
    departments: number;
  };
}

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, [params.id]);

  const fetchOrganization = async () => {
    try {
      const res = await fetch(`/api/organizations/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrg(data);
      } else {
        router.push('/organizations');
      }
    } catch (error) {
      console.error('Failed to fetch organization', error);
      router.push('/organizations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-muted rounded-3xl" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="h-48 bg-muted rounded-3xl" />
              <div className="h-64 bg-muted rounded-3xl" />
            </div>
            <div className="h-96 bg-muted rounded-3xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!org) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link 
          href="/organizations" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        {/* Header Section */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />
          <div className="px-6 sm:px-10 pb-10">
            <div className="relative -mt-16 flex flex-col sm:flex-row gap-6 sm:items-end sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
                <div className="w-32 h-32 bg-background rounded-2xl border-4 border-background shadow-lg flex items-center justify-center text-primary">
                  <Building2 className="w-16 h-16" />
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{org.name}</h1>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {org.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {org.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {org.location}
                      </div>
                    )}
                    {org.website && (
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 self-start sm:self-auto flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {org.description || 'No description available for this organization.'}
              </p>
            </div>

            {/* Departments */}
            <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Departments ({org._count.departments})
                </h2>
              </div>
              
              {org.departments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No departments added yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {org.departments.map((dept) => (
                    <div key={dept.id} className="p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/30 transition-colors">
                      <h3 className="font-semibold text-foreground mb-1">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{dept.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {dept._count.members} Members
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Members Section */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Members ({org._count.members})
              </h2>

              {org.members.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No members yet.</p>
              ) : (
                <div className="space-y-4">
                  {org.members.slice(0, 10).map((member) => (
                    <Link 
                      key={member.user.id} 
                      href={`/profile/${member.user.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {member.user.firstName[0]}{member.user.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.role} • {member.user.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
