import { Component, OnInit, OnDestroy } from "@angular/core";
import { ToastService, ToastType } from '../../shared/toast/toast.service';
import DOMPurify from "dompurify";
import { ActivatedRoute } from "@angular/router";
import { PostsService, Post } from "../../services/posts.service";
import { NavbarDashboardComponent } from "../../shared/navbar-dashboard/navbar-dashboard.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { ToastComponent } from '../../shared/toast/toast.component';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from "@angular/common";
import { environment } from "../../../environments/environment";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-editar-post-dashboard",
  standalone: true,
  imports: [
    NavbarDashboardComponent,
    SidebarComponent,
    CommonModule,
    FormsModule,
    QuillModule,
    ToastComponent,
  ],
  templateUrl: "./editar-post-dashboard.component.html",
  styleUrls: ["./editar-post-dashboard.component.css"],
})
export class EditarPostDashboardComponent implements OnInit {
  uploadURL = environment.baseURL;
  onContentChange(content: string) {
    if (this.post) {
      this.post.content = content;
    }
  }
  post: Post | null = null;
  loading = true;
  quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  };
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.post) return;
  
    const sanitizerOptions = {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameBorder", "scrolling", "src", "height", "width", "style", "loading", "data-testid"]
    };
    this.post.content = DOMPurify.sanitize(this.post.content, sanitizerOptions);

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
        this.toastService.show('Post atualizado com sucesso!', 'success');
       
      },
      error: () => {
        this.toastService.show('Erro ao atualizar post!', 'error');
      },
    });
  }
}
