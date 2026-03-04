import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../core/service/model-services/user/user';

@Pipe({
  name: 'erpCurrency'
})
export class ErpCurrencyPipe implements PipeTransform {

  constructor(private userService: UserService) {}
 transform(value: number | null | undefined, currency: string = this.userService.getCompany()?.currency || 'USD'): string {

  if (value == null) return `${currency} 0.00`;
 
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: this.userService.getCompany()?.decimalPlaces || 2,
    maximumFractionDigits: this.userService.getCompany()?.decimalPlaces || 2
  }).format(value);
}

}
