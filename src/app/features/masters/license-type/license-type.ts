import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { UserService } from '../../../core/service/model-services/user/user';
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';
import { TextAreaComponent } from "../../../shared/components/text-area/text-area";
import { LicenseTypeService } from '../../../core/service/api-services/license-type/license-type';

@Component({
 selector: 'app-service-type',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    CrudTableComponent,
    TextFieldComponent,
    TextAreaComponent
],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './license-type.html',
  styleUrl: './license-type.css',
  providers: [ConfirmationService, MessageService]
})

export class LicenseTypeComponent {

  licenseTypes: any[] = [];

  loading = false;
  isSaving = false;

  licenseTypeDialog = false;
  dialogTitle = 'Add License Type';
  formSubmitted = false;

  form!: FormGroup;
  company:any={};
  columns: any[] = [ ];

  constructor(
    private licenseTypeservice: LicenseTypeService,
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
     { field: 'rowId', header: '#', type: 'rowId',sortable:false },
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'is_Active', header: 'Status', type: 'status' ,sortable:false}
    ];
  }

  initForm() {
    this.form = this.fb.group({
      lt_Id: [null],
      code: [{ value: '', disabled: true }],
       name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(20)],
          asyncValidators: [this.nameUniqueValidator()],
          updateOn: 'blur'
        }
      ],
       description: [''],
     });
  }

  load() {
    this.loading = true;
     this.licenseTypeservice.getAll().subscribe((res:any)=>{
    this.licenseTypes = res.data;
      this.loading = false;
    });
  }

 
 loadLicenseTypeCode() {
    this.licenseTypeservice.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('lt_Id')?.value;

      return this.licenseTypeservice
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

    this.dialogTitle = 'Add License Type';
    this.licenseTypeDialog = true;
    this.formSubmitted = false;

    this.loadLicenseTypeCode();
  }

  openEdit(licenseType: any) {

    this.form.patchValue(licenseType);

    this.dialogTitle = 'Edit License Type';
    this.licenseTypeDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.licenseTypeDialog = false;
  }

  saveServiceType() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.lt_Id
      ? this.licenseTypeservice.update(value)
      : this.licenseTypeservice.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.licenseTypeDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'License Type updated' : 'License Type created'
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
      message: 'Are you sure you want to delete this license type?',
      header: 'Delete License Type',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.licenseTypeservice.delete(id).subscribe(() => {

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
      message: 'Are you sure you want to change license type status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.licenseTypeservice.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'License Type status updated'
          });

        });

      }
    });
  }

}