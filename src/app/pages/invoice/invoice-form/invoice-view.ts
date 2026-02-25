// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { BussinessPointApiService } from '../../../services/api-services/bp/bussiness-point';
// import { SHARED_IMPORTS } from '../../../shared/shared-imports';
// import { MatDatepicker } from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material/core';
// @Component({
//   selector: 'app-invoice-view',
//   imports: [SHARED_IMPORTS, MatDatepicker, MatNativeDateModule],
//   templateUrl: './invoice-view.html',
//   styleUrl: './invoice-view.css',
// })
// export class InvoiceView implements OnInit {

//   invoiceForm!: FormGroup;

//   businessPartners: any[] = [];

//   fromBillingAddresses: any[] = [];
//   toBillingAddresses: any[] = [];
//   toShippingAddresses: any[] = [];

//   displayedColumns = ['item', 'qty', 'price', 'tax', 'remove'];

//   constructor(
//     private fb: FormBuilder,
//     private bpService: BussinessPointApiService
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//     this.loadPartners();
//     this.handlePartnerChanges();
//     this.calculateDueDate();
//   }

//   initForm() {
//     this.invoiceForm = this.fb.group({
//       invoiceNumber: [{ value: 'AUTO', disabled: true }],
//       invoiceDate: [new Date(), Validators.required],
//       dueDate: [{ value: '', disabled: true }],
//       currency: ['AED'],

//       fromPartnerId: [''],
//       fromBillingAddressId: [''],
//       fromBillingAddress: this.createAddressGroup(),

//       toPartnerId: [''],
//       toBillingAddressId: [''],
//       toBillingAddress: this.createAddressGroup(),

//       toShippingAddressId: [''],
//       toShippingAddress: this.createAddressGroup(),

//       sameAsBilling: [false],

//       lines: this.fb.array([]),

//       totalAmount: [{ value: 0, disabled: true }],
//       totalTax: [{ value: 0, disabled: true }],
//       grandTotal: [{ value: 0, disabled: true }]
//     });

//     this.addLine();
//   }

//   createAddressGroup(): FormGroup {
//     return this.fb.group({
//       addressLine1: [''],
//       city: [''],
//       country: ['']
//     });
//   }

//   get lines(): FormArray {
//     return this.invoiceForm.get('lines') as FormArray;
//   }

//   addLine() {
//     this.lines.push(this.fb.group({
//       itemName: ['', Validators.required],
//       quantity: [1],
//       unitPrice: [0],
//       taxPercent: [5],
//       lineTotal: [{ value: 0, disabled: true }],
//       taxAmount: [{ value: 0, disabled: true }]
//     }));
//   }

//   removeLine(index: number) {
//     this.lines.removeAt(index);
//     this.recalculate();
//   }

//   loadPartners() {

// this.bpService.getAll().subscribe((res: any) => {
//       this.businessPartners  = res.data ?? res;
//     });

//   }

//   handlePartnerChanges() {

//     this.invoiceForm.get('fromPartnerId')?.valueChanges.subscribe(id => {
//       if (!id) return;

//       this.bpService.getById(id).subscribe(bp => {
//         this.fromBillingAddresses = bp.addresses.filter((x:any)=>x.type==='Billing');
//         const defaultAddr = this.fromBillingAddresses.find((x:any)=>x.isDefault);
//         if (defaultAddr) this.patchAddress(defaultAddr,'fromBillingAddress');
//       });
//     });

//     this.invoiceForm.get('toPartnerId')?.valueChanges.subscribe(id => {
//       if (!id) return;

//       this.bpService.getById(id).subscribe(bp => {

//         this.toBillingAddresses = bp.addresses.filter((x:any)=>x.type==='Billing');
//         this.toShippingAddresses = bp.addresses.filter((x:any)=>x.type==='Shipping');

//         const defaultBilling = this.toBillingAddresses.find((x:any)=>x.isDefault);
//         const defaultShipping = this.toShippingAddresses.find((x:any)=>x.isDefault);

//         if (defaultBilling)
//           this.patchAddress(defaultBilling,'toBillingAddress');

//         if (defaultShipping)
//           this.patchAddress(defaultShipping,'toShippingAddress');
//       });
//     });

//     this.invoiceForm.get('sameAsBilling')?.valueChanges.subscribe(val => {
//       if (val) {
//         const billing = this.invoiceForm.get('toBillingAddress')?.value;
//         this.invoiceForm.patchValue({
//           toShippingAddress: billing
//         });
//       }
//     });
//   }

//   patchAddress(address: any, group: string) {
//     this.invoiceForm.get(group)?.patchValue({
//       addressLine1: address.addressLine1,
//       city: address.city,
//       country: address.country
//     });
//   }

//   calculateDueDate() {
//     const date = new Date(this.invoiceForm.value.invoiceDate);
//     date.setDate(date.getDate() + 10);
//     this.invoiceForm.patchValue({ dueDate: date });
//   }

//   recalculate() {

//     let total = 0;
//     let tax = 0;

//     this.lines.controls.forEach((line:any)=>{
//       const qty = line.value.quantity;
//       const price = line.value.unitPrice;
//       const taxPercent = line.value.taxPercent;

//       const lineTotal = qty * price;
//       const taxAmount = lineTotal * (taxPercent/100);

//       line.patchValue({ lineTotal, taxAmount }, { emitEvent:false });

//       total += lineTotal;
//       tax += taxAmount;
//     });

//     this.invoiceForm.patchValue({
//       totalAmount: total,
//       totalTax: tax,
//       grandTotal: total + tax
//     });
//   }

//   submit() {
//     const payload = this.invoiceForm.getRawValue();
//     console.log(payload);

//     // Send to API
//     // Backend must clone addresses and save invoice
//   }
// }