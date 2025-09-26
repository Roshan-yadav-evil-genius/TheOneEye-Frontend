import { toast } from 'sonner'

// DRF Error Response Structure
interface DRFErrorResponse {
  detail?: string
  [key: string]: any
}

// Axios Error with DRF response
interface AxiosDRFError {
  response?: {
    status: number
    data: DRFErrorResponse | string
  }
  message: string
  code?: string
}

/**
 * Extracts error message from DRF error response
 */
export const extractErrorMessage = (error: AxiosDRFError): string => {
  // If it's a network error or no response
  if (!error.response) {
    // Check for specific Axios timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }
    return 'Network error. Please check your connection and try again.'
  }

  const { status, data } = error.response

  // Handle different status codes
  switch (status) {
    case 400:
      return 'Bad request. Please check your input and try again.'
    case 401:
      return 'Unauthorized. Please log in and try again.'
    case 403:
      return 'Forbidden. You do not have permission to perform this action.'
    case 404:
      return 'Resource not found. Please refresh and try again.'
    case 500:
      return 'Server error. Please try again later.'
    default:
      break
  }

  // Extract message from DRF response
  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object') {
    // Handle DRF validation errors
    if (data.detail) {
      return data.detail
    }

    // Handle field-specific errors
    const fieldErrors = Object.entries(data)
      .filter(([_, value]) => Array.isArray(value) && value.length > 0)
      .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
      .join('; ')

    if (fieldErrors) {
      return fieldErrors
    }

    // Handle non-field errors
    const nonFieldErrors = data.non_field_errors || data.nonFieldErrors
    if (nonFieldErrors && Array.isArray(nonFieldErrors)) {
      return nonFieldErrors.join(', ')
    }
  }

  return `Request failed with status ${status}. Please try again.`
}

/**
 * Shows a basic toast message - no colors, no styling, just the message
 */
export const showToast = (message: string) => {
  toast(message)
}

/**
 * Wraps async function with error handling
 */
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorTitle: string = 'Operation Failed',
  defaultValue?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn()
  } catch (error) {
    const message = extractErrorMessage(error as AxiosDRFError)
    showToast(message)
    return defaultValue
  }
}
