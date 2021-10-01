import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from 'src/app/models/transaction';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-viewtransactions',
  templateUrl: './viewtransactions.component.html',
  styleUrls: ['./viewtransactions.component.css']
})
export class ViewtransactionsComponent implements OnInit {

  accountId?:number;
  transaction:Transaction[];
  errorMessage:string
  customerId:number
  type:number
  searchDate:any

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public transactionService:TransactionService,public router:Router) { }

  ngOnInit(): void {
   
    this.accountId = this.activatedRoute.snapshot.params['accountId'];
    console.log(this.accountId)

    this.customerId = this.activatedRoute.snapshot.params['customerId'];
    console.log(this.customerId)
    
    this.type = this.activatedRoute.snapshot.params['type'];
    console.log(this.type)

    this.transactionService.getTransactionByAccount(this.accountId).subscribe(data=>
      {
        if(data==null)
          this.errorMessage="NO DATA FOUND!"
        else
        this.transaction=data;
      })
    }

    back()
    {
      this.router.navigate(['account',this.customerId,this.type])
    }

}
