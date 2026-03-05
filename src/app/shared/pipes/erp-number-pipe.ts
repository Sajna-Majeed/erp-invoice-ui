import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../core/service/model-services/user/user';

@Pipe({
  name: 'erpNumber'
})
export class ErpNumberPipe implements PipeTransform {
constructor(private userService: UserService) {}
 transform(value: number | null | undefined): string {
const companyData= this.userService.getCompany();
  if (value == null) return `0.00`;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: companyData?.decimalplace||0,
    maximumFractionDigits: companyData?.decimalplace||0
  }).format(value);
}

}
