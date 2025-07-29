import { Component, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NavbarDashboardComponent } from "../../shared/navbar-dashboard/navbar-dashboard.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";

@Component({
  selector: "app-integracoes",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarDashboardComponent,
    SidebarComponent,
  ],
  templateUrl: "./integracoes.component.html",
  styleUrl: "./integracoes.component.css",
})
export class IntegracoesComponent {
  analyticsScript = "";

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Carrega do localStorage ao abrir a tela
    const saved = localStorage.getItem('analyticsScript');
    if (saved) {
      this.analyticsScript = saved;
      this.inserirNoHead(saved);
    }
  }

  salvarScript() {
    if (this.analyticsScript.trim()) {
      // Salva no localStorage
      localStorage.setItem('analyticsScript', this.analyticsScript);
      this.inserirNoHead(this.analyticsScript);
      alert("Script inserido no <head>!");
    } else {
      alert("Cole um script antes de salvar.");
    }
  }

  private inserirNoHead(scriptContent: string) {
    const oldScript = document.getElementById("custom-analytics-script");
    if (oldScript) {
      oldScript.remove();
    }
    const script = this.renderer.createElement("script");
    script.id = "custom-analytics-script";
    script.type = "text/javascript";
    script.text = scriptContent;
    this.renderer.appendChild(document.head, script);
  }
}
