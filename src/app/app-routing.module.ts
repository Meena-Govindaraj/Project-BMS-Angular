import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminoperationsComponent } from './components/admin/adminoperations/adminoperations.component';
import { AddbranchComponent } from './components/branch/addbranch/addbranch.component';
import { EditbranchComponent } from './components/branch/editbranch/editbranch.component';
import { ViewallbranchesComponent } from './components/branch/viewallbranches/viewallbranches.component';
import { AddcustomerComponent } from './components/customer/addcustomer/addcustomer.component';import { CustomerloginComponent } from './components/customer/customerlogin/customerlogin.component';
import { CustomeroperationsComponent } from './components/customer/customeroperations/customeroperations.component';
import { AccountOperationsComponent} from './components/customer/accountoperations/accountoperations.component';
import { ViewrequestComponent } from './components/customer/viewrequest/viewrequest.component';
import { AddemployeeComponent } from './components/employee/addemployee/addemployee.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { EmployeeloginComponent } from './components/employee/employeelogin/employeelogin.component';
import { EmployeeoperationsComponent } from './components/employee/employeeoperations/employeeoperations.component';
import { UpdateemployeeComponent } from './components/employee/updateemployee/updateemployee.component';
import { ViewemployeesComponent } from './components/employee/viewemployees/viewemployees.component';
import { HomeComponent } from './components/home/home/home.component';
import { ViewtransactionsComponent } from './components/transactions/viewtransactions/viewtransactions.component';
import { ChangepinComponent } from './components/customer/changepin/changepin.component';
import { AdminloginComponent } from './components/admin/adminlogin/adminlogin.component';
import { ViewcustomersComponent } from './components/customer/viewcustomers/viewcustomers.component';

const routes: Routes = [
  {path:'home',component:HomeComponent},

  //admin
  {path:'adminlogin',component:AdminloginComponent},

  //branches
  {path:'viewall',component:ViewallbranchesComponent},
  {path:'adminop',component:AdminoperationsComponent},
  {path:'addbranch',component:AddbranchComponent},
  {path:'editbranch/:branchId',component:EditbranchComponent},

  //employee
  {path:'employeeop/:employeeId',component:EmployeeoperationsComponent},
  {path:'addemployee',component:AddemployeeComponent},
  {path:'viewemployees',component:ViewemployeesComponent},
  {path:'editemployee/:employeeId',component:EditEmployeeComponent},
  {path:'employeelogin',component:EmployeeloginComponent},
  {path:'updateemployee/:employeeId',component:UpdateemployeeComponent},

  //employee on customers
  {path:'addcustomers',component:AddcustomerComponent},
  {path:'viewrequests/:employeeId',component:ViewrequestComponent},
  {path:'viewcustomers/:employeeIfsc/:employeeId',component:ViewcustomersComponent},
  

  //customer
  {path:'customerlogin',component:CustomerloginComponent},
  {path:'customeroperations/:customerId',component:CustomeroperationsComponent},
  {path:'account/:customerId/:type',component:AccountOperationsComponent},
  {path:'changetransacationPIN/:customerId/:type',component:ChangepinComponent},

  //transactions
  {path:'transactions/:accountId/:customerId/:type',component:ViewtransactionsComponent},

  {path:"**" ,component:HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
