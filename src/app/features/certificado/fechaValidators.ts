import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {

  if (!control.value) return null;

  const fecha = new Date(control.value);
  const hoy = new Date();
  
  fecha.setHours(0,0,0,0);
  hoy.setHours(0,0,0,0);

  const hace120 = new Date();
  hace120.setFullYear(hoy.getFullYear() - 120);
  hace120.setHours(0,0,0,0);

  if (fecha > hoy) {
    return { fechaFutura: true };
  }

  if (fecha < hace120) {
    return { mayor120: true };
  }

  return null;
}