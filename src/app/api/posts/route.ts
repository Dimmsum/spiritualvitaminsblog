import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET all posts
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        author:users(id, name, avatar_url),
        comments(id),
        likes(id)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform data to match our BlogPost type
    const transformedPosts = posts?.map((post) => ({
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
      likes: post.likes || [],
      comments: post.comments || [],
      category: post.category,
      tags: post.tags || [],
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST create a new post
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
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if user exists in users table, if not create them
    let { data: user, error: userFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email)
      .single();

    // If user doesn't exist, create them
    if (userFetchError || !user) {
      const { data: newUser, error: userCreateError } = await supabase
        .from("users")
        .insert({
          name:
            body.authorName ||
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "User",
          email: authUser.email!,
          avatar_url:
            authUser.user_metadata?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.email}`,
        })
        .select()
        .single();

      if (userCreateError) throw userCreateError;
      user = newUser;
    }

    // Create the post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        author_id: user.id,
        images: body.images || [],
        scripture_verse: body.scripture?.verse,
        scripture_reference: body.scripture?.reference,
        category: body.category,
        tags: body.tags || [],
      })
      .select(
        `
        *,
        author:users(id, name, avatar_url)
      `
      )
      .single();

    if (postError) throw postError;

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
