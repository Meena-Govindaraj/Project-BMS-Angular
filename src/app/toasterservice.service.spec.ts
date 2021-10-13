import { TestBed } from '@angular/core/testing';

import { ToasterserviceService } from './toasterservice.service';

describe('ToasterserviceService', () => {
  let service: ToasterserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
