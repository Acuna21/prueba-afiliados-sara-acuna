import { Component, input, output } from '@angular/core';

import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        (click)="outsideClick.emit()"
        >
        <div
          class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
          (click)="$event.stopPropagation()"
          >
          <h2 class="text-xl font-bold text-gray-900 mb-4">{{ title() }}</h2>
          <p class="text-gray-600 mb-6">{{ message() }}</p>
          <div class="flex gap-3 justify-end">
            <app-button
              label="Cancelar"
              variant="secondary"
              (onClick)="onCancel()"
            ></app-button>
            <app-button
              label="Confirmar"
              variant="danger"
              (onClick)="onConfirm()"
            ></app-button>
          </div>
        </div>
      </div>
    }
    `
})
export class ModalComponent {
  isOpen = input(false);
  title = input('Confirmación');
  message = input('¿Está seguro?');
  confirm = output<void>();
  cancel = output<void>();
  outsideClick = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
