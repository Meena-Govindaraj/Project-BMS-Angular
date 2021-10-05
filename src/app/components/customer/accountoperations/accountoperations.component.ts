import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { AccountService } from 'src/app/services/account.service';
import { CustomerService } from 'src/app/services/customer.service';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-accountoperations',
  templateUrl: './accountoperations.component.html',
  styleUrls: ['./accountoperations.component.css']
})
export class AccountOperationsComponent implements OnInit {

  viewBalanceForm: FormGroup;
  bankTransferForm: FormGroup;
  errorMessage?: string
  customerId: number;
  type: string;

  viewBal?: boolean;
  showBalance?: boolean;
  transferAmt?: boolean;
  shownav?: boolean;
  checkPIN?: boolean;

  senderBalance?: number;
  senderId: number;
  senderPIN: number;

  senderDetails: Observable<Account[]> | any;

  receiverId: number;
  sendAmount: number;
  receiverDetails: Observable<Account[]> | any;
  transaction: Observable<Transaction[]> | any;
  showDetails?: boolean;
  date = new Date();
  invoice?: boolean;


  constructor(public activatedRoute: ActivatedRoute, public formBuilder: FormBuilder, public transactionService: TransactionService, public router: Router, public customerService: CustomerService, public accountService: AccountService) { }

  ngOnInit(): void {

    this.showDetails = true;
    this.shownav = true;
    this.customerId = this.activatedRoute.snapshot.params['customerId'];
    console.log(this.customerId)

    this.type = this.activatedRoute.snapshot.params['type'];
    console.log(this.type)

    this.viewBalanceForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      balance: [''],
    })

    this.bankTransferForm = this.formBuilder.group({
      recieverAccount: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      message: [''],
      pin: ['', [Validators.required, Validators.minLength(6)]],
    })

    this.getAccountDetails();
  }


  @ViewChild('htmlData') htmlData: ElementRef;
  USERS = [
    {
      "Name": "Meena",
      "Account Number": "xxxx",
      "Account Type": "xxxxx",
      "IFSC Code": "xxxx",
      "Sent To": "xxxx",
      "Sent Amount": 0,
      "Available balance ": 0,

    }

  ];

  public openPDF(): void {
    let DATA = document.getElementById('htmlData');

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      var PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('Invoice.pdf');
    });
    this.back();
  }

  getAccountDetails() {

    //to get account details on account type of customer
    this.accountService.getAccountByType(this.customerId, this.type)
      .subscribe(data => {
        this.senderDetails = data;
        this.senderDetails = this.senderDetails.data;
        console.log(this.senderDetails)
        this.senderBalance = this.senderDetails.balance
        this.senderPIN = this.senderDetails.transactionPIN;
      },
        err => {
          console.log(err.error.message);
        })
  }
  viewBalance() {

    console.log(this.senderPIN)
    if (this.senderPIN == this.viewBalanceForm.get('password').value) {
      this.showBalance = true;
      this.viewBal = false;
      this.showDetails = false;
    }
    else
      this.wrongInfo("Wrong Transacation PIN!");
  }

  getAccount() {
    this.transferAmt = true;
    this.shownav = false;
    this.showDetails = false;
    this.viewBal=false;
    this.showBalance=false;
    console.log("Sender Id:" + this.senderDetails.id)
    this.senderId = this.senderDetails.id;
  }

  transferAmountByAccount() {
    this.sendAmount = this.bankTransferForm.get('amount').value;
    //to get account id of reciever account 
    this.accountService.getAccountByaccountNo(this.bankTransferForm.get('recieverAccount').value)
      .subscribe(data => {
        this.receiverDetails = data;
        this.receiverDetails = this.receiverDetails.data;

        if (this.receiverDetails != null) {

          this.receiverId = this.receiverDetails.id;
          if (this.sendAmount > this.senderBalance)
            this.availInfo("Available Balance: " + this.senderBalance);
          
            //if savings account--->per transaction limit 20000 
          else if (this.type == "Savings" && this.sendAmount > 20000)
            this.wrongInfo("Payment Failed, Send money less than 20000")
         
            else {
            if (this.senderPIN == this.bankTransferForm.get('pin').value) {
              this.accountService.bankTransfer(this.senderId, this.receiverId, this.sendAmount)
                .subscribe(data => {
                  this.transferAmt = false;
                  this.invoice = true;
                  this.success();
                  this.addTransaction(this.sendAmount, this.senderDetails, this.receiverDetails)
                  this.getAccountDetails();
                })
            }
            else
              this.wrongInfo("Wrong Transacation PIN!");
          }
        }

      }, err => { this.errorMessage = "Please enter Correct Account No" })
  }

  addTransaction(amount: number, sender: Account, reciever: Account) {

    this.transaction = new Transaction();
    this.accountService.getAccountByaccountNo(sender.accountType.accountNo)
      .subscribe(sBalance => {

        this.transaction.account = sender;
        this.transaction.balance = sBalance;
        this.transaction.balance = this.transaction.balance.data.balance;
        this.transaction.withdraw = amount;
      
        this.transactionService.addTransaction(this.transaction).subscribe(data => {
        }, err => { console.log(err.error.message) })
      })


    this.accountService.getAccountByaccountNo(reciever.accountType.accountNo)
      .subscribe(rBalance => {

        this.transaction.withdraw = null;
        this.transaction.account = reciever;
        this.transaction.balance = rBalance;
        this.transaction.balance=this.transaction.balance.data.balance
        this.transaction.deposit = amount;
        this.transaction.message = this.bankTransferForm.get('message').value;
        this.transactionService.addTransaction(this.transaction).subscribe(data => {
        }, err => { console.log(err.error.message) })
      })

  }
  view() {
    this.viewBal = true;
    this.shownav = false;
    this.showDetails = false;
    this.transferAmt=false;
  }

  back() {
    this.viewBal = false;
    this.showBalance = false;
    this.transferAmt = false;
    this.shownav = true;
    this.reloadComponent()
  }

  recepit() {
    this.transferAmt = false;
    this.viewBal = false;
  }
  changePIN() {
    this.router.navigate(['changetransacationPIN', this.customerId, this.type])
  }

  transactionhistory() {
    console.log(this.senderDetails.id);
    this.router.navigate(['transactions', this.senderDetails.id, this.customerId, this.type])
  }

  wrongInfo(msg: string) {
    Swal.fire('WRONG!!', msg, 'error')
  }
  availInfo(msg: string) {
    Swal.fire('No sufficient Balance!!', msg, 'warning')
  }
  success() {
    this.invoice = true;
    Swal.fire("Success!", "Sent Successfully", "success")

  }
  reloadComponent() {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['account', this.customerId, this.type]);
  }
  backPage() {
    this.router.navigate(['customeroperations', this.customerId]);
  }
}
