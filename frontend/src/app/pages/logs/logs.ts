import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarDashboardComponent } from '../../shared/navbar-dashboard/navbar-dashboard.component';
import { LogsService, LogEntry, LogStats } from '../../services/logs.service';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarDashboardComponent],
  templateUrl: './logs.html',
  styleUrl: './logs.css'
})
export class Logs implements OnInit {
  logs: LogEntry[] = [];
  stats: LogStats | null = null;
  loading = true;
  error = '';

  // Filtros
  filters = {
    action: '',
    resourceType: '',
    startDate: '',
    endDate: ''
  };

  // Paginação
  currentPage = 1;
  totalPages = 0;
  total = 0;
  pageSize = 50;

  // Opções para os filtros
  actionOptions = [
    { value: '', label: 'Todas as ações' },
    { value: 'CREATE_POST', label: 'Criar Post' },
    { value: 'UPDATE_POST', label: 'Editar Post' },
    { value: 'DELETE_POST', label: 'Excluir Post' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'REGISTER', label: 'Registro' },
    { value: 'ERROR', label: 'Erro' },
    { value: 'VIEW_POST', label: 'Visualizar Post' }
  ];

  resourceTypeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'POST', label: 'Post' },
    { value: 'USER', label: 'Usuário' },
    { value: 'SYSTEM', label: 'Sistema' }
  ];

  constructor(private logsService: LogsService) {}

  ngOnInit(): void {
    this.loadLogs();
    this.loadStats();
  }

  loadLogs(): void {
    this.loading = true;
    this.logsService.getLogs(this.currentPage, this.pageSize, this.filters).subscribe({
      next: (response) => {
        this.logs = response.logs;
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar logs';
        this.loading = false;
        console.error('Erro ao carregar logs:', err);
      }
    });
  }

  loadStats(): void {
    this.logsService.getLogStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadLogs();
  }

  clearFilters(): void {
    this.filters = {
      action: '',
      resourceType: '',
      startDate: '',
      endDate: ''
    };
    this.currentPage = 1;
    this.loadLogs();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLogs();
    }
  }

  getActionLabel(action: string): string {
    const option = this.actionOptions.find(opt => opt.value === action);
    return option ? option.label : action;
  }

  getActionBadgeClass(action: string): string {
    switch (action) {
      case 'CREATE_POST':
        return 'bg-success';
      case 'UPDATE_POST':
        return 'bg-primary';
      case 'DELETE_POST':
        return 'bg-danger';
      case 'LOGIN':
        return 'bg-info';
      case 'ERROR':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  getPaginationArray(): number[] {
    const maxPages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
