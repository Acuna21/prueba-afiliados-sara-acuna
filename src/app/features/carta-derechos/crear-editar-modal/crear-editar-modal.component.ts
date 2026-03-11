import { Component, input, output, OnInit, inject, effect } from '@angular/core';

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartaDerechosService } from '../../../core/services/carta-derechos.service';
import { CartaDerechos, TipoSolicitud, EstadoSolicitud } from '../../../core/models/carta-derechos.model';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-crear-editar-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ mode() === 'create' ? 'Nueva Solicitud' : 'Editar Solicitud' }}
            </h2>
            <button (click)="onCancel()" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
          </div>
    
          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
            <!-- Tipo Solicitud -->
            <div>
              <label for="tipoSolicitud" class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Solicitud *
              </label>
              <select
                id="tipoSolicitud"
                formControlName="tipoSolicitud"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                @for (tipo of tipos; track tipo) {
                  <option [value]="tipo">{{ tipo }}</option>
                }
              </select>
            </div>
    
            <!-- Descripción -->
            <div>
              <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-2">
                Descripción * (mínimo 20 caracteres)
              </label>
              <textarea
                id="descripcion"
                formControlName="descripcion"
                rows="4"
                placeholder="Describe tu solicitud en detalle..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                [class.border-red-500]="descripcion?.invalid && descripcion?.touched"
              ></textarea>
              @if (descripcion?.invalid && descripcion?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  @if (descripcion?.errors?.['required']) {
                    <span>La descripción es requerida</span>
                  }
                  @if (descripcion?.errors?.['minlength']) {
                    <span>Mínimo 20 caracteres</span>
                  }
                </p>
              }
              <p class="mt-1 text-xs text-gray-500">{{ descripcion?.value?.length || 0 }}/500 caracteres</p>
            </div>
    
            <!-- Nombre Afiliado -->
            <div>
              <label for="nombreAfiliado" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Afiliado *
              </label>
              <input
                id="nombreAfiliado"
                type="text"
                formControlName="nombreAfiliado"
                placeholder="Juan Pérez García"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
    
              <!-- Número Documento -->
              <div>
                <label for="numeroDocumento" class="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento * (6-12 dígitos)
                </label>
                <input
                  id="numeroDocumento"
                  type="text"
                  formControlName="numeroDocumento"
                  placeholder="1234567890"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  [class.border-red-500]="numeroDocumento?.invalid && numeroDocumento?.touched"
                  />
                  @if (numeroDocumento?.invalid && numeroDocumento?.touched) {
                    <p class="mt-1 text-sm text-red-600">
                      @if (numeroDocumento?.errors?.['required']) {
                        <span>El documento es requerido</span>
                      }
                      @if (numeroDocumento?.errors?.['pattern']) {
                        <span>Debe ser un número de 6-12 dígitos</span>
                      }
                    </p>
                  }
                </div>
    
                <!-- Estado (solo en edición) -->
                @if (mode() === 'edit') {
                  <div>
                    <label for="estado" class="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      id="estado"
                      formControlName="estado"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                      @for (estado of estados; track estado) {
                        <option [value]="estado">{{ estado }}</option>
                      }
                    </select>
                  </div>
                }
    
                <!-- Observaciones -->
                <div>
                  <label for="observaciones" class="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones (opcional)
                  </label>
                  <textarea
                    id="observaciones"
                    formControlName="observaciones"
                    rows="3"
                    placeholder="Cualquier información adicional..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  ></textarea>
                </div>
    
                <!-- Buttons -->
                <div class="flex gap-4 pt-6 border-t border-gray-200 justify-end">
                  <app-button
                    label="Cancelar"
                    variant="secondary"
                    (onClick)="onCancel()"
                  ></app-button>
                  <app-button
                    label="{{ mode() === 'create' ? 'Crear Solicitud' : 'Guardar Cambios' }}"
                    variant="primary"
                    type="submit"
                    [disabled]="form.invalid"
                  ></app-button>
                </div>
              </form>
            </div>
          </div>
        }
    `
})
export class CrearEditarModalComponent implements OnInit {
  isOpen = input(false);
  mode = input<'create' | 'edit'>('create');
  cartaToEdit = input<CartaDerechos | null>(null);
  
  onClose = output<void>();
  onSave = output<CartaDerechos>();

  form: FormGroup;
  tipos: TipoSolicitud[] = ['Derecho', 'Deber', 'Consulta', 'Reclamo'];
  estados: EstadoSolicitud[] = ['Pendiente', 'En proceso', 'Resuelta', 'Rechazada'];

  private readonly cartaService = inject(CartaDerechosService);

  constructor() {
    this.form = new FormGroup({
      tipoSolicitud: new FormControl('Derecho', Validators.required),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(20)]),
      nombreAfiliado: new FormControl('', Validators.required),
      numeroDocumento: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,12}$/)]),
      estado: new FormControl('Pendiente', Validators.required),
      observaciones: new FormControl('')
    });

    // Cargar datos cuando cartaToEdit cambia
    effect(() => {
      const carta = this.cartaToEdit();
      if (carta) {
        this.form.patchValue(carta);
      } else {
        this.form.reset({
          tipoSolicitud: 'Derecho',
          estado: 'Pendiente'
        });
      }
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    if (this.mode() === 'edit' && this.cartaToEdit()) {
      this.cartaService.update(this.cartaToEdit()!.id!, formValue);
      this.onSave.emit({ ...this.cartaToEdit(), ...formValue });
    } else {
      const newCarta = this.cartaService.create(formValue as Omit<CartaDerechos, 'id' | 'numeroSolicitud' | 'fechaSolicitud'>);
      this.onSave.emit(newCarta);
    }

    this.onClose.emit();
  }

  onCancel(): void {
    this.onClose.emit();
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get numeroDocumento() {
    return this.form.get('numeroDocumento');
  }
}
