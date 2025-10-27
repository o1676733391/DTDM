import React, { useState } from 'react'
import { useSupabaseUser } from '../utils/auth-clerk.jsx'
import { updateUserRole, USER_ROLES, ROLE_NAMES } from '../utils/roles'

const RoleSelector = () => {
  const { user, clerkUser } = useSupabaseUser()
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState('')

  const handleRoleChange = async (newRole) => {
    if (!clerkUser) return

    setIsUpdating(true)
    setMessage('')

    try {
      const result = await updateUserRole(clerkUser.id, newRole)
      
      if (result.success) {
        setMessage(`Role updated to ${ROLE_NAMES[newRole]} successfully!`)
        // Refresh the page to update the UI
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Development: Change Role</h3>
      <div className="text-xs text-gray-600 mb-2">
        Current: {ROLE_NAMES[user.role] || 'Unknown'}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => handleRoleChange(USER_ROLES.USER)}
          disabled={isUpdating || user.role === USER_ROLES.USER}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          Make User
        </button>
        <button
          onClick={() => handleRoleChange(USER_ROLES.OWNER)}
          disabled={isUpdating || user.role === USER_ROLES.OWNER}
          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
        >
          Make Owner
        </button>
      </div>
      
      {message && (
        <div className="mt-2 text-xs text-gray-600">
          {message}
        </div>
      )}
      
      {isUpdating && (
        <div className="mt-2 text-xs text-gray-500">
          Updating...
        </div>
      )}
    </div>
  )
}

export default RoleSelector
