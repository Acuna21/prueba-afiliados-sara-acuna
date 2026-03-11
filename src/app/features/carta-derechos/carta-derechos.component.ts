import { Component, inject } from '@angular/core';


import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { CrearEditarModalComponent } from './crear-editar-modal/crear-editar-modal.component';
import { CartaDerechosModalService } from '../../core/services/carta-derechos-modal.service';

@Component({
  selector: 'app-carta-derechos',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CrearEditarModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      <main class="max-w-7xl mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>

      <!-- Modal para crear/editar -->
      <app-crear-editar-modal
        [isOpen]="modalService.modalOpen()"
        [mode]="modalService.modalMode()"
        [cartaToEdit]="modalService.cartaToEdit()"
        (onClose)="modalService.closeModal()"
      ></app-crear-editar-modal>
    </div>
  `
})
export class CartaDerechosComponent {
  modalService = inject(CartaDerechosModalService);
}
