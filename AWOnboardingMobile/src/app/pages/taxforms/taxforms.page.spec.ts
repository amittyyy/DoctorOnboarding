import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxformsPage } from './taxforms.page';

describe('TaxformsPage', () => {
  let component: TaxformsPage;
  let fixture: ComponentFixture<TaxformsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxformsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxformsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
