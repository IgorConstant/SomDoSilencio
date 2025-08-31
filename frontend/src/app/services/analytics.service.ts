import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from "../../environments/environment";

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  mostReadPosts: {
    postId: string;
    title: string;
    slug: string;
    views: number;
  }[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  osBreakdown: {
    [key: string]: number;
  };
  dailyViews: {
    date: string;
    views: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = environment.apiUrl;
  private sessionId: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private initializeTracking(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView({
          page: event.urlAfterRedirects,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          sessionId: this.sessionId
        });
      });
  }

  trackPageView(data: {
    page: string;
    postId?: string;
    userAgent: string;
    referrer?: string;
    sessionId: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/analytics/track-page`, data);
  }

  getDashboardAnalytics(period: '7d' | '30d' | '90d' = '30d'): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.baseUrl}/analytics/dashboard/data?period=${period}`);
  }

  getPostAnalytics(postId: string, period: '7d' | '30d' | '90d' = '30d'): Observable<any> {
    return this.http.get(`${this.baseUrl}/analytics/post/${postId}?period=${period}`);
  }

  trackPostView(postId: string): Observable<any> {
    return this.trackPageView({
      page: this.router.url,
      postId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: this.sessionId
    });
  }

  private generateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = Date.now() + '_' + Math.random().toString(36).substring(2);
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }

  getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';
    return 'desktop';
  }

  getOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Outros';
  }
}
