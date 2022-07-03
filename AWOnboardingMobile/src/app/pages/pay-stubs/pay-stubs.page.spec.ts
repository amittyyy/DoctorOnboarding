import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayStubsPage } from './pay-stubs.page';

describe('PayStubsPage', () => {
  let component: PayStubsPage;
  let fixture: ComponentFixture<PayStubsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayStubsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayStubsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
