import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { ProductService } from '../../../core/service/api-services/product/product';
import { ConfirmService } from '../../../shared/confirm-dialog/confirm-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ModuleDialogComponent } from '../module-dialog/module-dialog';
import { ModuleService } from '../../../core/service/api-services/module/module';

@Component({
  selector: 'app-module-list',
  imports: [SHARED_IMPORTS],
  templateUrl: './module-list.html',
  styleUrl: './module-list.css',
})
export class ModuleListComponent {
  modules: any[] = [];
  displayedColumns = ['id', 'code', 'name', 'description', 'product', 'status', 'actions'];
  constructor(
    private productService: ProductService,
    private moduleService: ModuleService,
    private confirm: ConfirmService,
    private dialog: MatDialog
  ) { }
  ngOnInit() {
    this.load();
  }

  load() {
    this.moduleService.getAll().subscribe((res: any) => {
      this.modules = res.data;
      this.modules.forEach((module: any, index: number) => {
        module.id = index + 1;
        this.productService.getById(module.product_Id).subscribe((res: any) => {
          module.product = res.data.name;
        });
      });
    });
  }
  openCreate() {
    const dialogRef = this.dialog.open(ModuleDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.load();
      }
    });
  }
  openEdit(id: number) {
    const dialogRef = this.dialog.open(ModuleDialogComponent, {
      width: '500px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.load();
      }
    });
  }
  delete(id: number) {
    this.confirm.open({
      title: 'Delete Module',
      message: 'Are you sure?',
      color: 'warn'
    }).subscribe(r => {
      if (r) {
        this.moduleService.delete(id).subscribe(() => this.load());
      }
    });
  }
  toggleStatus(id: number) {
    this.confirm.open({
      title: 'Toggle Module Status',
      message: 'Are you sure?',
      color: 'warn'
    }).subscribe(r => {
      if (r) {
        this.moduleService.toggleStatus(id).subscribe(() => this.load());
      }
    });
  }
}
