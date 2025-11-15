// OAuth2 Form Data
export interface OAuth2FormData {
  title: string;
  client_id: string;
  secret: string;
  redirect_url: string;
}

export interface OAuth2FormProps {
  initialData?: Partial<OAuth2FormData>;
  onSubmit: (data: OAuth2FormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
}

