"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import ScrollFadeInSection from '@/components/common/ScrollFadeInSection';

interface BaseErrorPageProps {
  title: string;
  subtitle: string;
  description: string;
  error?: Error & { digest?: string };
  gradientColor?: 'blue' | 'red';
  actions: {
    primary: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
  };
}

export function BaseErrorPage({
  title,
  subtitle,
  description,
  error,
  gradientColor = 'blue',
  actions
}: BaseErrorPageProps) {
  const gradientClass = gradientColor === 'red' 
    ? 'bg-red-600/10 blur-[100px]' 
    : 'bg-blue-600/10 blur-[100px]';

  return (
    <main className="bg-slate-950 text-slate-50">
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Gradient background effect */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] sm:w-[150%] sm:h-[150%] lg:w-[100%] lg:h-[100%] rounded-full ${gradientClass}`} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollFadeInSection>
            {/* Logo and branding */}
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 font-medium hover:opacity-80 transition-opacity">
                <Image src="/logo.png" width={60} height={24} alt="TheOneEye" />
                <span className="text-xl font-bold">TheOneEye</span>
              </Link>
            </div>

            {/* Error Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tighter">
                {title}
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-50">
                {subtitle}
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
                {description}
              </p>
              
              {/* Error details for development */}
              {error && process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-left max-w-2xl mx-auto">
                  <p className="text-sm text-slate-400 mb-2">Error details (development only):</p>
                  <p className="text-sm text-red-400 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-slate-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  onClick={actions.primary.onClick}
                  className="px-8 py-4 text-lg font-semibold text-white bg-primary rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-primary"
                >
                  {actions.primary.icon && <span className="mr-2">{actions.primary.icon}</span>}
                  {actions.primary.label}
                </Button>
                {actions.secondary && (
                  <Button
                    onClick={actions.secondary.onClick}
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold text-white bg-slate-800/50 border-slate-600 rounded-full hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500"
                  >
                    {actions.secondary.icon && <span className="mr-2">{actions.secondary.icon}</span>}
                    {actions.secondary.label}
                  </Button>
                )}
              </div>
            </div>
          </ScrollFadeInSection>
        </div>
      </section>
    </main>
  );
}
