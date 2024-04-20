import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosAppComponent } from './ios-app.component';

describe('IosAppComponent', () => {
  let component: IosAppComponent;
  let fixture: ComponentFixture<IosAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IosAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IosAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
