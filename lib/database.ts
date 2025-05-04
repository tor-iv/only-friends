import { supabase } from "./supabase"

// Profile functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId)

  if (error) throw error
  return data
}

// Post functions
export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (
        id,
        first_name,
        last_name,
        profile_picture_url
      ),
      comments:comments (count)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createPost(userId: string, content: string, imageUrl: string | null, isTemporary: boolean) {
  const expiresAt = isTemporary ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null // 24 hours from now

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      content,
      image_url: imageUrl,
      is_temporary: isTemporary,
      expires_at: expiresAt,
    })
    .select()

  if (error) throw error
  return data
}

export async function getPost(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:user_id (
        id,
        first_name,
        last_name,
        profile_picture_url
      )
    `)
    .eq("id", postId)
    .single()

  if (error) throw error
  return data
}

// Comment functions
export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:user_id (
        id,
        first_name,
        last_name,
        profile_picture_url
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data
}

export async function createComment(postId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content,
    })
    .select()

  if (error) throw error
  return data
}

// Friend functions
export async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from("friends")
    .select(`
      *,
      friend:friend_id (
        id,
        first_name,
        last_name,
        profile_picture_url
      )
    `)
    .eq("user_id", userId)
    .eq("status", "accepted")

  if (error) throw error
  return data
}

export async function getPendingFriendRequests(userId: string) {
  const { data, error } = await supabase
    .from("friends")
    .select(`
      *,
      friend:friend_id (
        id,
        first_name,
        last_name,
        profile_picture_url
      )
    `)
    .eq("user_id", userId)
    .eq("status", "pending")

  if (error) throw error
  return data
}

export async function sendFriendRequest(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from("friends")
    .insert({
      user_id: userId,
      friend_id: friendId,
      status: "pending",
    })
    .select()

  if (error) throw error
  return data
}

export async function acceptFriendRequest(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("user_id", friendId)
    .eq("friend_id", userId)
    .eq("status", "pending")
    .select()

  if (error) throw error

  // Create the reverse relationship
  const { error: reverseError } = await supabase.from("friends").insert({
    user_id: userId,
    friend_id: friendId,
    status: "accepted",
  })

  if (reverseError) throw reverseError
  return data
}

// Notification functions
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()

  if (error) throw error
  return data
}

export async function createNotification(userId: string, type: string, content: string, relatedId?: string) {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      type,
      content,
      related_id: relatedId,
    })
    .select()

  if (error) throw error
  return data
}
