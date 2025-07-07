
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarDashboardComponent } from '../../shared/navbar-dashboard/navbar-dashboard.component';
import { PostsService, CriarPosts } from '../../services/posts.service';

// NGX Editor imports
import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';


@Component({
  selector: 'app-criar-postagem',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, NavbarDashboardComponent, NgxEditorComponent, NgxEditorMenuComponent],
  templateUrl: './criar-postagem.component.html',
  styleUrl: './criar-postagem.component.css'
})
export class CriarPostagemComponent {

  editor!: Editor;
  content: string = '';

  constructor(public postsService: PostsService) {}

  post: CriarPosts = {
    title: '',
    slug: '',
    author: '',
    content: '',
    image: '',
    seoDescription: '',
    status: '',
    tags: [],
    category: ''
  };
  selectedFile: File | null = null;

  ngOnInit() {
    this.editor = new Editor();
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
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
          alert('Post criado com sucesso!');
          window.location.href = '/dashboard';
        },
        error: () => alert('Erro ao criar post!')
      });
    } else {
      if (typeof this.post.tags === 'string') {
        this.post.tags = (this.post.tags as unknown as string).split(',').map((t: string) => t.trim());
      }
      this.postsService.criarPostagem(this.post).subscribe({
        next: () => {
          alert('Post criado com sucesso!');
          window.location.href = '/dashboard';
        },
        error: () => alert('Erro ao criar post!')
      });
    }
  }
}
