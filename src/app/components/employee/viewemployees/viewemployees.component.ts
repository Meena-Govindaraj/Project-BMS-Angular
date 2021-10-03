import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewemployees',
  templateUrl: './viewemployees.component.html',
  styleUrls: ['./viewemployees.component.css']
})
export class ViewemployeesComponent implements OnInit {


  employee:Observable<Employee[]> | any;
  errorMessage?:string
  searchemployee?:any

  constructor(public router:Router,public formBuilder:FormBuilder,public employeeService:EmployeeService) { }

  ngOnInit(): void {
    this.viewAllEmployees();
  }

  //to get all employees
  viewAllEmployees()
  {
    this.employeeService.getAllEmployees().subscribe(
      (data)=>{
      console.log("####Getting all Employees");
      if(data==null)
      {
        this.errorMessage="NO DATA FOUND!!"
        console.log(this.errorMessage)
      }
      else{
      console.log(data);
      this.employee=data;
      this.employee=this.employee.data;
      }
      
    },err=>this.errorMessage=err)
  }

  //navigating to editcomponent
  editEmployee(employeeId:number)
  {
    this.router.navigate(['editemployee',employeeId])
  }

   //to delete employee
   deleteEmployee(employeeId:any)
   {
 
     console.log("employee Id Going to delete:"+employeeId)
     this.employeeService.deleteEmployee(employeeId)
         .subscribe(
           response => {
             console.log("Response"+response) 
             console.log("employeeId: "+employeeId+" deleted successfully ");
             this.viewAllEmployees();
           });  
   }

  //for pop up for deletion of Employee
  alertConfirmation(employeeId:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.deleteEmployee(employeeId)
        Swal.fire(
          'Removed!',
          'Employee removed successfully!',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Employee Not Deleted!!',
          'error'
        )
      }
    })
  } 
  
  addEmployee()
  {
    this.router.navigate(['addemployee'])
  }
  showAdminop()
  {
    this.router.navigate(['adminop'])
  }

}