import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'erpCurrency'
})
export class ErpCurrencyPipe implements PipeTransform {

 transform(value: number | null | undefined, currency: string = 'AED'): string {

  if (value == null) return `${currency} 0.00`;
 
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

}
