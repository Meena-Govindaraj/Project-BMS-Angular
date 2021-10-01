import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeroperationsComponent } from './customeroperations.component';

describe('CustomeroperationsComponent', () => {
  let component: CustomeroperationsComponent;
  let fixture: ComponentFixture<CustomeroperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomeroperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeroperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
