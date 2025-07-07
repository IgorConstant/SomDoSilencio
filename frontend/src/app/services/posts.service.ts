import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface Post {
  _id: string;
  title: string;
  slug: string;
  author: string;
  content: string;
  image: string;
  seoDescription: string;
  status: string;
  tags: string[];
  category: string;
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
}

@Injectable({
  providedIn: "root",
})
export class PostsService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  criarPostagem(post: CriarPosts | FormData): Observable<Post> {
    const url = `${environment.apiUrl}/posts/create`;
    const token = localStorage.getItem("token");
    let headers = {};
    // Se não for FormData, precisa setar Content-Type
    if (!(post instanceof FormData)) {
      headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      return this.http.post<Post>(url, post, { headers });
    } else {
      // Para FormData, não setar Content-Type manualmente
      headers = token ? { Authorization: `Bearer ${token}` } : {};
      return this.http.post<Post>(url, post, { headers });
    }
  }
}
