import { Component, inject, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(val => !val);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    const { email, password } = this.loginForm.value;

    setTimeout(() => {
      const result = this.authService.validateCredentials(email, password);
      
      if (result.valid && result.user) {
        this.authService.login(result.user);
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Credenciales incorrectas. Inténtalo de nuevo');
        this.isLoading.set(false);
      }
    }, 1000);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
