import { Account } from "./account";

export class Transaction {

    id:number;
    transactionDate:Date;
    message:string;
    deposit:number;
    withdraw:number;
    balance:number;
    account:Account;

}
