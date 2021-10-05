import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { ToasterserviceService } from './toasterservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  constructor(public router:Router)
  {

  }
  ngOnInit(): void {
    // this.router.navigate(['employeeop',2])
     //this.router.navigate(['account',25,"Savings"])
    //this.router.navigate(['employeelogin'])
       this.router.navigate(['home'])
   // this.router.navigate(['customeroperations',57])
  //  /transactions/26/25/Current
 // this.router.navigate(['transactions',26,25,'Current'])
    
  }

}
