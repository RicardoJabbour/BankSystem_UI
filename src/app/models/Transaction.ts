import { TransactionType } from "../enums/TransactionType/TransactionType";
import { Account } from "./Account";

export interface Transaction {
    transactionId: number;
    transactionDate: Date;
    accountId: number;
    amount: number;
    account?: Account; 
    transactionType: TransactionType;
  }
