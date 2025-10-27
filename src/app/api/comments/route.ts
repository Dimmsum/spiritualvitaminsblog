import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST create a new comment
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
        { error: "Unauthorized - Please sign in to comment" },
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

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from("comments")
      .insert({
        post_id: body.postId,
        user_id: user.id,
        content: body.content,
      })
      .select(
        `
        *,
        user:users(id, name, avatar_url)
      `
      )
      .single();

    if (commentError) throw commentError;

    // Transform to match our Comment type
    const transformedComment = {
      id: comment.id,
      postId: comment.post_id,
      user: {
        id: comment.user.id,
        name: comment.user.name,
        avatar: comment.user.avatar_url,
      },
      content: comment.content,
      createdAt: new Date(comment.created_at),
    };

    return NextResponse.json(transformedComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
