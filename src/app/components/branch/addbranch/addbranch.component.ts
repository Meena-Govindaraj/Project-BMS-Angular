import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.css']
})
export class AddbranchComponent implements OnInit {

  addBranchForm?:FormGroup
  branch?:Branch;
  errorMessage?:string
  ifscCodeExists?:string;
  date=new Date();
  constructor(public activatedRoute :ActivatedRoute,public formBuilder:FormBuilder,public branchService:BranchService,public router:Router) { }

  ngOnInit(): void {
     this.addBranchForm=this.formBuilder.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      ifscCode: ['', [Validators.required,Validators.minLength(6)]]
     })
  }

//TO ADD BRANCH
 addBranch()
  {
    console.log(this.branch=this.addBranchForm?.value);
    
    this.branch=this.addBranchForm.value;
    this.ifscCodeExists=this.branch.ifscCode
  
    console.log("Ifsc code: "+this.ifscCodeExists)

    //TO CHECK IFSC CODE ALREADY EXISTS OR NOT
    this.branchService.getBranchByIfscCode(this.ifscCodeExists)
    .subscribe(res=>{
      console.log("Branch By Ifsc code: "+res)
      //IF NOT 
      if(res==null)
      this.branchService.addBranch(this.addBranchForm?.value)
    .subscribe(
      res=>{
        console.log(res);
        console.log("#####Branch Added Successfully!");
      },
      error=>
     {
       this.successNotification();
       console.log("Error in save: "+error)
        this.back();
     }
    )
    
  else{
    
    this.errorMessage="IFSC code: "+this.branch.ifscCode+" already exists!!"
    console.log(this.errorMessage)
  }
}
)}

successNotification(){
  Swal.fire('Success', 'Branch Added Successfully!', 'success')
}
back()
{
  this.router.navigate(['viewall'])
}

}
