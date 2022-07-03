import { TestBed, inject } from '@angular/core/testing';
import { CustomErrorHandler } from './error-handler.service';


describe('CustomErrorHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomErrorHandler]
    });
  });

  it('should be created', inject([CustomErrorHandler], (service: CustomErrorHandler) => {
    expect(service).toBeTruthy();
  }));
});
