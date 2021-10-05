import { Component, OnInit } from '@angular/core';
import { FormBuilder, NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Customer } from 'src/app/models/customer';
import { Employee } from 'src/app/models/employee';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
import { EmployeeoperationsComponent } from '../../employee/employeeoperations/employeeoperations.component';

@Component({
  selector: 'app-viewcustomer',
  templateUrl: './viewcustomer.component.html',
  styleUrls: ['./viewcustomer.component.css']
})
export class ViewcustomerComponent implements OnInit {

  
  customers:Customer[]=[];
  errorMessage?:string
  account:Account[]=[];
  employeeId:number;
  employee:Employee;
  ifscCode?:string;
  transaction:Transaction[];
  viewTrans?:boolean;
  viewCust?:boolean;
  searchCus:any
  bal=5000;
  constructor(public activatedRoute:ActivatedRoute,public router:Router,public formBuilder:FormBuilder,public customerService:CustomerService,public accountService:AccountService,public employeeService:EmployeeService,public transacationService:TransactionService) { }

  ngOnInit(): void {
     
    this.viewCust=true;
    this.employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log(this.employeeId)
    
    this.viewAllCustomer();
  }

  //getting all customers..on employee branch(ifsc)
  viewAllCustomer()
  {
    this.employeeService.getEmployeeById(this.employeeId)
    .subscribe(
      response => {
        this.employee=response;
        console.log(this.employee)
          this.accountService.getCustomersByIFSC(this.employee.branch.ifscCode).subscribe(
          (data)=>{
            console.log(data);
            this.account=data;
          },err=>{
            console.log(err.error.message)
            this.errorMessage="NO DATA FOUND!!"
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
  this.transacationService.getTransactionByAccount(accountId).subscribe(data=>
    {
      this.transaction=data;

    },cus=>
    {
      this.errorMessage="NO DATA FOUND!"
    })
 }

 back()
 {
  this.viewTrans=false;
  this.viewCust=true; 
  this.reloadComponent();

}
reloadComponent() {

  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate(['viewcustomers',this.employeeId])
}
  
}
