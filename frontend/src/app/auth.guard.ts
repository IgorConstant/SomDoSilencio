import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Só acessa localStorage se estiver no browser
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    const isLoggedIn = isBrowser ? !!localStorage.getItem('token') : false;
    if (!isLoggedIn) {
      return this.router.parseUrl('/login');
    }
    return true;
  }
}
