import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { PostsService, Post } from "../../services/posts.service";

@Component({
  selector: "app-postagem",
  imports: [CommonModule],
  templateUrl: "./postagem.component.html",
  styleUrl: "./postagem.component.css",
})
export class PostagemComponent implements OnInit {
  post: Post | null = null;
  loading = true;
  error = "";
  safeContent: SafeHtml | null = null;
  allPosts: Post[] = [];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private titleService: Title,
    private metaService: Meta,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get("slug");
    if (slug) {
      // Primeiro, carrega todos os posts para popularPosts
      this.postsService.getPosts().subscribe({
        next: (posts) => {
          this.allPosts = posts.filter((p) => p.status === "publicado");
          // Depois, carrega o post atual
          this.postsService.getPostBySlug(slug).subscribe({
            next: (post) => {
              this.post = post;
              // Atualiza o título da página
              if (post && post.title) {
                this.titleService.setTitle(`${post.title} - O som do silêncio`);
              }
              // Atualiza meta keywords se houver tags
              if (post && post.tags && post.tags.length > 0) {
                this.metaService.updateTag({
                  name: "keywords",
                  content: post.tags.join(", "),
                });
              }
              // Sanitiza o conteúdo para permitir iframes
              this.safeContent =
                post && post.content
                  ? this.sanitizer.bypassSecurityTrustHtml(post.content)
                  : null;
              this.loading = false;
            },
            error: () => {
              this.error = "Post não encontrado.";
              this.loading = false;
            },
          });
        },
        error: () => {
          this.error = "Erro ao carregar posts.";
          this.loading = false;
        },
      });
    } else {
      this.error = "Slug não informado.";
      this.loading = false;
    }
  }
}
