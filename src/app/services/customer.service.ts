import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Customer } from '../models/customer';

const customerURL = "http://localhost:9001/customer"
const login = "http://localhost:9001/login"
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(public http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //get all customers
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(customerURL)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //delete customer
  deleteCustomer(customerId: number) {
    return this.http.delete(`${customerURL}/${customerId}`)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //save Customer
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(customerURL, customer, this.httpOptions)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }


  //localhost:9001/customer/forgetPassword/meebha5764@gmail.com
  forgetPassword(email: string) {
    return this.http.put(`${customerURL}/forgetPassword/${email}`, this.httpOptions)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //get customer by mobileno
  //http://localhost:9001/customer/getCustomerByMobileNo/4545445444
  getCustomerByMobileNo(mobileNo: string): Observable<Customer> {
    return this.http.get<Customer>(`${customerURL}/getCustomerByMobileNo/${mobileNo}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //get customer by email
  getCustomerByEmail(email: string): Observable<Customer> {
    return this.http.get<Customer>(`${customerURL}/getCustomerByEmail/${email}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/customer/getCustomersByIFSC/IDIB0000107
  getCustomersByIFSC(ifscCode: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${customerURL}/getCustomersByIFSC/${ifscCode}`)
      .pipe(retry(0),
        catchError(this.errorHandler)
      );
  }

  //localhost:9001/customer/customerLogin/5688877666/123456
  //http://localhost:9001/login/customerLogin/8987654321/309831
  customerLogin(mobileNo: string, password: String): Observable<Customer> {
    return this.http.get<Customer>(`${login}/customerLogin/${mobileNo}/${password}`)
      .pipe(
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/customer/sendAlertMail/meena.govindaraj@revature.com
  alertCustomer(email: string) {
    return this.http.post(`${customerURL}/sendAlertMail/${email}`, this.httpOptions)
      .pipe
      (
        retry(0),
        catchError(this.errorHandler)
      )
  }

  //localhost:9001/customer/updatePassword/9600432486/123456
  updatePassword(mobileNo: string,oldPassword:string, newPassword: string) {
    console.log(newPassword)
    return this.http.put(`${customerURL}/updatePassword/${mobileNo}/${oldPassword}/${newPassword}`, this.httpOptions)
      .pipe
      (
        retry(1),
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
