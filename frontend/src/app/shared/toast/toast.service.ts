import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<{ message: string; type: ToastType } | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastType = 'success') {
    this.toastSubject.next({ message, type });
    setTimeout(() => this.hide(), 3500);
  }

  hide() {
    this.toastSubject.next(null);
  }
}
