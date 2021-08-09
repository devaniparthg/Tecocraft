import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidtestComponent } from './covidtest.component';

describe('CovidtestComponent', () => {
  let component: CovidtestComponent;
  let fixture: ComponentFixture<CovidtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidtestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
