import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

}
