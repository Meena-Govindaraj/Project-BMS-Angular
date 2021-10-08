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

  editEmployeeForm: FormGroup
  employeeId: number;
  employee: Employee;
  errorMessage: string
  createdDate: Date;

  constructor(public activatedRoute: ActivatedRoute, public formBuilder: FormBuilder, public router: Router, public employeeService: EmployeeService, public branchService: BranchService, public toasterService: ToasterserviceService) { }

  ngOnInit(): void {

    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)

    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(response => {
        console.log(response)
        this.employee = response.data;
        this.editEmployeeForm = this.formBuilder.group({
          id: [this.employeeId, [Validators.required]],
          name: [this.employee.name, [Validators.required, Validators.minLength(3)]],
          password: [this.employee.password],
          mobileNo: [this.employee.mobileNo, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          email: [this.employee.email, [Validators.required, Validators.email]],
          address: [this.employee.address, [Validators.required]],
          salary: [this.employee.salary, [Validators.required, Validators.min(0)]],
          branch: [this.employee.branch.ifscCode, Validators.required],
        })
        this.createdDate = this.employee.createdDate;
      })

  }

  updateEmployee() {
    console.log(this.editEmployeeForm.value)
    var emp: Employee;
    emp = this.editEmployeeForm.value;
    emp.branch = this.employee.branch
    console.log(emp);
    this.employeeService.updateEmployee(emp)
      .subscribe(
        response => {
          this.employee = response
          this.successNotification();
          console.log("Employee account Updated successfully!")
          this.back();
        }, err => { console.error(err.errormessage) });

  }

  successNotification() {
    this.toasterService.success("Employee Details Updated Successfully!")
  }

  back() {
    this.router.navigate(['employeeop', this.employeeId])
  }
}
