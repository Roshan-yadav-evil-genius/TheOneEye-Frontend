// API Error Types
export class TApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'TApiError';
    this.status = status;
    this.data = data;
  }
}
