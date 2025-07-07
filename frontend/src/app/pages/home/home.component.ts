import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsPostsComponent } from '../../shared/cards-posts/cards-posts.component';
@Component({
  selector: 'app-home',
  imports: [CommonModule, CardsPostsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
