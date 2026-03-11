import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { signal, computed } from '@angular/core';
import { PortabilidadService } from '../../core/services/portabilidad.service';
import { Portabilidad, EPS_LIST } from '../../core/models/portabilidad.model';
import { ButtonComponent } from '../../shared/components/button.component';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-portabilidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, NavbarComponent, ModalComponent],
  providers: [DatePipe],
  templateUrl: './portabilidad.component.html',
  styleUrls: ['./portabilidad.component.scss']
})
export class PortabilidadComponent implements OnInit {
  form: FormGroup;
  currentStep = signal(1);
  portabilidades = signal<Portabilidad[]>([]);
  showSuccessModal = signal(false);
  successMessage = signal('');
  isLoading = signal(false);
  showDetailModal = signal(false);
  selectedPortabilidad = signal<Portabilidad | null>(null);
  openDropdownId = signal<number | null>(null);

  motivoTraslados = ['Cambio de EPS', 'Cambio de ciudad', 'Cambio de empleo', 'Otro'];
  estadosDisponibles = ['Radicada', 'En revisión', 'Aprobada', 'Negada'];
  epsList = EPS_LIST;

  constructor(
    private fb: FormBuilder,
    private portabilidadService: PortabilidadService
  ) {
    this.form = this.fb.group({
      // Paso 1: Datos Personales
      nombreAfiliado: ['', [Validators.required, Validators.minLength(3)]],
      tipoDocumento: ['CC', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)]],

      // Paso 2: Datos EPS
      epsOrigen: ['', Validators.required],
      epsDestino: ['', Validators.required],
      motivoTraslado: ['Cambio de EPS', Validators.required],
      descripcionMotivo: ['']
    }, { validators: this.validarEPS.bind(this) });
  }

  ngOnInit(): void {
    this.loadPortabilidades();
  }

  private validarEPS(control: AbstractControl): ValidationErrors | null {
    const epsOrigen = control.get('epsOrigen')?.value;
    const epsDestino = control.get('epsDestino')?.value;

    if (epsOrigen && epsDestino && epsOrigen === epsDestino) {
      return { epsMisma: true };
    }

    // Validar descripcionMotivo si motivoTraslado es 'Otro'
    const motivoTraslado = control.get('motivoTraslado')?.value;
    const descripcionMotivo = control.get('descripcionMotivo')?.value;

    if (motivoTraslado === 'Otro' && !descripcionMotivo) {
      return { descripcionMotivoRequired: true };
    }

    return null;
  }

  loadPortabilidades(): void {
    this.portabilidades.set(this.portabilidadService.getAll());
  }

  isStep1Valid(): boolean {
    return !!this.form.get('nombreAfiliado')?.valid &&
           !!this.form.get('tipoDocumento')?.valid &&
           !!this.form.get('numeroDocumento')?.valid;
  }

  isStep2Valid(): boolean {
    return !!this.form.get('epsOrigen')?.valid &&
           !!this.form.get('epsDestino')?.valid &&
           !!this.form.get('motivoTraslado')?.valid &&
           !this.form.hasError('epsMisma') &&
           !this.form.hasError('descripcionMotivoRequired');
  }

  nextStep(): void {
    if (this.currentStep() === 1 && this.isStep1Valid()) {
      this.currentStep.set(2);
    } else if (this.currentStep() === 2 && this.isStep2Valid()) {
      this.currentStep.set(3);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      const formValue = this.form.value;
      const newPortabilidad = this.portabilidadService.create({
        nombreAfiliado: formValue.nombreAfiliado,
        tipoDocumento: formValue.tipoDocumento,
        numeroDocumento: formValue.numeroDocumento,
        epsOrigen: formValue.epsOrigen,
        epsDestino: formValue.epsDestino,
        motivoTraslado: formValue.motivoTraslado,
        descripcionMotivo: formValue.descripcionMotivo || undefined,
        estado: 'Radicada'
      });

      this.portabilidades.set(this.portabilidadService.getAll());
      this.isLoading.set(false);
      this.showSuccessModal.set(true);
      this.successMessage.set(`Solicitud de portabilidad ${newPortabilidad.id} radicada exitosamente`);
      
      // Reset form
      this.form.reset({
        tipoDocumento: 'CC',
        motivoTraslado: 'Cambio de EPS'
      });
      this.currentStep.set(1);
    }, 1000);
  }

  onModalConfirm(): void {
    this.showSuccessModal.set(false);
  }

  verDetalle(port: Portabilidad): void {
    this.selectedPortabilidad.set(port);
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    setTimeout(() => {
      this.selectedPortabilidad.set(null);
    }, 300);
  }

  toggleStateDropdown(id: number | undefined | null): void {
    if (this.openDropdownId() === id) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(id || null);
    }
  }

  cambiarEstado(id: number | undefined, nuevoEstado: string): void {
    if (!id) return;
    const portabilidad = this.portabilidades().find(p => p.id === id);
    if (portabilidad) {
      portabilidad.estado = nuevoEstado as any;
      this.portabilidadService.update(id, portabilidad);
      this.portabilidades.set([...this.portabilidades()]);
      
      // Actualizar el modal si está abierto
      if (this.selectedPortabilidad()?.id === id) {
        this.selectedPortabilidad.set({ ...portabilidad });
      }
    }
  }

  get nombreAfiliado() {
    return this.form.get('nombreAfiliado');
  }

  get numeroDocumento() {
    return this.form.get('numeroDocumento');
  }

  get epsOrigen() {
    return this.form.get('epsOrigen');
  }

  get epsDestino() {
    return this.form.get('epsDestino');
  }

  get motivoTraslado() {
    return this.form.get('motivoTraslado');
  }

  get descripcionMotivo() {
    return this.form.get('descripcionMotivo');
  }
}
