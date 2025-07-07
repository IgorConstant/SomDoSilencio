
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { CriarPostagemComponent } from './pages/criar-postagem/criar-postagem.component';
import { ListarPostagensDashboardComponent } from './pages/listar-postagens-dashboard/listar-postagens-dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'criar-postagem', component: CriarPostagemComponent, canActivate: [AuthGuard] },
    { path: 'listar-postagens', component: ListarPostagensDashboardComponent, canActivate: [AuthGuard] },
];
