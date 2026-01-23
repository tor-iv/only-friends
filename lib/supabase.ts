import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with your database
// Note: Client will be non-functional if env vars are missing (build time)
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Helper function to test the connection
export async function testConnection() {
  // Check for missing env vars at runtime
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables')
    return false
  }

  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      console.error('Supabase connection failed:', error)
      return false
    }
    console.log('Supabase connection successful!')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

// Auth helpers
export const auth = {
  // Send OTP to phone number
  sendOtp: async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({ phone })
    return { data, error }
  },

  // Verify OTP code
  verifyOtp: async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Users
  users: {
    getById: async (id: string) => {
      return await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
    },

    getByPhone: async (phone: string) => {
      return await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phone)
        .single()
    },

    update: async (id: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
      return await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    }
  },

  // Profiles
  profiles: {
    getById: async (userId: string) => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
    },

    create: async (profile: Database['public']['Tables']['profiles']['Insert']) => {
      return await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single()
    },

    update: async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
      return await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
    },

    search: async (query: string) => {
      return await supabase
        .from('profiles')
        .select('*')
        .or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
        .limit(20)
    }
  },

  // Posts
  posts: {
    getAll: async (limit = 20, offset = 0) => {
      return await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(*),
          post_likes(user_id),
          post_comments(
            id,
            content,
            user_id,
            created_at,
            profiles!post_comments_user_id_fkey(display_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    },

    getByUserId: async (userId: string, limit = 20, offset = 0) => {
      return await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(*),
          post_likes(user_id),
          post_comments(
            id,
            content,
            user_id,
            created_at,
            profiles!post_comments_user_id_fkey(display_name, avatar_url)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    },

    getById: async (id: string) => {
      return await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey(*),
          post_likes(user_id),
          post_comments(
            id,
            content,
            user_id,
            created_at,
            profiles!post_comments_user_id_fkey(display_name, avatar_url)
          )
        `)
        .eq('id', id)
        .single()
    },

    create: async (post: Database['public']['Tables']['posts']['Insert']) => {
      return await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()
    },

    update: async (id: string, updates: Partial<Database['public']['Tables']['posts']['Update']>) => {
      return await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    },

    delete: async (id: string) => {
      return await supabase
        .from('posts')
        .delete()
        .eq('id', id)
    },

    like: async (postId: string, userId: string) => {
      return await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId })
    },

    unlike: async (postId: string, userId: string) => {
      return await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
    },

    addComment: async (comment: Database['public']['Tables']['post_comments']['Insert']) => {
      return await supabase
        .from('post_comments')
        .insert(comment)
        .select(`
          *,
          profiles!post_comments_user_id_fkey(display_name, avatar_url)
        `)
        .single()
    }
  },

  // Stories
  stories: {
    getActive: async () => {
      return await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_user_id_fkey(*),
          story_views(viewer_id)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
    },

    getByUserId: async (userId: string) => {
      return await supabase
        .from('stories')
        .select(`
          *,
          profiles!stories_user_id_fkey(*),
          story_views(viewer_id, profiles!story_views_viewer_id_fkey(display_name, avatar_url))
        `)
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
    },

    create: async (story: Database['public']['Tables']['stories']['Insert']) => {
      return await supabase
        .from('stories')
        .insert(story)
        .select()
        .single()
    },

    view: async (storyId: string, viewerId: string) => {
      return await supabase
        .from('story_views')
        .insert({ story_id: storyId, viewer_id: viewerId })
    }
  },

  // Messages
  messages: {
    getConversation: async (userId1: string, userId2: string, limit = 50, offset = 0) => {
      return await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          recipient:profiles!messages_recipient_id_fkey(*)
        `)
        .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    },

    send: async (message: Database['public']['Tables']['messages']['Insert']) => {
      return await supabase
        .from('messages')
        .insert(message)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          recipient:profiles!messages_recipient_id_fkey(*)
        `)
        .single()
    },

    markAsRead: async (messageId: string) => {
      return await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId)
    }
  },

  // Friends
  friends: {
    getAll: async (userId: string) => {
      return await supabase
        .from('friends')
        .select(`
          *,
          requester:profiles!friends_requester_id_fkey(*),
          addressee:profiles!friends_addressee_id_fkey(*)
        `)
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted')
    },

    getPendingRequests: async (userId: string) => {
      return await supabase
        .from('friends')
        .select(`
          *,
          requester:profiles!friends_requester_id_fkey(*),
          addressee:profiles!friends_addressee_id_fkey(*)
        `)
        .eq('addressee_id', userId)
        .eq('status', 'pending')
    },

    sendRequest: async (requesterId: string, addresseeId: string) => {
      return await supabase
        .from('friends')
        .insert({ requester_id: requesterId, addressee_id: addresseeId })
        .select()
        .single()
    },

    acceptRequest: async (requestId: string) => {
      return await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select()
        .single()
    },

    rejectRequest: async (requestId: string) => {
      return await supabase
        .from('friends')
        .delete()
        .eq('id', requestId)
    },

    removeFriend: async (userId1: string, userId2: string) => {
      return await supabase
        .from('friends')
        .delete()
        .or(`and(requester_id.eq.${userId1},addressee_id.eq.${userId2}),and(requester_id.eq.${userId2},addressee_id.eq.${userId1})`)
    }
  },

  // Notifications
  notifications: {
    getAll: async (userId: string, limit = 20, offset = 0) => {
      return await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    },

    markAsRead: async (notificationId: string) => {
      return await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
    },

    markAllAsRead: async (userId: string) => {
      return await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
    },

    create: async (notification: Database['public']['Tables']['notifications']['Insert']) => {
      return await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single()
    }
  },

  // User Settings
  settings: {
    get: async (userId: string) => {
      return await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
    },

    update: async (userId: string, updates: Partial<Database['public']['Tables']['user_settings']['Update']>) => {
      return await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
    },

    create: async (settings: Database['public']['Tables']['user_settings']['Insert']) => {
      return await supabase
        .from('user_settings')
        .insert(settings)
        .select()
        .single()
    }
  }
}

// Storage helpers
export const storage = {
  // Upload file to a bucket
  upload: async (bucket: string, path: string, file: File) => {
    return await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
  },

  // Update/replace file
  update: async (bucket: string, path: string, file: File) => {
    return await supabase.storage
      .from(bucket)
      .update(path, file, {
        cacheControl: '3600',
        upsert: true
      })
  },

  // Get public URL for a file
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
  },

  // Delete file
  remove: async (bucket: string, paths: string[]) => {
    return await supabase.storage
      .from(bucket)
      .remove(paths)
  },

  // List files in a folder
  list: async (bucket: string, folder?: string) => {
    return await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0
      })
  }
}

// Real-time subscriptions
export const realtime = {
  // Subscribe to messages in a conversation
  subscribeToMessages: (userId1: string, userId2: string, callback: (payload: any) => void) => {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1}))`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to friend requests
  subscribeToFriendRequests: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('friend_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `or(requester_id.eq.${userId},addressee_id.eq.${userId})`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to notifications
  subscribeToNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id.eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  // Unsubscribe from a channel
  unsubscribe: (subscription: any) => {
    return supabase.removeChannel(subscription)
  }
}

export default supabase
