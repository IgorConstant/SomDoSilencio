import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  mfa = '';
  error = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(event: Event) {
    console.log('[Login] submit', { email: this.email, hasPassword: !!this.password, mfaLen: this.mfa?.length });
    event.preventDefault();
    this.error = '';
    this.authService.login(this.email, this.password, this.mfa).subscribe({
      next: (res) => {
        console.log('[Login] resposta API', res);
        const token: string | undefined = res?.token;
        if (!token) {
          console.warn('[Login] token ausente na resposta');
          this.error = 'Resposta de login inválida (token ausente).';
          return;
        }

        localStorage.setItem('token', token);
        console.log('[Login] token salvo no localStorage', { tokenPreview: token.slice(0, 12) + '...' });

        // Usa UrlTree para respeitar <base href="/SomDoSilencio/"> em qualquer ambiente.
        // Se a navegação falhar (erro de rota/componente), faz fallback via redirect de página.
        const dashboardTree = this.router.createUrlTree(['/dashboard']);
        const serialized = this.router.serializeUrl(dashboardTree);
        console.log('[Login] tentando navegar para', { serialized, baseURI: document.baseURI });

        this.router.navigateByUrl(dashboardTree).then(
          (ok) => {
            console.log('[Login] navigateByUrl resultado', ok);
            if (ok) return;
            const relative = this.router.serializeUrl(dashboardTree).replace(/^\//, '');
            const url = new URL(relative, document.baseURI).toString();
            console.warn('[Login] navigateByUrl retornou false; fallback window.location', url);
            window.location.assign(url);
          },
          (err) => {
            console.error('[Login] erro no navigateByUrl; fallback', err);
            const relative = this.router.serializeUrl(dashboardTree).replace(/^\//, '');
            const url = new URL(relative, document.baseURI).toString();
            window.location.assign(url);
          }
        );
      },
      error: (err) => {
        console.error('[Login] erro API', err);
        this.error = 'Login ou MFA inválido.';
      }
    });
  }

}
