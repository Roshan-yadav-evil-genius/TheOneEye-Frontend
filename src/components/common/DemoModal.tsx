"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  companyName: string;
  workEmail: string;
  automationNeeds: string;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    companyName: '',
    workEmail: '',
    automationNeeds: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Show success toast
    toast.success('Demo request submitted successfully! We\'ll be in touch soon.', {
      duration: 4000,
    });

    // Reset form and close modal
    setFormData({
      fullName: '',
      companyName: '',
      workEmail: '',
      automationNeeds: ''
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-50">
            Book a Demo
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Tell us about your needs, and we'll prepare a tailored demo for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-50">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-slate-50">
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              required
              value={formData.companyName}
              onChange={handleInputChange}
              className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              placeholder="Enter your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workEmail" className="text-slate-50">
              Work Email
            </Label>
            <Input
              id="workEmail"
              name="workEmail"
              type="email"
              required
              value={formData.workEmail}
              onChange={handleInputChange}
              className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              placeholder="Enter your work email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="automationNeeds" className="text-slate-50">
              Tell us about your automation needs
            </Label>
            <Textarea
              id="automationNeeds"
              name="automationNeeds"
              required
              value={formData.automationNeeds}
              onChange={handleInputChange}
              className="bg-slate-700/50 border-slate-600 text-slate-50 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px] resize-y"
              placeholder="Describe your automation requirements and challenges..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 w-full hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {isSubmitting ? 'Submitting...' : 'Request Demo'}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
