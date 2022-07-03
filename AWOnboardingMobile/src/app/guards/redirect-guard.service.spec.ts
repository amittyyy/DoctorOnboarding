import { TestBed, inject } from '@angular/core/testing';

import { RedirectGuardService } from './redirect-guard.service';

describe('RedirectGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectGuardService]
    });
  });

  it('should be created', inject([RedirectGuardService], (service: RedirectGuardService) => {
    expect(service).toBeTruthy();
  }));
});
