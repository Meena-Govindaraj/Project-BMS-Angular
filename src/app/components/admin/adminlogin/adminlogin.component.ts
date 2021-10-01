import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {

  adminLoginForm?:FormGroup
 

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public router: Router) { }
   
  ngOnInit(): void {

    this.adminLoginForm = this.formBuilder.group({
      name: [''],
      password: ['', [Validators.required ,Validators.minLength(6)]],
  })
   
  }
  adminLogin()
  {
    if(this.adminLoginForm.get('name').value=="admin" && this.adminLoginForm.get('password').value=="admin123")
        this.router.navigate(['adminop'])
    else
    this.wrongLogin();
  }
  wrongLogin(){
    Swal.fire('Wrong!', 'Your Login Credentials are not matched!', 'error')
  }
}
