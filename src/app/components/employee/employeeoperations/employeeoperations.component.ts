import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account';
import { Accountype } from 'src/app/models/accountype';
import { Branch } from 'src/app/models/branch';
import { Customer } from 'src/app/models/customer';
import { Employee } from 'src/app/models/employee';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employeeoperations',
  templateUrl: './employeeoperations.component.html',
  styleUrls: ['./employeeoperations.component.css']
})
export class EmployeeoperationsComponent implements OnInit {

  employeeId:number;
  changePassword?:boolean;
  signupForm?:FormGroup
  employee: Observable<Employee[]> | any;
  customers:Customer[]=[];
  errorMessage?:string
  account:Observable<Account[]> | any;
  ifscCode?:string;
  transaction:Observable<Transaction[]> | any;
  viewTrans?:boolean;
  viewCust?:boolean;
  showAll?:boolean;
  searchCus?:any;
  
 
  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public router:Router,public employeeService:EmployeeService,public accountService:AccountService,public customerService:CustomerService,public transactionService:TransactionService) { }

  ngOnInit(): void {
   
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)

    this.viewCust=true;
    this.showAll=true;
    
    this.viewAllCustomer();

    this.employeeService.getEmployeeById(this.employeeId)
      .subscribe(response=>{
       console.log(response)
        this.employee=response;
        this.employee=this.employee.data;
      this.signupForm = this.formBuilder.group({
        mobileNo: [this.employee.mobileNo],
        password: ['', [Validators.required ,Validators.minLength(6)]],
        newPassword: ['', [Validators.required ,Validators.minLength(6)]]
       
      })
    })
  }

   updatePassword(){

    console.log("updating password!!")
    
    if(this.employee.password==this.signupForm.get('password').value){
    this.employeeService.updatePassword(this.signupForm.get('mobileNo').value,this.signupForm.get('password').value,this.signupForm.get('newPassword').value)
      .subscribe(response=>{
       console.log(response)
       this.successNotification();
      },err=>{
        console.log(err) 
      })
  }
  else
    this.wrongPassword();

  }
  successNotification(){
    Swal.fire('Success', 'Password Updated!', 'success')
    this.router.navigate(['employeelogin'])
  }
  wrongPassword(){
    Swal.fire('Wrong', 'Enter correct OLD PASSWORD', 'warning')
    this.pass();
  }
  
   //getting all customers..on employee branch(ifsc)
   viewAllCustomer()
   {

     this.employeeService.getEmployeeById(this.employeeId)
     .subscribe(
       response => {
         this.employee=response;
         this.employee=this.employee.data;
         console.log(this.employee)
           this.accountService.getCustomersByIFSC(this.employee.branch.ifscCode).subscribe(
           (data)=>{
           console.log("####Getting all Customers");
           if(data==null)
           {
             this.errorMessage="NO DATA FOUND!!"
             console.log(this.errorMessage)
           }
           else{
             console.log(data);
             this.account=data;
             this.account=this.account.data;
            
           }})
         });   
   }

  //to delete customer
  deleteCustomer(customerId:any)
  {
   console.log("customer Id Going to delete:"+customerId)
    this.customerService.deleteCustomer(customerId)
        .subscribe(
          response => {
            console.log("Response"+response) 
            console.log("customer Id: "+customerId+" deleted successfully ");
            this.viewAllCustomer();
          }
       );   
  }

  deleteAccount(typeId:any,customerId:any)
  {

    console.log("Account type Id Going to delete:"+typeId)
    this.accountService.deleteAccount(typeId)
        .subscribe(
          response => {
            console.log(response) 
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

 //for pop up for deletion of customer
 alertConfirmation(typeId:any,customerId:any){
   Swal.fire({
     title: 'Are you sure?',
     text: 'This process is irreversible.',
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Yes, go ahead.',
     cancelButtonText: 'No, let me think'
   }).then((result) => {
     if (result.value) {
       this.deleteAccount(typeId,customerId)
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
 viewTransacations(accountId:number)
 {
  this.viewTrans=true;
  this.viewCust=false;
  this. showAll=false;
 
  this.transactionService.getTransactionByAccount(accountId).subscribe(data=>
    {
     this.transaction=data;
        this.transaction=this.transaction.data
        console.log(this.transaction)
        if(this.transaction==null)
          this.errorMessage="NO DATA FOUND!"
      })
 }

 back()
  {
    this.viewTrans=false;
    this.viewCust=true; 
    this.changePassword=false;
    this.showAll=true;
    this.errorMessage=""
    this.router.navigate(['employeeop',this.employeeId])
  }

  viewcustomers()
  {
    
    this.router.navigate(['viewcustomers',this.employeeId])
  }

  viewrequests()
  {
    this.router.navigate(['viewrequests',this.employeeId])
  }

  updateemployee()
  {
    this.router.navigate(['updateemployee',this.employeeId])
  }

  pass()
  {
    this.changePassword=true;
    this.viewCust=false;
    this.showAll=false;
  }

reloadComponent() {

  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.errorMessage=""
  this.router.navigate(['employeeop',this.employeeId])
}
logout()
{
  this.router.navigate(['employeelogin'])
}
}
