import { supabase, uploadFile, deleteFile, getStorageUrl } from "./supabase";
import type { Post, PostInsert, PostWithAuthor, Profile } from "@/types/database";

// Get feed posts from connections (excluding archived)
export async function getFeed(): Promise<PostWithAuthor[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get posts with author info, ordered by most recent
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_user_id_fkey(*)
    `)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feed:", error);
    return [];
  }

  // Get view counts and check if current user has viewed
  const postsWithViews = await Promise.all(
    (posts || []).map(async (post) => {
      const [viewCountResult, hasViewedResult] = await Promise.all([
        supabase
          .from("post_views")
          .select("id", { count: "exact", head: true })
          .eq("post_id", post.id),
        supabase
          .from("post_views")
          .select("id")
          .eq("post_id", post.id)
          .eq("viewer_user_id", user.id)
          .single(),
      ]);

      return {
        ...post,
        author: post.author as Profile,
        view_count: viewCountResult.count || 0,
        has_viewed: !!hasViewedResult.data,
      };
    })
  );

  return postsWithViews;
}

// Get posts for a specific user (for profile view)
export async function getUserPosts(userId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }

  return data || [];
}

// Create a new post
export async function createPost(
  imageUri: string,
  caption?: string
): Promise<{ success: boolean; post?: Post; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Upload image to storage
    const fileName = `${user.id}/${Date.now()}.jpg`;

    // Fetch the image and convert to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const imageUrl = await uploadFile("posts", fileName, blob, "image/jpeg");
    if (!imageUrl) {
      return { success: false, error: "Failed to upload image" };
    }

    // Create post record
    const postData: PostInsert = {
      user_id: user.id,
      image_path: fileName,
      caption: caption || null,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      // Clean up uploaded image on failure
      await deleteFile("posts", fileName);
      return { success: false, error: error.message };
    }

    return { success: true, post: data };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }
}

// Mark a post as viewed
export async function markPostViewed(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("post_views")
    .upsert(
      {
        post_id: postId,
        viewer_user_id: user.id,
      },
      {
        onConflict: "post_id,viewer_user_id",
        ignoreDuplicates: true,
      }
    );

  if (error) {
    console.error("Error marking post viewed:", error);
    return false;
  }

  return true;
}

// Get viewers for a post (only for post author)
export async function getPostViewers(postId: string): Promise<{
  viewers: (Profile & { viewed_at: string })[];
  count: number;
}> {
  const { data, error } = await supabase
    .from("post_views")
    .select(`
      viewed_at,
      viewer:profiles!post_views_viewer_user_id_fkey(*)
    `)
    .eq("post_id", postId)
    .order("viewed_at", { ascending: false });

  if (error) {
    console.error("Error fetching post viewers:", error);
    return { viewers: [], count: 0 };
  }

  const viewers = (data || []).map((view) => ({
    ...(view.viewer as Profile),
    viewed_at: view.viewed_at,
  }));

  return { viewers, count: viewers.length };
}

// Delete a post
export async function deletePost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Get the post to find the image path
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("image_path, user_id")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    console.error("Error fetching post for deletion:", fetchError);
    return false;
  }

  // Verify ownership
  if (post.user_id !== user.id) {
    console.error("Cannot delete post: not the owner");
    return false;
  }

  // Delete the post record (cascade will delete views)
  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (deleteError) {
    console.error("Error deleting post:", deleteError);
    return false;
  }

  // Delete the image from storage
  await deleteFile("posts", post.image_path);

  return true;
}

// Archive a post (hide from feed but keep in profile)
export async function archivePost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("posts")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error archiving post:", error);
    return false;
  }

  return true;
}

// Get public URL for a post image
export function getPostImageUrl(imagePath: string): string {
  return getStorageUrl("posts", imagePath);
}

// Report a screenshot event
export async function reportScreenshot(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("screenshot_events")
    .insert({
      post_id: postId,
      screenshotter_user_id: user.id,
    });

  if (error) {
    console.error("Error reporting screenshot:", error);
    return false;
  }

  return true;
}
