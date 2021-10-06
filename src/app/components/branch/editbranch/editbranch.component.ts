import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';

@Component({
  selector: 'app-editbranch',
  templateUrl: './editbranch.component.html',
  styleUrls: ['./editbranch.component.css']
})
export class EditbranchComponent implements OnInit {

  editBranchForm?: FormGroup
  errorMessage?: string
  branchId?: number;

  constructor(public activatedRoute: ActivatedRoute, public toasterService: ToasterserviceService, public formBuilder: FormBuilder, public branchService: BranchService, public router: Router) { }

  ngOnInit(): void {

    var branch: Observable<Branch> | any;
    this.branchId = this.activatedRoute.snapshot.params['branchId'];
    console.log("####branchId: ", this.branchId)


    this.branchService.getBranchById(this.branchId)
      .subscribe(res => {
        console.log(res)
        branch = res;
        branch = branch.data;
        this.editBranchForm = this.formBuilder.group({
          id: [branch.id, [Validators.required]],
          name: [branch.name, [Validators.required]],
          city: [branch.city, [Validators.required]],
          ifscCode: [branch.ifscCode, [Validators.required]],
          createdDate: [branch.createdDate]
        })
      }, err => {
        console.log(err.error.message);
      }
      )
  }

  updateBranch() {
    this.branchService.updateBranch(this.editBranchForm?.value)
      .subscribe(
        response => {
          console.log(response);
          this.back();
          this.success();
        },
        error => {
          console.log("ERROR in update : " + error.error.message);
        });
  }

  back() {
    this.router.navigate(['viewall'])
  }

  success() {
    this.toasterService.success("Branch Updated Successfully!")
  }
}
