import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Branch } from '../models/branch';
import { retry, catchError } from 'rxjs/operators';


const branchURL = "http://localhost:9001/branch"
@Injectable({
  providedIn: 'root'
})

export class BranchService {

  constructor(public http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  //get all branches
  getAllBranches(): Observable<any> {
    return this.http.get<Branch[]>(branchURL)
  }

  //to delete a branch
  //http://localhost:9001/branch/1
  deleteBranch(branchId: number) {
    return this.http.delete(`${branchURL}/${branchId}`)
  }

  //save branch
  addBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(branchURL, branch, this.httpOptions)
  }

  //get branch by IFSC CODE
  //http://localhost:9001/branch/IDIB001014
  getBranchByIfscCode(ifscCode: string): Observable<any> {
    return this.http.get<Branch>(`${branchURL}/getBranchByIfscCode/${ifscCode}`)
  }

  //branch by branch Id
  //http://localhost:9001/branch/1
  getBranchById(branchId: number): Observable<any> {
    return this.http.get<Branch>(`${branchURL}/${branchId}`)
  }

  //branch by name
  getBranchByName(branchName: string): Observable<any> {
    return this.http.get<Branch>(`${branchURL}/getBranchByName/${branchName}`)
  }

  //update branch
  updateBranch(branch: Branch): Observable<Branch> {
    return this.http.put<Branch>(branchURL, branch, this.httpOptions)
  }

}
