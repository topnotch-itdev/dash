import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlexaSkillComponent } from './alexa-skill.component';

describe('AlexaSkillComponent', () => {
  let component: AlexaSkillComponent;
  let fixture: ComponentFixture<AlexaSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlexaSkillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlexaSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
