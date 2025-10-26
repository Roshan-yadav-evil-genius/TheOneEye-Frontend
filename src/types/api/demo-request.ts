export interface DemoRequest {
  id: string;
  full_name: string;
  company_name: string;
  work_email: string;
  automation_needs: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DemoRequestCreateData {
  full_name: string;
  company_name: string;
  work_email: string;
  automation_needs: string;
}
