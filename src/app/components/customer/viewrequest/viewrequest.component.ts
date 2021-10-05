import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account';
import { Accountype } from 'src/app/models/accountype';
import { Customer } from 'src/app/models/customer';
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

  customers:Observable<Customer[]> | any
  accountTypes:Observable<Accountype[]> | any;
  errorMessage?:string
  account:Observable<Account> | any;
  employeeId?:number;
  employee:Observable<Employee[]> | any;
  searchReq?:any
  requestAccounts:Observable<Accountype[]> | any;

  constructor(public activatedRoute:ActivatedRoute,public router:Router,public formBuilder:FormBuilder,public customerService:CustomerService,public accountService:AccountService,public employeeService:EmployeeService,public toasterService:ToasterserviceService) { }

  ngOnInit(): void {
    
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)
    this.viewAllCustomer();
  }

  //getting all customers..
  viewAllCustomer()
  {
     this.employeeService.getEmployeeById(this.employeeId)
    .subscribe(
      response => {
        this.employee=response;
        this.employee=this.employee.data
        console.log(this.employee)
          this.accountService.getCustomersByIFSCOnType(this.employee.branch.ifscCode).subscribe(
          (data)=>{
            console.log(data)
            this.accountTypes=data;
            this.accountTypes=this.accountTypes.data
            console.log(this.accountTypes)
           console.log("####Getting all Customers");
            for(var i=0;i<this.accountTypes.length;i++)
            {
              if(this.accountTypes[i].accountStatus=="No")
               this.requestAccounts=this.accountTypes[i];
            }
            console.log(this.requestAccounts)
          },err=>{
            this.errorMessage="NO DATA FOUND!!"
            console.log(this.errorMessage)
          })
        });   
  }

  //to delete customer
  deleteCustomer(customerId:any)
  {

    console.log("customer Id Going to delete:"+customerId)
    this.customerService.deleteCustomer(customerId)
        .subscribe(
          response => {
            console.log(response) 
            console.log("customer Id: "+customerId+" deleted successfully ");
            this.viewAllCustomer();
            window.alert("Rejected")
          }   
       );   
  }

  deleteAccount(typeId:any,customerId:any)
  {
    console.log("Account type Id Going to delete:"+typeId)
    this.accountService.deleteAccount(typeId)
        .subscribe(
          response => {
            console.log("Response"+response) 
            this.accountService.getCountOfCustomerAccount(customerId)
            .subscribe(
              cust=> {
                console.log("Count of customer in type"+cust) 
                if(cust==null)
                  this.deleteCustomer(customerId)
              })
            this.viewAllCustomer();
          }
          
       );   
  }
  
  //update requested accounts
  updateAccountStatus(accountNo:string)
  {
    this.accountService.updateAccountStatus("Yes",accountNo)
    .subscribe(
      response => {
        console.log(response);
        console.log("#######updated successfully ");
        this.successNotification()
        this.createAccount(accountNo);
        this.viewAllCustomer();
      });
  }

  createAccount(accountNo:string)
  {
    this.accountService.getByAccountNumber(accountNo)
    .subscribe(
      response => {
        this.account=new Account();
        this.account.accountType=response
        this.account.accountType=this.account.accountType.data
        console.log(this.account)
        this.addAccount(this.account);
      })
  }

  addAccount(account:any)
  {
    if(this.account.accountType.type=="Savings")
      this.account.balance=500;
    else
      this.account.balance=5000;

    console.log(this.account)
    this.accountService.addAccount(account)
    .subscribe(
      response => {
        console.log(response)
        console.log("Account addedd!!!!!!")
      })
  }
  successNotification(){
    this.toasterService.success( "Accepted and Account Opened Successfully!")
  }

  back()
  {
      this.router.navigate(['employeeop',this.employeeId])
  }

}
