"use client";

import React from 'react';
import NavBar from "@/components/global/NavBar";
import { ContactForm } from '@/components/common/ContactForm';
import { ContactInfo } from '@/components/common/ContactInfo';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <NavBar />
      <div className="py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get in touch with our team. We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <div>
            <ContactInfo />
          </div>

          {/* Right Side - Contact Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-50">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
