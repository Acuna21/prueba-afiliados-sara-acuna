import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [ngClass]="getClasses()"
      (click)="onClick.emit()"
      >
      @if (loading()) {
        <span class="mr-2">⌛</span>
      }
      {{ label() }}
    </button>
    `
})
export class ButtonComponent {
  label = input('Button');
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary');
  disabled = input(false);
  loading = input(false);
  onClick = output<void>();

  getClasses(): string {
    let baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    switch (this.variant()) {
      case 'primary':
        return `${baseClasses} bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800`;
      case 'secondary':
        return `${baseClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 active:bg-red-800`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 active:bg-green-800`;
      default:
        return baseClasses;
    }
  }
}
