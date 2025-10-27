// Role management utilities
import { supabase } from '../services/api.js'

// Update user role in Supabase
export const updateUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role: role })
      .eq('id', userId) // Use 'id' instead of 'clerk_user_id'
      .select()
      .single()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: error.message }
  }
}

// Get all users (admin function)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: error.message }
  }
}

// Check if current user can access owner features
export const canAccessOwnerFeatures = (user) => {
  return user && user.role === 'OWNER'
}

// Validate role
export const isValidRole = (role) => {
  return Object.values(USER_ROLES).includes(role)
}

// Promote user to hotel owner
export const promoteToHotelOwner = async (clerkUserId) => {
  try {
    const result = await updateUserRole(clerkUserId, USER_ROLES.OWNER)
    if (result.success) {
      console.log('User promoted to hotel owner successfully')
      // Reload the page to update the user context
      window.location.reload()
    }
    return result
  } catch (error) {
    console.error('Error promoting user:', error)
    return { success: false, error: error.message }
  }
}

// User roles enum
export const USER_ROLES = {
  USER: 'USER',
  OWNER: 'OWNER'
}

// Role display names
export const ROLE_NAMES = {
  USER: 'Regular User',
  OWNER: 'Hotel Owner'
}
