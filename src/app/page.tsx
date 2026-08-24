'use client';

import React, { useEffect } from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { TechStackSection } from '../components/sections/TechStackSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { GuestbookSection } from '../components/sections/GuestbookSection';
import { ContactSection } from '../components/sections/ContactSection';

import { AuroraBackground } from '../components/layout/AuroraBackground';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BackToTop } from '../components/layout/BackToTop';
import { SmoothScroller } from '../components/layout/SmoothScroller';
import { PageTransition } from '../components/layout/PageTransition';
import { ChatWidget } from '../components/chat/ChatWidget';
import api from '../lib/api';

export default function PublicPortfolioPage() {
  useEffect(() => {
    // Visitor tracking (kept exactly as before).
    const trackVisitor = async () => {
      let sessionId = sessionStorage.getItem('skylogic_session');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('skylogic_session', sessionId);
      }
      try {
        await api.post('/visitors/track', {
          page: window.location.pathname,
          referrer: document.referrer || null,
          sessionId,
        });
      } catch (error) {
        console.error('Failed to track visitor', error);
      }
    };
    trackVisitor();
  }, []);

  return (
    <>
      <PageTransition />
      <AuroraBackground />
      <SmoothScroller />
      <Navbar />

      <main className="relative">
        <HeroSection />
        <TechStackSection />
        <ServicesSection />
        <ProjectsSection />
        <GuestbookSection />
        <ContactSection />
      </main>

      <Footer />
      <BackToTop />
      <ChatWidget />
    </>
  );
}