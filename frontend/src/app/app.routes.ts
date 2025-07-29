
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { CriarPostagemComponent } from './pages/criar-postagem/criar-postagem.component';
import { ListarPostagensDashboardComponent } from './pages/listar-postagens-dashboard/listar-postagens-dashboard.component';
import { ListarPostsSiteComponent } from './pages/listar-posts-site/listar-posts-site.component';
import { EditarPostDashboardComponent } from './pages/editar-post-dashboard/editar-post-dashboard.component';
import { PostagemComponent } from './pages/postagem/postagem.component';
import { IntegracoesComponent } from './pages/integracoes/integracoes.component';
import { ResultadoPesquisaComponent } from './pages/resultado-pesquisa/resultado-pesquisa.component';
import { SobreMimComponent } from './pages/sobre-mim/sobre-mim.component';
import { ArquivoStoriesComponent } from './pages/arquivo-stories/arquivo-stories.component';
import { CuradoriaComponent } from './pages/curadoria/curadoria.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'criar-postagem', component: CriarPostagemComponent, canActivate: [AuthGuard] },
    { path: 'listar-postagens', component: ListarPostagensDashboardComponent, canActivate: [AuthGuard] },
    { path: 'editar-postagem/:id', component: EditarPostDashboardComponent, canActivate: [AuthGuard] },
    { path: 'integracoes', component: IntegracoesComponent, canActivate: [AuthGuard] },
    { path: 'arquivo-stories', component: ArquivoStoriesComponent, canActivate: [AuthGuard] },
    { path: 'postagens', component: ListarPostsSiteComponent },
    { path: 'post/:slug', component: PostagemComponent },
    { path: 'resultado-pesquisa', component: ResultadoPesquisaComponent },
    { path: 'sobre-mim', component: SobreMimComponent },
    { path: 'curadoria', component: CuradoriaComponent, canActivate: [AuthGuard] }
];
