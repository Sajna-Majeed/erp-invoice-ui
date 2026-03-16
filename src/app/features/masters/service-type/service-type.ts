import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { UserService } from '../../../core/service/model-services/user/user';
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';

@Component({
 selector: 'app-service-type',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    CrudTableComponent,
    TextFieldComponent
],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './service-type.html',
  styleUrl: './service-type.css',
  providers: [ConfirmationService, MessageService]
})

export class ServiceTypeComponent {

  serviceTypes: any[] = [];

  loading = false;
  isSaving = false;

  serviceTypeDialog = false;
  dialogTitle = 'Add Service Type';
  formSubmitted = false;

  form!: FormGroup;
  company:any={};
  columns: any[] = [ ];

  constructor(
    private serviceTypeservice: ServiceTypeApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userservice:UserService,
    private fb: FormBuilder
  ) {}

  
  ngOnInit() {
    this.initForm();
    this.load();
    this.company = this.userservice.getCompany();
    this.columns = [
     { field: 'rowId', header: '#', type: 'rowId' },
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'is_Active', header: 'Status', type: 'status' ,sortable:false}
    ];
  }

  initForm() {
    this.form = this.fb.group({
      st_Id: [null],
      code: [{ value: '', disabled: true }],
       name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur'
        }
      ],
      description: [''],
     });
  }

  load() {
    this.loading = true;
     this.serviceTypeservice.getAll().subscribe((res:any)=>{
    this.serviceTypes = res.data;
      this.loading = false;
    });
  }

 
 loadServicetypeCode() {
    this.serviceTypeservice.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('st_Id')?.value;

      return this.serviceTypeservice
        .checkNameExists(control.value, id)
        .pipe(map((res: any) => res.data ? { nameExists: true } : null));
    };
  }

  openCreate() {

    this.form.reset({
      unit_Price: 0,
      tax_Rate: 5,
      is_active: true
    });

    this.dialogTitle = 'Add Service Type';
    this.serviceTypeDialog = true;
    this.formSubmitted = false;

    this.loadServicetypeCode();
  }

  openEdit(serviceType: any) {

    this.form.patchValue(serviceType);

    this.dialogTitle = 'Edit Service Type';
    this.serviceTypeDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.serviceTypeDialog = false;
  }

  saveServiceType() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.id
      ? this.serviceTypeservice.update(value)
      : this.serviceTypeservice.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.serviceTypeDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Service Type updated' : 'Service Type created'
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
      message: 'Are you sure you want to delete this service type?',
      header: 'Delete Service Type',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.serviceTypeservice.delete(id).subscribe(() => {

          this.load();

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
      message: 'Are you sure you want to change service type status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.serviceTypeservice.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Service Type status updated'
          });

        });

      }
    });
  }

}