import { Component, OnInit } from '@angular/core';
import { StoriesService, StoryImage } from '../../services/stories.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarDashboardComponent } from '../../shared/navbar-dashboard/navbar-dashboard.component';
@Component({
  selector: 'app-arquivo-stories',
  imports: [CommonModule, SidebarComponent, NavbarDashboardComponent],
  templateUrl: './arquivo-stories.component.html',
  styleUrl: './arquivo-stories.component.css'
})
export class ArquivoStoriesComponent implements OnInit {
  stories: StoryImage[] = [];
  loading = true;
  error = '';

  constructor(private storiesService: StoriesService) {}

  ngOnInit() {
    this.storiesService.getStories().subscribe({
      next: (data) => {
        this.stories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar stories';
        this.loading = false;
      }
    });
  }

  download(url: string, name: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
