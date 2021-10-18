import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Accountype } from 'src/app/models/accountype';
import { Employee } from 'src/app/models/employee';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css']
})
export class ViewrequestComponent implements OnInit {

  accountTypes: Accountype[];
  errorMessage: string
  account: Account;
  employeeId: number;
  searchReq: any
  requests:Accountype[];
  employee: Employee;
  customerRequests=false;

  constructor(public activatedRoute: ActivatedRoute, public router: Router, public formBuilder: FormBuilder, public customerService: CustomerService, public accountService: AccountService, public employeeService: EmployeeService, public toasterService: ToasterserviceService) { }

  ngOnInit(): void {

    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)
    this.viewAllCustomer();

  }

  //getting all customers..
  viewAllCustomer() {

    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(
        response => {
          this.employee = response.data;
          this.accountService.getCustomersByIFSCOnType(this.employee.branch.ifscCode).subscribe(
            (data) => {
              this.accountTypes = data.data;
              console.log(this.accountTypes)
              var j=0;

              for(var i=0;i<this.accountTypes.length;i++)
              {
                if(this.accountTypes[i].accountStatus=="No")
                {
                  this.customerRequests=true;
                  console.log(this.accountTypes[i]);
                  this.requests[j++]=this.accountTypes[i];
                  console.log(this.requests);
                
                }
              }
              if(this.customerRequests==false){
                this.errorMessage = "NO DATA FOUND!"
                this.toasterService.error("No Requests Found")
            }
              console.log(this.requests);
            }, err => {
              this.errorMessage = "NO DATA FOUND!!"
              this.toasterService.error("No Requests Found")
              console.log(err.error.meessage)
            })
        });
  }

  //to delete customer
  deleteCustomer(customerId: number) {

    console.log("customer Id Going to delete:" + customerId)
    this.customerService.deleteCustomer(customerId)
      .subscribe(
        response => {
          console.log(response)
          console.log("customer Id: " + customerId + " deleted successfully ");
          this.viewAllCustomer();
          window.alert("Rejected")
        }
      );
  }

  deleteAccount(typeId: number, customerId: number) {
    console.log("Account type Id Going to delete:" + typeId)
    this.accountService.deleteAccount(typeId)
      .subscribe(
        response => {
          console.log("Response" + response)
          this.toasterService.error("Rejected")
          this.accountService.getCountOfCustomerAccount(customerId)
            .subscribe(
              cust => {
                console.log(cust)
              },err=>{this.deleteCustomer(customerId)})
          this.viewAllCustomer();
        }

      );
  }

  //update requested accounts
  updateAccountStatus(accountNo: string) {
    this.accountService.updateAccountStatus("Yes", accountNo)
      .subscribe(
        response => {
          console.log(response);
          this.successNotification()
          this.createAccount(accountNo);
          this.viewAllCustomer();
        });
  }

  //to get accounttype for adding account
  createAccount(accountNo: string) {
    this.accountService.getByAccountNumber(accountNo)
      .subscribe(
        response => {
          this.account = new Account();
          this.account.accountType = response.data;
          console.log(this.account)
          this.addAccount(this.account);
        })
  }

  //to add account on type with balance
  addAccount(account: Account) {
    if (this.account.accountType.type == "Savings")
      this.account.balance = 500;
    else
      this.account.balance = 5000;

    console.log(this.account)
    this.accountService.addAccount(account)
      .subscribe(
        response => {
          console.log(response)
          console.log("Account addedd!!!!!!")
        })
  }
  successNotification() {
    this.toasterService.success("Accepted and Account Opened Successfully!")
  }

  back() {
    this.router.navigate(['viewcustomers',this.employee.branch.ifscCode,this.employee.id])
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
}
