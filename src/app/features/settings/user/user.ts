import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { NumberFieldComponent } from '../../../shared/components/number-field/number-field';
import { UserApiService } from '../../../core/service/api-services/user/user';
import { RoleApiService } from '../../../core/service/api-services/role/role';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SHARED_IMPORTS, CrudTableComponent, TextFieldComponent, SelectFieldComponent, NumberFieldComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class UserListComponent implements OnInit {

  roles: any[] = [];
  users: any[] = [];
  loading = false;
  isSaving = false;
  company: any = {};
  columns: any[] = [];
  form!: FormGroup;

  customerDialog = false;
  dialogTitle = 'Add User';
  formSubmitted = false;

  constructor(
    private service: UserApiService,
    private roleService: RoleApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.initForm();
    this.loadRoles();
    this.load();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'name', header: 'Name', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'mobile_Number', header: 'Mobile Number', type: 'text' },
      { field: 'user_Name', header: 'User Name', type: 'text' },
      { field: 'role', header: 'Role', type: 'text' },
      { field: 'is_Active', header: 'Status', type: 'status', sortable: false }
    ];
  }

  initForm() {
    this.form = this.fb.group({
      user_Id: [null],
      name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)]
        }
      ],
      role_Id: [null, Validators.required],
      user_Name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur'
        }
      ],
      email: ['', { validators: [Validators.required, Validators.email] }],
      mobile_Number: ['', {
        validators: [Validators.required, Validators.maxLength(15),
        Validators.pattern(/^\d{3}\d{3}\d{4}$/)]
      }]
    });
  }


  loadRoles() {
    this.roleService.getAllRoles().subscribe((res: any) => {
      this.roles = res.data;
    });
  }


  load() {
    this.service.getUsers().subscribe((res: any) => {
      this.users = res.data;
      this.users.forEach((bp: any, index: number) => {
        bp.id = index + 1;
      });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('user_Id')?.value;

      return this.service
        .checkNameExists(control.value, id)
        .pipe(map((res: any) => res.data ? { nameExists: true } : null));
    };
  }

  openCreate() {

    this.form.reset({
    });

    this.dialogTitle = 'Add User';
    this.customerDialog = true;
    this.formSubmitted = false;

  }

  openEdit(customer: any) {
    this.form.patchValue(customer);

    this.dialogTitle = 'Edit User';
    this.customerDialog = true;
    this.formSubmitted = false;
    this.form.get('user_Name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.customerDialog = false;
  }

  saveUser() {
    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();
    value.mobile_Number = value.mobile_Number.toString();

    const request = value.user_Id
      ? this.service.update(value)
      : this.service.register(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.customerDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.user_Id ? 'User updated' : 'User created'
        });

      },
      error: () => {

        this.isSaving = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed'
        });

      }
    });
  }

  delete(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.service.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'User deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change User status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.service.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'User status updated'
          });

        });

      }
    });
  }

}