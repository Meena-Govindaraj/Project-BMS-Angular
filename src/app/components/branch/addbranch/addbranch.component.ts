import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';

@Component({
  selector: 'app-addbranch',
  templateUrl: './addbranch.component.html',
  styleUrls: ['./addbranch.component.css']
})
export class AddbranchComponent implements OnInit {

  addBranchForm: FormGroup;
  errorMessage: string;

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
 
    this.branchService.addBranch(this.addBranchForm?.value)
      .subscribe(
        res => {
          console.log(res);
          this.back();
          this.success();
        }, err => {
          this.errorMessage = err.error.message;
          this.toasterService.warning(err.error.message);
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
