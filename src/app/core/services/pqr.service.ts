import { Injectable, signal } from '@angular/core';
import { PQR } from '../models/pqr.model';

@Injectable({
  providedIn: 'root'
})
export class PQRService {
  private pqrsSignal = signal<PQR[]>(this.loadFromStorage());
  private counterSignal = signal<number>(this.loadCounterFromStorage());

  pqrs = this.pqrsSignal.asReadonly();
  counter = this.counterSignal.asReadonly();

  constructor() {
    this.initializeIfEmpty();
  }

  private loadFromStorage(): PQR[] {
    try {
      const data = localStorage.getItem('pqrs');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private loadCounterFromStorage(): number {
    const counter = localStorage.getItem('pqrsCounter');
    return counter ? parseInt(counter, 10) : 0;
  }

  private saveToStorage(): void {
    localStorage.setItem('pqrs', JSON.stringify(this.pqrsSignal()));
    localStorage.setItem('pqrsCounter', this.counterSignal().toString());
  }

  initializeIfEmpty(): void {
    if (this.pqrsSignal().length === 0) {
      const mockPQRs: PQR[] = [
        {
          id: 1,
          numeroPQR: 'PQR-2026-001',
          tipoPQR: 'Petición',
          nombreAfiliado: 'Juan García',
          correoContacto: 'juan@example.com',
          telefonoContacto: '3101234567',
          descripcion: 'Solicito información sobre cobertura de servicios dentales',
          fechaRecepcion: new Date('2026-03-05'),
          estado: 'Recibido',
          respuesta: undefined
        },
        {
          id: 2,
          numeroPQR: 'PQR-2026-002',
          tipoPQR: 'Queja',
          nombreAfiliado: 'María López',
          correoContacto: 'maria@example.com',
          telefonoContacto: '3109876543',
          descripcion: 'No me atendieron en la cita asignada el día 01 de marzo',
          fechaRecepcion: new Date('2026-03-02'),
          estado: 'En trámite',
          respuesta: undefined
        },
        {
          id: 3,
          numeroPQR: 'PQR-2026-003',
          tipoPQR: 'Reclamo',
          nombreAfiliado: 'Carlos Rodríguez',
          correoContacto: 'carlos@example.com',
          telefonoContacto: '3105555555',
          descripcion: 'Medicamento rechazado sin justificación por la EPS',
          fechaRecepcion: new Date('2026-02-28'),
          estado: 'En trámite',
          respuesta: undefined
        },
        {
          id: 4,
          numeroPQR: 'PQR-2026-004',
          tipoPQR: 'Sugerencia',
          nombreAfiliado: 'Ana Martínez',
          correoContacto: 'ana@example.com',
          telefonoContacto: '3102222222',
          descripcion: 'Ampliar horario de atención al público en la sede principal',
          fechaRecepcion: new Date('2026-02-25'),
          estado: 'Respondido',
          fechaRespuesta: new Date('2026-03-01'),
          respuesta: 'Gracias por la sugerencia. Se evaluará la ampliación de horarios.'
        },
        {
          id: 5,
          numeroPQR: 'PQR-2026-005',
          tipoPQR: 'Petición',
          nombreAfiliado: 'Pedro García',
          correoContacto: 'pedro@example.com',
          telefonoContacto: '3103333333',
          descripcion: 'Necesito certificado de afiliación de forma urgente',
          fechaRecepcion: new Date('2026-02-20'),
          estado: 'Respondido',
          fechaRespuesta: new Date('2026-02-22'),
          respuesta: 'Su certificado ha sido enviado a su correo electrónico.'
        }
      ];
      this.pqrsSignal.set(mockPQRs);
      this.counterSignal.set(5);
      this.saveToStorage();
    }
  }

  private generateNumeroPQR(): string {
    const counter = this.counterSignal() + 1;
    this.counterSignal.set(counter);
    const year = new Date().getFullYear();
    const numero = String(counter).padStart(3, '0');
    return `PQR-${year}-${numero}`;
  }

  create(pqr: Omit<PQR, 'id' | 'numeroPQR' | 'fechaRecepcion'>): PQR {
    const newPQR: PQR = {
      ...pqr,
      id: this.pqrsSignal().length ? Math.max(...this.pqrsSignal().map(p => p.id || 0)) + 1 : 1,
      numeroPQR: this.generateNumeroPQR(),
      fechaRecepcion: new Date()
    };
    this.pqrsSignal.update(pqrs => [...pqrs, newPQR]);
    this.saveToStorage();
    return newPQR;
  }

  getAll(): PQR[] {
    return this.pqrsSignal();
  }

  getById(id: number): PQR | undefined {
    return this.pqrsSignal().find(p => p.id === id);
  }

  update(id: number, pqr: Partial<PQR>): PQR | undefined {
    const index = this.pqrsSignal().findIndex(p => p.id === id);
    if (index !== -1) {
      const updated = { ...this.pqrsSignal()[index], ...pqr, id };
      const updated$ = this.pqrsSignal().map((p, i) => i === index ? updated : p);
      this.pqrsSignal.set(updated$);
      this.saveToStorage();
      return updated;
    }
    return undefined;
  }
}
