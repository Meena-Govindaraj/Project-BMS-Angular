import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch';
import { Employee } from 'src/app/models/employee';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {

  signupForm: FormGroup
  errorMessage: string
  employee: Employee;
  branches: Branch[];
  searches: any

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


  //to get all branches
  viewAllBranches() {
    this.branchService.getAllBranches().subscribe(
      (data) => {
        this.branches = data.data;
        console.log(this.branches)
      }
    )
  }

  employeeSignup() {

    console.log(this.signupForm.value)
    this.employeeService.addEmployee(this.signupForm.value)
      .subscribe(
        response => {
          this.viewEmployees();
          this.successNotification();
          console.log("Employee account created successfully!")
        }, err => {
          this.toasterService.error("Employee already exists with this MobileNo/Email")
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