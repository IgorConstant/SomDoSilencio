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
    
    // Track initial page load
    setTimeout(() => {
      this.trackPageView({
        page: this.router.url || '/',
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: this.sessionId
      }).subscribe({
        next: (response) => {
          console.log('Initial page view tracked:', response);
        },
        error: (error) => {
          console.error('Error tracking initial page view:', error);
        }
      });
    }, 1000);
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
        }).subscribe({
          next: (response) => {
            console.log('Page view tracked successfully:', response);
          },
          error: (error) => {
            console.error('Error tracking page view:', error);
          }
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
    
    // Detectar tablet primeiro (mais específico)
    if (/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i.test(userAgent)) {
      return 'tablet';
    }
    
    // Detectar mobile
    if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|fennec/i.test(userAgent)) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  getOperatingSystem(): string {
    const userAgent = navigator.userAgent;
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac os x|macintosh/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    if (/chrome os/i.test(userAgent)) return 'Chrome OS';
    return 'Outros';
  }
}
