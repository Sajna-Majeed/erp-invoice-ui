import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, of } from 'rxjs';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { RoleApiService } from '../../../core/service/api-services/role/role';

@Component({
  selector: 'app-role-permission',
  imports: [SHARED_IMPORTS, TextFieldComponent, CrudTableComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './role-permission.html',
  styleUrl: './role-permission.css',
})
export class RolePermissionComponent {
  roles: any[] = [];
  permissions: any[] = [];
  displayDialog = false;
  loading = false;
  isSaving = false;

  dialogTitle = 'Add User Role';
  formSubmitted = false;
  roleForm!: FormGroup;
  columns: any = [];

  permissionTable: any[] = [];
  selectedPermissionIds: number[] = [];

  constructor(private fb: FormBuilder,
    private roleService: RoleApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }


  //#region  Inital methods
  ngOnInit() {
    this.initForm();
    this.loadRoles();
    this.loadPermissions();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'name', header: 'Name', type: 'text' },
      { field: 'description', header: 'Description', type: 'text' },
      { field: 'is_Active', header: 'Status', type: 'status', sortable: false }
    ];
  }

  initForm() {
    this.roleForm = this.fb.group({
      role_Id: [0],
      name: ['',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur'
        }
      ],
      description: [''],
      permissionIds: [[]]
    });

  }


  loadRoles() {
    this.roleService.getAllRoles().subscribe((res: any) => {
      this.roles = res.data;
    });
  }

  loadPermissions(callback?: () => void) {
    this.roleService.getAllPermission().subscribe((res: any) => {
      this.preparePermissionTable(res.data);
      this.selectedPermissionIds = [...this.selectedPermissionIds];
      if (callback) {
        callback(); // 👈 run after tree loaded
      }
    });
  }


  //#endregion

  //#region Form methods
  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.roleForm?.get('role_Id')?.value;

      return this.roleService
        .checkNameExists(control.value, id)
        .pipe(map((res: any) => res.data ? { nameExists: true } : null));
    };
  }

  openDialog() {
    this.roleForm.reset({
      role_Id: 0,
      name: '',
      description: '',
      permissionIds: []
    });
    this.displayDialog = true;
  }
  openEdit(role: any) {

    this.roleForm.patchValue({
      role_Id: role.role_Id,
      name: role.name,
      description: role.description,
      permissionIds: role.permissionIds
    });

    this.displayDialog = true;

    this.displayDialog = true;
    this.formSubmitted = false;
    this.roleForm.get('name')?.updateValueAndValidity();

    setTimeout(() => {
    this.selectedPermissionIds = [...role.permissionIds];
  });
  }

  hideDialog() {
    this.displayDialog = false;
  }

  //#endregion

  //#region  Permission tree

  preparePermissionTable(data: any[]) {
    const table: any[] = [];

    data.forEach(group => {

      table.push({
        isGroup: true,
        group: group.label
      });

      group.permissions.forEach((module: any) => {

        const row: any = {
          isGroup: false,
          group: group.label,
          module: module.label,
          VIEW: null,
          CREATE: null,
          EDIT: null,
          DELETE: null
        };

        module.children.forEach((perm: any) => {
          if (perm.name.startsWith('VIEW')) row.VIEW = perm.prm_id;
          if (perm.name.startsWith('CREATE')) row.CREATE = perm.prm_id;
          if (perm.name.startsWith('EDIT')) row.EDIT = perm.prm_id;
          if (perm.name.startsWith('DELETE')) row.DELETE = perm.prm_id;
        });

        table.push(row);
      });
    });

    this.permissionTable = table;
  }
  isChecked(id: number): boolean {
    return this.selectedPermissionIds.includes(id);
  }
  isRowAllChecked(row: any): boolean {
  return ['VIEW', 'CREATE', 'EDIT', 'DELETE']
    .every(type => !row[type] || this.selectedPermissionIds.includes(row[type]));
}
onPermissionChange(checked: boolean, id: number, row?: any, type?: string) {

  if (!id) return;

  if (checked) {
    if (!this.selectedPermissionIds.includes(id)) {
      this.selectedPermissionIds.push(id);
    }
  } else {
    this.selectedPermissionIds =
      this.selectedPermissionIds.filter(x => x !== id);
  }

  // 🔥 enforce rules
  if (type === 'VIEW' && !checked && row) {
    ['CREATE', 'EDIT', 'DELETE'].forEach(t => {
      if (row[t]) {
        this.selectedPermissionIds =
          this.selectedPermissionIds.filter(x => x !== row[t]);
      }
    });
  }

  if (['CREATE', 'EDIT', 'DELETE'].includes(type!) && checked && row?.VIEW) {
    if (!this.selectedPermissionIds.includes(row.VIEW)) {
      this.selectedPermissionIds.push(row.VIEW);
    }
  }

  // 🔥 trigger UI refresh
  this.selectedPermissionIds = [...this.selectedPermissionIds];
}
  toggleRow(row: any, checked: boolean) {
    ['VIEW', 'CREATE', 'EDIT', 'DELETE'].forEach(type => {
      const id = row[type];
      if (!id) return;

      if (checked) {
        if (!this.selectedPermissionIds.includes(id)) {
          this.selectedPermissionIds.push(id);
        }
      } else {
        this.selectedPermissionIds = this.selectedPermissionIds.filter(x => x !== id);
      }
    });
  }
  toggleColumn(type: string, checked: boolean) {

    this.permissionTable
      .filter(r => !r.isGroup)
      .forEach(row => {

        const id = row[type];
        if (!id) return;

        if (checked) {
          if (!this.selectedPermissionIds.includes(id)) {
            this.selectedPermissionIds.push(id);
          }

          // ensure VIEW is checked
          if (type !== 'VIEW' && row.VIEW) {
            if (!this.selectedPermissionIds.includes(row.VIEW)) {
              this.selectedPermissionIds.push(row.VIEW);
            }
          }

        } else {
          this.selectedPermissionIds = this.selectedPermissionIds.filter(x => x !== id);
        }

      });
  }
toggleGroupColumn(group: string, type: string, checked: boolean) {

  this.permissionTable
    .filter(r => !r.isGroup && r.group === group)
    .forEach(row => {

      const id = row[type];
      if (!id) return;

      if (checked) {
        if (!this.selectedPermissionIds.includes(id)) {
          this.selectedPermissionIds.push(id);
        }

        // ensure VIEW if needed
        if (type !== 'VIEW' && row.VIEW) {
          if (!this.selectedPermissionIds.includes(row.VIEW)) {
            this.selectedPermissionIds.push(row.VIEW);
          }
        }

      } else {
        this.selectedPermissionIds =
          this.selectedPermissionIds.filter(x => x !== id);
      }

    });
}
toggleGroupAll(group: string, checked: boolean) {

  this.permissionTable
    .filter(r => !r.isGroup && r.group === group)
    .forEach(row => {

      ['VIEW', 'CREATE', 'EDIT', 'DELETE'].forEach(type => {
        const id = row[type];
        if (!id) return;

        if (checked) {
          if (!this.selectedPermissionIds.includes(id)) {
            this.selectedPermissionIds.push(id);
          }
        } else {
          this.selectedPermissionIds =
            this.selectedPermissionIds.filter(x => x !== id);
        }
      });

    });
}
isGroupColumnChecked(group: string, type: string): boolean {
  const rows = this.permissionTable
    .filter(r => !r.isGroup && r.group === group);

  return rows.every(r => !r[type] || this.selectedPermissionIds.includes(r[type]));
}
isGroupAllChecked(group: string): boolean {
  const rows = this.permissionTable
    .filter(r => !r.isGroup && r.group === group);

  return rows.every(row =>
    ['VIEW', 'CREATE', 'EDIT', 'DELETE']
      .every(type => !row[type] || this.selectedPermissionIds.includes(row[type]))
  );
}
  //#endregion

  //#region  API Methods
  saveRole() {
    const  permissionIds=this.selectedPermissionIds;


    this.isSaving = true;

    const value = this.roleForm.getRawValue();
    const payload = {
      ...this.roleForm.value,
      permissionIds
    };
    const request = value.role_Id
      ? this.roleService.update(payload)
      : this.roleService.create(payload);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.displayDialog = false;

        this.loadRoles();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Role updated' : 'Role created'
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


  deleteRole(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this service type?',
      header: 'Delete Service Type',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.roleService.delete(id).subscribe(() => {

          this.loadRoles();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Service Type deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change role status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.roleService.toggleStatus(id).subscribe(() => {

          this.loadRoles();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Role status updated'
          });

        });

      }
    });
  }
  //#endregion
}
