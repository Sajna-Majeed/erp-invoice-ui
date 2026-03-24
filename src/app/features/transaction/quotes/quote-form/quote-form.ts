import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SHARED_IMPORTS } from '../../../../shared/shared-imports';
import { ProductService } from '../../../../core/service/api-services/product/product';
import { QuoteApiService } from '../../../../core/service/api-services/quote/quote';
import { ModuleService } from '../../../../core/service/api-services/module/module';
import { ServiceTypeApiService } from '../../../../core/service/api-services/serviceType/service-type';
import { CustomerApiService } from '../../../../core/service/api-services/customer/customer';
import { Message } from "primeng/message";
import { CustomPriceApiService } from '../../../../core/service/api-services/customPrice/customPrice';
import { FileUploadComponent } from "../../../../shared/components/file-upload/file-upload";
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ErpCurrencyPipe } from "../../../../shared/pipes/erp-currency-pipe";
import { UserService } from '../../../../core/service/model-services/user/user';


@Component({
  selector: 'app-quote-view',
  imports: [SHARED_IMPORTS, MatDatepickerModule, MatNativeDateModule, Message, FileUploadComponent, ErpCurrencyPipe],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.css',
  providers: [MessageService]
})
export class QuoteFormComponent implements OnInit {

  products: any[] = [];
  filteresproducts: any[] = [];
  customers: any[] = [];
  serviceTypes: any[] = [];
  modules: any[] = [];
  form!: FormGroup;
  lineForm!: FormGroup;
  editIndex: number | null = null;
  isEdit = false;
  q_Id!: number;
  lineSubmitted: boolean = false;
  existingFiles: any[] = []; // from API
  newFiles: File[] = [];
  deletedFileIds: number[] = [];
  currencyCode:string="INR";
  constructor(
    private fb: FormBuilder,
    private service: QuoteApiService,
    private moduleService: ModuleService,
    private stService: ServiceTypeApiService,
    private bpService: CustomerApiService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private customPriceService: CustomPriceApiService,
    private messageService: MessageService,
    private userService:UserService
  ) { }

  ngOnInit() {
    this.initializeForm();
    let company=this.userService.getCompany();
    this.currencyCode=company.currency;
    this.q_Id = +this.route.snapshot.paramMap.get('id')!;
    this.isEdit = !!this.q_Id;

    // 🔥 Load all master data first
    Promise.all([
      this.bpService.getAll().toPromise(),
      this.productService.getAll().toPromise(),
      this.stService.getAll().toPromise(),
      this.moduleService.getAll().toPromise()
    ]).then(([customers, products, services, modules]: any) => {

      this.customers = customers.data;
      this.products = products.data;
      this.serviceTypes = services.data;
      this.modules = modules.data;

      if (this.isEdit) {
        this.loadQuote(); // ✅ now safe
      } else {
        this.loadQuoteNumber();
      }

    });

    this.form.get('customer_Id')?.valueChanges.subscribe(() => {
      this.loadRate();
    });
    this.lineForm.get('module_Id')?.valueChanges.subscribe(() => {
      this.loadRate();
    });
    this.lineForm.get('st_Id')?.valueChanges.subscribe(() => {
      this.loadRate();
    });
  this.form.get('discount')?.valueChanges.subscribe(() => {
    this.calculateTotals();
    });
    

  }

  //#region Initalization methods



  initializeForm() {
    this.form = this.fb.group({
      q_Id: [0],
      quote_No: [{ value: '', disabled: true }],
      quote_Date: [new Date(), Validators.required],
      customer_Id: [null, Validators.required],
      total_Amt: [{ value: 0, disabled: true }],
      discount: [0],
      net_Amt: [{ value: 0, disabled: true }],
      increased_Rate: [0],
      t_C: [''],
      quote_Send: [false],
      contract_Signed: [false],
      invoiced: [false],
      payment_Received: [false],
      lines: this.fb.array([])
    });
    this.lineForm = this.fb.group({
      pd_Id: [null, Validators.required],
      product: [null],
      module_Id: [null],
      st_Id: [null],
      base_rate: [0],
      rate: [0],
      license_Count: [1]
    });
  }


  loadRate() {
    this.customPriceService.getByFilter(
      this.lineForm.value.pd_Id ?? 0,
      this.form.value.customer_Id ?? 0,
      this.lineForm.value.st_Id ?? 0,
      this.lineForm.value.module_Id ?? 0
    ).subscribe((res: any) => {
      if (res.data != 0) {
        this.lineForm.patchValue({ rate: res.data, base_rate: res.data });
      }
    });
  }
  loadQuoteNumber() {
    this.service.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ quote_No: res.data });
    });
  }
  loadQuote() {

    this.service.getById(this.q_Id).subscribe((res: any) => {

      const data = res.data;

      data.quote_Date = new Date(data.quote_Date);

      // 🔹 Patch header
      this.form.patchValue({
        q_Id: data.q_Id,
        quote_No: data.quote_No,
        quote_Date: data.quote_Date,
        customer_Id: data.customer_Id,
        discount: data.discount,
        increased_Rate: data.increased_Rate,
        t_C: data.t_C,
        quote_Send: data.quote_Send,
        contract_Signed: data.contract_Signed,
        invoiced: data.invoiced,
        payment_Received: data.payment_Received
      });
      this.existingFiles = data.attchments;
      this.lines.clear();

      data.lines.forEach((line: any, index: number) => {

        this.lines.push(this.fb.group({
          q_Line_Id: line.q_Line_Id || 0,
          q_Id: line.q_Id || 0,
          rowNum: index + 1,
          st_Id: line.st_Id,
          pd_Id: line.pd_Id,
          module_Id: line.module_Id,
          base_rate: line.rate,
          rate: line.rate,
          license_Count: line.license_Count
        }));

      });

      this.calculateTotals();

    });

  }

  //#endregion

  //#region  Dom Helper Methods

 filterProducts(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;
        
        for (let i = 0; i < (this.products as any[]).length; i++) {
            let prod = (this.products as any[])[i];
            if (prod.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(prod);
            }
        }
        this.filteresproducts = filtered;
    }




  onProductSelected(event: any) {

    const productId = event.value;
    const product = this.products.find(p => p.prod_Id === productId);

    if (!product) return;

    this.lineForm.patchValue({
      pd_Id: productId,
      rate: product.unit_Price,
      base_rate: product.unit_Price
    });

    this.moduleService.getByFilter(productId)
      .subscribe((res: any) => {
        this.modules = res.data;
      });

  }
  getProductName(id: number) {
    const product = this.products.find(p => p.prod_Id === id);
    return product ? `${product.code} ${product.name}` : '';
  }

  getServiceName(id: number) {
    const s = this.serviceTypes.find(p => p.st_Id === id);
    return s ? `${s.code} ${s.name}` : '';
  }

  getModuleName(id: number) {
    const m = this.modules.find(p => p.module_Id === id);
    return m ? `${m.code} ${m.name}` : '';
  }

  //#endregion

  //#region  Line Item methods
  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }
  addLine() {

    if (this.lineForm.invalid) {
      this.lineForm.markAllAsTouched();
      return;
    }

    const value = this.lineForm.value;

    const newLine = {
      q_Line_Id: 0,
      q_Id: this.form.value.q_Id,
      rowNum: this.lines.length + 1,
      st_Id: value.st_Id,
      pd_Id: value.pd_Id,
      module_Id: value.module_Id,
      base_rate: value.base_rate,
      rate: value.rate,
      license_Count: value.license_Count
    };

    if (this.editIndex !== null) {
      this.lines.at(this.editIndex).patchValue(newLine);
      this.editIndex = null;
    } else {
      this.lines.push(this.fb.group(newLine));
    }

    this.lineForm.reset({ license_Count: 1 });
    this.calculateTotals();
  }
  editLine(index: number) {

    const line = this.lines.at(index).value;

    this.lineForm.patchValue({
      pd_Id: line.pd_Id,
      module_Id: line.module_Id,
      st_Id: line.st_Id,
      rate: line.rate,
      license_Count: line.license_Count
    });

    this.editIndex = index;
  }
  removeLine(index: number) {
    this.lines.removeAt(index);
    this.calculateTotals();
  }
  calculateTotals() {

    let total = 0;

    this.lines.controls.forEach(line => {

      const value = line.getRawValue();

      const rate = value.rate || 0;
      const qty = value.license_Count || 0;

      total += rate * qty;

    });

    const discount = this.form.value.discount || 0;

    this.form.patchValue({
      total_Amt: total,
      net_Amt: total - discount
    }, { emitEvent: false });

  }
  previewIncrease() {
    const percent = this.form.value.increased_Rate || 0;

    this.lines.controls.forEach(line => {

      const base = line.value.base_rate || 0;

      const newRate = percent == 0 ? base : base + (base * percent / 100);

      line.patchValue({
        rate: newRate
      }, { emitEvent: false });

    });

    this.calculateTotals();
  }
  applyIncrease() {
    this.previewIncrease();
  }

  //#endregion

  //#region  form Methods

  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && (control.touched || this.lineSubmitted);
  }

  save() {

    if (this.form.invalid || this.lines.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    payload.attachments = this.existingFiles;
    // 🔹 Clean lines
    payload.lines = this.lines.controls.map((line, index) => {

      const value = line.getRawValue();

      return {
        q_Line_Id: value.q_Line_Id || 0,
        q_Id: payload.q_Id || 0,
        rowNum: index + 1,
        st_Id: value.st_Id,
        pd_Id: value.pd_Id,
        module_Id: value.module_Id,
        rate: value.rate,
        license_Count: value.license_Count
      };

    });

    this.calculateTotals();

    const formData = new FormData();

    formData.append('data', JSON.stringify(payload));

    // 🔹 new files
    this.newFiles.forEach(file => {
      formData.append('files', file);
    });

    // 🔹 deleted files
    formData.append('deletedFileIds', JSON.stringify(this.deletedFileIds));
    if (this.isEdit) {

      this.service.updateWithFiles(formData).subscribe({
        next: () => this.router.navigate(['/quote']),
        error: err => console.error(err)
      });

    } else {

      this.service.createWithFiles(formData).subscribe({
        next: () => this.router.navigate(['/quote']),
        error: err => console.error(err)
      });

    }

  }
  //#endregion

  //#region  file upload methods

  onFilesChanged(event: any) {
    this.newFiles = event.newFiles;
    this.deletedFileIds = event.deletedFileIds;
  }
  //#endregion
}