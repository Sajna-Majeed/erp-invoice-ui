import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../core/service/model-services/user/user';

@Pipe({
  name: 'erpNumber'
})
export class ErpNumberPipe implements PipeTransform {
constructor(private userService: UserService) {}
 transform(value: number | null | undefined): string {

  if (value == null) return `0.00`;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: this.userService.getCompany()?.decimalPlaces || 2,
    maximumFractionDigits: this.userService.getCompany()?.decimalPlaces || 2
  }).format(value);
}

}
