import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewallbranches',
  templateUrl: './viewallbranches.component.html',
  styleUrls: ['./viewallbranches.component.css']
})
export class ViewallbranchesComponent implements OnInit {

  errorMessage?: string;
  branch: Branch[] = [];
  show?: boolean
  searchBranchForm?: FormGroup
  ifscCode?: string;
  searchBranchId: Boolean = false;
  txtValue: any = null;
  branchId?: number
  tt: boolean = true;
  searches?: any;

  constructor(public branchService: BranchService, public router: Router, public formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.viewAllBranches();
    this.searchBranchForm = this.formBuilder.group({
      branchId: ['', Validators.required]
    })

  }

  //to get all branches
  viewAllBranches() {
    this.branchService.getAllBranches().subscribe(
      (data: any[]) => {
        this.show = true;
        console.log("####Getting all branches");
        if (data == null) {
          this.errorMessage = "NO DATA FOUND!!"
          console.log(this.errorMessage)
        }
        else {
          console.log(data);
          this.branch = data;
        }

      }, err => this.errorMessage = err)
  }


  //to delete all branches
  deleteBranch(branchId: any) {

    console.log("Branch Id Going to delete:" + branchId)
    this.branchService.deleteBranch(branchId)
      .subscribe(
        response => {
          console.log("Response" + response)
        },
        error => {
          console.log("Branch Id:" + branchId + "deleted successfully ");
          this.viewAllBranches();
          console.log(error)
        }
      );
  }

  //for search by name..
  viewBranchByName(name: string) {
    this.branchService.getBranchByName(name).subscribe(
      (data: any) => {
        console.log(data)
      })
  }

  searchBranch() {
    console.log(this.searchBranchId)
    console.log(this.searchBranchForm.get('branchId')?.value)
    if (this.txtValue == null) {
      this.viewAllBranches();
    }
    else {
      this.branchService.getBranchById(this.searchBranchForm.get('branchId')?.value)
        .subscribe(res => {
          this.branch = [];
          this.branch[0] = res;
          console.log(this.branch[0])
          if (this.branch[0] == null) {
            this.tt = false;
            this.errorMessage = "No record Found"
            this.viewAllBranches();
          }
          else {
            this.errorMessage = ""
            this.tt = true;
          }
        }
        )
    }
  }

  addBranch() {
    this.router.navigate(['addbranch'])
  }
  showAdminop() {
    this.router.navigate(['adminop'])
  }

  //for pop up for deletion of branch
  alertConfirmation(branchId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.deleteBranch(branchId)
        Swal.fire(
          'Removed!',
          'Branch removed successfully!',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Branch Not Deleted!!',
          'error'
        )
      }
    })
  }

  //navigating to editcomponent
  editBranch(branchId: number) {
    this.router.navigate(['editbranch', branchId])
  }
}
