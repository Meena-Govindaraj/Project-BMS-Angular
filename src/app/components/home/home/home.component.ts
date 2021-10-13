import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {

  }
  admin() {
    this.router.navigate(["adminlogin"])
  }
  employee() {
    this.router.navigate(['employeelogin'])
  }
  customer() {
    this.router.navigate(['customerlogin'])
  }
}
