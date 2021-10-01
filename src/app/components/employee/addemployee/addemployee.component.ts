import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { Employee } from 'src/app/models/employee';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {

  signupForm:FormGroup
  branch:Branch[]=[];
  errorMessage?:string
  employee?:Employee;
  branches:Branch[]=[];
  ifsc?:string;
  searches?:any
 
  constructor(public activatedRoute :ActivatedRoute,public employeeService:EmployeeService,public branchService:BranchService, public formBuilder:FormBuilder, 
    public router: Router) { }
   
  ngOnInit(): void {

    this.viewAllBranches();
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobileNo: ['', [Validators.required ,Validators.minLength(10),Validators.maxLength(10)]],
      email: ['', [Validators.required,Validators.email ]],
      address: ['', [Validators.required ]],
      salary: ['', [Validators.required ,Validators.min(0)]],
      branch:['',Validators.required]
    }
    )
  }

  viewBranchByIFSC()
  {
    this.branchService.getBranchByIfscCode(this.signupForm.get('branch')?.value).subscribe(
      (data:any)=>{
        console.log("branch Name: "+this.signupForm.get('branch')?.value)
        this.branch=data;
        this.employee=this.signupForm.value;
        this.employee.branch=this.branch;
        
        this.getEmployeeByPhone(this.signupForm.get('mobileNo')?.value);
      })
  }

  viewBranchName()
  {
    this.branchService.getBranchByIfscCode(this.signupForm.get('branch')?.value).subscribe(
      (data:any)=>{
        console.log("branch Name: "+this.signupForm.get('branch')?.value)
        console.log(data);
        this.ifsc=data.name;
        console.log("BRANCH: "+this.ifsc)
      })
  }

  //to get all branches
  viewAllBranches()
  {
    this.branchService.getAllBranches().subscribe(
      (data:any[])=>{
     this.branches=data;
      console.log(data)
      }
      )
  }

  employeeSignup(employee:any)
  {
    console.log(this.signupForm?.value)
    this.employeeService.addEmployee(employee)
    .subscribe(
      response => {
        this.employee=response
      },error => {
        this.successNotification();
        console.log("Employee account created successfully!")
       this.viewemployee();
      })
   
  }
  
successNotification(){
  Swal.fire('Success', 'Employee Added Successfully!', 'success')
}

  getEmployeeByPhone(mobileNo:string)
  {
    this.employeeService.getEmployeeByMobileNo(mobileNo).subscribe(data=>{
      console.log("By mobile: "+data);
      //can add
      if(data==null){
        this.errorMessage="";
        this.employeeSignup(this.employee);
      }
      else{
        this.errorMessage=" Account already exists"
      }
    })
  }

  viewemployee()
  {
  this.router.navigate(['viewemployees'])
  }
}