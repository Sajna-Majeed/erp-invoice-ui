import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';
import { UserApiService } from '../../../../core/service/api-services/user/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'fullName', 'email', 'mobileNumber', 'username', 'role', 'actions'];

  users: any[] = [];
  loading = false;

  constructor(
    private userService: UserApiService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    var id = 1
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        // Only show employees (role 2)
        this.users = res.data.filter((u: any) => u.role === 'User');
        this.users.forEach((user: any) => {
          user.id = id++;
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }
  create() {
    this.router.navigate(['/users/create']);
  }

  edit(user: any) {
    this.router.navigate(['/users/edit', user.userId]);
  }



  delete(id: number) {

    // this.confirm.open({
    //   title: 'Delete employee',
    //   message: 'Are you sure you want to delete this employee?',
    //   confirmText: 'Yes, Delete',
    //   cancelText: 'Cancel',
    //   color: 'warn'
    // }).subscribe(result => {

    //   if (result) {
    //     this.userService.delete(id).subscribe(() => {
    //       this.snackBar.open('Deleted successfully', 'Close', { duration: 3000 });
    //       this.loadUsers();
    //     });
    //   }

    // });
  }
}