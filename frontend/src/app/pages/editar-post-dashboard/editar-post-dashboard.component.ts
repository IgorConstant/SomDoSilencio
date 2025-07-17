import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PostsService, Post } from "../../services/posts.service";
import { NavbarDashboardComponent } from "../../shared/navbar-dashboard/navbar-dashboard.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
} from "ngx-editor";
import { CommonModule } from "@angular/common";
import { environment } from "../../../environments/environment";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-editar-post-dashboard",
  standalone: true,
  imports: [
    NavbarDashboardComponent,
    SidebarComponent,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: "./editar-post-dashboard.component.html",
  styleUrls: ["./editar-post-dashboard.component.css"],
})
export class EditarPostDashboardComponent implements OnInit, OnDestroy {
  uploadURL = environment.baseURL;
  onContentChange(content: string) {
    if (this.post) {
      this.post.content = content;
    }
  }
  post: Post | null = null;
  loading = true;
  editor!: Editor;
  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.postsService.getPosts().subscribe((posts) => {
        const found = posts.find((p) => p._id === id) || null;
        if (found) {
          // Se tags vier como array, transforma em string para o input
          if (Array.isArray(found.tags)) {
            (found as any).tags = found.tags.join(", ");
          }
          // Se featured vier como boolean, transforma em string para o select
          if (typeof found.featured === "boolean") {
            (found as any).featured = found.featured ? "true" : "false";
          }
        }
        this.post = found;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.post) return;
    const id = this.route.snapshot.paramMap.get("id");
    let payload: any;
    if (this.selectedFile) {
      payload = new FormData();
      Object.entries(this.post).forEach(([key, value]) => {
        if (key === "tags" && typeof value === "string") {
          payload.append(key, value);
        } else {
          payload.append(key, value as any);
        }
      });
      payload.append("image", this.selectedFile);
    } else {
      // Se tags for string, transforma em array para o backend
      if (typeof this.post.tags === "string") {
        this.post.tags = (this.post.tags as unknown as string)
          .split(",")
          .map((t: string) => t.trim());
      }
      // Se featured for string, transforma em boolean
      if (typeof this.post.featured === "string") {
        this.post.featured = this.post.featured === "true";
      }
      payload = this.post;
    }
    this.postsService.atualizarPostagem(id!, payload).subscribe({
      next: () => {
        alert("Post atualizado com sucesso!");
        window.location.href = "/dashboard";
      },
      error: () => alert("Erro ao atualizar post!"),
    });
  }
}
