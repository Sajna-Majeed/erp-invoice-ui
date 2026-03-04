import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../core/service/model-services/user/user';

@Pipe({
  name: 'erpCurrency'
})
export class ErpCurrencyPipe implements PipeTransform {

  constructor(private userService: UserService) {}
 transform(value: number | null | undefined, currency?: string): string {
  
  const companyData= this.userService.getCompany()?.company;
   
  const amount = value ?? 0;
  
    return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency:  currency ||companyData?.currency || 'USD',
    minimumFractionDigits: companyData?.decimalplace||0,
    maximumFractionDigits: companyData?.decimalplace||0
  }).format(amount);
}

}
