import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  
private readonly baseUrl = 'https://localhost:7196/api/Account';

constructor(private http: HttpClient) {

 }

 getCustomerAccounts(customerId: number): Observable<Account[]> {
  return this.http.get<Account[]>(`${this.baseUrl}`+"/GetCustomerAccounts?customerId="+`${customerId}`);
}

openAccount(account: Account) {
  return this.http.post<string>(`${this.baseUrl}`+'/OpenAccount', account);
}

getAllAccounts(accountId: number){
  return this.http.get<Account[]>(`${this.baseUrl}`+"/GetAllAccounts?accountId="+`${accountId}`);
}

getAccountLimit(accountId: number){
  return this.http.get<number>(`${this.baseUrl}`+"/GetAccountLimit?accountId="+`${accountId}`);
}

}
