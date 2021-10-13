import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewrequestComponent } from './viewrequest.component';

describe('ViewrequestComponent', () => {
  let component: ViewrequestComponent;
  let fixture: ComponentFixture<ViewrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
