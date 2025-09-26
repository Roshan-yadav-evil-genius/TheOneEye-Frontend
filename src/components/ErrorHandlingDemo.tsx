import React from 'react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/errorHandler'

/**
 * Demo component to test error handling with Sonner toasts
 * This can be used to test different error scenarios
 */
export const ErrorHandlingDemo: React.FC = () => {
  const simulateNetworkError = () => {
    showToast('Network error. Please check your connection and try again.')
  }

  const simulateDRFValidationError = () => {
    showToast('username: This field is required.; email: Enter a valid email address.')
  }

  const simulateServerError = () => {
    showToast('Internal server error. Please try again later.')
  }

  const simulateSuccess = () => {
    showToast('Operation completed successfully!')
  }

  const simulateInfo = () => {
    showToast('This is an informational message')
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Error Handling Demo</h2>
      <p className="text-gray-600">Click the buttons below to test different error scenarios:</p>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={simulateNetworkError} variant="destructive">
          Test Network Error
        </Button>
        
        <Button onClick={simulateDRFValidationError} variant="destructive">
          Test DRF Validation Error
        </Button>
        
        <Button onClick={simulateServerError} variant="destructive">
          Test Server Error
        </Button>
        
        <Button onClick={simulateSuccess} variant="default">
          Test Success Toast
        </Button>
        
        <Button onClick={simulateInfo} variant="outline">
          Test Info Toast
        </Button>
      </div>
    </div>
  )
}
