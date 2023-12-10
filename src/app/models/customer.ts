import { Account } from "./Account";

export interface Customer {
    customerId: number;
    firstName: string;
    lastName: string;
    email: string;
    accounts?: Account[];
  }