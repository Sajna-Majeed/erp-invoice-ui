import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceApiService } from '../../../core/service/api-services/invoice/invoice';
import { BussinessPointApiService } from '../../../core/service/api-services/bp/bussiness-point';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../../core/service/api-services/product/product';

@Component({
  selector: 'app-invoice-view',
  imports: [SHARED_IMPORTS, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './invoice-view.html',
  styleUrl: './invoice-view.css',
})
export class InvoiceFormComponent implements OnInit {

  partners: any[] = [];
  form!: FormGroup;
  isEdit = false;
  invoiceId!: number;
  filteredProducts: { [key: number]: any[] } = {};

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceApiService,
    private bpService: BussinessPointApiService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.initializeForm();

    this.invoiceId = +this.route.snapshot.paramMap.get('id')!;
    this.isEdit = !!this.invoiceId;

    this.loadPartners();

    if (this.isEdit) {
      this.loadInvoice();
    } else {
      this.loadInvoiceNumber();
      this.addLine();
    }

    this.listenPartnerChange();
  }

  initializeForm() {
    this.form = this.fb.group({
      invoice_Id: [0],
      invoice_No: [''],
      invoice_Date: [new Date(), Validators.required],
      due_Date: [new Date(), Validators.required],

      invoice_Curreny_Code: ['AED', Validators.required],
      invoice_Type_Code: [''],
      invoice_Tsn_Code: [''],
      bsn_Process_Type: [''],
      specification_Identifier: [''],
      payment_Means_Type_Code: [''],

      net_Amt: [0],
      total_Wo_Tax: [0],
      total_Tax_Amt: [0],
      total_W_Tax: [0],
      payment_Due_Amt: [0],

      tax_Cat_Taxable_Amt: [0],
      tax_Cat_Tax_Amt: [0],
      tax_Cat_Code: [''],
      tax_Cat_Rate: [5],

      bp_Id: [null, Validators.required],
      addressLine: ['', Validators.required],

      lines: this.fb.array([])
    });
  }

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  loadInvoiceNumber() {
    this.invoiceService.getNextNumber().subscribe((res: any) => {
      this.form.patchValue({ invoice_No: res.data });
    });
  }

  loadPartners() {
    this.bpService.getAll().subscribe((res: any) => {
      this.partners = res.data;
    });
  }

  loadInvoice() {

    this.invoiceService.getById(this.invoiceId).subscribe((res: any) => {

      const data = res.data;

      // Convert date strings to Date objects
      data.invoice_Date = new Date(data.invoice_Date);
      data.due_Date = new Date(data.due_Date);

      // Clear existing lines
      this.lines.clear();
this.productService.getAll().subscribe((products: any) => {

      const productList = products.data;

      this.lines.clear();

      data.lines.forEach((line: any) => {

        const product = productList.find((p: { id: any; }) => p.id === line.product_Id);

        line.item_Name = product || '';

        this.lines.push(this.createLineGroup(line));
      });

      this.form.patchValue(data);
      this.calculateTotals();
    });
    });
  }

  listenPartnerChange() {

    this.form.get('bp_Id')?.valueChanges.subscribe(id => {

      if (this.isEdit) return; // prevent overwrite in edit

      const partner = this.partners.find(p => p.bp_Id == id);

      if (partner) {
        this.form.patchValue({
          addressLine:
            partner.addressLine1 + '\n' +
            partner.city + ', ' +
            partner.country_Subdivision + ', ' +
            partner.country
        });
      }
    });
  }

  createLineGroup(line?: any) {
    const group = this.fb.group({
      invoice_Id: [line?.invoice_Id || 0],
      rowNum: [line?.rowNum || this.lines.length + 1],
      product_Id: [line?.product_Id ?? null],
      item_Name: [line?.item_Name || '', [Validators.required, this.productValidator.bind(this)]],
      description: [line?.description || ''],
      inv_Line_Identifier: [line?.inv_Line_Identifier || ''],
      unit_Of_Measure_Code: [line?.unit_Of_Measure_Code || 'PCS'],
      item_Price_Base_Qty: [line?.item_Price_Base_Qty || 1, [Validators.required,Validators.min(1)]],
      item_Gross_Price: [line?.item_Gross_Price || 0],
      item_Tax_Cat_Code: [line?.item_Tax_Cat_Code || 'VAT'],
      item_Net_Price: [{ value: line?.item_Net_Price || 0, disabled: true }],
      item_Tax_Rate: [{ value: line?.item_Tax_Rate || 5, disabled: true }],
      net_Amt: [line?.net_Amt || 0],
      vat_In_Aed: [line?.vat_In_Aed || 0],
      amt_In_Aed: [line?.amt_In_Aed || 0]
    });
    const index = this.lines.length;

    group.get('item_Name')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {

        if (!value) return;

        this.productService.search(value).subscribe((res: any) => {
          this.filteredProducts[index] = res.data;
        });

        this.calculateTotals();
      });
    group.get('item_Price_Base_Qty')?.valueChanges.subscribe(() => {
      this.calculateLine(group);
    });
    group.get('item_Name')?.valueChanges.subscribe(value => {
  if (typeof value === 'string') {
    group.get('product_Id')?.setValue(null, { emitEvent: false });
  }
});
    return group;
  }
productValidator(control: any) {
  const value = control.value;

  // If value is string, user typed manually
  if (typeof value === 'string') {
    return { invalidProduct: true };
  }

  return null;
}

displayProduct(product: any): string {
  return product && product.name ? product.name : '';
}
  onProductSelected(product: any, index: number) {

    const line = this.lines.at(index);

    line.patchValue({
      product_Id: product.id,
      item_Name: product,
      item_Net_Price: product.unit_Price,
      item_Tax_Rate: product.tax_Rate
    }, { emitEvent: false });

    this.calculateTotals();
  }
  validateProduct(index: number) {
  const line = this.lines.at(index);
  const value = line.get('item_Name')?.value;

  if (typeof value === 'string') {
    line.get('item_Name')?.setErrors({ invalidProduct: true });
  }
}
  addLine() {
    this.lines.push(this.createLineGroup());
  }

  removeLine(index: number) {
    this.lines.removeAt(index);
    this.calculateTotals();
  }
calculateLine(line: FormGroup) {

    const raw = line.getRawValue();

    const qty = +raw.item_Price_Base_Qty || 0;
    const price = +raw.item_Net_Price || 0;
    const rate = +raw.item_Tax_Rate || 0;

    const net = qty * price;
    const tax = (net * rate) / 100;
    const total = net + tax;

    line.patchValue({
      net_Amt: net,
      vat_In_Aed: tax,
      amt_In_Aed: total
    }, { emitEvent: false });

     this.calculateTotals();
  }
  calculateTotals() {

    let net = 0;
    let tax = 0;

    this.lines.controls.forEach(line => {

      const raw = line.getRawValue();   // 🔥 IMPORTANT

      const qty = +raw.item_Price_Base_Qty || 0;
      const price = +raw.item_Net_Price || 0;
      const rate = +raw.item_Tax_Rate || 0;

      const lineNet = qty * price;
      const lineTax = (lineNet * rate) / 100;

      line.patchValue({
        net_Amt: lineNet,
        vat_In_Aed: lineTax,
        amt_In_Aed: lineNet + lineTax
      }, { emitEvent: false });

      net += lineNet;
      tax += lineTax;
    });

    this.form.patchValue({
      net_Amt: net,
      total_Wo_Tax: net,
      total_Tax_Amt: tax,
      total_W_Tax: net + tax,
      payment_Due_Amt: net + tax
    }, { emitEvent: false });
  }

  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 this.lines.controls.forEach(line => {
      const itemName = line.get('item_Name')?.value;

      if (itemName && typeof itemName === 'object') { 
        line.get('item_Name')?.setValue(itemName.name);
      }
  });
    const payload = this.form.getRawValue();

    if (this.isEdit) {
      this.invoiceService.update(payload).subscribe(() => {
        this.router.navigate(['/invoice']);
      });
    } else {
      this.invoiceService.create(payload).subscribe(() => {
        this.router.navigate(['/invoice']);
      });
    }
  }
}