import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarDashboardComponent } from '../../shared/navbar-dashboard/navbar-dashboard.component';
import { CommonModule } from '@angular/common';
import { PostsService, Post } from '../../services/posts.service';
import { RouterLink } from '@angular/router';
import { PostsDataTableComponent } from './posts-data-table.component';

@Component({
  selector: 'app-listar-postagens-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarDashboardComponent, PostsDataTableComponent, RouterLink],
  templateUrl: './listar-postagens-dashboard.component.html',
  styleUrl: './listar-postagens-dashboard.component.css'
})
export class ListarPostagensDashboardComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    this.loading = true;
    this.postsService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar postagens.';
        this.loading = false;
      }
    });
  }
}
