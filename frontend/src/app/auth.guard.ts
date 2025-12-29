import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    // Só acessa localStorage se estiver no browser
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    const isLoggedIn = isBrowser ? !!localStorage.getItem('token') : false;
    console.log('[AuthGuard] canActivate', { url: state.url, isBrowser, isLoggedIn });
    if (!isLoggedIn) {
      // Evita problemas com <base href="/SomDoSilencio/"> usando UrlTree do Router
      console.warn('[AuthGuard] bloqueado; redirecionando para /login');
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
