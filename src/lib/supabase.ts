// SkillSyncAI Supabase Configuration
// This sets up Supabase client for direct database operations and file storage

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Client-side Supabase client for browser operations
export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side Supabase client with service role for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database utilities for SkillSyncAI
export const supabaseHelpers = {
  // File upload helper for assignments, course materials, etc.
  async uploadFile(bucket: string, path: string, file: File | Buffer) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  // Get public URL for uploaded files
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete file from storage
  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
  },

  // AI Analytics helper - store AI recommendation results
  async storeAIAnalytics(userId: string, courseId: string | null, type: string, data: any) {
    const { error } = await supabaseAdmin
      .from('ai_analytics')
      .insert({
        userId,
        courseId,
        analyticsType: type,
        data
      })
    
    if (error) throw error
  },

  // Get user learning analytics for AI recommendations
  async getUserLearningData(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        enrollments(
          *,
          course(
            *,
            category(*)
          )
        ),
        quizAttempts(
          *,
          quiz(
            *,
            course(*)
          )
        ),
        userProgress(*)
      `)
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }
}

