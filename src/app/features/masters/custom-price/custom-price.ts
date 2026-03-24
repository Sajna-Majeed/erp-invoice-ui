import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { NumberFieldComponent } from '../../../shared/components/number-field/number-field';
import { CustomPriceApiService } from '../../../core/service/api-services/customPrice/customPrice';
import { CustomerApiService } from '../../../core/service/api-services/customer/customer';
import { ProductService } from '../../../core/service/api-services/product/product';
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';
import { ModuleService } from '../../../core/service/api-services/module/module';


@Component({
  selector: 'app-customprice',
  imports: [SHARED_IMPORTS, SelectFieldComponent, CrudTableComponent, NumberFieldComponent],
   viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './custom-price.html',
  styleUrl: './custom-price.css',
   providers: [ConfirmationService, MessageService]
})
export class CustompriceComponent implements OnInit {

  custompricelist: any[] = [];
  serviceType: any[] = [];
  products: any[] = [];
  customers: any[] = [];
  modules: any[] = [];
  loading = false;
  isSaving = false;
  company:any={};
  columns: any[] = [ ];
  form!: FormGroup;
 
  customPriceDialog = false;
  dialogTitle = 'Add Custom Product Price';
  formSubmitted = false;
  
  constructor(
    private service: CustomPriceApiService,
    private customerService: CustomerApiService,
    private productService: ProductService,
    private serviceTypeService: ServiceTypeApiService,
    private moduleService: ModuleService,
    private confirmationService:ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

   
  ngOnInit() {
     this.initForm();
     this.loadServiceTypes();
    this.loadCustomers();
    this.loadModules();
    this.loadProducts();
      this.load();
    this.columns = [
    { field: 'rowId', header: '#', type: 'rowId' },
    { field: 'code', header: 'Code', type: 'text' },
    { field: 'customer', header: 'Customer', type: 'text' },
    { field: 'serviceType', header: 'Service Type', type: 'text' },
    { field: 'product', header: 'Product', type: 'text' },
    { field: 'module', header: 'Module', type: 'text' },
    { field: 'unit_Price', header: 'Unit Price', type: 'number' },
    { field: 'is_Active', header: 'Status', type: 'status' ,sortable:false}
    ];
  }

 initForm() {
    this.form = this.fb.group({
      custom_Prod_Id: [null],
      code: [{ value: '', disabled: true }],
      st_Id: [null, Validators.required],
      customer_Id:[null, Validators.required],
      pd_Id:[null,Validators.required],
      module_Id:[null,Validators.required],
      unit_Price: [0, [Validators.required, Validators.min(0)]]
     });
  }

loadCustomPriceCode() {
    this.service.getNextNumber().subscribe((res: any) => {
     this.form.patchValue({ code: res.data });
    });
  }

 loadCustomers() {
    this.customerService.getAll().subscribe((res: any) => {
      this.customers = res.data;
    });
  }
 loadProducts() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data;
    });
  }
loadServiceTypes() {
    this.serviceTypeService.getAll().subscribe((res: any) => {
      this.serviceType = res.data;
    });
  }
loadModules() {
    this.moduleService.getAll().subscribe((res: any) => {
      this.modules = res.data;
    });
  }
  load() {
    this.service.getAll().subscribe((res: any) => {
      this.custompricelist = res.data;
       this.custompricelist.forEach((bp: any, index: number) => {
          bp.id = index + 1;
        });
    });
  }


  openCreate() {
    this.form.reset({
    });

    this.dialogTitle = 'Add Custom Price';
    this.customPriceDialog = true;
    this.formSubmitted = false;

    this.loadCustomPriceCode();
     }

  openEdit(custom: any) {
    this.loadCustomPriceCode();
    this.form.patchValue(custom);

    this.dialogTitle = 'Edit Custom Price';
    this.customPriceDialog = true;
    this.formSubmitted = false;

  }

  hideDialog() {
    this.customPriceDialog = false;
  }

  saveCustomerType() {
    this.formSubmitted = true;

    if (this.form.invalid) return;

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = value.custom_Prod_Id
      ? this.service.update(value)
      : this.service.create(value);

    request.subscribe({
      next: () => {

        this.isSaving = false;
        this.customPriceDialog = false;

        this.load();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: value.custom_Prod_Id ? 'Custom Price updated' : 'Custom Price created'
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
      message: 'Are you sure you want to delete this  Custom Price?',
      header: 'Delete Custom Price',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.service.delete(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Custom Price deleted successfully'
          });

        });

      }
    });
  }

  toggleStatus(id: number) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to changeCustom Price status?',
      header: 'Change Status',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.service.toggleStatus(id).subscribe(() => {

          this.load();

          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Custom Price status updated'
          });

        });

      }
    });
  }

}

