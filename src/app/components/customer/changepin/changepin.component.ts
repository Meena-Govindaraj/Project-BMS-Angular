import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepin',
  templateUrl: './changepin.component.html',
  styleUrls: ['./changepin.component.css']
})
export class ChangepinComponent implements OnInit {

  customerId:number;
  type:string;
  signupForm?:FormGroup
  senderDetails:Observable<Account[]> | any;;

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public router:Router,public accountService:AccountService) { }

  ngOnInit(): void {
   
    this.customerId = this.activatedRoute.snapshot.params['customerId'];
    console.log(this.customerId)
    this.type = this.activatedRoute.snapshot.params['type'];
    console.log(this.type)
    
    this.signupForm = this.formBuilder.group({
      password: ['', [Validators.required ,Validators.minLength(6)]],
      newPassword: ['', [Validators.required ,Validators.minLength(6)]]
    })

    //to get account details on account type of customer
    this.accountService.getAccountByType(this.customerId,this.type)
    .subscribe(data=>{
     this.senderDetails=data;
     this.senderDetails=this.senderDetails.data;
     console.log(this.senderDetails);
      })
  }

  updatePassword()
  {
    console.log(this.signupForm.get('password').value)
    console.log(this.signupForm.get('newPassword').value)
    if(this.senderDetails.transactionPIN==this.signupForm.get('password').value)
    {
      console.log(this.senderDetails.accountType.id)
       this.accountService.updatePassword(this.senderDetails.accountType.id,this.signupForm.get('newPassword').value)
          .subscribe(data=>{
           console.log(data)
           this.successNotification();
          },err=>{console.log(err.error.message)})     
    }
    else{
      this.wrongInfo("Wrong Transacation PIN!");
    }
  }

  back()
  {
    this.router.navigate(['account',this.customerId,this.type])
  }

  wrongInfo(msg:string){
    Swal.fire('WRONG!!',msg, 'error')
  }

  successNotification(){
    Swal.fire('Success', 'Password Updated!', 'success')
    this.back();
  }
}
