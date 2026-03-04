import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { MatDialog } from '@angular/material/dialog';
import { ServiceTypeApiService } from '../../../core/service/api-services/serviceType/service-type';
import { ServiceTypeDialogComponent } from '../service-type-dialog/service-type-dialog';

@Component({
  selector: 'app-service-type-list',
  imports: [SHARED_IMPORTS],
  templateUrl: './service-type-list.html',
  styleUrl: './service-type-list.css',
})
export class ServiceTypeComponent {
serviceTypes: any[] = [];
displayedColumns = ['id','code','name','description','actions'];
  constructor(
    private serviceTypeService: ServiceTypeApiService,
    private dialog: MatDialog
  ) { }
ngOnInit() {
  this.load();
}

load() {
  this.serviceTypeService.getAll().subscribe((res:any)=>{
    this.serviceTypes = res.data;
     this.serviceTypes.forEach((st: any, index: number) => {
          st.id = index + 1;
        });
  });
}
openCreate() {
  const dialogRef = this.dialog.open(ServiceTypeDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.load();
    }
  });
}
openEdit(id: number) {
  const dialogRef = this.dialog.open(ServiceTypeDialogComponent, {
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
  // this.confirm.open({
  //   title:'Delete Service Type',
  //   message:'Are you sure?',
  //   color:'warn'
  // }).subscribe(r=>{
  //   if(r){
  //     this.serviceTypeService.delete(id).subscribe(()=> this.load());
  //   }
  // });
}
}
