import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST toggle like (like or unlike)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Get the authenticated user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to like posts" },
        { status: 401 }
      );
    }

    // Get the user from users table
    const { data: user, error: userFetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", authUser.email)
      .single();

    if (userFetchError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", body.postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLike) {
      // Unlike: Delete the like
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) throw deleteError;

      return NextResponse.json({ liked: false, message: "Post unliked" });
    } else {
      // Like: Create a new like
      const { data: newLike, error: insertError } = await supabase
        .from("likes")
        .insert({
          post_id: body.postId,
          user_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return NextResponse.json(
        {
          liked: true,
          message: "Post liked",
          like: {
            id: newLike.id,
            postId: newLike.post_id,
            userId: newLike.user_id,
            createdAt: new Date(newLike.created_at),
          },
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

// GET like count for a post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Error fetching like count:", error);
    return NextResponse.json(
      { error: "Failed to fetch like count" },
      { status: 500 }
    );
  }
}
