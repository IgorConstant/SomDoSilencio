import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardsPostsComponent } from "../../shared/cards-posts/cards-posts.component";
import { PostsService, Post } from "../../services/posts.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  imports: [CommonModule, CardsPostsComponent, RouterLink],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  posts: Post[] = [];
  featuredPosts: Post[] = [];
  oldPosts: Post[] = [];

  get oldPostsGrouped(): Post[][] {
    const groups: Post[][] = [];
    for (let i = 0; i < this.oldPosts.length; i += 3) {
      groups.push(this.oldPosts.slice(i, i + 3));
    }
    return groups;
  }

  constructor(private postsService: PostsService) {
    this.postsService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.filter((p) => p.status === "publicado");
        this.featuredPosts = this.posts.filter((p) => p.featured);
        this.oldPosts = this.posts.filter((p) => !p.featured);
      },
      error: (err) => {
        console.error("Erro ao carregar posts:", err);
      },
    });
  }
}
