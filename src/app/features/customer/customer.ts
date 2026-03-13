import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CustomerApiService } from '../../core/service/api-services/customer/customer';
import { CustomerTypeApiService } from '../../core/service/api-services/customerType/customer-type';
import { SelectFieldComponent } from '../../shared/components/select-field/select-field';
import { TextFieldComponent } from '../../shared/components/text-field/text-field';
import { CrudTableComponent } from '../../shared/components/crud-table/crud-table';

@Component({
  selector: 'app-customer',
  imports: [SHARED_IMPORTS, SelectFieldComponent, TextFieldComponent, CrudTableComponent],
   viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
   providers: [ConfirmationService, MessageService]
})
export class CustomerComponent implements OnInit {

  customerTypes: any[] = [];
  customers: any[] = [];
  loading = false;
  isSaving = false;
  company:any={};
  columns: any[] = [ ];
form!: FormGroup;
 
  customerDialog = false;
  dialogTitle = 'Add Customer';
  formSubmitted = false;
  
  constructor(
    private service: CustomerApiService,
    private confirmationService:ConfirmationService,
    private customerTypeservice:CustomerTypeApiService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

   
  ngOnInit() {
     this.initForm();
     this.loadCustomerType();
    this.columns = [
    { field: 'rowId', header: '#', type: 'rowId' },
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'customerType', header: 'Type', type: 'text' },
    { field: 'is_Active', header: 'Status', type: 'status' ,sortable:false}
    ];
  }

 initForm() {
    this.form = this.fb.group({
      customer_Id: [null],
      code: [{ value: '', disabled: true }],
       name: [
        '',
        {
          validators: [Validators.required, Validators.maxLength(100)]
        }
      ],
      description: [''],
      customer_Type_Id:[null, Validators.required],
      contact_Person:['',Validators.required],
      email:['',{validators:[Validators.required,Validators.email]}],
      mobile_number:['',Validators.required],
      city:['',Validators.required],
      addressline1:['',Validators.required],
      country_Subdivision:['',Validators.required],
      country:['',Validators.required],
      zip_code:['',Validators.required],
     });
  }

loadCustomerCode() {
    this.service.getNextNumber().subscribe((res: any) => {
     this.form.patchValue({ code: res.data });
    });
  }

 loadCustomerType() {
    this.customerTypeservice.getAll().subscribe((res: any) => {
      this.customerTypes = res.data;
      this.load();
    });
  }


  load() {
    this.service.getAll().subscribe((res: any) => {
      this.customers = res.data;
       this.customers.forEach((bp: any, index: number) => {
          bp.id = index + 1;
          bp.customerType=this.customerTypes.find(x=>x.ct_id==bp.cutomer_Type_Id)?.name
        });
    });
  }


  openCreate() {

    this.form.reset({
    });

    this.dialogTitle = 'Add Customer';
    this.customerDialog = true;
    this.formSubmitted = false;

    this.loadCustomerCode();
  }

  openEdit(customer: any) {
debugger
    this.form.patchValue(customer);

    this.dialogTitle = 'Edit Customer';
    this.customerDialog = true;
    this.formSubmitted = false;

  }

  hideDialog() {
    this.customerDialog = false;
  }

  saveCustomerType() {
debugger
    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.customer_Id
      ? this.service.update(value)
      : this.service.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.customerDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.customer_Id ? 'Customer updated' : 'Customer created'
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
      message: 'Are you sure you want to delete this customer Bussiness Point?',
      header: 'Delete Bussiness Point',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.service.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Bussiness Point deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to change Bussiness Point status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.customerTypeservice.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Bussiness Point status updated'
          });

        });

      }
    });
  }

}

