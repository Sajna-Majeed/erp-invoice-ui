import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { map, of } from 'rxjs';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { TextFieldComponent } from '../../../shared/components/text-field/text-field';
import { CustomerTypeApiService } from '../../../core/service/api-services/customerType/customer-type';
import { UserService } from '../../../core/service/model-services/user/user';

@Component({
   selector: 'app-customer-type',
  standalone: true,
  imports: [
    SHARED_IMPORTS,
    CrudTableComponent,
    TextFieldComponent
],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './customer-type.html',
  styleUrl: './customer-type.css',
  providers: [ConfirmationService, MessageService]
})

export class CustomerTypeComponent {

  customerTypes: any[] = [];

  loading = false;
  isSaving = false;

  customerTypeDialog = false;
  dialogTitle = 'Add Customer Type';
  formSubmitted = false;

  form!: FormGroup;
  company:any={};
  columns: any[] = [ ];

  constructor(
    private customerTypeservice: CustomerTypeApiService,
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
      ct_Id: [null],
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
     this.customerTypeservice.getAll().subscribe((res:any)=>{
    this.customerTypes = res.data;
      this.loading = false;
    });
  }

 
 loadCustomerTypeCode() {
    this.customerTypeservice.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ code: res.data });
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (!control.value) return of(null);

      const id = this.form?.get('ct_Id')?.value;

      return this.customerTypeservice
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

    this.dialogTitle = 'Add Customer Type';
    this.customerTypeDialog = true;
    this.formSubmitted = false;

    this.loadCustomerTypeCode();
  }

  openEdit(customerType: any) {

    this.form.patchValue(customerType);

    this.dialogTitle = 'Edit Customer Type';
    this.customerTypeDialog = true;
    this.formSubmitted = false;

    this.form.get('name')?.updateValueAndValidity();
  }

  hideDialog() {
    this.customerTypeDialog = false;
  }

  saveCustomerType() {

    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.id
      ? this.customerTypeservice.update(value)
      : this.customerTypeservice.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.customerTypeDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.id ? 'Customer Type updated' : 'Customer Type created'
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
      message: 'Are you sure you want to delete this customer type?',
      header: 'Delete Customer Type',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.customerTypeservice.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Customer Type deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change customer type status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.customerTypeservice.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Customer Type status updated'
          });

        });

      }
    });
  }

}