import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Employee } from '../models/employee';

const employeeURL = "http://localhost:9001/employee"
const login = "http://localhost:9001/login"
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(public http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //save employee
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(employeeURL, employee, this.httpOptions)

  }

  //get employee by mobileno
  getEmployeeByMobileNo(mobileNo: string): Observable<Employee> {
    return this.http.get<Employee>(`${employeeURL}/getEmployeeByMobileNo/${mobileNo}`)

  }

  //get employee by email
  //localhost:9001/employee/getEmployeeByEmail/meena.govindaraj@revature.com
  getEmployeeByEmail(email: string): Observable<Employee> {
    return this.http.get<Employee>(`${employeeURL}/getEmployeeByEmail/${email}`)

  }

  //get all employees
  getAllEmployees(): Observable<any> {
    return this.http.get<Employee[]>(employeeURL)

  }

  //edit employee
  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(employeeURL, employee, this.httpOptions)

  }

  //get employee by id
  getEmployeeById(employeeId: number): Observable<any> {
    return this.http.get<Employee>(`${employeeURL}/${employeeId}`)

  }

  //delete employee
  deleteEmployee(employeeId: number) {
    return this.http.delete(`${employeeURL}/${employeeId}`)

  }
  //localhost:9001/employee/employeeLogin/8765433237/123456
  employeeeLogin(mobileNo: string, password: String): Observable<any> {
    return this.http.get<Employee>(`${login}/employeeLogin/${mobileNo}/${password}`)

  }

  //localhost:9001/employee/updatePassword/9876567892/1234567/123122
  updatePassword(mobileNo: string, oldPassword: string, newPassword: string) {
    return this.http.put(`${employeeURL}/updatePassword/${mobileNo}/${oldPassword}/${newPassword}`, this.httpOptions)

  }

  //localhost:9001/employee/forgetPassword/meena.govindaraj@revature.com
  forgetPassword(email: string) {
    return this.http.put(`${employeeURL}/forgetPassword/${email}`, this.httpOptions)
  }


}
