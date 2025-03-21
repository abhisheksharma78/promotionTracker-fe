import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', { 
        validators: [Validators.required, Validators.email],
        disabled: false
      }],
      password: ['', {
        validators: [Validators.required],
        disabled: false
      }]
    });
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
    if (loading) {
      this.loginForm.disable();
    } else {
      this.loginForm.enable();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.setLoading(true);
      const { email, password } = this.loginForm.getRawValue();

      this.authService.login(email!, password!)
        .subscribe({
          next: () => {
            this.notificationService.success('Login successful');
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.notificationService.error(error.message || 'Login failed');
            this.setLoading(false);
          }
        });
    } else {
      this.notificationService.error('Please fill in all required fields correctly.');
    }
  }
}
