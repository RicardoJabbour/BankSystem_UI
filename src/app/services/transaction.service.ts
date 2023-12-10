import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

private readonly baseUrl = 'https://localhost:7196/api/Transaction';

constructor(private http: HttpClient) { }

getTransactionsByCustomerId(customerId: number) {
  return this.http.get<Transaction[]>(`${this.baseUrl}`+"/GetTransactionsByCustomerId?customerId="+`${customerId}`);
}

makeTransaction(transactions: Transaction[]): Observable<any> {
  const url = `${this.baseUrl}/MakeTransaction`;
  return this.http.post<any>(url, transactions);
}

}
