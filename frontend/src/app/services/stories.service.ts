import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface StoryImage {
  name: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class StoriesService {
  private apiUrl = environment.apiUrl + '/stories';
  private baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  getStories() {
    return this.http.get<StoryImage[]>(this.apiUrl).pipe(
      map((stories: StoryImage[]) => stories.map((story: StoryImage) => ({
        ...story,
        url: story.url.startsWith('http') ? story.url : this.baseURL + story.url
      })))
    );
  }
}
