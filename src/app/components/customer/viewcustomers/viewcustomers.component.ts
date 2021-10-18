import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  selector: 'app-viewcustomers',
  templateUrl: './viewcustomers.component.html',
  styleUrls: ['./viewcustomers.component.css']
})
export class ViewcustomersComponent implements OnInit {

  employeeIfsc: string;
  account: Account[];
  config: any;
  errorMessage: string
  searchDate: any;

  employeeId: number;
  transaction: Transaction[];
  viewTrans: boolean;
  viewCus: boolean;
  searchCus: any;
  employee:Employee;
  
  constructor(public activatedRoute: ActivatedRoute, public toasterService: ToasterserviceService, public formBuilder: FormBuilder, public router: Router, public employeeService: EmployeeService, public accountService: AccountService, public customerService: CustomerService, public transactionService: TransactionService) { }

  ngOnInit(): void {

    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)

    this.employeeService.getEmployeeById(this.employeeId)
    .subscribe(res => {
      this.employee=res.data;
    });

    this.employeeIfsc = this.activatedRoute.snapshot.params['employeeIfsc'];
    console.log(this.employeeIfsc)
    this.viewCus = true;
    this.viewAllCustomer();

  }


  //getting all customers..on employee branch(ifsc)
  viewAllCustomer() {

    this.accountService.getCustomersByIFSC(this.employeeIfsc).subscribe(
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
                console.log(cust)
              }, err => {
                this.deleteCustomer(customerId)
              })
          this.viewAllCustomer();
        }

      );
  }

  //for pop up for deletion of customer
  alertConfirmation(typeId: number, customerId: number) {
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


    this.transactionService.getTransactionByAccount(accountId).subscribe(data => {
      this.viewTrans = true;
      this.viewCus = false;
      this.transaction = data.data;
      console.log(this.transaction)
      this.config = { itemsPerPage: 3, currentPage: 1 }

    }, err => {
      this.toasterService.error("No Transactions")
      console.log(err.error)
    })

  }

  sendMail(email: string) {
    console.log(email)
    this.customerService.alertCustomer(email).subscribe(res => {
      this.toasterService.success("Mail sent");
    });

  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  viewrequests() {
    this.router.navigate(['viewrequests', this.employeeId])
  }

  updateemployee() {
    this.router.navigate(['updateemployee', this.employeeId])
  }

  logout() {
    this.router.navigate(['employeelogin'])
  }

  pass() {
    this.router.navigate(['employeeop', this.employeeId])
  }
  back() {
    this.router.navigate(['viewcustomers',this.employeeIfsc,this.employeeId])
    this.viewTrans=false;
    this.viewCus=true;
  
  }
}
