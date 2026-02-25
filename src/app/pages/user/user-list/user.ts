import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { Router } from '@angular/router';
import { forEachChild } from 'typescript';
import { UserApiService } from '../../../core/service/api-services/user/user';
import { SnackbarService } from '../../../core/service/model-services/snackbar/snackbar';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UsersComponent implements OnInit {
constructor(
    private router: Router,
    private snackBar: SnackbarService,
    private usersApiService: UserApiService
  ) {}
 users: any[] = [];

  
  displayedColumns: string[] = [ 'id','fullName','email','mobileNumber','username', 'role', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersApiService.getUsers().subscribe({
      next: (res: any) => {
        var id=1
        this.users = res.data ?? res;
        this.users.forEach((user: any) => {
          user.role = user.userRole === 1 ? 'Admin' : 'User';
          user.id = id++;
        });
      },
      error: () => {
        this.snackBar.open('Failed to load users', 'OK', { duration: 3000 });
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.usersApiService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('User deleted', 'OK', { duration: 2000 });
        this.loadUsers();
      },
      error: () => {
        this.snackBar.open('Delete failed', 'OK', { duration: 3000 });
      }
    });
  }
}
