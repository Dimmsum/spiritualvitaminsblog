import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET a single post by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        author:users(id, name, avatar_url),
        comments(
          id,
          content,
          created_at,
          user:users(id, name, avatar_url)
        ),
        likes(
          id,
          user_id,
          created_at
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform data to match our BlogPost type
    const transformedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: {
        id: post.author.id,
        name: post.author.name,
        avatar: post.author.avatar_url,
      },
      images: post.images || [],
      scripture: post.scripture_verse
        ? {
            verse: post.scripture_verse,
            reference: post.scripture_reference,
          }
        : undefined,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      likes: post.likes.map((like: any) => ({
        id: like.id,
        postId: post.id,
        userId: like.user_id,
        createdAt: new Date(like.created_at),
      })),
      comments: post.comments.map((comment: any) => ({
        id: comment.id,
        postId: post.id,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar: comment.user.avatar_url,
        },
        content: comment.content,
        createdAt: new Date(comment.created_at),
      })),
      category: post.category,
      tags: post.tags || [],
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
