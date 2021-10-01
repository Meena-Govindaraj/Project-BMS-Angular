import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Accountype } from 'src/app/models/accountype';
import { Customer } from 'src/app/models/customer';
import { Employee } from 'src/app/models/employee';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  styleUrls: ['./viewrequest.component.css']
})
export class ViewrequestComponent implements OnInit {

  customers:Customer[]=[];
  errorMessage?:string
  accountTypes:Accountype[]=[];
  account=new Account();
  employeeId?:number;
  employee:Employee;
  no="No";
  searchReq?:any
  
  constructor(public activatedRoute:ActivatedRoute,public router:Router,public formBuilder:FormBuilder,public customerService:CustomerService,public accountService:AccountService,public employeeService:EmployeeService) { }

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
        console.log(this.employee)
          this.accountService.getCustomersByIFSCOnType(this.employee.branch.ifscCode).subscribe(
          (data:any[])=>{
          console.log("####Getting all Customers");
          if(data==null)
          {
            this.errorMessage="NO DATA FOUND!!"
            console.log(this.errorMessage)
          }
          else{
            console.log(data);
            this.accountTypes=data;
          }})
        });   
      
     /*  for (let accountType of data){
        if(accountType.accountStatus=="Yes"){
          this.accounts=this.accountType
          console.log(this.accounts)
        }   
      }  */

     /*  for (let i = 0; i < data.length; i++) {
        console.log ("I:"+i+data[i]);
        if(data[i].accountStatus=="No")
          this.accountType[i]=data[i];
      }
 */
      /* console.log("Final"+this.accountType)
      this.accounts=this.accounts; */

  }

  //to delete customer
  deleteCustomer(customerId:any)
  {

    console.log("customer Id Going to delete:"+customerId)
    this.customerService.deleteCustomer(customerId)
        .subscribe(
          response => {
            console.log("Response"+response) 
          },
          error => {
            console.log("customer Id: "+customerId+" deleted successfully ");
            this.viewAllCustomer();
            console.log(error)
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
          },
          error => {
            this.accountService.getCountOfCustomerAccount(customerId)
            .subscribe(
              cust=> {
                console.log("Count of customer in type"+cust) 
                if(cust==null)
                  this.deleteCustomer(customerId)
              })
            this.viewAllCustomer();
            console.log(error)
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
      },
      error => {
        console.log("#######updated successfully ");
        this.successNotification()
        this.createAccount(accountNo);
        this.viewAllCustomer();
        console.log("ERROR in save : " + error);
      });
  }

  createAccount(accountNo:string)
  {
    this.accountService.getByAccountNumber(accountNo)
    .subscribe(
      response => {
        this.account.balance=0;
        this.account.accountType=response
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

    this.accountService.addAccount(account)
    .subscribe(
      response => {
        console.log(response)
      },err=>{
        console.log("Account addedd!!!!!!")
      })
  }
  successNotification(){
    Swal.fire('Success', ' Accepted and Account Opened Successfully' , 'success')
  }

  back()
  {
    this.router.navigate(['employeeop',this.employee.id])
  }

}
