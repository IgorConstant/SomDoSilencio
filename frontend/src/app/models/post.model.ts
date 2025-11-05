export interface Post {
  _id: string;
  title: string;
  slug: string;
  author: string;
  content: string;
  image: string;
  seoDescription: string;
  status: string;
  intro: string;
  tags: string[];
  autoriaFoto: string;
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CriarPosts {
  title: string;
  slug: string;
  author: string;
  content: string;
  image: string;
  seoDescription: string;
  status: string;
  tags: string[];
  category: string;
  featured: boolean;
  autoriaFoto: string;
  intro: string;
}
