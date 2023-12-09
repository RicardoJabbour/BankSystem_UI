import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/Customer.service';
import { Customer } from '../../models/customer';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/Transaction';
import { TransactionType } from '../../enums/TransactionType/TransactionType';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customers: Customer[] = [];
  customerAccounts: Account[] = [];
  selectedCustomer: Customer | undefined;
  createAccount: boolean = false;
  initialCredit: number = 0;
  customerTransactions: Transaction[] = [];
  makeTransaction: boolean = false;
  transactionTypeSelected: TransactionType | undefined;
  TransactionTypes = [TransactionType.Withdraw, TransactionType.Deposit, TransactionType.Transfer];
  transactionAmount: number = 0;
  fromAccount: number = -1;
  allAccounts: Account[] = [];
  toAccount: number = -1;
  toAccountDisabled: boolean = true;
  limit: number = 100;

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    ) { 

  }

  ngOnInit() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.customers.push(...customers);
        if (this.customers.length > 0) {
          this.selectedCustomer = this.customers[0];
          this.GetCustomerAcounts(this.customers[0].customerId);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        
      },
    });    
  }

  onKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.startsWith('0') && input.value.length > 1) {
      input.value = input.value.slice(1);
    }
  }

  GetCustomerAcounts(customerId: number){

    this.accountService.getCustomerAccounts(customerId).subscribe({
      next: (customerAccounts: Account[]) => {
        this.customerAccounts.push(...customerAccounts);
    
        if (this.customerAccounts[0]) {
          this.GetCustomerTransactions(this.selectedCustomer?.customerId ? this.selectedCustomer?.customerId : -1);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {

      },
    });
    
  }

  GetCustomerTransactions(customerId: number){
    this.transactionService.getTransactionsByCustomerId(customerId).subscribe({
        next: (response) => {
          this.customerTransactions.push(...response);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          
        },
      }); 
  }

  CreateAccount(){
    this.createAccount = true;
  }

  openAccount(){
    const account: Account = {
      accountId: 0, 
      customerId: this.selectedCustomer?.customerId ? this.selectedCustomer?.customerId : -1 , 
      balance: this.initialCredit,
      customer: undefined,
      transactions: [], 
    };

    this.accountService.openAccount(account).subscribe({
      next: (response) => {
        
      },
      error: err =>{
        console.log(err);
      },
      complete: () => {
        this.createAccount = false;
        
        this.GetCustomerAcounts(this.selectedCustomer?.customerId ? this.selectedCustomer?.customerId : -1);
      },
    });
  }

  onTransactionTypeChange() {
    if(this.transactionTypeSelected === TransactionType.Transfer && this.fromAccount != -1){
      this.accountService.getAllAccounts(this.fromAccount).subscribe({
        next: (allAccounts: Account[]) => {
          this.allAccounts.push(...allAccounts);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.toAccountDisabled = false;
        },
      });
    }else{
      this.toAccountDisabled = true;
      this.allAccounts = [];
      this.toAccount = -1;
    }

    if(this.transactionTypeSelected === (TransactionType.Transfer || TransactionType.Withdraw) && this.fromAccount != -1){
      this.accountService.getAccountLimit(this.fromAccount).subscribe({
        next: (limit: number) => {
          this.limit = limit;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.toAccountDisabled = false;
        },
      });

    }

  }
  
  makeTheTransaction(){
    console.log(this.transactionTypeSelected);
    console.log(this.transactionAmount);
    console.log(this.fromAccount);
    console.log(this.toAccount);
  }

  SetCustomer(customer: Customer){
    this.selectedCustomer = customer;
    this.customerAccounts = [];
    this.customerTransactions = [];
    this.makeTransaction = false;
    this.createAccount = false;
    
    this.GetCustomerAcounts(customer.customerId);
  }

  MakeTransaction(){
    this.makeTransaction = true;
  }

}
