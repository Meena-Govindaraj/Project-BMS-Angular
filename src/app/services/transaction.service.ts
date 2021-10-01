import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Transaction } from '../models/transaction';

const transactionURL="http://localhost:9001/transaction"

@Injectable({
  providedIn: 'root'
})

export class TransactionService {

 
  constructor(public http: HttpClient) { }

  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //save Transacation
  addTransaction(transaction:Transaction):Observable<Transaction>
  {
    return this.http.post<Transaction>(transactionURL,transaction,this.httpOptions)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //get transaction history of customer
  //get all branches
  //localhost:9001/transaction/transactionById/27
  getTransactionByAccount(accountId:number):Observable<Transaction[]>
  {
    return this.http.get<Transaction[]>(`${transactionURL}/transactionById/${accountId}`)
    .pipe(retry(0),
    catchError(this.errorHandler)
    );
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
