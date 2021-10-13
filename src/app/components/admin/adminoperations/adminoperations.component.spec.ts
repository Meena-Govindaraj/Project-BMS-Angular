import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminoperationsComponent } from './adminoperations.component';

describe('AdminoperationsComponent', () => {
  let component: AdminoperationsComponent;
  let fixture: ComponentFixture<AdminoperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminoperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminoperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
