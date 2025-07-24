import { Component } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
// ...existing code...
export class AppComponent {
  title = "";
  constructor(public router: Router) {}

  get hideLayoutElements(): boolean {
    const hiddenRoutes = [
      "/login",
      "/dashboard",
      "/criar-postagem",
      "/listar-postagens",
      "/integracoes",
      "/arquivo-stories",
      "/curadoria",
      
    ];
    // Verifica se está em uma rota exata ou se começa com '/editar-postagem/'
    return (
      hiddenRoutes.includes(this.router.url) ||
      this.router.url.startsWith("/editar-postagem/")
    );
  }
}
