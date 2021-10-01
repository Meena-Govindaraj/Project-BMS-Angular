import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BankingManagementSystem';

  constructor(public router:Router){}
  
  ngOnInit(): void {
     //this.router.navigate(['employeeop',2])
     //this.router.navigate(['account',25,"Savings"])
    this.router.navigate(['home'])
    //this.router.navigate(['customeroperations',32])
    
  }
  
}
