import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from '../enums/TransactionType/TransactionType';

@Pipe({
  name: 'transactionTypeText',
})

export class TransactionTypeTextPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case TransactionType.Withdraw:
        return 'Withdraw';
      case TransactionType.Deposit:
        return 'Deposit';
      case TransactionType.Transfer:
        return 'Transfer';
      default:
        return '';
    }
  }
}
