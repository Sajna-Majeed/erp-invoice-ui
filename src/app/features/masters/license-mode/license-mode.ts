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
import { LicenseModeService } from '../../../core/service/api-services/license-mode/license-mode';

@Component({
 selector: 'app-license-mode',
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
  templateUrl: './license-mode.html',
  styleUrl: './license-mode.css',
  providers: [ConfirmationService, MessageService]
})

export class LicenseModeComponent {

  licenseModes: any[] = [];

  loading = false;
  isSaving = false;

  licenseModeDialog = false;
  dialogTitle = 'Add License Mode';
  formSubmitted = false;

  form!: FormGroup;
  company:any={};
  columns: any[] = [ ];

  constructor(
    private licenseModeservice: LicenseModeService,
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
      lm_Id: [null],
      code: [{ value: '',disabled: true }],
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
     this.licenseModeservice.getAll().subscribe((res:any)=>{
    this.licenseModes = res.data;
      this.loading = false;
    });
  }

 
 loadLicenseModeCode() {
    this.licenseModeservice.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('lm_Id')?.value;

      return this.licenseModeservice
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

    this.dialogTitle = 'Add License Mode';
    this.licenseModeDialog = true;
    this.formSubmitted = false;

    this.loadLicenseModeCode();
  }

  openEdit(licenseMode: any) {

    this.form.patchValue(licenseMode);

    this.dialogTitle = 'Edit License Mode';
    this.licenseModeDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.licenseModeDialog = false;
  }

  saveServiceType() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.lm_Id
      ? this.licenseModeservice.update(value)
      : this.licenseModeservice.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.licenseModeDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'License Mode updated' : 'License Mode created'
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
      message: 'Are you sure you want to delete this license mode?',
      header: 'Delete License Mode',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.licenseModeservice.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'License Mode deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change license mode status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.licenseModeservice.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'License Mode status updated'
          });

        });

      }
    });
  }

}