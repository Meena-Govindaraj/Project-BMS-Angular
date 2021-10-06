import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branch';
import { Employee } from 'src/app/models/employee';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ToasterserviceService } from 'src/app/toasterservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  editEmployeeForm?: FormGroup
  branch: Observable<Branch> | any;
  employee?: Employee;
  branches: Observable<Branch[]> | any;
  ifsc?: string;
  branchIfsc?: string
  branchName?: string;
  editBranch?: boolean;
  createdDate?: Date;

  constructor(public activatedRoute: ActivatedRoute, public toasterService: ToasterserviceService, public formBuilder: FormBuilder, public router: Router, public employeeService: EmployeeService, public branchService: BranchService) { }

  ngOnInit(): void {

    var employeeId: number;
    var emp: Observable<Employee[]> | any;
    employeeId = this.activatedRoute.snapshot.params['employeeId'];
    console.log("####employeeId: ", employeeId)

    this.employeeService.getEmployeeById(employeeId)
      .subscribe(res => {
        emp = res;
        emp = emp.data;
        console.log(emp)
        this.editEmployeeForm = this.formBuilder.group({
          id: [employeeId, [Validators.required]],
          name: [emp.name, [Validators.required, Validators.minLength(3)]],
          password: [emp.password],
          mobileNo: [emp.mobileNo, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          email: [emp.email, [Validators.required, Validators.email]],
          address: [emp.address, [Validators.required]],
          salary: [emp.salary, [Validators.required, Validators.min(0)]],
          branch: [emp.branch.ifscCode, Validators.required],
        })
        this.branchIfsc = emp.branch.ifscCode;
        this.branchName = emp.branch.name;
        this.createdDate = emp.createdDate;
      })

  }

  //getting branch details on Selected IFSC..
  viewBranchByIFSC() {
    this.branchService.getBranchByIfscCode(this.editEmployeeForm.get('branch')?.value).subscribe(
      (data) => {
        console.log("branch Name: " + this.editEmployeeForm.get('branch')?.value)
        this.branch = data;
        this.branch = this.branch.data;
        this.employee = this.editEmployeeForm.value;
        this.employee.createdDate = this.createdDate;
        this.employee.branch = this.branch;
        console.log(this.employee)
        this.updateEmployee(this.employee);
      })
  }

  //Getting branch details to view branch name..
  viewBranchName() {

    this.branchService.getBranchByIfscCode(this.editEmployeeForm.get('branch')?.value).subscribe(
      (res) => {
        console.log("branch Name: " + this.editEmployeeForm.get('branch')?.value)
        console.log(res);
        this.branch = res;
        this.branch = this.branch.data;
        this.ifsc = this.branch.name;
        console.log("BRANCH: " + this.ifsc)
      })
  }

  //to get all branches
  viewAllBranches() {

    this.branchService.getAllBranches().subscribe(
      (data) => {
        this.branches = data;
        this.branches = this.branches.data;
        console.log(this.branches)
      }
    )
  }

  updateEmployee(employee: Employee) {
    console.log(this.editEmployeeForm?.value)
    console.log(this.employee)
    this.employeeService.updateEmployee(employee)
      .subscribe(
        response => {
          this.employee = response
          this.successNotification();
          console.log("Employee account Updated successfully!")
          this.back();
        })

  }

  editBranchDetails() {
    this.editBranch = true;
    this.viewAllBranches();
  }

  successNotification() {
    this.toasterService.success("Employee account Updated successfully!")
  }

  back() {
    this.router.navigate(['viewemployees'])
  }

}
