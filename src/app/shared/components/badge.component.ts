import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="getClasses()">
      {{ label() }}
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    span {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `]
})
export class BadgeComponent {
  label = input('');
  type = input<'estado' | 'tipo'>('estado');
  value = input('');

  getClasses(): string {
    let baseClasses = 'inline-block px-3 py-1 rounded-full text-sm font-medium';

    // Estado colors
    if (this.type() === 'estado') {
      switch (this.value().toLowerCase()) {
        case 'pendiente':
          return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'en proceso':
        case 'en trámite':
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'resuelta':
        case 'respondido':
        case 'aprobada':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'rechazada':
        case 'negada':
          return `${baseClasses} bg-red-100 text-red-800`;
        case 'radicada':
          return `${baseClasses} bg-indigo-100 text-indigo-800`;
        case 'recibido':
          return `${baseClasses} bg-sky-100 text-sky-800`;
        case 'cerrado':
          return `${baseClasses} bg-gray-100 text-gray-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }

    // Tipo colors
    if (this.type() === 'tipo') {
      switch (this.value().toLowerCase()) {
        case 'petición':
          return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'queja':
          return `${baseClasses} bg-red-100 text-red-800`;
        case 'reclamo':
          return `${baseClasses} bg-orange-100 text-orange-800`;
        case 'sugerencia':
          return `${baseClasses} bg-green-100 text-green-800`;
        case 'derecho':
        case 'consulta':
          return `${baseClasses} bg-indigo-100 text-indigo-800`;
        case 'deber':
          return `${baseClasses} bg-purple-100 text-purple-800`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }

    return baseClasses;
  }
}
