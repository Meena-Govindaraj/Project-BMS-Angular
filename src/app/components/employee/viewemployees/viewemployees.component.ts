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

  employee: Employee[];
  errorMessage: string
  searchemployee: any
  config: any

  constructor(public router: Router, public formBuilder: FormBuilder, public employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.viewAllEmployees();
  }

  //to get all employees
  viewAllEmployees() {
    this.employeeService.getAllEmployees().subscribe(
      (data) => {
        console.log("####Getting all Employees");
        console.log(data);
        this.employee = data.data;
        this.config = { itemsPerPage: 5, currentPage: 1 }
 
      }, err => {
        this.errorMessage = "NO DATA FOUND!!"
        console.log(err.error)
      })
  }


  //to delete employee
  deleteEmployee(employeeId: number) {

    console.log("employee Id Going to delete:" + employeeId)
    this.employeeService.deleteEmployee(employeeId)
      .subscribe(
        response => {
          console.log(response)
          console.log("employeeId: " + employeeId + " deleted successfully ");
          this.viewAllEmployees();
        });
  }

  //for pop up for deletion of Employee
  alertConfirmation(employeeId: number
    ) {
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

  //navigating to editcomponent
  editEmployee(employeeId: number) {
    this.router.navigate(['editemployee', employeeId])
  }

  addEmployee() {
    this.router.navigate(['addemployee'])
  }
  showAdminop() {
    this.router.navigate(['adminop'])
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }
}