import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PostsService, Post } from '../../services/posts.service';

@Component({
  selector: 'app-cards-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cards-posts.component.html',
  styleUrl: './cards-posts.component.css'
})
export class CardsPostsComponent implements OnInit {
  posts: Post[] = [];
  uploadsUrl = environment.apiUrl + '/uploads/';

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.filter(p => p.status === 'publicado');
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      }
    });
  }
}
