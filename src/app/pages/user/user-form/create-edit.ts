import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { User } from '../../../models/interface/user';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../core/service/model-services/snackbar/snackbar';
import { UserApiService } from '../../../core/service/api-services/user/user';

@Component({
  selector: 'app-create-edit',
  imports: [SHARED_IMPORTS],
  templateUrl: './create-edit.html',
  styleUrl: './create-edit.css',
})
export class UserFormComponent {
[x: string]: any;
 constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService,
    private userApiService: UserApiService
  ) {}
   
  isEdit = false;
  userId!: number;

  newUser: any = {
    userId:0,
    fullName: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    Role: 'User'
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number) {
    this.userApiService.getUserById(id).subscribe({
      next: (res: any) => {
        this.newUser = res.data ?? res;
      },
      error: () => {
        this.snackBar.open('Failed to load user', 'OK', { duration: 3000 });
      }
    });
  }

  onSubmit(form: any) {
    if (!form.valid) return;

    if (this.isEdit) {
      const payload = {
        ...this.newUser,
        id: this.userId
      };

      this.userApiService.update(payload).subscribe({
        next: () => {
          this.snackBar.open('User updated', 'OK', { duration: 2000 });
          this.router.navigate(['/dashboard/users']);
        },
        error: () => {
          this.snackBar.open('Update failed', 'OK', { duration: 3000 });
        }
      });

    } else {
      this.userApiService.register(this.newUser).subscribe({
        next: () => {
          this.snackBar.open('User created', 'OK', { duration: 2000 });
          this.router.navigate(['/dashboard/users']);
        },
        error: () => {
          this.snackBar.open('Create failed', 'OK', { duration: 3000 });
        }
      });
    }
  }
}
