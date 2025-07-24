
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toast = this.toastService.toast;

  get message(): string {
    return this.toast()?.message ?? '';
  }

  get type(): ToastType {
    return this.toast()?.type ?? 'success';
  }

  get icon(): string {
    return this.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
  }
}
