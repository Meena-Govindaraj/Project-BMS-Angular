import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminoperations',
  templateUrl: './adminoperations.component.html',
  styleUrls: ['./adminoperations.component.css']
})
export class AdminoperationsComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  }

  view()
  {
    this.router.navigate(['viewall'])
  }
  
  employee()
  {
    this.router.navigate(['viewemployees'])
  }
  admin()
  {
    this.router.navigate(['employeelogin'])
  }
}
