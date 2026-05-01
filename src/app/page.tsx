"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <nav className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="RITE Rise Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-foreground">RITE Rise</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 font-medium transition-colors shadow-lg shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-7xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
              Connect. Collaborate.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Grow Together.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              The all-in-one platform for your college community. Connect with peers, showcase projects,
              find opportunities, and build your academic network - all in one place.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
              >
                Join RITE Rise
              </Link>
              <Link
                href="/feed"
                className="bg-background/50 backdrop-blur-sm text-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-muted transition-all border border-border hover:-translate-y-1"
              >
                Explore Feed
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              Everything You Need in One Platform
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Professional Profiles</h3>
                <p className="text-muted-foreground leading-relaxed">Build your academic identity with detailed profiles showcasing skills, projects, and achievements.</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Project Showcase</h3>
                <p className="text-muted-foreground leading-relaxed">Share your repositories, get feedback, and collaborate on projects with your peers.</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Career Opportunities</h3>
                <p className="text-muted-foreground leading-relaxed">Discover internships, jobs, and research opportunities tailored for your college community.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              Built for Everyone in Your College
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { role: 'Students', desc: 'Network, showcase work, find opportunities', color: 'bg-primary/10 text-primary' },
                { role: 'Professors', desc: 'Share research, mentor students, collaborate', color: 'bg-primary/10 text-primary' },
                { role: 'Management', desc: 'Announce events, manage departments, connect', color: 'bg-primary/10 text-primary' },
                { role: 'Alumni', desc: 'Give back, hire talent, stay connected', color: 'bg-primary/10 text-primary' },
              ].map((item, i) => (
                <motion.div 
                  key={item.role} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="font-bold text-xl">{item.role[0]}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{item.role}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of students, professors, and staff already connected on RITE Rise.
            </p>
            <Link
              href="/register"
              className="inline-block bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="RITE Rise Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-foreground">RITE Rise</span>
              </div>
              <p className="text-sm text-muted-foreground">Connecting academic communities worldwide.</p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/feed" className="hover:text-primary transition-colors">Feed</Link></li>
                <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
                <li><Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link></li>
                <li><Link href="/repos" className="hover:text-primary transition-colors">Repos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-sm text-center text-muted-foreground">
            &copy; 2026 RITE Rise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
