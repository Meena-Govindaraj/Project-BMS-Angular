import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { Employee } from 'src/app/models/employee';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updateemployee',
  templateUrl: './updateemployee.component.html',
  styleUrls: ['./updateemployee.component.css']
})
export class UpdateemployeeComponent implements OnInit {

  editEmployeeForm?:FormGroup
  employeeId:number;
  branch:Branch[]=[];
  employee?:Employee;
  errorMessage?:string
  branchIfsc?:string
  branchName?:string;
  createdDate?:Date;

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public router:Router,public employeeService:EmployeeService,public branchService:BranchService) { }

  ngOnInit(): void {

    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)

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

  
successNotification(){
  Swal.fire('Success', 'Employee Datails Updated Successfully!', 'success')
}

back()
{
  this.router.navigate(['employeeop',this.employeeId])
}



}
