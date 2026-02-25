import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpList } from './bp-list';

describe('BpList', () => {
  let component: BpList;
  let fixture: ComponentFixture<BpList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BpList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
