import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customerlogin',
  templateUrl: './customerlogin.component.html',
  styleUrls: ['./customerlogin.component.css']
})
export class CustomerloginComponent implements OnInit {

  customerLoginForm?: FormGroup
  errorMessage?: string;
  customer: Customer;
  getEmailForm?: FormGroup
  resetPassword?: boolean
  login?: boolean

  constructor(public activatedRoute: ActivatedRoute, public customerService: CustomerService, public formBuilder: FormBuilder, public router: Router) { }

  ngOnInit(): void {

    this.login = true;
    this.customerLoginForm = this.formBuilder.group({
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
    this.getEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }


  //validate customer login
  customerLogin() {
    var cust: Observable<Customer[]> | any;
    this.customerService.customerLogin(this.customerLoginForm.get('mobileNo').value, this.customerLoginForm.get('password').value,).subscribe(
      (data) => {
        cust = data;
        cust = cust.data;
        if (cust != null)
          this.router.navigate(['customeroperations', cust.id])
        else {
          this.wrongLogin();
          this.router.navigate(['customerlogin'])
        }
      }
    )
  }
  forgetPassword() {
    var cust: Observable<Customer[]> | any;
    this.customerService.getCustomerByEmail(this.getEmailForm.get('email').value).subscribe(data => {
      cust = data;
      cust = cust.data;
      if (cust != null) {
        this.customerService.forgetPassword(this.getEmailForm.get('email').value).subscribe(
          (data) => {
            this.forget();
            this.updated(); 
          })
      }
      else {
        this.wrongLogin();
      }
    })

  }
  updated() {
    Swal.fire('Success Check!!!', 'Your password sent to your Mail! ', 'success')
  }
  forget() {
    this.login = !this.login;
    this.resetPassword = !this.resetPassword;
  }

  wrongLogin() {
    Swal.fire('Wrong!', 'Your Login Credentials are not matched!', 'error')
  }

  addcustomers() {
    this.router.navigate(['addcustomers'])
  }
}
