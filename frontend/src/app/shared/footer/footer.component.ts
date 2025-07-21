import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  anoAtual: number = new Date().getFullYear();
  pixCode: string = environment.codigoPIX;
  pixBtnText: string = 'Pagar com PIX';
  isCopying: boolean = false;

  copyPixCode() {
    if (this.isCopying) return;
    this.isCopying = true;
    navigator.clipboard.writeText(this.pixCode).then(() => {
      this.pixBtnText = 'PIX copiado!';
      setTimeout(() => {
        this.pixBtnText = 'Pagar com PIX';
        this.isCopying = false;
      }, 2000);
    });
  }
}
