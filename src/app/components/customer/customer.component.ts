import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/Customer.service';
import { Customer } from '../../models/customer';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/Transaction';
import { TransactionType } from '../../enums/TransactionType/TransactionType';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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
  limit: number = 10000;
  minAmount: number = 1;
  createCustomer: boolean = false;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition1: MatSnackBarVerticalPosition = 'top';
  
  constructor(
    private customerService: CustomerService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private _snackBarErr: MatSnackBar,
    ) { 

  }

  ngOnInit() {
     this.GetCustomers();
  }

  openSnackBarErr(msg: string){
    this._snackBarErr.open(msg, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition1,
    });
  }

  GetCustomers(customer?: Customer){
    this.customerService.getAllCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.customers.push(...customers);
        if (this.customers.length > 0) {
           this.selectedCustomer = customer ? customer : this.customers[0];
          this.GetCustomerInfo(this.selectedCustomer.customerId);
        }
      },
      error: (err) => {
        console.log(err.error);
        this.openSnackBarErr(err.error);
        this.Reset();
        this.GetCustomers();
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

  GetCustomerInfo(customerId : number){
    this.customerService.getCustomerInfo(customerId).subscribe({
      next: (customerInfo: Customer) =>{
        this.customerAccounts = [];
        this.customerTransactions = [];

        if (customerInfo && customerInfo.accounts && customerInfo.accounts?.length > 0) {
          this.customerAccounts.push(...customerInfo.accounts);

          customerInfo.accounts.forEach(x =>{

          if(x.transactions)
            this.customerTransactions.push(...x.transactions);
        });

        this.customerTransactions.sort((a, b) => {
          const dateA = new Date(a.transactionDate).getTime();
          const dateB = new Date(b.transactionDate).getTime();
        
          return dateA - dateB;
        });

      }

      },
      error: (err: any) =>{
        console.log(err.error);
        this.Reset();
        this.openSnackBarErr(err.error);
        this.GetCustomers();
      },
      complete: () =>{

      }
    })

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
        console.log(err.error);
        this.openSnackBarErr(err.error);
        this.Reset();
        this.GetCustomers();
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
          console.log(err.error);
          this.openSnackBarErr(err.error);
          this.Reset();
          this.GetCustomers();
        },
        complete: () => {
          
        },
      }); 
  }

  openAccount(){

    if(this.initialCredit  < 0 ){
      this.initialCredit = 0;
      this.openSnackBarErr("Initial credit should be 0$ or greater than 0$.");
      return;
    }

    const account: Account = {
      accountId: 0, 
      customerId: this.selectedCustomer?.customerId ? this.selectedCustomer?.customerId : -1 , 
      balance: this.initialCredit,
      customer: undefined,
      transactions: [], 
    };

    this.accountService.openAccount(account).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: err =>{
        console.log(err.error);
        this.openSnackBarErr(err.error);
        this.Reset();
        this.GetCustomers();
      },
      complete: () => {
        this.createAccount = false;
        this.customerAccounts = [];
        this.customerTransactions = [];
        this.initialCredit = 0;
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
          console.log(err.error);
          this.openSnackBarErr(err.error);
          this.Reset();
          this.GetCustomers();
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
        error: (err: any) => {
          console.log(err.error);
          this.openSnackBarErr(err.error);
          this.Reset();
          this.GetCustomers();
        },
        complete: () => {
          this.toAccountDisabled = false;
        },
      });

    }

  }
  
  makeTheTransaction(){
    var transactions: Transaction[] = [];
    var transactionFrom: Transaction;
    var transactionTo: Transaction;
    var account = undefined;

    if(this.transactionAmount == 0){
      this.openSnackBarErr("The transaction amount can't be 0$");
      return;
    }

    if(this.transactionTypeSelected == TransactionType.Deposit || this.transactionTypeSelected == TransactionType.Withdraw){

      transactionFrom = {
        transactionId: 0,
        accountId: this.fromAccount,
        amount: this.transactionAmount,
        transactionDate: new Date(),
        transactionType: this.transactionTypeSelected,
        account: account
      };

      transactions.push(transactionFrom);

    }else if(this.transactionTypeSelected == TransactionType.Transfer){

      transactionFrom = {
        transactionId: 0,
        accountId: this.fromAccount,
        amount: this.transactionAmount,
        transactionDate: new Date(),
        transactionType: this.transactionTypeSelected,
        account: account
      };

      transactions.push(transactionFrom);

      transactionTo = {
        transactionId: 0,
        accountId: this.toAccount,
        amount: this.transactionAmount,
        transactionDate: new Date(),
        transactionType: TransactionType.Deposit,
        account: account
      }

      transactions.push(transactionTo);

    }

    if(transactions.length > 0){
      this.transactionService.makeTransaction(transactions).subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (err: any) =>{
          console.log(err.error);
          this.openSnackBarErr(err.error);
          this.Reset();
          this.GetCustomers(this.selectedCustomer);
        },
        complete: () =>{
          this.Reset();          
          this.GetCustomers(this.selectedCustomer);
        }
      });
    }
  }

  SetCustomer(customer: Customer){
    this.selectedCustomer = customer;
    this.GetCustomerInfo(customer.customerId);
  }

  Reset(){
    this.customerAccounts = [];
    this.customerTransactions = [];
    this.makeTransaction = false;
    this.createAccount = false;
    this.initialCredit = 0;
    this.createCustomer = false;
    this.transactionAmount = 0;
    this.toAccount = -1;
    this.fromAccount = -1;
    this.transactionTypeSelected = undefined;
    this.customers = [];
    this.firstName = "";
    this.lastName = "";
    this.email = "";
  }

  AddCustomer(){
    var customer: Customer ={
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      customerId: 0,
    };
    
    this.customerService.createCustomer(customer).subscribe({
      next: (res: any)=> {
        console.log(res);
      },
      error: (err: any)=> {
        this.Reset();
        this.GetCustomers();
        this.openSnackBarErr(err.error);
      
      },
      complete: ()=> {
        this.Reset();
        this.GetCustomers();
      }
    })
  }

}
