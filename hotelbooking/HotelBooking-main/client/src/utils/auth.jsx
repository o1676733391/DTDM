import { useUser, useAuth } from '@clerk/clerk-react'
import { createOrUpdateUser, getUserProfile } from '../services/api'
import { useEffect, useState } from 'react'

// Check if Clerk is properly configured
const isClerkAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_YOUR_CLERK_PUBLISHABLE_KEY_HERE"

// Custom hook to sync Clerk user with Supabase
export const useSupabaseUser = () => {
  const [supabaseUser, setSupabaseUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Try to use Clerk hooks, but handle gracefully if not available
  let user = null
  let isLoaded = true
  
  try {
    if (isClerkAvailable) {
      const clerkUser = useUser()
      user = clerkUser.user
      isLoaded = clerkUser.isLoaded
    }
  } catch (err) {
    console.warn('Clerk not available:', err)
    user = null
    isLoaded = true
  }

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return
      
      setIsLoading(true)
      setError(null)

      try {
        if (user) {
          // Create or update user in Supabase
          const userData = {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username || user.firstName || 'User',
            firstName: user.firstName,
            lastName: user.lastName,
            isHotelOwner: user.publicMetadata?.isHotelOwner || false
          }

          const result = await createOrUpdateUser(userData)
          
          if (result.success) {
            setSupabaseUser(result.data)
          } else {
            setError(result.error)
          }
        } else {
          setSupabaseUser(null)
        }
      } catch (err) {
        console.error('Error syncing user:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    syncUser()
  }, [user, isLoaded])

  return {
    user: supabaseUser,
    clerkUser: user,
    isLoading,
    error,
    isAuthenticated: !!user
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

// Get Clerk authentication token for API calls
export const useAuthToken = () => {
  const { getToken } = useAuth()
  
  const getAuthToken = async () => {
    try {
      return await getToken()
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
