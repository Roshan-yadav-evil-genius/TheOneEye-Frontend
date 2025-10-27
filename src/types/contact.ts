export interface ContactFormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  created_at: string;
  status: string;
}
