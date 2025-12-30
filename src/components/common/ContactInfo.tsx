"use client";

import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const contactInfo = {
  headOffice: {
    address: "TOWER-2, WORLD TRADE CENTER, 218, Dholepatil Farms Rd, EON Free Zone, Kharadi, Pune, Maharashtra 411014"
  },
  email: {
    primary: "roshanyadav1st@gmail.com"
  },
  phone: {
    primary: "+91 98765 43210" // Placeholder phone number
  },
  socialMedia: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#"
  }
};

export const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-50 mb-3">Get in touch</h2>
        <p className="text-slate-300 text-sm">
          Sociosqu viverra lectus placerat sem efficitur molestie vehicula cubilia leo etiam nam.
        </p>
      </div>

      <div className="space-y-4">
        {/* Head Office */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-50">Head Office</h3>
            <p className="text-slate-300 text-sm">{contactInfo.headOffice.address}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-50">Email Us</h3>
            <a 
              href={`mailto:${contactInfo.email.primary}`}
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              {contactInfo.email.primary}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-50">Call Us</h3>
            <p className="text-slate-300 text-sm">Phone: {contactInfo.phone.primary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
