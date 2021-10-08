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
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  editEmployeeForm: FormGroup
  branches:Branch[];
  employee:Employee;
  editBranch: boolean;

  constructor(public activatedRoute: ActivatedRoute, public toasterService: ToasterserviceService, public formBuilder: FormBuilder, public router: Router, public employeeService: EmployeeService, public branchService: BranchService) { }

  ngOnInit(): void {

    var employeeId: number;
    employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log("####employeeId: ", employeeId)

    this.employeeService.getEmployeeById(employeeId)
      .subscribe(res => {
        this.employee=res.data;
        this.editEmployeeForm = this.formBuilder.group({
          id: [this.employee.id, [Validators.required]],
          name: [this.employee.name, [Validators.required, Validators.minLength(3)]],
          password: [this.employee.password],
          mobileNo: [this.employee.mobileNo, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          email: [this.employee.email, [Validators.required, Validators.email]],
          address: [this.employee.address, [Validators.required]],
          salary: [this.employee.salary, [Validators.required, Validators.min(0)]],
          branch: [this.employee.branch, Validators.required],
          createdDate:[this.employee.createdDate]
        })
      })

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

  updateEmployee() {
    console.log(this.editEmployeeForm.value)
    var emp:Employee;
    emp=this.editEmployeeForm.value
    this.employeeService.updateEmployee(emp)
      .subscribe(
        response => {
          this.successNotification();
          console.log("Employee account Updated successfully!")
          this.back();
        })

  }

  editBranchDetails() {
    this.editBranch = true;
    this.viewAllBranches();
  }

  successNotification() {
    this.toasterService.success("Employee account Updated successfully!")
  }

  back() {
    this.router.navigate(['viewemployees'])
  }

}
