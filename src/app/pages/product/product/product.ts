import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ProductService } from '../../../core/service/api-services/product/product';
import { ConfirmService } from '../../../shared/confirm-dialog/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog';

@Component({
  selector: 'app-product',
  imports: [SHARED_IMPORTS],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent {
products: any[] = [];
displayedColumns = ['id','code','name','description','price','tax','status','actions'];
  constructor(
    private productService: ProductService,
    private confirm:ConfirmService,
    private dialog: MatDialog
  ) { }
ngOnInit() {
  this.load();
}

load() {
  this.productService.getAll().subscribe((res:any)=>{
    this.products = res.data;
     this.products.forEach((product: any, index: number) => {
          product.id = index + 1;
        });
  });
}
openCreate() {
  const dialogRef = this.dialog.open(ProductDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.load();
    }
  });
}
openEdit(id: number) {
  const dialogRef = this.dialog.open(ProductDialogComponent, {
    width: '500px',
    data: { id }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.load();
    }
  });
}
delete(id:number){
  this.confirm.open({
    title:'Delete Product',
    message:'Are you sure?',
    color:'warn'
  }).subscribe(r=>{
    if(r){
      this.productService.delete(id).subscribe(()=> this.load());
    }
  });
}
toggleStatus(id:number){
  this.confirm.open({
    title:'Toggle Product Status',
    message:'Are you sure?',
    color:'warn'
  }).subscribe(r=>{
    if(r){
      this.productService.toggleStatus(id).subscribe(()=> this.load());
    }
  });
}
}
