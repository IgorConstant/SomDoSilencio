import { Component } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { AnalyticsService } from "./services/analytics.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})

export class App {
  title = "";
  constructor(
    public router: Router,
    private analyticsService: AnalyticsService
  ) {}

  get hideLayoutElements(): boolean {
    const hiddenRoutes = [
      "/login",
      "/dashboard",
      "/criar-postagem",
      "/listar-postagens",
      "/integracoes",
      "/arquivo-stories",
      "/curadoria",
      "/logs"
    ];
   
    return (
      hiddenRoutes.includes(this.router.url) ||
      this.router.url.startsWith("/editar-postagem/")
    );
  }
}
