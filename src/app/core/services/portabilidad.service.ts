import { Injectable, signal } from '@angular/core';
import { Portabilidad } from '../models/portabilidad.model';

@Injectable({
  providedIn: 'root'
})
export class PortabilidadService {
  private portabilidadesSignal = signal<Portabilidad[]>(this.loadFromStorage());
  private counterSignal = signal<number>(this.loadCounterFromStorage());

  portabilidades = this.portabilidadesSignal.asReadonly();
  counter = this.counterSignal.asReadonly();

  private loadFromStorage(): Portabilidad[] {
    try {
      const data = localStorage.getItem('portabilidades');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private loadCounterFromStorage(): number {
    const counter = localStorage.getItem('portabilidadesCounter');
    return counter ? parseInt(counter, 10) : 0;
  }

  private saveToStorage(): void {
    localStorage.setItem('portabilidades', JSON.stringify(this.portabilidadesSignal()));
    localStorage.setItem('portabilidadesCounter', this.counterSignal().toString());
  }

  create(portabilidad: Omit<Portabilidad, 'id' | 'fechaSolicitud'>): Portabilidad {
    const id = this.portabilidadesSignal().length ? Math.max(...this.portabilidadesSignal().map(p => p.id || 0)) + 1 : 1;
    const newPortabilidad: Portabilidad = {
      ...portabilidad,
      id,
      fechaSolicitud: new Date()
    };
    this.portabilidadesSignal.update(ports => [...ports, newPortabilidad]);
    this.saveToStorage();
    return newPortabilidad;
  }

  getAll(): Portabilidad[] {
    return this.portabilidadesSignal();
  }

  getById(id: number): Portabilidad | undefined {
    return this.portabilidadesSignal().find(p => p.id === id);
  }

  update(id: number, portabilidad: Partial<Portabilidad>): Portabilidad | undefined {
    const index = this.portabilidadesSignal().findIndex(p => p.id === id);
    if (index !== -1) {
      const updated = { ...this.portabilidadesSignal()[index], ...portabilidad, id };
      const updated$ = this.portabilidadesSignal().map((p, i) => i === index ? updated : p);
      this.portabilidadesSignal.set(updated$);
      this.saveToStorage();
      return updated;
    }
    return undefined;
  }
}
