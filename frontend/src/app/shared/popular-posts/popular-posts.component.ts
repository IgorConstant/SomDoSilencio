import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../services/posts.service';

@Component({
  selector: 'app-popular-posts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular-posts.component.html',
  styleUrls: ['./popular-posts.component.css']
})
export class PopularPostsComponent {
  @Input() posts: Post[] = [];
}
