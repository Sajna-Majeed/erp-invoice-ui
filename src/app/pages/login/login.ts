import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { AuthService } from '../../core/service/api-services/auth/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  isLoading = false;
  errorMessage = '';
  hide = true;
  form!: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
showError(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['error-snackbar']
  });
}
  onSubmit() {
    if (this.form.invalid) {
    this.showError('Please enter username and password');
    return;
  }

  this.isLoading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token); // Adjust if API structure differs
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.showError('Invalid username or password');
        this.isLoading = false;
      }
    });
  }

  
}







