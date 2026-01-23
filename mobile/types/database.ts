// Database types for Supabase
// Note: Run `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > mobile/types/database.ts`
// to regenerate these types from your actual Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string;
          bio: string | null;
          phone_number: string;
          notification_time: string;
          connection_cap: number;
          invites_sent_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url: string;
          bio?: string | null;
          phone_number: string;
          notification_time?: string;
          connection_cap?: number;
          invites_sent_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string;
          bio?: string | null;
          phone_number?: string;
          notification_time?: string;
          connection_cap?: number;
          invites_sent_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invite_codes: {
        Row: {
          id: string;
          code: string;
          created_by_user_id: string | null;
          used_by_user_id: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          created_by_user_id?: string | null;
          used_by_user_id?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          created_by_user_id?: string | null;
          used_by_user_id?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invite_codes_created_by_user_id_fkey";
            columns: ["created_by_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invite_codes_used_by_user_id_fkey";
            columns: ["used_by_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      contact_hashes: {
        Row: {
          id: string;
          user_id: string;
          contact_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_hash?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_hashes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      connections: {
        Row: {
          id: string;
          requester_id: string;
          requestee_id: string;
          status: "pending" | "accepted";
          confirmed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          requestee_id: string;
          status?: "pending" | "accepted";
          confirmed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          requestee_id?: string;
          status?: "pending" | "accepted";
          confirmed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "connections_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "connections_requestee_id_fkey";
            columns: ["requestee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          image_path: string;
          caption: string | null;
          created_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_path: string;
          caption?: string | null;
          created_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_path?: string;
          caption?: string | null;
          created_at?: string;
          archived_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      post_views: {
        Row: {
          id: string;
          post_id: string;
          viewer_user_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          viewer_user_id: string;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          viewer_user_id?: string;
          viewed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_views_viewer_user_id_fkey";
            columns: ["viewer_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      screenshot_events: {
        Row: {
          id: string;
          post_id: string;
          screenshotter_user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          screenshotter_user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          screenshotter_user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "screenshot_events_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "screenshot_events_screenshotter_user_id_fkey";
            columns: ["screenshotter_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      are_connected: {
        Args: {
          user1_id: string;
          user2_id: string;
        };
        Returns: boolean;
      };
      get_connection_count: {
        Args: {
          user_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      connection_status: "pending" | "accepted";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type InviteCode = Database["public"]["Tables"]["invite_codes"]["Row"];
export type InviteCodeInsert = Database["public"]["Tables"]["invite_codes"]["Insert"];

export type ContactHash = Database["public"]["Tables"]["contact_hashes"]["Row"];
export type ContactHashInsert = Database["public"]["Tables"]["contact_hashes"]["Insert"];

export type Connection = Database["public"]["Tables"]["connections"]["Row"];
export type ConnectionInsert = Database["public"]["Tables"]["connections"]["Insert"];
export type ConnectionUpdate = Database["public"]["Tables"]["connections"]["Update"];
export type ConnectionStatus = Database["public"]["Enums"]["connection_status"];

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export type PostView = Database["public"]["Tables"]["post_views"]["Row"];
export type PostViewInsert = Database["public"]["Tables"]["post_views"]["Insert"];

export type ScreenshotEvent = Database["public"]["Tables"]["screenshot_events"]["Row"];
export type ScreenshotEventInsert = Database["public"]["Tables"]["screenshot_events"]["Insert"];

// Extended types with joins
export type PostWithAuthor = Post & {
  author: Profile;
  view_count?: number;
  viewers?: Profile[];
  has_viewed?: boolean;
};

export type ConnectionWithProfile = Connection & {
  profile: Profile;
};

export type PendingRequest = Connection & {
  requester: Profile;
};
