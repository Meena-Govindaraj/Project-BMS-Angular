import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account';
import { Accountype } from 'src/app/models/accountype';
import { Customer } from 'src/app/models/customer';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customeroperations',
  templateUrl: './customeroperations.component.html',
  styleUrls: ['./customeroperations.component.css']
})
export class CustomeroperationsComponent implements OnInit {

  signupForm: FormGroup;
  customerId: number
  customer: Customer;
  accountDetails: Account[];
  savingsAccount: boolean;
  currentAccount: boolean;
  noAccount: boolean;
  createSavings: boolean;
  createCurrent: boolean;
  accountType = new Accountype();
  type: string;
  changePassword: boolean;
  otherOp: boolean;
  hide: boolean;

  constructor(public activatedRoute: ActivatedRoute, public formBuilder: FormBuilder, public router: Router, public customerService: CustomerService, public accountService: AccountService) { }

  ngOnInit(): void {

    this.customerId = this.activatedRoute.snapshot.params['customerId'];
    console.log(this.customerId)

    this.accountService.getCustomerOnAccount(this.customerId)
      .subscribe(data => {
        console.log(data)
        this.accountDetails = data.data;
        console.log(this.accountDetails)

        this.signupForm = this.formBuilder.group({
          mobileNo: [this.accountDetails[0].accountType.customer.mobileNo],
          password: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(6)]]

        })
        var cust: Observable<Customer[]> | any
        this.accountService.getCountOfCustomerAccount(this.customerId)
          .subscribe(
            res => {
              cust = res;
              cust = cust.data;
              console.log(cust)
              console.log(cust.length)

              if (cust.length == 2) {
                this.otherOp = true;
                if (cust[0].accountStatus == "Yes") {
                  if (cust[0].type == "Savings")
                    this.savingsAccount = true;
                  else
                    this.currentAccount = true;
                }
                if (cust[1].accountStatus == "Yes") {
                  if (cust[1].type == "Savings")
                    this.savingsAccount = true;
                  else
                    this.currentAccount = true;
                }
              }

              else if (cust[0].type == "Savings" && cust[0].accountStatus == "Yes") {

                this.otherOp = true;
                this.savingsAccount = true;
                this.createCurrent = true;
              }
              else if (cust[0].type == "Current" && cust[0].accountStatus == "Yes") {
                this.otherOp = true;
                this.currentAccount = true;
                this.createSavings = true;
              }
            })


      }, err => {
        this.noAccount = true;
        this.otherOp = false;
      })
  }
  viewSavingsAccount() {
    this.type = "Savings"
    this.router.navigate(['account', this.customerId, this.type])
  }

  viewCurrentAccount() {
    this.type = "Current"
    this.router.navigate(['account', this.customerId, this.type])
  }

  createSavingsAccount() {
    this.createSavings = false;
    this.accountType.customer = this.accountDetails[0].accountType.customer;
    this.accountType.type = "Savings"
    console.log(this.accountType)
    this.accountService.addAccountType(this.accountType)
      .subscribe(
        response => {
          console.log(response)
          console.log("Customer account with type created successfully!")
          this.successNotification("Savings");
          this.router.navigate(['customeroperations', this.customerId])
        })
  }

  createCurrentAccount() {
    this.createCurrent = false;
    this.accountType.customer = this.accountDetails[0].accountType.customer;
    this.accountType.type = "Current"
    console.log(this.accountType)
    this.accountService.addAccountType(this.accountType)
      .subscribe(
        response => {
          console.log(response)
          console.log("Customer account with type created successfully!")
          this.successNotification("Current");
          this.router.navigate(['customeroperations', this.customerId])
        })
  }


  successNotification(msg: string) {
    Swal.fire('Wait For Mail!!', 'Your ' + msg + "Account Created Successfully!! \n Please wait for account details", 'info')

  }

  pass() {
    this.changePassword = true;
  }
  updatePassword() {

    console.log("updating password!!")

    this.customerService.updatePassword(this.signupForm.get('mobileNo').value, this.signupForm.get('password').value, this.signupForm.get('newPassword').value)
      .subscribe(data => {
        console.log(data)
        this.success();

      }, err => {
        this.wrongPassword();
      })
  }
  success() {
    Swal.fire('Success', 'Password Updated!', 'success')
    this.router.navigate(['customerlogin'])
  }
  wrongPassword() {
    Swal.fire('Wrong', 'Enter correct current PASSWORD', 'warning')
    this.pass();
  }
  back() {
    this.changePassword = false;
  }
  logout() {
    this.router.navigate(['customerlogin'])
  }
}
