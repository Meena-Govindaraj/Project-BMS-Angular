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


@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.component.html',
  styleUrls: ['./addcustomer.component.css']
})
export class AddcustomerComponent implements OnInit {


  signupForm:FormGroup
  branches:Branch[]=[];
  branch?:Branch;
  customer?:Customer;
  errorMessage?:string;
  ifsc?:string;
  getType?:boolean;
  getCustomer?:boolean=true;
  typeForm:FormGroup
  accountType:Accountype;

  constructor(public activatedRoute :ActivatedRoute,private toasterService:ToasterserviceService,public customerService:CustomerService,public branchService:BranchService,public accountService:AccountService, public formBuilder:FormBuilder, public router: Router) { }

  ngOnInit(): void {
    
    this.viewAllBranches();
    this.typeForm=this.formBuilder.group({
      type:['',[Validators.required]]
    })
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobileNo: ['', [Validators.required ,Validators.minLength(10),Validators.maxLength(10)]],
      email: ['', [Validators.required,Validators.email]],
      state: ['', [Validators.required]],
      age: ['', [Validators.required,Validators.min(1)]],
      branch:['',Validators.required]
     
    })
   
  }

  //to get all branches
  viewAllBranches()
  {
    this.branchService.getAllBranches().subscribe(
      (data:any[])=>{
     this.branches=data;
      console.log(data)
      }
      )
  }

  viewBranchByIFSC()
  {
    this.branchService.getBranchByName(this.signupForm.get('branch')?.value).subscribe(
      (data:any)=>{
        console.log("branch Name: "+this.signupForm.get('branch')?.value)
        this.branch=data;
        this.customer=this.signupForm.value;
        this.customer.branch=this.branch;
        this.getCustomerByMobileNo(this.signupForm.get('mobileNo')?.value);
      })
  }

  customerSignup(customer:any)
  {
    console.log(this.signupForm?.value)
    this.getType=true
    this.customerService.addCustomer(customer)
    .subscribe(
      response => {
        this.customer=response
      },error => {
        this.getCustomer=false
        console.log("Customer saved successfully!")
      })
   
  }

  addAccountType()
  {
    console.log(this.typeForm?.value);
    this.accountType=this.typeForm.value;
    this.customerService.getCustomerByMobileNo(this.signupForm.get('mobileNo').value)
    .subscribe(
      response => {
           this.customer=response
           this.accountType.customer=this.customer
           this.accountService.addAccountType(this.accountType)
           .subscribe(
             response => {
               console.log(response)
             },error => {
               console.log("Customer account with type created successfully!")
               this.success();
               this.router.navigate(['customerlogin'])
             })
      })
  }

  getCustomerByMobileNo(mobileNo:string)
  {
    this.customerService.getCustomerByMobileNo(mobileNo).subscribe(data=>{
      //can add
      if(data==null){
        this.errorMessage="";
        this.getCustomerByEmail(this.customer.email);
      }
      else{
        this.errorMessage=" Account already exists with mobile no"
      }
    })

  }

  getCustomerByEmail(email:string)
  {
    this.customerService.getCustomerByEmail(email).subscribe(data=>{
      //can add
      if(data==null){
        this.errorMessage="";
        this.getType=true
        this.getCustomer=false
        this.customerSignup(this.customer);
      }
      else{
        this.errorMessage=" Account already exists with email"
      }
    })
    
  }

 success()
{
  this.toasterService.success("Account Details will be sent to your mail once accepted by bank!!")
}

customerLogin()
{
  this.router.navigate(['customerlogin'])
}
}