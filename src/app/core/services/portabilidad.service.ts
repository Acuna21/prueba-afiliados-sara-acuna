import { Injectable, signal } from '@angular/core';
import { Portabilidad } from '../models/portabilidad.model';
/**
 * Servicio encargado de gestionar las solicitudes de portabilidad.
 */
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

  /**
 * Crea una nueva solicitud de portabilidad.
 * 
 * @param portabilidad Datos de la portabilidad
 * @returns {Portabilidad} La portabilidad creada.
 */
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


  /**
   * Busca una portabilidad por su identificador.
   * 
   * @param id Identificador de la portabilidad.
   * @returns {Portabilidad | undefined} La portabilidad encontrada o undefined si no existe.
   */
  getById(id: number): Portabilidad | undefined {
    return this.portabilidadesSignal().find(p => p.id === id);
  }

    /**
   * Actualiza una portabilidad existente.
   * 
   * @param id Identificador de la portabilidad a actualizar.
   * @param portabilidad Datos parciales a modificar.
   * @returns {Portabilidad | undefined} La portabilidad actualizada o undefined si no se encuentra.
   */
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
