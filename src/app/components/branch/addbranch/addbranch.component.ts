import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';

@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.css']
})
export class AddbranchComponent implements OnInit {

  addBranchForm?: FormGroup
  errorMessage?: string;

  constructor(public activatedRoute: ActivatedRoute, private toasterService: ToasterserviceService, public formBuilder: FormBuilder, public branchService: BranchService, public router: Router) { }

  ngOnInit(): void {
    this.addBranchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      ifscCode: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  //TO ADD BRANCH
  addBranch() {

    var branch: Observable<Branch> | any;
    var ifscCodeExists: string;

    console.log(this.addBranchForm?.value);

    branch = this.addBranchForm.value;
    ifscCodeExists = branch.ifscCode

    //TO CHECK IFSC CODE ALREADY EXISTS OR NOT
    this.branchService.getBranchByIfscCode(ifscCodeExists)
      .subscribe(res => {
        console.log(res)
        //IF NOT 
        branch = res
        branch=branch.data;
        console.log(branch)
        if (branch == null){
          this.branchService.addBranch(this.addBranchForm?.value)
            .subscribe(
              res => {
                console.log(res);
                this.back();
                this.success();
              }
            )
        }
        else {
          this.errorMessage = "IFSC code: " + branch.ifscCode + " already exists!!"
          console.log(this.errorMessage)
         
        }
      },err=>{
        console.log(err.error.message)
        this.errorMessage = "IFSC code: " + branch.ifscCode + " already exists!!"
        console.log(this.errorMessage)
      }
      )
  }

  back() {
    this.router.navigate(['viewall'])
  }
  success() {
    this.toasterService.success("Branch Added Successfully!")
  }

}
