import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewallbranchesComponent } from './viewallbranches.component';

describe('ViewallbranchesComponent', () => {
  let component: ViewallbranchesComponent;
  let fixture: ComponentFixture<ViewallbranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewallbranchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewallbranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
