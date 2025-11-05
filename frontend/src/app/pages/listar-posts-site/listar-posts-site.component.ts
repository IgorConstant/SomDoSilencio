import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { environment } from '../../../environments/environment';
import { PostsService, Post } from "../../services/posts.service";
import { CategoriesListComponent } from "../../shared/categories-list/categories-list.component";
import { PopularPostsComponent } from "../../shared/popular-posts/popular-posts.component";
import { PaginationComponent } from "../../shared/pagination/pagination.component";

@Component({
  selector: "app-listar-posts-site",
  imports: [
    CommonModule,
    RouterLink,
    CategoriesListComponent,
    PopularPostsComponent,
    PaginationComponent,
  ],
  templateUrl: "./listar-posts-site.component.html",
  styleUrl: "./listar-posts-site.component.css",
})
export class ListarPostsSiteComponent {
  posts: Post[] = [];
  paginatedPosts: Post[][] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  public environment = environment;

  popularPosts: Post[] = [];
  categories: { name: string; count: number }[] = [];
  tags: string[] = [];

  stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, "");
  }

  constructor(private postsService: PostsService) {
    this.postsService.getPosts().subscribe({
      next: (data) => {
        this.posts = data
          .filter((p) => p.status === "publicado")
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.paginatePosts();
        this.setPopularPosts();
        this.setCategories();
        this.setTags();
      },
      error: (err) => {
        console.error("Erro ao carregar posts:", err);
      },
    });
  }

  setPopularPosts() {
    this.popularPosts = [...this.posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  setCategories() {
    const map = new Map<string, number>();
    this.posts.forEach(post => {
      if (post.category) {
        map.set(post.category, (map.get(post.category) || 0) + 1);
      }
    });
    this.categories = Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }

  setTags() {
    const tagSet = new Set<string>();
    this.posts.forEach(post => {
      post.tags?.forEach((tag: string) => tagSet.add(tag));
    });
    this.tags = Array.from(tagSet);
  }

  paginatePosts() {
    this.paginatedPosts = [];
    for (let i = 0; i < this.posts.length; i += this.pageSize) {
      this.paginatedPosts.push(this.posts.slice(i, i + this.pageSize));
    }
    this.totalPages = this.paginatedPosts.length;
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }

  getReadingTime(content: string): string {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min de leitura`;
  }
}
