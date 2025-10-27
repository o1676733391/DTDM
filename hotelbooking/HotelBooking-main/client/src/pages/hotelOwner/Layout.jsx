import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../../components/hotelOwner/Navber'
import { SlideBar } from '../../components/hotelOwner/SlideBar'
import { useSupabaseUser } from '../../utils/auth-clerk.jsx'
import { canAccessOwnerFeatures } from '../../utils/roles.js'

export const Layout = () => {
  // This will trigger the user sync when the layout loads
  const { user, isLoading, error, isAuthenticated } = useSupabaseUser()
  
  console.log('Layout - Authentication status:', { user, isLoading, error, isAuthenticated })
  
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  // Check if user has owner access
  if (!canAccessOwnerFeatures(user)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className='flex flex-col h-screen'>
        <Navbar />
        <div className='flex h-full'>
            <SlideBar />
            <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}
