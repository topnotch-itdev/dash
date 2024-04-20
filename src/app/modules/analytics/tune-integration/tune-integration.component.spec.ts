import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuneIntegrationComponent } from './tune-integration.component';

describe('TuneIntegrationComponent', () => {
  let component: TuneIntegrationComponent;
  let fixture: ComponentFixture<TuneIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TuneIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TuneIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
