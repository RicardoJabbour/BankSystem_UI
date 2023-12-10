import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

private readonly baseUrl = 'https://localhost:7196/api/Customer';

constructor(private http: HttpClient) { 

}

getAllCustomers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}`+"/GetAllCustomers");
}

getCustomerInfo(customerId: number): Observable<Customer> {
  const url = `${this.baseUrl}/GetCustomerInfo?customerId=${customerId}`;
  return this.http.get<Customer>(url);
}

createCustomer(createCustomer: Customer): Observable<any> {
  const url = `${this.baseUrl}/CreateCustomer`;
  return this.http.post<any>(url, createCustomer);
}

}
