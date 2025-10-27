import { useEffect, useState } from 'react'
import { createOrUpdateUser, getUserProfile } from '../services/api'

// Simple mock for development without authentication
const mockUser = {
  id: 'dev-user',
  email: 'dev@example.com',
  username: 'Developer',
  firstName: 'Dev',
  lastName: 'User'
}

// Check if Clerk is properly configured
const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_YOUR_CLERK_PUBLISHABLE_KEY_HERE"

// Custom hook to sync Clerk user with Supabase (with fallback for development)
export const useSupabaseUser = () => {
  const [supabaseUser, setSupabaseUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initUser = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (isClerkConfigured) {
          // Try to use Clerk - will be implemented when Clerk is properly configured
          console.log('Clerk is configured but user needs to sign in')
          setSupabaseUser(null)
        } else {
          // Development mode - use mock user
          console.warn('Development mode: Using mock user. Configure Clerk for production.')
          
          // Create/update mock user in Supabase for development
          const userData = {
            clerkUserId: mockUser.id,
            email: mockUser.email,
            username: mockUser.username,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            isHotelOwner: true // For development, make user a hotel owner
          }

          const result = await createOrUpdateUser(userData)
          
          if (result.success) {
            setSupabaseUser(result.data)
          } else {
            console.warn('Could not create development user:', result.error)
            setSupabaseUser(null)
          }
        }
      } catch (err) {
        console.error('Error initializing user:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    initUser()
  }, [])

  return {
    user: supabaseUser,
    clerkUser: isClerkConfigured ? null : mockUser,
    isLoading,
    error,
    isAuthenticated: !!supabaseUser
  }
}

// Get authenticated user's Supabase profile
export const getAuthenticatedUser = async (clerkUserId) => {
  try {
    if (!clerkUserId) {
      throw new Error('No authenticated user')
    }

    const result = await getUserProfile(clerkUserId)
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return result.data
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    throw error
  }
}

// Check if user is hotel owner
export const useIsHotelOwner = () => {
  const { user } = useSupabaseUser()
  return user?.is_hotel_owner || false
}

// Get Clerk authentication token for API calls (mock for development)
export const useAuthToken = () => {
  const getAuthToken = async () => {
    try {
      if (isClerkConfigured) {
        // Will be implemented when Clerk is configured
        return null
      } else {
        // Return mock token for development
        return 'dev-token'
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
      return null
    }
  }

  return getAuthToken
}

// Utility function to check authentication status
export const checkAuthStatus = (user, isLoaded) => {
  if (!isLoaded) {
    return { status: 'loading', message: 'Loading...' }
  }
  
  if (!user) {
    return { status: 'unauthenticated', message: 'Please sign in to continue' }
  }
  
  return { status: 'authenticated', message: 'User is authenticated' }
}

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useSupabaseUser()
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }
    
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please sign in to access this page.</p>
            {!isClerkConfigured && (
              <p className="mt-2 text-sm text-orange-600">
                Development mode: Configure Clerk authentication for production use.
              </p>
            )}
          </div>
        </div>
      )
    }
    
    return <WrappedComponent {...props} />
  }
}

// Higher-order component for hotel owner only routes  
export const withHotelOwnerAuth = (WrappedComponent) => {
  return function HotelOwnerAuthenticatedComponent(props) {
    const { user, isLoading, isAuthenticated } = useSupabaseUser()
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }
    
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please sign in to access this page.</p>
            {!isClerkConfigured && (
              <p className="mt-2 text-sm text-orange-600">
                Development mode: Configure Clerk authentication for production use.
              </p>
            )}
          </div>
        </div>
      )
    }
    
    if (!user?.is_hotel_owner) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600">This page is only accessible to hotel owners.</p>
          </div>
        </div>
      )
    }
    
    return <WrappedComponent {...props} />
  }
}
