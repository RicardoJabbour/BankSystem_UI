import { Routes } from '@angular/router';
import { CustomerComponent } from './components/customer/customer.component';

export const routes: Routes = [
    { path: '', redirectTo: 'customer', pathMatch: 'full' },
    { path: 'customer', component: CustomerComponent},
];
