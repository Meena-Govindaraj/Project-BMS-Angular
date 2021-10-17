import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

    this.viewCust = true;
    this.showAll = true;


    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(response => {
        console.log(response)
        this.employee = response.data;

        this.signupForm = this.formBuilder.group({
          mobileNo: [this.employee.mobileNo],
          password: ['', [Validators.required, Validators.minLength(6)]],
          newPassword: ['', [Validators.required, Validators.minLength(6)]]

        })
        this.viewAllCustomer();
        console.log(this.employee.branch.ifscCode)
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

  //getting all customers..on employee branch(ifsc)
  viewAllCustomer() {

    this.accountService.getCustomersByIFSC(this.employee.branch.ifscCode).subscribe(
      (data) => {
        console.log("####Getting all Customers");

        console.log(data);
        this.account = data.data;
        this.config = { itemsPerPage: 5, currentPage: 1 }

      }, err => {
        this.errorMessage = "NO DATA FOUND!!"
        console.log(this.errorMessage)
      })
  }

  //to delete customer
  deleteCustomer(customerId: number) {
    console.log("customer Id Going to delete:" + customerId)
    this.customerService.deleteCustomer(customerId)
      .subscribe(
        response => {
          console.log("Response" + response)
          console.log("customer Id: " + customerId + " deleted successfully ");
          this.viewAllCustomer();
        }
      );
  }

  deleteAccount(typeId: number, customerId: number) {

    console.log("Account type Id Going to delete:" + typeId)
    this.accountService.deleteAccount(typeId)
      .subscribe(
        response => {
          console.log(response)
          this.accountService.getCountOfCustomerAccount(customerId)
            .subscribe(
              cust => {
                console.log( cust)
                   },err=>{
                    this.deleteCustomer(customerId)
              })
          this.viewAllCustomer();
        }

      );
  }

  //for pop up for deletion of customer
  alertConfirmation(typeId:number, customerId:number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.deleteAccount(typeId, customerId)
        Swal.fire(
          'Removed!',
          'Account removed successfully!',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Account Not Deleted!!',
          'error'
        )
      }
    })
  }


  viewTransacations(accountId: number) {
    this.viewTrans = true;
    this.viewCust = false;
    this.showAll = false;

    this.transactionService.getTransactionByAccount(accountId).subscribe(data => {
      this.transaction = data.data;
      console.log(this.transaction)
      this.config = { itemsPerPage: 3, currentPage: 1 }

    }, err => {
      this.errorMessage = "NO DATA FOUND!"
      console.log(err.error)
    })

  }

  sendMail(email:string)
  {
    console.log(email)
    this.customerService.alertCustomer(email).subscribe(res=>
      {
        this.toasterService.success("Mail sent");
      });
      
  }
  back() {
    this.viewTrans = false;
    this.viewCust = true;
    this.changePassword = false;
    this.showAll = true;
    this.errorMessage = ""
    this.reloadComponent();
    this.router.navigate(['employeeop', this.employeeId])
  }

  viewcustomers() {

    this.router.navigate(['viewcustomers', this.employeeId])
  }

  viewrequests() {
    this.router.navigate(['viewrequests', this.employeeId])
  }

  updateemployee() {
    this.router.navigate(['updateemployee', this.employeeId])
  }

  pass() {
    this.changePassword = true;
    this.viewCust = false;
    this.showAll = false;
  }

  reloadComponent() {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.errorMessage = ""
    this.router.navigate(['employeeop', this.employeeId])
  }
  logout() {
    this.router.navigate(['employeelogin'])
  }
  pageChanged(event: any) {
    this.config.currentPage = event;
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
