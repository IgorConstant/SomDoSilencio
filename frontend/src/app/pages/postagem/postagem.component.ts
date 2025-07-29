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
  private cleanHtmlContent(html: string): string {
    if (!html) return html;
    html = html.trim();
    // Remove aspas duplas/simples no início/fim
    html = html.replace(/^['"]+|['"]+$/g, "");
    // Remove barras invertidas antes de aspas ou tags
    html = html.replace(/\\(["'])/g, "$1");
    // Remove <p> ao redor de <iframe>
    html = html.replace(
      /<p>(\s*)?(<iframe[\s\S]*?<\/iframe>)(\s*)?<\/p>/gi,
      "$2"
    );
    return html;
  }
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
      this.postsService.getPosts().subscribe({
        next: (posts) => {
          this.allPosts = posts.filter((p) => p.status === "publicado");
          this.postsService.getPostBySlug(slug).subscribe({
            next: (post) => {
              this.post = post;

              // 🔍 Logs para debug
              console.log("🟦 HTML original:", post.content);

              const cleaned = this.cleanHtmlContent(post.content);

              console.log("🟩 HTML limpo:", cleaned);

              this.safeContent = post?.content
                ? this.sanitizer.bypassSecurityTrustHtml(cleaned)
                : null;

              this.loading = false;
              if (post?.title) {
                this.titleService.setTitle(`${post.title} - o som do silêncio`);
              }
              if (post?.intro) {
                this.metaService.updateTag({
                  name: "description",
                  content: post.intro,
                });
              }
              if (post?.tags?.length) {
                this.metaService.updateTag({
                  name: "keywords",
                  content: post.tags.join(", "),
                });
              }
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
