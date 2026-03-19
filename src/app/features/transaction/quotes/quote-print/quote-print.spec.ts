import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotePrintComponent } from './quote-print';

describe('InvoicePrint', () => {
  let component: QuotePrintComponent;
  let fixture: ComponentFixture<QuotePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotePrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
