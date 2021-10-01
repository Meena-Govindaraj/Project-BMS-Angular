import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Employee } from '../models/employee';

const employeeURL="http://localhost:9001/employee"

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 
  constructor(public http: HttpClient) { }

  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //save employee
  addEmployee(employee:Employee):Observable<Employee>
  {
    return this.http.post<Employee>(employeeURL,employee,this.httpOptions)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //get employee by mobileno
  getEmployeeByMobileNo(mobileNo:string):Observable<Employee>
  {
    return this.http.get<Employee>(`${employeeURL}/getEmployeeByMobileNo/${mobileNo}`)
    .pipe(
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //get employee by email
  //localhost:9001/employee/getEmployeeByEmail/meena.govindaraj@revature.com
  getEmployeeByEmail(email:string):Observable<Employee>
  {
    return this.http.get<Employee>(`${employeeURL}/getEmployeeByEmail/${email}`)
    .pipe(
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //get all employees
  getAllEmployees():Observable<Employee[]>
  {
    return this.http.get<Employee[]>(employeeURL)
    .pipe(retry(0),
    catchError(this.errorHandler)
    );
  }
  
  //edit employee
  updateEmployee(employee:Employee):Observable<Employee>
  {
    return this.http.put<Employee>(employeeURL,employee,this.httpOptions)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //get employee by id
  getEmployeeById(employeeId:number):Observable<Employee>
  {
    return this.http.get<Employee>(`${employeeURL}/${employeeId}`)
    .pipe(
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //delete employee
  deleteEmployee(employeeId:number)
  {
    return this.http.delete(`${employeeURL}/${employeeId}`)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }
  //localhost:9001/employee/employeeLogin/8765433237/123456
  employeeeLogin(mobileNo:string,password:String):Observable<Employee>
  {
    return this.http.get<Employee>(`${employeeURL}/employeeLogin/${mobileNo}/${password}`)
    .pipe(
      retry(0),
      catchError(this.errorHandler)
    )
  }

 //localhost:9001/employee/updatePassword/9876567892/1234567/123122
  updatePassword(mobileNo:string,oldPassword:string,newPassword:string)
  {
    return this.http.put(`${employeeURL}/updatePassword/${mobileNo}/${oldPassword}/${newPassword}`,this.httpOptions)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
      
     
    )
  }

  //localhost:9001/employee/forgetPassword/meena.govindaraj@revature.com
  forgetPassword(email:string)
  {
    return this.http.put(`${employeeURL}/forgetPassword/${email}`,this.httpOptions)
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
