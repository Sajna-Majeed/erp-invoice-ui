import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { UserApiService } from '../../../core/service/api-services/user/user';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-create-edit',
  imports: [SHARED_IMPORTS],
  templateUrl: './create-edit.html',
  styleUrl: './create-edit.css',
})
export class UserFormComponent implements OnInit {

  isEdit = false;
  userId!: number;
  loading = false;
  form!: any;

  constructor(
    private fb: FormBuilder,
    private usersService: UserApiService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_.]+$/)
        ]
      ],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      password: [
        '',
        []
      ]
    });
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.userId = +id;
      this.form.get('password')?.clearValidators();
      this.loadUser();
    } else {
      this.form.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      ]);
    }

    this.form.get('password')?.updateValueAndValidity();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  loadUser() {
    this.usersService.getUserById(this.userId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const payload:User = {
      ...this.form.value,
      role: 'User',
      id: this.userId
    };
    const action = this.isEdit
      ? this.usersService.update(payload)
      : this.usersService.register(payload);

    action.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Employee saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to save employee', 'Close', { duration: 3000 });
      }
    });
  }
}