import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartaDerechosService } from '../../../core/services/carta-derechos.service';
import { CartaDerechosModalService } from '../../../core/services/carta-derechos-modal.service';
import { CartaDerechos, EstadoSolicitud } from '../../../core/models/carta-derechos.model';
import { BadgeComponent } from '../../../shared/components/badge.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { ModalComponent } from '../../../shared/components/modal.component';
import { signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carta-derechos-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    ButtonComponent,
    ModalComponent
  ],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class CartaDerechosListaComponent implements OnInit {
  cartaService = inject(CartaDerechosService) as CartaDerechosService;
  modalService = inject(CartaDerechosModalService) as CartaDerechosModalService;
  router = inject(Router) as Router;

  searchTerm = signal('');
  selectedEstado = signal<EstadoSolicitud | 'Todos'>('Todos');
  currentPage = signal(1);
  pageSize = 5;
  
  cartasDerechos = computed(() => this.cartaService.cartas());
  modalOpen = signal(false);
  itemToDelete: CartaDerechos | null = null;

  estados: (EstadoSolicitud | 'Todos')[] = ['Todos', 'Pendiente', 'En proceso', 'Resuelta', 'Rechazada'];

  filteredCartas = computed(() => {
    let cartas = this.cartasDerechos();
    
    if (this.selectedEstado() !== 'Todos') {
      cartas = cartas.filter((c: CartaDerechos) => c.estado === this.selectedEstado());
    }
    
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      cartas = cartas.filter((c: CartaDerechos) =>
        c.numeroSolicitud.toLowerCase().includes(search) ||
        c.nombreAfiliado.toLowerCase().includes(search) ||
        c.descripcion.toLowerCase().includes(search)
      );
    }
    
    return cartas;
  });

  paginatedCartas = computed(() => {
    const filtered = this.filteredCartas();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredCartas().length / this.pageSize);
  });

  ngOnInit(): void {}

  onCreateNew(): void {
    this.modalService.openCreateModal();
  }

  onEdit(id: number | undefined): void {
    if (id) {
      const carta = this.cartaService.getById(id);
      if (carta) {
        this.modalService.openEditModal(carta);
      }
    }
  }

  onView(id: number | undefined): void {
    if (id) {
      this.router.navigate(['/carta-derechos/detalle', id]);
    }
  }

  onDeleteClick(carta: CartaDerechos): void {
    this.itemToDelete = carta;
    this.modalOpen.set(true);
  }

  confirmDelete(): void {
    if (this.itemToDelete?.id) {
      const deleted = this.cartaService.delete(this.itemToDelete.id);
      if (deleted) {
        this.modalOpen.set(false);
        this.itemToDelete = null;
      }
    }
  }

  cancelDelete(): void {
    this.modalOpen.set(false);
    this.itemToDelete = null;
  }

  exportCSV(): void {
    const data = this.filteredCartas();
    let csv = 'Nº,Numero Solicitud,Tipo,Afiliado,Fecha,Estado\n';
    
    data.forEach((c: CartaDerechos, index: number) => {
      csv += `${index + 1},"${c.numeroSolicitud}","${c.tipoSolicitud}","${c.nombreAfiliado}","${c.fechaSolicitud}","${c.estado}"\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'cartas-derechos.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
}
