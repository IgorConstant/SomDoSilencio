import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LogEntry {
  _id: string;
  action: string;
  userId?: string;
  userEmail: string;
  resourceId?: string;
  resourceType: string;
  details: {
    title?: string;
    slug?: string;
    status?: string;
    errorMessage?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  timestamp: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface LogStats {
  stats: { _id: string; count: number }[];
  recentActivity: LogEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  getLogs(page: number = 1, limit: number = 50, filters?: {
    action?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<LogsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.action) params = params.set('action', filters.action);
      if (filters.resourceType) params = params.set('resourceType', filters.resourceType);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<LogsResponse>(this.apiUrl, { headers, params });
  }

  getLogStats(): Observable<LogStats> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<LogStats>(`${this.apiUrl}/stats`, { headers });
  }
}
