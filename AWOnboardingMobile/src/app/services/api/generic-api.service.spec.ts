import { TestBed, inject } from '@angular/core/testing';

import { GenericApiService } from './generic-api.service';

describe('GenericApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericApiService]
    });
  });

  it('should be created', inject([GenericApiService], (service: GenericApiService) => {
    expect(service).toBeTruthy();
  }));
});
