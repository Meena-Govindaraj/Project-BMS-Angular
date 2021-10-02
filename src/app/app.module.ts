import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewallbranchesComponent } from './components/branch/viewallbranches/viewallbranches.component';
import { HomeComponent } from './components/home/home/home.component';
import { AdminoperationsComponent } from './components/admin/adminoperations/adminoperations.component';
import { AddbranchComponent } from './components/branch/addbranch/addbranch.component';
import { EditbranchComponent } from './components/branch/editbranch/editbranch.component';
import { AddemployeeComponent } from './components/employee/addemployee/addemployee.component';
import { ViewemployeesComponent } from './components/employee/viewemployees/viewemployees.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { ViewcustomerComponent } from './components/customer/viewcustomer/viewcustomer.component';
import { EmployeeoperationsComponent } from './components/employee/employeeoperations/employeeoperations.component';
import { AddcustomerComponent } from './components/customer/addcustomer/addcustomer.component';
import { ViewrequestComponent } from './components/customer/viewrequest/viewrequest.component';
import { EmployeeloginComponent } from './components/employee/employeelogin/employeelogin.component';
import { UpdateemployeeComponent } from './components/employee/updateemployee/updateemployee.component';
import { CustomerloginComponent } from './components/customer/customerlogin/customerlogin.component';
import { CustomeroperationsComponent } from './components/customer/customeroperations/customeroperations.component';
import { AccountOperationsComponent} from './components/customer/accountoperations/accountoperations.component';
import { ViewtransactionsComponent } from './components/transactions/viewtransactions/viewtransactions.component';
import { ChangepinComponent } from './components/customer/changepin/changepin.component';
import { AdminloginComponent } from './components/admin/adminlogin/adminlogin.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ToasterserviceService } from './toasterservice.service';
@NgModule({
  declarations: [
    AppComponent,
    ViewallbranchesComponent,
    HomeComponent,
    AdminoperationsComponent,
    AddbranchComponent,
    EditbranchComponent,
    AddemployeeComponent,
    ViewemployeesComponent,
    EditEmployeeComponent,
    ViewcustomerComponent,
    EmployeeoperationsComponent,
    AddcustomerComponent,
    ViewrequestComponent,
    EmployeeloginComponent,
    UpdateemployeeComponent,
    CustomerloginComponent,
    CustomeroperationsComponent,
    AccountOperationsComponent,
    ChangepinComponent,
    ViewtransactionsComponent,
    AdminloginComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,Ng2SearchPipeModule
  ],
  providers: [ToasterserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
