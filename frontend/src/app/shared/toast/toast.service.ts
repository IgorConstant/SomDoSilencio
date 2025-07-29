
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ToastService {

  private toastSignal = signal<{ message: string; type: ToastType } | null>(null);
  toast = this.toastSignal;


  show(message: string, type: ToastType = 'success') {
    this.toastSignal.set({ message, type });
    setTimeout(() => this.hide(), 3500);
  }

  hide() {
    this.toastSignal.set(null);
  }
}
