import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch';
import { Employee } from 'src/app/models/employee';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {

  signupForm: FormGroup
  branch: Observable<Branch[]> | any;
  errorMessage?: string
  employee: Employee;
  branches: Observable<Branch[]> | any;
  searches?: any

  constructor(public activatedRoute: ActivatedRoute, private toasterService: ToasterserviceService, public employeeService: EmployeeService, public branchService: BranchService, public formBuilder: FormBuilder,
    public router: Router) { }

  ngOnInit(): void {

    this.viewAllBranches();
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      branch: ['', Validators.required]
    }
    )
  }

  viewBranchByIFSC() {
    console.log(this.signupForm.get('branch')?.value)
    this.branchService.getBranchByIfscCode(this.signupForm.get('branch')?.value).subscribe(
      (data) => {
        console.log("branch Name: " + this.signupForm.get('branch')?.value)
        this.branch = data;
        this.branch = this.branch.data;
        this.employee = this.signupForm.value;
        this.employee.branch = this.branch;
        this.employeeSignup(this.employee)
      })
  }


  //to get all branches
  viewAllBranches() {
    this.branchService.getAllBranches().subscribe(
      (data) => {
        this.branches = data;
        this.branches = this.branches.data;
        console.log(data)
      }
    )
  }

  employeeSignup(employee: Employee) {

    console.log(this.signupForm?.value)
    this.employeeService.addEmployee(employee)
      .subscribe(
        response => {
          this.viewEmployees();
          this.successNotification();
          console.log("Employee account created successfully!")
        }, err => {
          this.toasterService.warning("Employee Mobile No already exists")
        }
      )
  }

  successNotification() {
    this.toasterService.success("Employee account created successfully!")
  }
  viewEmployees() {
    this.router.navigate(['viewemployees'])
  }

}