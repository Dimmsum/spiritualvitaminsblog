export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createdAt: Date;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  images: string[];
  scripture?: {
    verse: string;
    reference: string;
  };
  createdAt: Date;
  updatedAt: Date;
  likes: Like[];
  comments: Comment[];
  category: string;
  tags: string[];
}
