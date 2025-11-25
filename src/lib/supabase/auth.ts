import { createClient } from './server'

export type UserRole = 'student' | 'instructor' | 'admin'

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signUpWithEmail(email: string, password: string, role: UserRole) {
  const supabase = createClient()
  
  // First create the auth user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  })
  
  if (signUpError) throw signUpError
  
  // Then create the user profile in your database
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        role,
        updated_at: new Date().toISOString(),
      })
      
    if (profileError) throw profileError
  }
  
  return data
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  
  if (user) {
    // Get additional user data from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', user.id)
      .single()
      
    if (profileError) throw profileError
    
    return {
      ...user,
      role: profile?.role as UserRole,
      full_name: profile?.full_name,
      avatar_url: profile?.avatar_url,
    }
  }
  
  return null
}
