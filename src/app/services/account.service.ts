import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Account } from '../models/account';
import { Accountype } from '../models/accountype';

const accountURL = "http://localhost:9001/account"
const accountTypeURL = "http://localhost:9001/accounttype"

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(public http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //get all account
  getAllCustomers(): Observable<Account[]> {
    return this.http.get<Account[]>(accountURL)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //localhost:9001/account/getCustomersByIFSC/IDIB0000107
  getCustomersByIFSC(ifscCode: string): Observable<any> {
    return this.http.get<Account[]>(`${accountURL}/getCustomersByIFSC/${ifscCode}`)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //localhost:9001/accounttype/getCustomersByIFSC/IDIB0000107
  getCustomersByIFSCOnType(ifscCode: string): Observable<any> {
    return this.http.get<Accountype[]>(`${accountTypeURL}/getCustomersByIFSC/${ifscCode}`)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }
  //get customer requests
  getRequets(): Observable<Accountype[]> {
    return this.http.get<Accountype[]>(accountTypeURL)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //delete customer by account type
  deleteAccount(typeId: number) {
    return this.http.delete(`${accountTypeURL}/${typeId}`)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //save accounttype
  addAccountType(accountType: Accountype): Observable<Accountype> {
    return this.http.post<Accountype>(accountTypeURL, accountType, this.httpOptions)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //get all account
  getCountOfCustomerAccount(customerId: number): Observable<any> {
    return this.http.get<Accountype[]>(`${accountTypeURL}/getCustomerById/${customerId}`)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //add account
  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(accountURL, account, this.httpOptions)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/accounttype/getByAccountNumber/609770104811
  //get customer by accountNo
  getByAccountNumber(accountNo: string): Observable<any> {
    return this.http.get<Accountype>(`${accountTypeURL}/getByAccountNumber/${accountNo}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/accounttype/updateAccountStatus/Yes/601019362107
  updateAccountStatus(accountStatus: string, accountNo: string) {
    return this.http.put(`${accountTypeURL}/updateAccountStatus/${accountStatus}/${accountNo}`, this.httpOptions)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //localhost:9001/account/getCustomerByCustomerId/16
  getCustomerOnAccount(customerId: number): Observable<any> {
    return this.http.get<Account[]>(`${accountURL}/getCustomerByCustomerId/${customerId}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/account/getAccountsByType/23/Current
  getAccountByType(customerId: number, type: string): Observable<any> {
    return this.http.get<any>(`${accountURL}/getAccountsByType/${customerId}/${type}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/account/getaccountbyaccountno/602970040956
  getAccountByaccountNo(accountNo: string): Observable<any> {
    return this.http.get<Account>(`${accountURL}/getaccountbyaccountno/${accountNo}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/account/banktransfer/26/2/700
  bankTransfer(senderId: number, recieverId: number, amount: number) {
    return this.http.put(`${accountURL}/banktransfer/${senderId}/${recieverId}/${amount}`, this.httpOptions)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //localhost:9001/account/updatePassword/33/555555
  updatePassword(accountId: number, oldPassword: string, newPassword: string) {
    return this.http.put(`${accountURL}/updatePassword/${accountId}/${oldPassword}/${newPassword}`, this.httpOptions)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //Error Handler
  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side message
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    switch (error.status) {
      case 200:
        console.log("200's");
        break;
      case 401:
        break;
      case 403:
        break;
      case 0:
      case 400:
      case 405:
      case 406:
      case 409:
      case 500:
        break;
    }
    return throwError(errorMessage);
  }
}
