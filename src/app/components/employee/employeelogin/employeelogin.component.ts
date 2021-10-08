import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employeelogin',
  templateUrl: './employeelogin.component.html',
  styleUrls: ['./employeelogin.component.css']
})
export class EmployeeloginComponent implements OnInit {

  employeeLoginForm: FormGroup;
  errorMessage: string;
  employee: Employee;
  getEmailForm: FormGroup
  resetPassword: boolean
  login: boolean

  constructor(public activatedRoute: ActivatedRoute, public employeeService: EmployeeService, public formBuilder: FormBuilder, public router: Router, public toasterService: ToasterserviceService) { }

  ngOnInit(): void {

    this.login = true;
    this.employeeLoginForm = this.formBuilder.group({
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
    this.getEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  //validate employee login
  employeeLogin() {
    if (this.employeeLoginForm.get('mobileNo').value == "9876543210" && this.employeeLoginForm.get('password').value == "admin123")
      this.router.navigate(['adminop'])
    else {
      this.employeeService.employeeeLogin(this.employeeLoginForm.get('mobileNo').value, this.employeeLoginForm.get('password').value,).subscribe(
        (response) => {
          this.employee = response.data;
          console.log(this.employee)
          this.router.navigate(['employeeop', this.employee.id])
        }, err => {
          console.log(err.error.message)
          this.wrongLogin("'Your Login Credentials are not matched!'");
          this.router.navigate(['employeelogin'])
        }
      )
    }
  }

  forgetPassword() {

    this.employeeService.forgetPassword(this.getEmailForm.get('email').value).subscribe(
      (emp) => {
        console.log(emp)
        this.updated();
        this.forget();
      }, err => {
        console.log(err)
        this.wrongLogin("Email Id Not found!!")
      }
    )

  }
  wrongLogin(msg: string) {
    Swal.fire('Wrong!', msg, 'error')
  }
  updated() {
    this.toasterService.success("Your password sent to your Mail!")
  }
  forget() {
    this.login = !this.login;
    this.resetPassword = !this.resetPassword;
  }
}
