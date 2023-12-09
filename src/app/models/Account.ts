import { Transaction } from "./Transaction";
import { Customer } from "./customer";

export interface Account {
    accountId: number;
    customerId: number;
    balance: number;
    customer?: Customer; // Optional reference to CustomerDTO
    transactions?: Transaction[]; // Optional array of TransactionDTOs
  }