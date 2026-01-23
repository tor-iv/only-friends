import { supabase } from "./supabase";
import type { InviteCode, Profile } from "@/types/database";

// Validate an invite code (check if exists and unused)
export async function validateInviteCode(
  code: string
): Promise<{ valid: boolean; inviteId?: string; error?: string }> {
  const normalizedCode = code.trim().toUpperCase();

  if (normalizedCode.length < 6) {
    return { valid: false, error: "Code must be at least 6 characters" };
  }

  const { data, error } = await supabase
    .from("invite_codes")
    .select("id, used_by_user_id")
    .eq("code", normalizedCode)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { valid: false, error: "Invalid invite code" };
    }
    console.error("Error validating invite code:", error);
    return { valid: false, error: "Failed to validate code" };
  }

  if (data.used_by_user_id) {
    return { valid: false, error: "This code has already been used" };
  }

  return { valid: true, inviteId: data.id };
}

// Claim an invite code (called after profile creation)
export async function claimInviteCode(
  inviteId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("invite_codes")
    .update({
      used_by_user_id: user.id,
      used_at: new Date().toISOString(),
    })
    .eq("id", inviteId)
    .is("used_by_user_id", null); // Only update if not already claimed

  if (error) {
    console.error("Error claiming invite code:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Generate a new invite code for the current user
export async function generateInviteCode(): Promise<{
  success: boolean;
  code?: string;
  error?: string;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // Generate a unique code
  const code = generateUniqueCode();

  const { data, error } = await supabase
    .from("invite_codes")
    .insert({
      code,
      created_by_user_id: user.id,
    })
    .select("code")
    .single();

  if (error) {
    // If code collision, try again with a new code
    if (error.code === "23505") {
      return generateInviteCode();
    }
    console.error("Error generating invite code:", error);
    return { success: false, error: error.message };
  }

  return { success: true, code: data.code };
}

// Get user's active invite code (most recent unused one they created)
export async function getMyInviteCode(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // First, check for an existing unused code
  const { data: existing } = await supabase
    .from("invite_codes")
    .select("code")
    .eq("created_by_user_id", user.id)
    .is("used_by_user_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    return existing.code;
  }

  // If no unused code exists, generate a new one
  const result = await generateInviteCode();
  return result.code || null;
}

// Get invite statistics for current user
export async function getInviteStats(): Promise<{
  totalInvites: number;
  usedInvites: number;
  currentCap: number;
  nextCapUnlock: { cap: number; invitesNeeded: number } | null;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalInvites: 0,
      usedInvites: 0,
      currentCap: 15,
      nextCapUnlock: { cap: 25, invitesNeeded: 2 },
    };
  }

  // Get profile for current cap
  const { data: profile } = await supabase
    .from("profiles")
    .select("connection_cap, invites_sent_count")
    .eq("id", user.id)
    .single();

  const invitesSent = profile?.invites_sent_count || 0;
  const currentCap = profile?.connection_cap || 15;

  // Get total invites created
  const { count: totalInvites } = await supabase
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
    .eq("created_by_user_id", user.id);

  // Calculate next unlock tier
  // Tiers: 15 (default) → 25 (2 invites) → 35 (5 invites) → 50 (10 invites)
  let nextCapUnlock: { cap: number; invitesNeeded: number } | null = null;

  if (currentCap < 50) {
    if (invitesSent < 2) {
      nextCapUnlock = { cap: 25, invitesNeeded: 2 - invitesSent };
    } else if (invitesSent < 5) {
      nextCapUnlock = { cap: 35, invitesNeeded: 5 - invitesSent };
    } else if (invitesSent < 10) {
      nextCapUnlock = { cap: 50, invitesNeeded: 10 - invitesSent };
    }
  }

  return {
    totalInvites: totalInvites || 0,
    usedInvites: invitesSent,
    currentCap,
    nextCapUnlock,
  };
}

// Get list of users who joined via current user's invites
export async function getInvitedUsers(): Promise<Profile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("invite_codes")
    .select(`
      used_by:profiles!invite_codes_used_by_user_id_fkey(*)
    `)
    .eq("created_by_user_id", user.id)
    .not("used_by_user_id", "is", null);

  if (error) {
    console.error("Error fetching invited users:", error);
    return [];
  }

  return (data || [])
    .map((invite) => invite.used_by as Profile)
    .filter(Boolean);
}

// Helper to generate a unique invite code
function generateUniqueCode(): string {
  // Generate a readable code: XXXX-XXXX format
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding confusing chars like 0/O, 1/I/L
  let code = "";

  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}
