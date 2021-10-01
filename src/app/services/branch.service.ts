import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Branch } from '../models/branch';
import { retry, catchError } from 'rxjs/operators';


const branchURL="http://localhost:9001/branch"
@Injectable({
  providedIn: 'root'
})

export class BranchService {

  constructor(public http: HttpClient) { }

  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //get all branches
  getAllBranches():Observable<Branch[]>
  {
    return this.http.get<Branch[]>(branchURL)
    .pipe(retry(0),
    catchError(this.errorHandler)
    );
  }

  //to delete a branch
  //http://localhost:9001/branch/1
  deleteBranch(branchId:number)
  {
    return this.http.delete(`${branchURL}/${branchId}`)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //save branch
  addBranch(branch:Branch):Observable<Branch>
  {
    return this.http.post<Branch>(branchURL,branch,this.httpOptions)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //get branch by IFSC CODE
  //http://localhost:9001/branch/IDIB001014
  getBranchByIfscCode(ifscCode:string)
  {
    return this.http.get(`${branchURL}/getBranchByIfscCode/${ifscCode}`)
    .pipe
    (
      retry(0),
      catchError(this.errorHandler)
    )
  }
  
  //branch by branch Id
  //http://localhost:9001/branch/1
  getBranchById(branchId:number):Observable<Branch>
  {
    return this.http.get<Branch>(`${branchURL}/${branchId}`)
    .pipe(
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //branch by name
  getBranchByName(branchName:string):Observable<Branch>
  {
    return this.http.get<Branch>(`${branchURL}/getBranchByName/${branchName}`)
    .pipe(
      retry(0),
      catchError(this.errorHandler)
    )
  }

  //update branch
  updateBranch(branch:Branch):Observable<Branch>
  {
    return this.http.put<Branch>(branchURL,branch,this.httpOptions)
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
