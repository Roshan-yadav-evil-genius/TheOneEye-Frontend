"use client";
import React from 'react';
import ScrollFadeInSection from '@/components/common/ScrollFadeInSection';
import { ContactForm } from '@/components/common/ContactForm';
import { ContactInfo } from '@/components/common/ContactInfo';
import { Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFadeInSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-50 mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Have questions about our automation solutions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </ScrollFadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info */}
          <ScrollFadeInSection>
            <div className="space-y-6">
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <ContactInfo />
              </div>
              
              {/* Response Expectation */}
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-2">Response Time</h3>
                    <p className="text-slate-300 text-sm">
                      We reply within <strong className="text-primary">24 hours</strong> to all inquiries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Address - Prominent Display */}
              <div className="p-6 bg-slate-800/50 border border-primary/30 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-1">Email Us Directly</h3>
                    <a 
                      href="mailto:roshanyadav1st@gmail.com" 
                      className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                    >
                      roshanyadav1st@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFadeInSection>

          {/* Right Side - Contact Form */}
          <ScrollFadeInSection>
            <div className="space-y-6">
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-slate-50 mb-2">Send us a message</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </ScrollFadeInSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
