import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editbranch',
  templateUrl: './editbranch.component.html',
  styleUrls: ['./editbranch.component.css']
})
export class EditbranchComponent implements OnInit {
  
  editBranchForm?:FormGroup
  branch?:Branch;
  errorMessage?:string
  ifscCodeExists?:string;
  branchId?:number;
  date=new Date();

  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public branchService:BranchService,public router:Router) { }

  ngOnInit(): void {
    this.branchId = this.activatedRoute.snapshot.params['branchId'];
    console.log("####branchId: ",this.branchId)
  
    this.branchService.getBranchById(this.branchId)
      .subscribe(data=>{
       console.log(data)
      this.editBranchForm=this.formBuilder.group({
      id:[data.id,[Validators.required]],
      name: [data.name, [Validators.required]],
      city: [data.city, [Validators.required]],
      ifscCode: [data.ifscCode, [Validators.required]],
      createdDate: [data.createdDate, [Validators.required]]
     })
    })
  }

  updateBranch()
  {
    this.branchService.updateBranch(this.editBranchForm?.value)
    .subscribe(
      response => {
        console.log(response);
        console.log("#######updated successfully ");
      },
      error => {
        this.successNotification();
        this.back();
        console.log("ERROR in save : " + error);
      });
  }

  back()
    {
      this.router.navigate(['viewall'])
    }

  successNotification(){
    Swal.fire('Success', 'Branch Updated Successfully!', 'success')
  }
}
