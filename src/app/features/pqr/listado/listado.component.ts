import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { signal, computed } from '@angular/core';
import { PQRService } from '../../../core/services/pqr.service';
import { PQR, TipoPQR } from '../../../core/models/pqr.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { BadgeComponent } from '../../../shared/components/badge.component';
import { NavbarComponent } from '../../../shared/components/navbar.component';

@Component({
  selector: 'app-pqr-listado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, BadgeComponent, NavbarComponent],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class PQRListadoComponent implements OnInit {
  pqrs = signal<PQR[]>([]);
  selectedPQR = signal<PQR | null>(null);
  selectedTab = signal<string>('Todos');
  searchTerm = signal('');
  sortDirection = signal<'asc' | 'desc'>('desc');
  responseForm: FormGroup;
  isResponding = signal(false);
  isLoadingResponse = signal(false);
  successMessage = signal('');

  tipos: TipoPQR[] = ['Petición', 'Queja', 'Reclamo', 'Sugerencia'];

  tabs = computed(() => ['Todos', ...this.tipos]);

  filteredPQRs = computed(() => {
    const allPQRs = this.pqrs();
    const tab = this.selectedTab();
    const search = this.searchTerm().toLowerCase();
    const sortDir = this.sortDirection();

    let filtered = allPQRs
      .filter(pqr => tab === 'Todos' || pqr.tipoPQR === tab)
      .filter(pqr =>
        pqr.numeroPQR.toLowerCase().includes(search) ||
        pqr.nombreAfiliado.toLowerCase().includes(search)
      );

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.fechaRecepcion).getTime();
      const dateB = new Date(b.fechaRecepcion).getTime();
      return sortDir === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  });

  responseStats = computed(() => {
    const allPQRs = this.pqrs();
    return {
      total: allPQRs.length,
      respondidas: allPQRs.filter(p => p.estado === 'Respondido').length,
      pendientes: allPQRs.filter(p => p.estado === 'Recibido').length,
      porcentaje: allPQRs.length ? Math.round((allPQRs.filter(p => p.estado === 'Respondido').length / allPQRs.length) * 100) : 0
    };
  });

  constructor(
    private fb: FormBuilder,
    private pqrService: PQRService
  ) {
    this.responseForm = this.fb.group({
      respuesta: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadPQRs();
  }

  loadPQRs(): void {
    this.pqrService.initializeIfEmpty();
    this.pqrs.set(this.pqrService.getAll());
  }

  selectPQR(pqr: PQR): void {
    this.selectedPQR.set(pqr);
    this.isResponding.set(false);
    this.responseForm.reset();
    this.successMessage.set('');
  }

  selectTab(tab: string): void {
    this.selectedTab.set(tab);
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  toggleDateSort(): void {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }

  toggleResponding(): void {
    this.isResponding.set(!this.isResponding());
    this.successMessage.set('');
  }

  onSubmitResponse(): void {
    const pqr = this.selectedPQR();
    if (!pqr || this.responseForm.invalid) {
      return;
    }

    this.isLoadingResponse.set(true);

    setTimeout(() => {
      const respuesta = this.responseForm.get('respuesta')?.value;
      const updatedPQR = this.pqrService.update(pqr.id!, {
        respuesta,
        estado: 'Respondido',
        fechaRespuesta: new Date()
      });

      if (updatedPQR) {
        this.selectedPQR.set(updatedPQR);
        this.pqrs.set(this.pqrService.getAll());
        this.isResponding.set(false);
        this.isLoadingResponse.set(false);
        this.successMessage.set('Respuesta enviada exitosamente');
        this.responseForm.reset();

        setTimeout(() => this.successMessage.set(''), 3000);
      }
    }, 800);
  }

  onBack(): void {
    this.selectedPQR.set(null);
    this.isResponding.set(false);
    this.successMessage.set('');
  }

  get respuesta() {
    return this.responseForm.get('respuesta');
  }
}
