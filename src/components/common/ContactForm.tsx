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
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            placeholder="Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-foreground">Company</Label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleInputChange}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            placeholder="Company"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            placeholder="Phone"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
            placeholder="Email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-foreground">Subject</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleInputChange}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
          placeholder="Subject"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleInputChange}
          className="min-h-[100px] resize-y border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
          placeholder="Message"
        />
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary px-6 py-2 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:shadow-primary/40 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          We reply within <strong className="text-primary">24 hours</strong>
        </p>
      </div>
    </form>
  );
};
