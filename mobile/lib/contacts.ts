import * as Contacts from "expo-contacts";
import { supabase } from "./supabase";

// Request contacts permission
export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === "granted";
}

// Check if contacts permission is granted
export async function hasContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.getPermissionsAsync();
  return status === "granted";
}

// Get all contacts with phone numbers
export async function getContacts(): Promise<Contacts.Contact[]> {
  const hasPermission = await hasContactsPermission();
  if (!hasPermission) {
    return [];
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
  });

  return data.filter(
    (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
  );
}

// Hash a phone number using SHA-256
export async function hashPhoneNumber(phoneNumber: string): Promise<string> {
  // Normalize: remove all non-digits
  const normalized = phoneNumber.replace(/\D/g, "");

  // Handle different formats - try to normalize to full number
  // If it's a US number without country code, add +1
  let fullNumber = normalized;
  if (normalized.length === 10) {
    fullNumber = "1" + normalized;
  } else if (normalized.length === 11 && normalized.startsWith("1")) {
    fullNumber = normalized;
  }
  // For other countries, use as-is

  // Use Web Crypto API for SHA-256 hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(fullNumber);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Extract and hash all phone numbers from contacts
export async function hashAllContacts(): Promise<string[]> {
  const contacts = await getContacts();
  const hashes: Set<string> = new Set();

  for (const contact of contacts) {
    if (contact.phoneNumbers) {
      for (const phone of contact.phoneNumbers) {
        if (phone.number) {
          const hash = await hashPhoneNumber(phone.number);
          hashes.add(hash);
        }
      }
    }
  }

  return Array.from(hashes);
}

// Sync contact hashes to the database
export async function syncContactHashes(): Promise<{
  success: boolean;
  synced: number;
  error?: string;
}> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, synced: 0, error: "Not authenticated" };
  }

  try {
    // Get all contact hashes
    const hashes = await hashAllContacts();

    if (hashes.length === 0) {
      return { success: true, synced: 0 };
    }

    // Delete existing hashes for this user
    await supabase
      .from("contact_hashes")
      .delete()
      .eq("user_id", user.id);

    // Insert new hashes
    const hashRecords = hashes.map((hash) => ({
      user_id: user.id,
      contact_hash: hash,
    }));

    // Batch insert (Supabase handles batching)
    const { error } = await supabase
      .from("contact_hashes")
      .insert(hashRecords);

    if (error) {
      console.error("Error syncing contact hashes:", error);
      return { success: false, synced: 0, error: error.message };
    }

    return { success: true, synced: hashes.length };
  } catch (error) {
    console.error("Error syncing contacts:", error);
    return {
      success: false,
      synced: 0,
      error: error instanceof Error ? error.message : "Failed to sync contacts",
    };
  }
}

// Get count of synced contact hashes
export async function getContactHashCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("contact_hashes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return count || 0;
}

// Clear all contact hashes for current user
export async function clearContactHashes(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("contact_hashes")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    console.error("Error clearing contact hashes:", error);
    return false;
  }

  return true;
}
