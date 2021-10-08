import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewallbranches',
  templateUrl: './viewallbranches.component.html',
  styleUrls: ['./viewallbranches.component.css']
})
export class ViewallbranchesComponent implements OnInit {

  errorMessage: string;
  branch: Branch[];
  showBranches: boolean
  searches: any;
  config: any;

  constructor(public branchService: BranchService, public router: Router, public formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.viewAllBranches();
    this.showBranches = true;
  }

  //to get all branches
  viewAllBranches() {

    this.branchService.getAllBranches().subscribe(
      (res) => {

        console.log(res);
        this.branch = res.data;
        this.config = { itemsPerPage: 5, currentPage: 1 }

      }, err => {
        this.errorMessage = "NO DATA FOUND!!"
        console.log(err.error.message)
      })
  }


  //to delete all branches
  deleteBranch(branchId: number) {

    console.log("Branch Id Going to delete:" + branchId)
    this.branchService.deleteBranch(branchId)
      .subscribe(
        response => {
          console.log("Branch Id:" + branchId + "deleted successfully ");
          this.viewAllBranches();
        },
        error => {
          console.log(error.error.message)
        }
      );
  }

  //for pop up for deletion of branch
  alertConfirmation(branchId: number) {
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

  addBranch() {
    this.router.navigate(['addbranch'])
  }

  showAdminop() {
    this.router.navigate(['adminop'])
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }
}
