import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { Account } from 'src/app/models/account';
import { Employee } from 'src/app/models/employee';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employeeoperations',
  templateUrl: './employeeoperations.component.html',
  styleUrls: ['./employeeoperations.component.css']
})
export class EmployeeoperationsComponent implements OnInit {

  employeeId: number;
  changePassword: boolean;
  signupForm: FormGroup
  employee: Employee;
  errorMessage: string
  account: Account[];
  transaction: Transaction[];
  viewTrans: boolean;
  viewCust: boolean;
  showAll: boolean;
  searchCus: any;
  config: any;

  constructor(public activatedRoute: ActivatedRoute,public toasterService:  ToasterserviceService, public formBuilder: FormBuilder, public router: Router, public employeeService: EmployeeService, public accountService: AccountService, public customerService: CustomerService, public transactionService: TransactionService) { }

  ngOnInit(): void {

    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)

    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(response => {
        console.log(response)
        this.employee = response.data;

        this.signupForm = this.formBuilder.group({
          mobileNo: [this.employee.mobileNo],
          password: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(6)]]
        })

        this.pass()
      })

  }

  updatePassword() {

    console.log("updating password!!")

    this.employeeService.updatePassword(this.signupForm.get('mobileNo').value, this.signupForm.get('password').value, this.signupForm.get('newPassword').value)
      .subscribe(response => {
        console.log(response)
        this.successNotification();
      }, err => {
        console.log(err)
        this.wrongPassword();
      })

  }

  viewAllCustomer() {

    console.log(this.employee.branch.ifscCode)
    this.router.navigate(['viewcustomers',this.employee.branch.ifscCode,this.employee.id])

  }
  viewrequests() {
    this.router.navigate(['viewrequests', this.employeeId])
  }

  updateemployee() {
    this.router.navigate(['updateemployee', this.employeeId])
  }

  pass() {
    this.router.navigate(['employeeop', this.employeeId])
  }

  back() {
    this.router.navigate(['viewcustomers',this.employee.branch.ifscCode,this.employee.id])
  }


  successNotification() {
    Swal.fire('Success', 'Password Updated!', 'success')
    this.router.navigate(['employeelogin'])
  }
  wrongPassword() {
    Swal.fire('Wrong', 'Enter correct OLD PASSWORD', 'warning')
    this.pass();
  }

}
