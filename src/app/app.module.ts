import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerService } from './services/Customer.service';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from './services/account.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TransactionService } from './services/transaction.service';
import { TransactionTypeTextPipe } from './pipes/transactionTypePipe';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NumberOnlyDirective } from './directives/positiveNumbers';

@NgModule({
  declarations: [
    CustomerComponent,
    TransactionTypeTextPipe,
    NumberOnlyDirective
  ],
  imports: [
    RouterModule.forChild(routes),
    MatToolbarModule, 
    MatButtonModule, 
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [
    CustomerService,
    AccountService,
    TransactionService,
    provideAnimations()
  ]
})
export class AppModule { }
