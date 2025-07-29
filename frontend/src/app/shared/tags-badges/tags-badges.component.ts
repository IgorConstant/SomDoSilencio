import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tags-badges.component.html',
  styleUrls: ['./tags-badges.component.css']
})
export class TagsBadgesComponent {
  @Input() tags: string[] = [];
}
