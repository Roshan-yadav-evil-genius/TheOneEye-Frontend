"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ContactFormData } from '@/types/contact';
import { ContactService } from '@/lib/api/contact-service';
import { toast } from 'sonner';

interface ContactFormProps {
  onSubmitSuccess?: () => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmitSuccess, 
  className = "" 
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ContactService.submitContactForm(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
      
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-50">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
            placeholder="Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-slate-50">Company</Label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleInputChange}
            className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
            placeholder="Company"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-50">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
            placeholder="Phone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-50">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
            placeholder="Email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-slate-50">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleInputChange}
          className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
          placeholder="Subject"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-50">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleInputChange}
          className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 min-h-[100px] resize-y"
          placeholder="Message"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
};
