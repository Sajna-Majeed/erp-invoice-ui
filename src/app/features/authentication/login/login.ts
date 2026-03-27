import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { AuthService } from '../../../core/service/api-services/auth/auth';
import { UserService } from '../../../core/service/model-services/user/user';
import { ThemeService } from '../../../core/service/theme-services/theme';
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
    private userService: UserService,
    private messageService: MessageService,
    public themeService: ThemeService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
showError(message: string) {
  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: message
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
        this.auth.setToken(res.data.accessToken); 
        this.auth.setRefreshToken(res.data.refreshToken);
        this.userService.setUser(res.data );
        this.userService.setCompany({
          company: res.data.company
        });
        this.userService.setMenu(res.data.menulist);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.showError('Invalid username or password');
        this.isLoading = false;
      }
    });
  }

  
}







