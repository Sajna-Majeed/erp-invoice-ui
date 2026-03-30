import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { SelectFieldComponent } from '../../../shared/components/select-field/select-field';
import { CrudTableComponent } from '../../../shared/components/crud-table/crud-table';
import { NumberFieldComponent } from '../../../shared/components/number-field/number-field';
import { PriceListApiService } from '../../../core/service/api-services/price-list/price-list';
import { CategoryService } from '../../../core/service/api-services/category/category';
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';
import { ProductService } from '../../../core/service/api-services/product/product';
import { LicenseTypeService } from '../../../core/service/api-services/license-type/license-type';
import { LicenseModeService } from '../../../core/service/api-services/license-mode/license-mode';
import { DateFieldComponent } from "../../../shared/components/date-field/date-field";


@Component({
  selector: 'app-price-list',
  imports: [SHARED_IMPORTS, SelectFieldComponent, CrudTableComponent, NumberFieldComponent, DateFieldComponent],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
  templateUrl: './price-list.html',
  styleUrl: './price-list.css',
  providers: [ConfirmationService, MessageService]
})
export class PriceListComponent implements OnInit {

  pricelist: any[] = [];
  serviceType: any[] = [];
  products: any[] = [];
  licenseTypes: any[] = [];
  licenseModels: any[] = [];
  categories: any[] = [];
  loading = false;
  isSaving = false;
  company: any = {};
  columns: any[] = [];
  form!: FormGroup;

  customPriceDialog = false;
  dialogTitle = 'Add Product Price';
  formSubmitted = false;

  constructor(
    private service: PriceListApiService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private serviceTypeService: ServiceTypeApiService,
    private licenseTypeService: LicenseTypeService,
    private licenseModelService: LicenseModeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.initForm();
    this.loadServiceTypes();
    this.loadLicenseTypes();
    this.loadLicenseModels();
    this.load();
    this.columns = [
      { field: 'rowId', header: '#', type: 'rowId' },
      { field: 'serviceType', header: 'Service Type', type: 'text' },
      { field: 'category', header: 'Category', type: 'text' },
      { field: 'product', header: 'Product', type: 'text' },
      { field: 'licenseType', header: 'License Type', type: 'text' },
      { field: 'licenseMode', header: 'License Model', type: 'text' },
      { field: 'unit_Rate', header: 'Unit Rate', type: 'number' },
      { field: 'alf_Rate', header: 'ALF Rate', type: 'number' },
      { field: 'is_Active', header: 'Status', type: 'status', sortable: false }
    ];
  this.form.get('st_Id')?.valueChanges.subscribe(value => {
    this.applyDynamicValidators(value);
  });
  }
applyDynamicValidators(serviceTypeId: number) {

  const lt = this.form.get('lt_Id');
  const lm = this.form.get('lm_Id');
  const alf = this.form.get('alf_Rate');
  const product = this.form.get('pd_Id');

  // Reset all first
  lt?.clearValidators();
  lm?.clearValidators();
  alf?.clearValidators();
  product?.clearValidators();

  if (this.isALF(serviceTypeId)) {
    lt?.setValidators([Validators.required]);
    lm?.setValidators([Validators.required]);
    alf?.setValidators([Validators.required]);
    product?.setValidators([Validators.required]);
  }

  if (this.isHOST(serviceTypeId)) {
    product?.setValidators([Validators.required]);
  }

  // AMC → no extra required fields

  lt?.updateValueAndValidity();
  lm?.updateValueAndValidity();
  alf?.updateValueAndValidity();
  product?.updateValueAndValidity();
}
  initForm() {
    this.form = this.fb.group({
      pl_Id: [null],
      st_Id: [null, Validators.required],
      cat_Id: [null, Validators.required],
      pd_Id: [null, Validators.required],
      lt_Id: [null, Validators.required],
      lm_Id: [null, Validators.required],
      unit_Rate: [0, [Validators.required, Validators.min(0)]],
      alf_Rate: [0, [Validators.required, Validators.min(0), Validators.max(this.company?.taxlimit ?? 100)]],
      effective_From: [null, Validators.required],
      effective_To: [null,Validators.required]
    },{validators: this.dateRangeValidator });
  }
isALF(id: number) {
  return id === 1; // adjust based on DB
}

isAMC(id: number) {
  return id === 2;
}

isHOST(id: number) {
  return id === 3;
}
dateRangeValidator(group: AbstractControl) {
  const from = group.get('effective_From')?.value;
  const to = group.get('effective_To')?.value;

  if (!from || !to) return null;

  return new Date(to) >= new Date(from)
    ? null
    : { dateRangeInvalid: true };
}
  loadCategories() {
    this.categories = [];
    this.form.get('cat_Id')?.setValue(null);
    this.categoryService.getFiltered(this.form.get('st_Id')?.value).subscribe((res: any) => {
      this.categories = res.data;
    });
  }
  loadProducts() {
    this.productService.getFiltered(this.form.get('cat_Id')?.value).subscribe((res: any) => {
      this.products = res.data;
    });
  }
  loadServiceTypes() {
    this.serviceTypeService.getAll().subscribe((res: any) => {
      this.serviceType = res.data;
    });
  }
  loadLicenseTypes() {
    this.licenseTypeService.getAll().subscribe((res: any) => {
      this.licenseTypes = res.data;
    });
  }
  loadLicenseModels() {
    this.licenseModelService.getAll().subscribe((res: any) => {
      this.licenseModels = res.data;
    });
  }
  load() {
    this.service.getAll().subscribe((res: any) => {
      this.pricelist = res.data;
      this.pricelist.forEach((bp: any, index: number) => {
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

  }

  openEdit(custom: any) {
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

    const request = value.pl_Id
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
          detail: value.pl_Id ? 'Custom Price updated' : 'Custom Price created'
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

