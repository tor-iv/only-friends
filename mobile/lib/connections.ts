import { supabase } from "./supabase";
import type {
  Connection,
  ConnectionWithProfile,
  PendingRequest,
  Profile,
} from "@/types/database";

// Get all accepted connections for current user
export async function getConnections(): Promise<ConnectionWithProfile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("connections")
    .select(`
      *,
      requester:profiles!connections_requester_id_fkey(*),
      requestee:profiles!connections_requestee_id_fkey(*)
    `)
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`);

  if (error) {
    console.error("Error fetching connections:", error);
    return [];
  }

  // Map to get the "other" person's profile
  return (data || []).map((conn) => ({
    ...conn,
    profile:
      conn.requester_id === user.id
        ? (conn.requestee as Profile)
        : (conn.requester as Profile),
  }));
}

// Get connection count for current user
export async function getConnectionCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("connections")
    .select("*", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`);

  if (error) {
    console.error("Error fetching connection count:", error);
    return 0;
  }

  return count || 0;
}

// Get pending connection requests received by current user
export async function getPendingRequests(): Promise<PendingRequest[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("connections")
    .select(`
      *,
      requester:profiles!connections_requester_id_fkey(*)
    `)
    .eq("status", "pending")
    .eq("requestee_id", user.id);

  if (error) {
    console.error("Error fetching pending requests:", error);
    return [];
  }

  return (data || []).map((conn) => ({
    ...conn,
    requester: conn.requester as Profile,
  }));
}

// Get outgoing pending requests (sent by current user)
export async function getOutgoingRequests(): Promise<Connection[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("connections")
    .select("*")
    .eq("status", "pending")
    .eq("requester_id", user.id);

  if (error) {
    console.error("Error fetching outgoing requests:", error);
    return [];
  }

  return data || [];
}

// Send a connection request
export async function sendConnectionRequest(
  requesteeId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Check connection cap
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const connectionCount = await getConnectionCount();
  if (connectionCount >= profile.connection_cap) {
    return {
      success: false,
      error: `You've reached your connection limit of ${profile.connection_cap}. Invite friends to unlock more!`,
    };
  }

  // Check if connection already exists (in either direction)
  const { data: existing } = await supabase
    .from("connections")
    .select("id, status")
    .or(
      `and(requester_id.eq.${user.id},requestee_id.eq.${requesteeId}),and(requester_id.eq.${requesteeId},requestee_id.eq.${user.id})`
    )
    .single();

  if (existing) {
    if (existing.status === "accepted") {
      return { success: false, error: "Already connected" };
    }
    return { success: false, error: "Request already pending" };
  }

  const { error } = await supabase.from("connections").insert({
    requester_id: user.id,
    requestee_id: requesteeId,
    status: "pending",
  });

  if (error) {
    console.error("Error sending connection request:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Accept a connection request
export async function acceptConnectionRequest(
  connectionId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Check connection cap for accepting user too
  const profile = await getCurrentUserProfile();
  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const connectionCount = await getConnectionCount();
  if (connectionCount >= profile.connection_cap) {
    return {
      success: false,
      error: `You've reached your connection limit of ${profile.connection_cap}. Remove a connection or invite friends to unlock more!`,
    };
  }

  const { error } = await supabase
    .from("connections")
    .update({
      status: "accepted",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", connectionId)
    .eq("requestee_id", user.id);

  if (error) {
    console.error("Error accepting connection request:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Decline a connection request
export async function declineConnectionRequest(
  connectionId: string
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", connectionId)
    .eq("requestee_id", user.id);

  if (error) {
    console.error("Error declining connection request:", error);
    return false;
  }

  return true;
}

// Remove a connection
export async function removeConnection(connectionId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", connectionId)
    .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`);

  if (error) {
    console.error("Error removing connection:", error);
    return false;
  }

  return true;
}

// Check if two users are connected
export async function isConnectedWith(userId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("connections")
    .select("id")
    .eq("status", "accepted")
    .or(
      `and(requester_id.eq.${user.id},requestee_id.eq.${userId}),and(requester_id.eq.${userId},requestee_id.eq.${user.id})`
    )
    .single();

  return !!data;
}

// Get mutual contact matches (users who have each other's phone numbers)
export async function getMutualMatches(): Promise<Profile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get current user's contact hashes
  const { data: myHashes } = await supabase
    .from("contact_hashes")
    .select("contact_hash")
    .eq("user_id", user.id);

  if (!myHashes || myHashes.length === 0) return [];

  const hashList = myHashes.map((h) => h.contact_hash);

  // Find users whose phone hash is in my contacts AND who have my phone hash in their contacts
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("phone_number")
    .eq("id", user.id)
    .single();

  if (!currentProfile) return [];

  // Hash the current user's phone number (this should match how contacts are hashed)
  // Note: In production, this should use the same hashing as contacts.ts
  const myPhoneHash = await hashPhoneNumber(currentProfile.phone_number);

  // Find users who:
  // 1. Have a contact hash that matches one of my hashes (they're in my contacts)
  // 2. Have MY phone hash in their contact_hashes (I'm in their contacts)
  const { data: mutualUsers, error } = await supabase
    .from("profiles")
    .select(`
      *,
      contact_hashes!inner(contact_hash)
    `)
    .neq("id", user.id)
    .in("contact_hashes.contact_hash", [myPhoneHash]);

  if (error) {
    console.error("Error fetching mutual matches:", error);
    return [];
  }

  // Filter to only those whose phone hash is in my contacts
  const matches = (mutualUsers || []).filter((profile) => {
    // Check if this user's phone hash is in my contact list
    return hashList.some(async (hash) => {
      const theirPhoneHash = await hashPhoneNumber(profile.phone_number);
      return hash === theirPhoneHash;
    });
  });

  // Exclude already connected users
  const connections = await getConnections();
  const connectedIds = new Set(connections.map((c) => c.profile.id));

  // Also exclude pending requests
  const outgoing = await getOutgoingRequests();
  const pendingIds = new Set(outgoing.map((r) => r.requestee_id));

  return matches.filter(
    (profile) => !connectedIds.has(profile.id) && !pendingIds.has(profile.id)
  );
}

// Helper to get current user's profile
async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

// Helper to hash phone number (should match contacts.ts implementation)
async function hashPhoneNumber(phoneNumber: string): Promise<string> {
  // Normalize phone number
  const normalized = phoneNumber.replace(/\D/g, "");

  // Use Web Crypto API for hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
