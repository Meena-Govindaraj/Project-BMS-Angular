import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeoperationsComponent } from './employeeoperations.component';

describe('EmployeeoperationsComponent', () => {
  let component: EmployeeoperationsComponent;
  let fixture: ComponentFixture<EmployeeoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeoperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
