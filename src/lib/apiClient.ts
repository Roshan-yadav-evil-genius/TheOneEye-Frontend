import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = 'http://localhost:8001/api'

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      error.message = 'Request timeout. Please try again.'
    } else if (!error.response) {
      // Network error
      error.message = 'Network error. Please check your connection.'
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
