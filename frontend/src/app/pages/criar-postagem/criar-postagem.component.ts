
import { Component } from '@angular/core';
import { ToastService, ToastType } from '../../shared/toast/toast.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import DOMPurify from 'dompurify';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarDashboardComponent } from '../../shared/navbar-dashboard/navbar-dashboard.component';
import { PostsService, CriarPosts } from '../../services/posts.service';

// NGX Editor imports
import { QuillModule } from 'ngx-quill';


@Component({
  selector: 'app-criar-postagem',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, NavbarDashboardComponent, QuillModule, ToastComponent],
  templateUrl: './criar-postagem.component.html',
  styleUrl: './criar-postagem.component.css'
})
export class CriarPostagemComponent {
  constructor(public postsService: PostsService, public toastService: ToastService) {}
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  };


  post: CriarPosts = {
    title: '',
    slug: '',
    author: '',
    content: '',
    image: '',
    seoDescription: '',
    status: '',
    intro: '',
    tags: [],
    autoriaFoto: '',
    category: '',
    featured: false
  };
  selectedFile: File | null = null;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    // Sanitizar o conteúdo permitindo iframes
    const sanitizerOptions = {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameBorder', 'scrolling', 'src', 'height', 'width', 'style', 'loading', 'data-testid']
    };
    this.post.content = DOMPurify.sanitize(this.post.content, sanitizerOptions);

    if (this.selectedFile) {
      const formData = new FormData();
      Object.entries(this.post).forEach(([key, value]) => {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, (value as string[]).join(','));
        } else {
          formData.append(key, value as string);
        }
      });
      formData.append('image', this.selectedFile);
      this.postsService.criarPostagem(formData as any).subscribe({
        next: () => {
          this.toastService.show('Post criado com sucesso!', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        },
        error: () => this.toastService.show('Erro ao criar post!', 'error')
      });
    } else {
      if (typeof this.post.tags === 'string') {
        this.post.tags = (this.post.tags as unknown as string).split(',').map((t: string) => t.trim());
      }
      this.postsService.criarPostagem(this.post).subscribe({
        next: () => {
          this.toastService.show('Post criado com sucesso!', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        },
        error: () => this.toastService.show('Erro ao criar post!', 'error')
      });
    }
  }
}
