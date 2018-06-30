import { TestBed, inject } from '@angular/core/testing';

import { ThreeServiceService } from './three-service.service';

describe('ThreeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreeServiceService]
    });
  });

  it('should be created', inject([ThreeServiceService], (service: ThreeServiceService) => {
    expect(service).toBeTruthy();
  }));
});
