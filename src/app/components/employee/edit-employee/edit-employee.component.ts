import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { Employee } from 'src/app/models/employee';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  editEmployeeForm?:FormGroup
  employeeId:number;
  branch:Branch[]=[];
  employee?:Employee;
  branches:Branch[]=[];
  errorMessage?:string
  ifsc?:string;
  branchIfsc?:string
  branchName?:string;
  editBranch?:boolean;
  createdDate?:Date;
  searches?:any

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public router:Router,public employeeService:EmployeeService,public branchService:BranchService) { }

  ngOnInit(): void {

    this.viewAllBranches();
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log("####employeeId: ",this.employeeId)
   
    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(data=>{
       console.log(data)
       this.editEmployeeForm=this.formBuilder.group({
        id:[this.employeeId,[Validators.required]],
        name: [data.name, [Validators.required, Validators.minLength(3)]],
        password: [data.password],
        mobileNo: [data.mobileNo, [Validators.required ,Validators.minLength(10),Validators.maxLength(10)]],
        email: [data.email, [Validators.required,Validators.email ]],
        address: [data.address, [Validators.required ]],
        salary: [data.salary, [Validators.required ,Validators.min(0)]],
        branch:[data.branch.ifscCode,Validators.required], 
       })
       this.branchIfsc=data.branch.ifscCode;
       this.branchName=data.branch.name;
       this.createdDate=data.createdDate;
    })
    
  }

  //getting branch details on Selected IFSC..
  viewBranchByIFSC()
  {
    this.branchService.getBranchByIfscCode(this.editEmployeeForm.get('branch')?.value).subscribe(
      (data:any)=>{
        console.log("branch Name: "+this.editEmployeeForm.get('branch')?.value)
        this.branch=data;
        this.employee=this.editEmployeeForm.value;
        this.employee.createdDate=this.createdDate;
        this.employee.branch=this.branch;
        this.updateEmployee(this.employee);
      })
  }

  //Getting branch details to view branch name..
  viewBranchName()
  {
    this.branchService.getBranchByIfscCode(this.editEmployeeForm.get('branch')?.value).subscribe(
      (data:any)=>{
        console.log("branch Name: "+this.editEmployeeForm.get('branch')?.value)
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

  updateEmployee(employee:any)
  {
    console.log(this.editEmployeeForm?.value)
    this.employeeService.updateEmployee(employee)
    .subscribe(
      response => {
        this.employee=response
      },error => {
        this.successNotification();
        console.log("Employee account Updated successfully!")
        this.back();
            })
   
  }

  editBranchDetails()
  {
    this.editBranch=true;
    this.viewAllBranches();
  }
  
successNotification(){
  Swal.fire('Success', 'Employee Datails Updated Successfully!', 'success')
}

back()
{
  this.router.navigate(['viewemployees'])
}

}
