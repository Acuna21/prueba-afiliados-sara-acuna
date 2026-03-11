import { Injectable, signal } from '@angular/core';
import { CartaDerechos } from '../models/carta-derechos.model';

@Injectable({
  providedIn: 'root'
})
export class CartaDerechosModalService {
  modalOpen = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  cartaToEdit = signal<CartaDerechos | null>(null);

  openCreateModal(): void {
    this.modalMode.set('create');
    this.cartaToEdit.set(null);
    this.modalOpen.set(true);
  }

  openEditModal(carta: CartaDerechos): void {
    this.modalMode.set('edit');
    this.cartaToEdit.set(carta);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.cartaToEdit.set(null);
  }
}
