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
  selector: 'app-updateemployee',
  templateUrl: './updateemployee.component.html',
  styleUrls: ['./updateemployee.component.css']
})
export class UpdateemployeeComponent implements OnInit {

  editEmployeeForm?:FormGroup
  employeeId:number;
  employee:Observable<Employee[]> | any;
  errorMessage?:string
  branchIfsc?:string
  branchName?:string;
  createdDate?:Date;

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public router:Router,public employeeService:EmployeeService,public branchService:BranchService,public toasterService:ToasterserviceService) { }

  ngOnInit(): void {

    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)

    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(response=>{
       console.log(response)
       this.employee=response
       this.employee=this.employee.data
       this.editEmployeeForm=this.formBuilder.group({
        id:[this.employeeId,[Validators.required]],
        name: [ this.employee.name, [Validators.required, Validators.minLength(3)]],
        password: [ this.employee.password],
        mobileNo: [ this.employee.mobileNo, [Validators.required ,Validators.minLength(10),Validators.maxLength(10)]],
        email: [ this.employee.email, [Validators.required,Validators.email ]],
        address: [ this.employee.address, [Validators.required ]],
        salary: [ this.employee.salary, [Validators.required ,Validators.min(0)]],
        branch:[ this.employee.branch.ifscCode,Validators.required], 
       })
       this.branchIfsc= this.employee.branch.ifscCode;
       this.branchName= this.employee.branch.name;
       this.createdDate= this.employee.createdDate;
    })
    
  }

  //getting branch details on Selected IFSC..
  viewBranchByIFSC()
  {
    var branch: Observable<Branch[]> | any;
    this.branchService.getBranchByIfscCode(this.editEmployeeForm.get('branch')?.value).subscribe(
      (data)=>{
        console.log("branch Name: "+this.editEmployeeForm.get('branch')?.value)
        branch=data;
        branch=branch.data
        this.employee=this.editEmployeeForm.value;
        this.employee.createdDate=this.createdDate;
        this.employee.branch=branch;
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
        this.successNotification();
        console.log("Employee account Updated successfully!")
        this.back();
      })
   
  }

successNotification(){
  this.toasterService.success("Employee Details Updated Successfully!")
}

back()
{
  this.router.navigate(['employeeop',this.employeeId])
}
}
