import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { Customer } from 'src/app/models/customer';
import { AccountService } from 'src/app/services/account.service';
import { BranchService } from 'src/app/services/branch.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Accountype } from 'src/app/models/accountype';
import { ToasterserviceService } from 'src/app/toasterservice.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.css']
})
export class AddcustomerComponent implements OnInit {


  signupForm: FormGroup
  branches: Observable<Branch[]> | any;
  customer?: Customer;
  errorMessage?: string;
  getType?: boolean;
  getCustomer?: boolean = true;
  typeForm: FormGroup


  constructor(public activatedRoute: ActivatedRoute, private toasterService: ToasterserviceService, public customerService: CustomerService, public branchService: BranchService, public accountService: AccountService, public formBuilder: FormBuilder, public router: Router) { }

  ngOnInit(): void {

    this.viewAllBranches();
    this.typeForm = this.formBuilder.group({
      type: ['', [Validators.required]]
    })
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      state: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1)]],
      branch: ['', Validators.required]

    })

  }

  //to get all branches
  viewAllBranches() {
    this.branchService.getAllBranches().subscribe(
      (response) => {
        this.branches = response;
        this.branches = this.branches.data;
        console.log(this.branches)
      }, err => console.log(err.error.message)
    )
  }

  viewBranchByIFSC() {

    var branch: Observable<Branch[]> | any;
    this.branchService.getBranchByName(this.signupForm.get('branch')?.value).subscribe(
      (response) => {
        console.log("branch Name: " + this.signupForm.get('branch')?.value)
        branch = response;
        branch = branch.data;
        this.customer = this.signupForm.value;
        this.customer.branch = branch;
        this.customerSignup(this.customer);
      }, err => {
        console.log(err.error.message)
      })
  }

  customerSignup(customer: Customer) {
    console.log(this.signupForm?.value)
    this.getType = true
    this.customerService.addCustomer(customer)
      .subscribe(
        response => {
          this.customer = response
          this.getCustomer = false
          this.getType = true
          console.log("Customer saved successfully!")
        }, err => {
          this.toasterService.error("Mobile no already exists..")
          this.getType = false;
        })
  }

  addAccountType() {
    var accountType: Accountype;
    var cust: Observable<Customer[]> | any;
    accountType = this.typeForm.value;
    this.customerService.getCustomerByMobileNo(this.signupForm.get('mobileNo').value)
      .subscribe(
        response => {
          console.log(response);
          cust = response
          cust = cust.data;
          console.log(cust);
          accountType.customer = cust
          this.accountService.addAccountType(accountType)
            .subscribe(
              response => {
                console.log(response)
                console.log("Customer account with type created successfully!")
                this.success();
                this.router.navigate(['customerlogin'])
              }, err => {
                console.log(err.error.message)
              })
        }, err => {
          console.log(err.error.message)
        })
  }


  success() {
    this.toasterService.success("Account Details will be sent to your mail once accepted by bank!!")
  }

  customerLogin() {
    this.router.navigate(['customerlogin'])
  }
}