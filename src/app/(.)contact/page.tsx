"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactForm } from '@/components/common/ContactForm';
import { ContactInfo } from '@/components/common/ContactInfo';
import { useRouter } from 'next/navigation';

export default function ContactModalPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl lg:min-w-4xl flex flex-col justify-center bg-slate-800 border-slate-700 py-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-slate-50 text-center">
            Contact Us
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 px-6">
          {/* Left Side - Contact Info */}
          <div className="space-y-6">
            <ContactInfo />
          </div>

          {/* Right Side - Contact Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-50">Send us a message</h2>
            <ContactForm onSubmitSuccess={handleClose} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
