import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Post {
  _id: string;
  title: string;
  slug: string;
  seoDescription: string;
  status: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-posts-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts-data-table.component.html',
  styleUrls: ['./posts-data-table.component.css']
})
export class PostsDataTableComponent implements OnInit {
  @Input() posts: Post[] = [];
  @Output() pageChange = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() postDeleted = new EventEmitter<string>();

  filterTitle: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  get filteredPosts(): Post[] {
    if (!this.filterTitle) return this.posts;
    return this.posts.filter(post => post.title.toLowerCase().includes(this.filterTitle.toLowerCase()));
  }

  get paginatedPosts(): Post[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.pageSize);
  }

  ngOnInit(): void {}

  onFilterChange() {
    this.currentPage = 1;
    this.filterChange.emit(this.filterTitle);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }

  private router = inject(Router);

  editPost(post: Post) {
    this.router.navigate([`/editar-postagem`, post._id]);
  }

  private postsService = inject(PostsService);

  deletePost(postId: string) {
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) return;
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.postDeleted.emit(postId);
      },
      error: () => {
        alert('Erro ao excluir postagem.');
      }
    });
  }
}
