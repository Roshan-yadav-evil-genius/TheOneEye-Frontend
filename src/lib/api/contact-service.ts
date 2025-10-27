import { axiosApiClient } from './axios-client';
import { ContactFormData, ContactSubmission } from '@/types/contact';

export class ContactService {
  static async submitContactForm(data: ContactFormData): Promise<ContactSubmission> {
    const response = await axiosApiClient.post<ContactSubmission>('/contact/submissions/', data);
    return response;
  }
}
