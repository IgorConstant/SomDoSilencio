import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router) { }

  onSearch(event: Event, query: string) {
    event.preventDefault();
    const search = query.trim();
    if (search.length > 0) {
      this.router.navigate(['/resultado-pesquisa'], { queryParams: { q: search } });
    }
  }
}
