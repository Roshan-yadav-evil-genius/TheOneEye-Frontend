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
}

/**
 * Extracts error message from DRF error response
 */
export const extractErrorMessage = (error: AxiosDRFError): string => {
  // If it's a network error or no response
  if (!error.response) {
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
 * Shows error toast with extracted message
 */
export const showErrorToast = (error: AxiosDRFError, title: string = 'Error') => {
  const message = extractErrorMessage(error)
  toast.error(title, {
    description: message,
    duration: 5000,
    style: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
    },
    descriptionClassName: 'text-red-700',
  })
}

/**
 * Shows success toast
 */
export const showSuccessToast = (message: string, title: string = 'Success') => {
  toast.success(title, {
    description: message,
    duration: 3000,
    style: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#16a34a',
    },
    descriptionClassName: 'text-green-700',
  })
}

/**
 * Shows info toast
 */
export const showInfoToast = (message: string, title: string = 'Info') => {
  toast.info(title, {
    description: message,
    duration: 3000,
    style: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      color: '#2563eb',
    },
    descriptionClassName: 'text-blue-700',
  })
}

/**
 * Wraps async function with error handling
 */
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorTitle: string = 'Operation Failed'
): Promise<T | null> => {
  try {
    return await asyncFn()
  } catch (error) {
    showErrorToast(error as AxiosDRFError, errorTitle)
    return null
  }
}
