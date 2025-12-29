import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NavbarDashboardComponent } from '../../shared/navbar-dashboard/navbar-dashboard.component';
import { BaseChartDirective } from 'ng2-charts';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, NavbarDashboardComponent, BaseChartDirective, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  analytics: AnalyticsData | null = null;
  loading = true;
  error: string | null = null;
  selectedPeriod: '7d' | '30d' | '90d' = '30d';
  private refreshInterval: any;

  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public lineChartLegend = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    console.log('[Dashboard] ngOnInit');
    this.loadAnalytics();
    this.refreshInterval = setInterval(() => {
      this.loadAnalytics();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadAnalytics(): void {
    console.log('[Dashboard] loadAnalytics', { period: this.selectedPeriod });
    this.loading = true;
    this.error = null;

    this.analyticsService.getDashboardAnalytics(this.selectedPeriod).subscribe({
      next: (data) => {
        console.log('[Dashboard] analytics recebido', data);
        this.analytics = data;
        this.updateChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('[Dashboard] erro ao carregar analytics', err);
        this.error = 'Erro ao carregar dados de analytics';
        this.loading = false;
      }
    });
  }

  updateChartData(): void {
    if (!this.analytics) return;

    this.lineChartLabels = this.analytics.dailyViews.map(item => 
      new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    );
    
    this.lineChartData = [{
      data: this.analytics.dailyViews.map(item => item.views),
      label: 'Visualizações',
      fill: false,
      tension: 0.4,
      type: 'line'
    }];
  }

  changePeriod(period: '7d' | '30d' | '90d'): void {
    this.selectedPeriod = period;
    this.loadAnalytics();
  }

  getDevicePercentage(device: 'desktop' | 'mobile' | 'tablet'): number {
    if (!this.analytics) return 0;
    
    const total = Object.values(this.analytics.deviceBreakdown).reduce((sum, count) => sum + count, 0);
    return total > 0 ? Math.round((this.analytics.deviceBreakdown[device] / total) * 100) : 0;
  }

  getTopOperatingSystems(): { name: string; percentage: number }[] {
    if (!this.analytics) return [];
    
    const total = Object.values(this.analytics.osBreakdown).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) return [];
    
    return Object.entries(this.analytics.osBreakdown)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  }
}
